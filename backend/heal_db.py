"""One-time database healer. Run with the Flask server STOPPED:
    python heal_db.py
Adds any columns the app models expect but the SQLite database is missing,
without deleting data. Safe to run repeatedly.
"""
import os, sqlite3, re
from config import Config

uri = Config.SQLALCHEMY_DATABASE_URI
if not uri.startswith("sqlite"):
    raise SystemExit("This healer is for the local SQLite database only.")

# sqlite:///neosafety.db (relative to instance/) or sqlite:////abs/path.db
path = uri.replace("sqlite:///", "", 1)
if not os.path.isabs(path):
    # Flask-SQLAlchemy puts relative sqlite files in the instance/ folder
    cand = os.path.join("instance", path)
    path = cand if os.path.exists(cand) else path

print("Database:", path)
con = sqlite3.connect(path)
cur = con.cursor()

# columns each table must have: name -> SQL type
WANT = {
    "products": {
        "colors": "VARCHAR(400)", "sizes": "VARCHAR(160)", "images": "VARCHAR(1000)",
        "stock": "INTEGER", "tag": "VARCHAR(40)", "featured": "BOOLEAN",
        "material": "VARCHAR(200)", "supplier": "VARCHAR(200)",
        "supplier_contact": "VARCHAR(200)", "raw_materials": "TEXT",
    },
    "orders": {"eta": "DATE", "status": "VARCHAR(30)", "email": "VARCHAR(160)", "notes": "TEXT", "total": "INTEGER"},
}

for table, cols in WANT.items():
    cur.execute(f"PRAGMA table_info({table})")
    existing = {r[1] for r in cur.fetchall()}
    if not existing:
        print(f"  (table {table} not found — run seed first)"); continue
    for name, typ in cols.items():
        if name not in existing:
            try:
                cur.execute(f"ALTER TABLE {table} ADD COLUMN {name} {typ}")
                print(f"  + added {table}.{name}")
            except sqlite3.OperationalError as e:
                print(f"  ! {table}.{name}: {e}")
con.commit()
con.close()
print("Done. Start the backend again: flask --app app run")
