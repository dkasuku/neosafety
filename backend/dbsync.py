"""Lightweight self-healing for the local SQLite schema + default rows.

Runs on every app start:
  * adds any model columns missing from existing tables (fixes schema drift
    without deleting the database or writing migrations),
  * upserts the default editable Setting rows (section images) so newly added
    ones appear in the admin without a re-seed.
"""
from sqlalchemy import inspect, text
from extensions import db

# Editable section images shown under Admin -> Site Content -> Section images.
DEFAULT_SETTINGS = [
    ("hero_image", "Homepage hero background", "/images/hero-bg.png"),
    ("overview_image", "Who we are section image", "/neo1.jpeg"),
    ("newsletter_image", "Newsletter background", "/images/catalog/rack.jpg"),
    ("branding_hero", "Branding page hero image", "/neo2.jpeg"),
    ("branding_services_image", "Homepage Branding Services section image", "/neo2.jpeg"),
    ("branding_image", "Branding page banner image", "/images/catalog/security.jpg"),
    ("industries_image", "Industries section background", "/images/catalog/scene.jpg"),
    ("sustainability_image", "Sustainability section image", "/neorecycle.jpeg"),
    ("about_hero", "About page hero image", "/images/catalog/coveralls-set.jpg"),
    ("about_collage1", "About page collage image 1", "/images/catalog/shirts-rack.jpg"),
    ("about_collage2", "About page collage image 2", "/images/catalog/worker-hivis.jpg"),
    ("about_collage3", "About page collage image 3", "/images/catalog/nurse-female.jpg"),
    ("about_stats_bg", "About page stats background", "/images/catalog/suits-rack.jpg"),
]


def sync_columns(app):
    with app.app_context():
        import models  # noqa: F401  ensure tables are registered
        db.create_all()  # create any missing tables (safe/idempotent)
        insp = inspect(db.engine)
        for table in db.metadata.sorted_tables:
            if not insp.has_table(table.name):
                continue
            existing = {c["name"] for c in insp.get_columns(table.name)}
            for col in table.columns:
                if col.name in existing:
                    continue
                try:
                    coltype = col.type.compile(dialect=db.engine.dialect)
                    db.session.execute(text(f'ALTER TABLE {table.name} ADD COLUMN {col.name} {coltype}'))
                    db.session.commit()
                    print(f"[dbsync] added column {table.name}.{col.name}")
                except Exception as e:
                    db.session.rollback()
                    print(f"[dbsync] could not add {table.name}.{col.name}: {e}")


def ensure_settings(app):
    from models import Setting
    with app.app_context():
        insp = inspect(db.engine)
        if not insp.has_table("settings"):
            return
        for key, label, img in DEFAULT_SETTINGS:
            row = Setting.query.filter_by(key=key).first()
            if not row:
                db.session.add(Setting(key=key, label=label, img=img))
        # Migrate legacy overview_image default from portrait.jpg to neo1.jpeg
        legacy = Setting.query.filter_by(key="overview_image").first()
        if legacy and legacy.img == "/portrait.jpg":
            legacy.img = "/neo1.jpeg"
        db.session.commit()


def run_dbsync(app):
    try:
        sync_columns(app)
        ensure_settings(app)
    except Exception as e:
        print(f"[dbsync] skipped: {e}")
