"""Public, privacy-friendly page-view tracking for the storefront.

The browser posts {path, referrer, visitor} with navigator.sendBeacon as
text/plain (a CORS "simple" request, so no preflight). No IPs are stored.
"""
import json
import random
import re
from datetime import datetime, timedelta
from urllib.parse import urlparse
from flask import Blueprint, request, current_app
from extensions import db
from models import PageView

bp = Blueprint("analytics", __name__, url_prefix="/api")

BOT_RE = re.compile(r"bot|crawl|spider|slurp|preview|monitor|uptime|headless|lighthouse|curl|wget|python|httpclient", re.I)
RETENTION_DAYS = 400


def _device(ua: str) -> str:
    u = ua.lower()
    if "ipad" in u or "tablet" in u or ("android" in u and "mobile" not in u):
        return "tablet"
    if "mobi" in u or "iphone" in u or "android" in u:
        return "mobile"
    return "desktop"


@bp.post("/track")
def track():
    ua = request.headers.get("User-Agent", "")
    if not ua or BOT_RE.search(ua):
        return "", 204
    try:
        data = json.loads(request.get_data(as_text=True) or "{}")
    except ValueError:
        return "", 204
    if not isinstance(data, dict):
        return "", 204
    path = str(data.get("path") or "")[:255]
    if not path.startswith("/") or path.startswith("/admin") or path.startswith("/api"):
        return "", 204

    ref = ""
    try:
        host = (urlparse(str(data.get("referrer") or "")).hostname or "").lower()
        own = {h.strip() for h in current_app.config.get("OWN_HOSTS", [])}
        if host and host.removeprefix("www.") not in own:
            ref = host.removeprefix("www.")[:120]
    except ValueError:
        pass

    visitor = re.sub(r"[^A-Za-z0-9-]", "", str(data.get("visitor") or ""))[:40]
    try:
        db.session.add(PageView(path=path, referrer=ref, visitor=visitor, device=_device(ua)))
        if random.random() < 0.01:  # occasional pruning keeps the table bounded
            PageView.query.filter(PageView.created_at < datetime.utcnow() - timedelta(days=RETENTION_DAYS)).delete()
        db.session.commit()
    except Exception:
        db.session.rollback()
    return "", 204
