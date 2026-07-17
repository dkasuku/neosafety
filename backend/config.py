import os
from dotenv import load_dotenv

load_dotenv()


def _normalize_db_url(url: str) -> str:
    # Some providers hand out postgres:// which SQLAlchemy no longer accepts.
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    # Defaults to a local SQLite file so it runs with zero setup.
    # For PostgreSQL, set DATABASE_URL in .env (e.g. postgresql://user:pass@localhost:5432/neosafety)
    SQLALCHEMY_DATABASE_URI = _normalize_db_url(
        os.getenv("DATABASE_URL", "sqlite:///neosafety.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("FLASK_SECRET", "change-me-in-production")
    ADMIN_USER = os.getenv("ADMIN_USER", "admin")
    ADMIN_PASS = os.getenv("ADMIN_PASS", "admin123")
    # Shared bearer token the Next.js admin uses to call /api/admin (server-side only).
    ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "neo-admin-local-token")
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "uploads"))
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    WHATSAPP_NUMBER = os.getenv("WHATSAPP_NUMBER", "254707866446")
