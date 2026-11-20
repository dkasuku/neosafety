import os
from dotenv import load_dotenv

load_dotenv()


def _normalize_db_url(url: str) -> str:
    # Some providers hand out postgres:// which SQLAlchemy no longer accepts.
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # SQLAlchemy 2.1+ maps bare postgresql:// to psycopg (v3); we ship psycopg2.
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


def _database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return _normalize_db_url(url)
    # Falling back to SQLite when deployed is how an empty catalogue goes unnoticed:
    # the API answers 200 with [] and the storefront quietly shows its static data.
    # Fail loudly instead so a missing DATABASE_URL can never look like "no products".
    if os.getenv("RAILWAY_ENVIRONMENT"):
        raise RuntimeError(
            "DATABASE_URL is not set. On Railway, reference the Postgres service "
            "with ${{Postgres.DATABASE_URL}} -- refusing to start on SQLite."
        )
    # Local development with no setup required.
    return "sqlite:///neosafety.db"


class Config:
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("FLASK_SECRET", "change-me-in-production")
    # There is no Flask-side admin login. The only admin is the Next.js panel at
    # /admin, which authenticates with ADMIN_PASSWORD on the web service and then
    # calls this API with the shared bearer token below.
    ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "neo-admin-local-token")
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "uploads"))
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    WHATSAPP_NUMBER = os.getenv("WHATSAPP_NUMBER", "254707866446")
