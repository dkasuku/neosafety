"""Copy the local SQLite catalogue into PostgreSQL.

Usage:
    # against the Railway database (use the PUBLIC proxy URL, not *.railway.internal,
    # which only resolves from inside Railway):
    python migrate_to_postgres.py --database-url "postgresql://postgres:PASS@HOST:PORT/railway" --replace

    # or, relying on DATABASE_URL from backend/.env:
    python migrate_to_postgres.py --replace

Rows are copied with their original primary keys so foreign keys stay intact.
Because the IDs are preserved, the script resets each table's identity sequence
afterwards -- without that, the next INSERT from the admin panel would reuse id 1
and fail with a duplicate key error.

By default the script refuses to touch a target table that already holds rows.
Pass --replace to clear the target tables first (DELETE, not DROP, so the schema
and any live database connections are left alone).
"""

import argparse
import os
import sys
from datetime import date, datetime

from dotenv import load_dotenv
from sqlalchemy import Boolean, Date, DateTime, MetaData, Table, create_engine, text

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'neosafety.db')}"

# Parents before children -- order matters for the foreign keys.
TABLE_ORDER = [
    "categories",
    "products",
    "reviews",
    "orders",
    "order_items",
    "adverts",
    "stats",
    "settings",
]


def _normalize(url: str) -> str:
    # Railway sometimes hands out postgres://, which SQLAlchemy no longer accepts.
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def _coerce(value, column):
    """Make a SQLite value acceptable to the matching PostgreSQL column."""
    if value is None:
        return None
    ctype = column.type
    # SQLite keeps booleans as 0/1 integers; psycopg2 will not cast those.
    if isinstance(ctype, Boolean):
        return bool(value)
    # Older rows can come back as ISO strings rather than datetime objects.
    if isinstance(ctype, DateTime) and isinstance(value, str):
        return datetime.fromisoformat(value)
    if isinstance(ctype, Date) and not isinstance(ctype, DateTime) and isinstance(value, str):
        return date.fromisoformat(value)
    if isinstance(ctype, Date) and not isinstance(ctype, DateTime) and isinstance(value, datetime):
        return value.date()
    return value


def _reset_sequence(conn, table: Table):
    """Bump the identity sequence past the highest id we just inserted."""
    if "id" not in table.columns:
        return
    seq = conn.execute(
        text("SELECT pg_get_serial_sequence(:t, 'id')"), {"t": table.name}
    ).scalar()
    if not seq:
        return
    conn.execute(
        text(
            "SELECT setval(:seq, COALESCE((SELECT MAX(id) FROM %s), 0) + 1, false)"
            % table.name
        ),
        {"seq": seq},
    )
    nxt = conn.execute(text("SELECT last_value FROM %s" % seq)).scalar()
    print(f"    sequence reset -> next id {nxt}")


def migrate(target_url: str, replace: bool):
    sqlite_engine = create_engine(SQLITE_URL)
    pg_engine = create_engine(target_url)

    sqlite_meta = MetaData()
    sqlite_meta.reflect(bind=sqlite_engine)
    pg_meta = MetaData()
    pg_meta.reflect(bind=pg_engine)

    missing = [t for t in TABLE_ORDER if t not in pg_meta.tables]
    if missing:
        print(f"Error: target database is missing tables: {', '.join(missing)}")
        print("Start the Flask app against it once -- it creates the schema on boot.")
        sys.exit(1)

    with pg_engine.connect() as conn:
        # Safety check before we write anything.
        if not replace:
            occupied = []
            for name in TABLE_ORDER:
                n = conn.execute(text('SELECT COUNT(*) FROM "%s"' % name)).scalar()
                if n:
                    occupied.append(f"{name} ({n} rows)")
            if occupied:
                print("Error: the target database already has data:")
                for o in occupied:
                    print("  -", o)
                print("\nRe-run with --replace to overwrite it.")
                sys.exit(1)

        if replace:
            print("Clearing target tables...")
            for name in reversed(TABLE_ORDER):  # children first
                conn.execute(text('DELETE FROM "%s"' % name))
            conn.commit()

        total = 0
        for name in TABLE_ORDER:
            pg_table = pg_meta.tables[name]
            src = sqlite_meta.tables.get(name)
            if src is None:
                print(f"{name}: not present in SQLite, skipped.")
                continue

            rows = conn_rows(sqlite_engine, src)
            if not rows:
                print(f"{name}: no rows.")
                _reset_sequence(conn, pg_table)
                continue

            # Only copy columns that exist on both sides.
            shared = [c for c in pg_table.columns.keys() if c in src.columns.keys()]
            dropped = [c for c in src.columns.keys() if c not in shared]
            if dropped:
                print(f"{name}: ignoring SQLite-only columns {dropped}")

            batch = [
                {c: _coerce(row[c], pg_table.columns[c]) for c in shared}
                for row in rows
            ]
            conn.execute(pg_table.insert(), batch)
            conn.commit()
            total += len(batch)
            print(f"{name}: copied {len(batch)} rows.")
            _reset_sequence(conn, pg_table)
            conn.commit()

    print(f"\nMigration complete -- {total} rows copied.")


def conn_rows(engine, table: Table):
    with engine.connect() as c:
        return c.execute(table.select()).mappings().all()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--database-url",
        default=os.getenv("DATABASE_URL"),
        help="Target PostgreSQL URL (defaults to DATABASE_URL from the environment).",
    )
    parser.add_argument(
        "--replace",
        action="store_true",
        help="Delete existing rows in the target tables before copying.",
    )
    args = parser.parse_args()

    if not args.database_url:
        print("Error: no target database. Pass --database-url or set DATABASE_URL.")
        sys.exit(1)

    url = _normalize(args.database_url)
    if ".railway.internal" in url:
        print("Error: *.railway.internal only resolves from inside Railway.")
        print("Use the Postgres service's DATABASE_PUBLIC_URL instead.")
        sys.exit(1)

    if not os.path.exists(os.path.join(BASE_DIR, "instance", "neosafety.db")):
        print(f"Error: no SQLite database at {SQLITE_URL}")
        sys.exit(1)

    migrate(url, args.replace)
