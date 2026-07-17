# NEO Safety Supplies — Deployment Guide (Railway + Namecheap)

This project is three parts that go live as **two web services + one database**:

| Part | Tech | Railway service | Public URL (example) |
|------|------|-----------------|----------------------|
| Storefront **and** admin panel | Next.js | `web` (repo root) | `https://www.neosafetysupplies.com` (admin at `/admin`) |
| API | Flask | `api` (root dir = `backend`) | `https://api.neosafetysupplies.com` |
| Database | PostgreSQL | Railway Postgres plugin | internal |

The admin is part of the Next.js app, so it deploys **with** the storefront — it is not a separate service.

---

## 0. Before you start

1. Push this project to a **GitHub repository** (Railway deploys from GitHub).
2. Create a free **Railway** account (railway.app) and a **Namecheap** account with your domain.
3. Generate strong secrets — run this locally and keep the output safe:
   ```
   python -c "import secrets; print('FLASK_SECRET', secrets.token_hex(32)); print('ADMIN_API_TOKEN', secrets.token_urlsafe(32)); print('ADMIN_SESSION_TOKEN', secrets.token_urlsafe(24))"
   ```
   Also choose a strong **ADMIN_PASSWORD** (this is what you type to sign into `/admin`).

---

## 1. Create the database

1. In Railway: **New Project → Deploy PostgreSQL**.
2. Open the Postgres service → **Variables** → note that it exposes `DATABASE_URL`. You'll reference it below.

---

## 2. Deploy the backend (Flask API)

1. In the same project: **New → GitHub Repo → select your repo**.
2. Open the new service → **Settings → Root Directory = `backend`**.
3. Railway auto-detects Python (from `requirements.txt`) and runs the `Procfile`
   (`gunicorn app:app`). No build config needed.
4. **Variables** (Settings → Variables) — add:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference the Postgres service) |
   | `FLASK_SECRET` | your generated secret |
   | `ADMIN_API_TOKEN` | your generated token (must match the web service) |
   | `CORS_ORIGINS` | `https://www.neosafetysupplies.com,https://neosafetysupplies.com` |
   | `WHATSAPP_NUMBER` | `254707866446` |

5. **Networking → Generate Domain** (or add the custom `api.` domain in step 5).
6. On first boot the app **auto-creates all tables**. To load the demo catalogue,
   open the service's **shell/one-off command** and run:
   ```
   flask --app app seed
   ```
   (Skip this if you'd rather add your own products in the admin.)

   **Migrating from local SQLite:** If you have existing data in `backend/instance/neosafety.db`,
   set the backend's `DATABASE_URL` to the Railway Postgres URL locally, then run:
   ```
   python migrate_to_postgres.py
   ```
   This copies all existing categories, products, orders, reviews, and settings into PostgreSQL.
7. Health check: visit `https://<backend-url>/api/health` → should return `{"ok": true}`.

---

## 3. Deploy the web app (storefront + admin)

1. In the same project: **New → GitHub Repo → same repo** (a second service).
2. **Settings → Root Directory = `/`** (repo root).
3. Railway auto-detects Next.js: build `npm run build`, start `npm run start`.
4. **Variables** — add:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://api.neosafetysupplies.com` (your backend URL) |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.neosafetysupplies.com` |
   | `ADMIN_PASSWORD` | your chosen admin password |
   | `ADMIN_SESSION_TOKEN` | your generated token |
   | `ADMIN_API_TOKEN` | **same value** as the backend's `ADMIN_API_TOKEN` |
   | `NODE_ENV` | `production` |

5. **Persistent uploads (important).** Admin image uploads are written to
   `public/uploads`. Railway's disk is wiped on every redeploy, so add a **Volume**:
   Service → **Settings → Volumes → Add Volume**, mount path **`/app/public/uploads`**.
   This keeps uploaded images across deploys. (Without it, uploads disappear on redeploy.)

---

## 4. Domains (Namecheap → Railway)

**In Railway**, for each service open **Settings → Networking → Custom Domain**:
- Web service: add `www.neosafetysupplies.com` (and optionally the apex).
- API service: add `api.neosafetysupplies.com`.
Railway shows a **CNAME target** for each (e.g. `abcd.up.railway.app`).

**In Namecheap** → Domain List → **Manage → Advanced DNS → Add New Record**:

| Type | Host | Value |
|------|------|-------|
| CNAME Record | `www` | the web service's Railway target |
| CNAME Record | `api` | the API service's Railway target |
| URL Redirect Record | `@` | `https://www.neosafetysupplies.com` (Permanent) |

(The apex redirect is used because Namecheap can't CNAME the bare domain. It sends
`neosafetysupplies.com` → `www.neosafetysupplies.com`.)

DNS takes a few minutes to a few hours. Railway issues HTTPS certificates automatically.
After it resolves, double-check the backend `CORS_ORIGINS` and the web
`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SITE_URL` match your final domains, then redeploy.

---

## 5. Go-live checklist

- [ ] Strong `ADMIN_PASSWORD`, `FLASK_SECRET`, `ADMIN_API_TOKEN`, `ADMIN_SESSION_TOKEN` set (no defaults).
- [ ] `ADMIN_API_TOKEN` identical on both services.
- [ ] `CORS_ORIGINS` lists the live storefront domain(s).
- [ ] `NEXT_PUBLIC_API_URL` points at the live API.
- [ ] Uploads **Volume** mounted at `/app/public/uploads`.
- [ ] Database seeded or products added via admin.
- [ ] `/api/health` returns ok; storefront loads; `/admin` login works; place a test order and confirm it appears in the admin.
- [ ] Enable **Postgres backups** in Railway (Database → Settings).

---

## 6. Nice-to-haves (optional, not blockers)

- **Rate-limiting** on the admin login (currently a single password + HTTPS, which is fine for one owner).
- **Google Search Console** — verify the domain; the sitemap is already served at `/sitemap.xml` and `robots.txt` is live.
- **Analytics** (e.g. Plausible or GA) for traffic.
- **Object storage** (Cloudinary/S3) for images if you outgrow the Railway volume.
- A **privacy policy / terms** page (business/legal decision).

---

## Local development (unchanged)

```
# backend
cd backend && venv\Scripts\activate && flask --app app run
# web
npm install && npm run dev   # http://localhost:3000  (admin at /admin)
```
Everything defaults to local SQLite + localhost, so local dev needs no env setup.
