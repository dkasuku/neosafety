"""Migrate data from the local SQLite database to PostgreSQL.

Usage:
    1. Install PostgreSQL locally and create a database named `neosafety`.
    2. Set DATABASE_URL in backend/.env, e.g.:
       DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/neosafety
    3. Activate the backend virtual environment:
       .venv\\Scripts\\activate
    4. Run:
       python migrate_to_postgres.py

The script drops existing PostgreSQL tables, recreates them from SQLAlchemy models,
and copies all rows from SQLite while preserving IDs and relationships.
"""

import os
import sys

from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, Table, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'neosafety.db')}"

POSTGRES_URL = os.getenv("DATABASE_URL")
if not POSTGRES_URL:
    print("Error: DATABASE_URL environment variable is not set.")
    print("Add it to backend/.env, for example:")
    print("DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/neosafety")
    sys.exit(1)

# Railway sometimes gives postgres:// which SQLAlchemy rejects.
if POSTGRES_URL.startswith("postgres://"):
    POSTGRES_URL = POSTGRES_URL.replace("postgres://", "postgresql://", 1)


# Order matters because of foreign keys.
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


def _ensure_database_exists(url: str):
    """Create the target PostgreSQL database if it does not exist."""
    from sqlalchemy.engine.url import make_url
    from sqlalchemy.exc import OperationalError

    parsed = make_url(url)
    db_name = parsed.database

    # Try connecting to the target database directly first. On Railway the DB
    # already exists, so this succeeds immediately without touching the
    # 'postgres' maintenance database (which cloud providers often block).
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"PostgreSQL database '{db_name}' already exists.")
        engine.dispose()
        return
    except OperationalError as exc:
        error_msg = str(exc).lower()
        # Only fall through to CREATE DATABASE for the specific "DB not found" error.
        if "database" not in error_msg:
            raise

    # Target DB does not exist (common for a fresh local install).
    # Connect to the maintenance database and create it.
    maintenance_url = parsed.set(database="postgres")
    engine = create_engine(maintenance_url, isolation_level="AUTOCOMMIT")
    with engine.connect() as conn:
        conn.execute(text(f'CREATE DATABASE "{db_name}"'))
        print(f"Created PostgreSQL database '{db_name}'.")
    engine.dispose()


def _create_tables_from_models(postgres_engine):
    """Create tables directly from SQLAlchemy models (avoids triggering dbsync)."""
    # Import models into a minimal app context so SQLAlchemy metadata is populated.
    from flask import Flask
    from config import Config
    from extensions import db
    import models  # noqa: F401  registers all models

    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_URL
    db.init_app(app)
    with app.app_context():
        db.create_all()


def migrate():
    _ensure_database_exists(POSTGRES_URL)

    sqlite_engine = create_engine(SQLITE_URL)
    postgres_engine = create_engine(POSTGRES_URL)

    sqlite_meta = MetaData()
    sqlite_meta.reflect(bind=sqlite_engine)

    # Drop all existing tables in Postgres, then recreate from models.
    print("Dropping existing PostgreSQL tables (if any)...")
    postgres_meta = MetaData()
    postgres_meta.reflect(bind=postgres_engine)
    postgres_meta.drop_all(bind=postgres_engine)

    print("Creating PostgreSQL tables from models...")
    _create_tables_from_models(postgres_engine)

    # Re-read metadata after create_all.
    postgres_meta = MetaData()
    postgres_meta.reflect(bind=postgres_engine)

    Session = sessionmaker(bind=sqlite_engine)
    sqlite_session = Session()

    with postgres_engine.connect() as conn:
        for table_name in TABLE_ORDER:
            if table_name not in sqlite_meta.tables:
                print(f"Skipping {table_name}: not found in SQLite.")
                continue

            sqlite_table = sqlite_meta.tables[table_name]
            rows = sqlite_session.execute(sqlite_table.select()).mappings().all()

            if not rows:
                print(f"{table_name}: no rows to migrate.")
                continue

            postgres_table = Table(table_name, postgres_meta, autoload_with=postgres_engine)
            batch = [{k: row[k] for k in row.keys()} for row in rows]

            conn.execute(postgres_table.insert(), batch)
            conn.commit()
            print(f"{table_name}: migrated {len(batch)} rows.")

    sqlite_session.close()
    print("\nMigration complete!")


if __name__ == "__main__":
    migrate()
