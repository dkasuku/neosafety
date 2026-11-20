# NEO Safety Supplies — Deployment Guide (Railway + Namecheap)

This project is three parts that go live as **two web services + one database**.
Live setup (Railway project `dependable-learning`, environment `production`):

| Part | Tech | Railway service | Public URL |
|------|------|-----------------|------------|
| Storefront **and** admin panel | Next.js | `frontend` (repo root) | `https://neosafetysupplies.com` (admin at `/admin`) |
| API | Flask | `backend` (root dir = `backend`) | `https://backend-production-39eb6.up.railway.app` |
| Database | PostgreSQL | `Postgres` | internal only |

The admin is part of the Next.js app, so it deploys **with** the storefront — it is not a separate service.

> **There is only one admin.** It is the Next.js panel at `/admin`, which signs in
> with a single password (`ADMIN_PASSWORD` on the `frontend` service — no username).
> Flask has no admin login of its own; it only exposes the token-protected
> `/api/admin` REST API that the panel calls server-side.

> **The API must have a public domain.** Both the browser (cart, reviews, order
> tracking) and the Next.js server call it, so private networking
> (`*.railway.internal`) is not enough. If the `backend` service has no domain
> under **Settings → Networking**, the admin will report
> *"Could not reach the backend"* and the storefront will quietly serve the static
> catalogue from `lib/data.ts` instead — looking perfectly healthy while showing
> nothing from the database.

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
   | `CORS_ORIGINS` | `https://neosafetysupplies.com` |
   | `WHATSAPP_NUMBER` | `254707866446` |

   Do **not** set `ADMIN_USER` / `ADMIN_PASS` / `ADMIN_PASSWORD` here. Flask has no
   admin login; those variables do nothing and only make it look like a second admin.

5. **Networking → Generate Domain.** This is required, not optional — see the note above.
6. On first boot the app **auto-creates all tables**. To load the demo catalogue,
   open the service's **shell/one-off command** and run:
   ```
   flask --app app seed
   ```
   (Skip this if you'd rather add your own products in the admin.)

   **Migrating from local SQLite:** If you have existing data in `backend/instance/neosafety.db`,
   run this **from your machine**, pointing at the Postgres service's
   `DATABASE_PUBLIC_URL` (found under the Postgres service → Variables):
   ```
   python migrate_to_postgres.py --database-url "postgresql://postgres:PASS@HOST.proxy.rlwy.net:PORT/railway" --replace
   ```
   Use the **public** URL. `postgres.railway.internal` only resolves from inside
   Railway, so running the migration against it from a laptop fails to connect and
   copies nothing — the script now refuses that hostname rather than appearing to work.
7. Health check: visit `https://<backend-url>/api/health` → should return `{"ok": true}`.
   Then check `https://<backend-url>/api/products` actually returns rows. A `200 []`
   here is the signature of an empty database, and the storefront will hide it.

---

## 3. Deploy the web app (storefront + admin)

1. In the same project: **New → GitHub Repo → same repo** (a second service).
2. **Settings → Root Directory = `/`** (repo root).
3. Railway auto-detects Next.js: build `npm run build`, start `npm run start`.
4. **Variables** — add:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | the backend's public URL, e.g. `https://backend-production-39eb6.up.railway.app` |
   | `NEXT_PUBLIC_SITE_URL` | `https://neosafetysupplies.com` |
   | `ADMIN_PASSWORD` | your chosen admin password (this is the whole `/admin` login) |
   | `ADMIN_SESSION_TOKEN` | your generated token |
   | `ADMIN_API_TOKEN` | **same value** as the backend's `ADMIN_API_TOKEN` |
   | `NODE_ENV` | `production` |

   `NEXT_PUBLIC_*` values are baked in at **build** time, so after changing either of
   them you must trigger a rebuild — `railway redeploy --service frontend --from-source`.
   Restarting the service is not enough.

5. **Persistent uploads (important).** Admin image uploads are written to
   `public/uploads`. Railway's disk is wiped on every redeploy, so add a **Volume**:
   Service → **Settings → Volumes → Add Volume**, mount path **`/app/public/uploads`**.
   This keeps uploaded images across deploys. (Without it, uploads disappear on redeploy.)

---

## 4. Domains (Namecheap → Railway)

**Current live DNS:** only the apex is set up — `neosafetysupplies.com` CNAMEs to
`d0d0xt5m.up.railway.app` (the `frontend` service). Neither `www.` nor `api.` exists,
so the API is reached on its generated Railway domain instead.

To move the API onto `api.neosafetysupplies.com` (optional — the generated domain
works fine):

1. **Railway** → `backend` service → **Settings → Networking → Custom Domain** →
   add `api.neosafetysupplies.com`. Railway shows a **CNAME target**.
2. **Namecheap** → Domain List → **Manage → Advanced DNS → Add New Record**:

   | Type | Host | Value |
   |------|------|-------|
   | CNAME Record | `api` | the backend service's Railway target |
   | CNAME Record | `www` | the frontend service's Railway target (optional) |

3. Update `NEXT_PUBLIC_API_URL` on `frontend` and `CORS_ORIGINS` on `backend`, then
   **rebuild the frontend**.

Do not point `NEXT_PUBLIC_API_URL` at a hostname before the DNS record exists — an
unresolvable API host is indistinguishable from an outage, and the storefront will
silently fall back to static data.

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
