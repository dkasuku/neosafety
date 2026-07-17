"""Deprecated.

The admin panel is now the Next.js app at /admin (see the `app/admin` routes),
backed by the token-protected REST API in `routes/admin_api.py`. Flask-Admin has
been removed. This stub remains only so any lingering import does not fail.
"""

def setup_admin(app):  # no-op, kept for backwards compatibility
    return None
