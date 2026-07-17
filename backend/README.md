# NEO Safety — Flask API + Admin

Flask backend for the NEO Safety storefront: products & categories (inventory),
product reviews/comments, and customer orders — plus a built-in admin panel.

Runs on **SQLite by default (zero setup)**. PostgreSQL is fully supported — just
set `DATABASE_URL`.

## Requirements
- Python 3.10–3.13

## Quick start (SQLite — recommended to try it)
Run each line on its own (do not paste the `#` comments):
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
flask --app app seed
flask --app app run
```
macOS/Linux: use `source venv/bin/activate` and `cp .env.example .env`.

The API starts at http://localhost:5000 and creates `neosafety.db` in this folder.

## Admin panel
Open **http://localhost:5000/admin** and log in with the values from `.env`:
- Username: `admin`
- Password: `admin123`

Manage **Products** (price, stock, category, image, tag, featured), **Categories**,
**Reviews** (approve/edit/delete), and **Orders** (status: new → confirmed → delivered).

## Using PostgreSQL instead
1. Install PostgreSQL and create a database, e.g. `createdb neosafety`.
2. In `.env`, set:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/neosafety
   ```
3. `pip install -r requirements.txt` (installs `psycopg2-binary`), then
   `flask --app app seed` and `flask --app app run` as above.

## API
| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/categories` | list categories |
| GET | `/api/products` | list products |
| GET | `/api/products/<slug>` | product + reviews |
| GET/POST | `/api/products/<slug>/reviews` | list / add review |
| POST | `/api/orders` | create order |

## Connect the frontend
In the Next.js project root create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Reviews and checkout will then use the API. If the API is off, the storefront
still works (reviews won't load; checkout still opens WhatsApp).
