"""Token-protected admin REST API consumed by the Next.js admin panel.

All endpoints live under /api/admin and require:
    Authorization: Bearer <ADMIN_API_TOKEN>
The Next.js app calls these only from the server side, so the token never
reaches the browser.
"""
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from extensions import db
from models import Product, Category, Review, Order, Advert, Stat, Setting

bp = Blueprint("admin_api", __name__, url_prefix="/api/admin")

LOW_STOCK = 10


@bp.before_request
def _guard():
    if request.method == "OPTIONS":
        return
    auth = request.headers.get("Authorization", "")
    token = auth[7:].strip() if auth.startswith("Bearer ") else ""
    if not token or token != current_app.config.get("ADMIN_API_TOKEN"):
        return jsonify({"error": "unauthorized"}), 401


# ---------- serializers (raw, editable fields incl. id) ----------
def product_row(p: Product):
    return {
        "id": p.id, "slug": p.slug, "name": p.name, "price": p.price, "oldPrice": p.old_price,
        "img": p.img, "tag": p.tag, "featured": bool(p.featured), "stock": p.stock,
        "colors": p.colors or "", "sizes": p.sizes or "", "images": p.images or "",
        "category": p.category.slug if p.category else None,
        "categoryName": p.category.name if p.category else None,
        "material": p.material or "", "supplier": p.supplier or "",
        "supplierContact": p.supplier_contact or "", "rawMaterials": p.raw_materials or "",
    }


def category_row(c: Category):
    return {"id": c.id, "slug": c.slug, "name": c.name, "blurb": c.blurb or "",
            "img": c.img or "", "group": c.group or "uniform",
            "productCount": len(c.products)}


def review_row(r: Review):
    return {"id": r.id, "name": r.name, "rating": r.rating, "comment": r.comment or "",
            "approved": bool(r.approved), "product": r.product.name if r.product else None,
            "productSlug": r.product.slug if r.product else None,
            "createdAt": r.created_at.strftime("%d %b %Y") if r.created_at else ""}


def order_row(o: Order):
    return {
        "id": o.id, "orderNumber": o.order_number, "customerName": o.customer_name,
        "phone": o.phone, "email": o.email or "", "notes": o.notes or "", "total": o.total,
        "status": o.status, "eta": o.eta.strftime("%Y-%m-%d") if o.eta else None,
        "createdAt": o.created_at.strftime("%d %b %Y %H:%M") if o.created_at else "",
        "items": [i.to_dict() for i in o.items],
    }


def advert_row(a: Advert):
    return {"id": a.id, "title": a.title, "subtitle": a.subtitle or "",
            "priceLabel": a.price_label or "", "ctaLabel": a.cta_label or "",
            "href": a.href or "", "img": a.img or "", "placement": a.placement or "home",
            "active": bool(a.active), "sort": a.sort or 0}


def stat_row(s: Stat):
    return {"id": s.id, "value": s.value, "label": s.label, "sort": s.sort or 0}


def setting_row(s: Setting):
    return {"id": s.id, "key": s.key, "label": s.label or "", "value": s.value or "", "img": s.img or ""}


def _body():
    return request.get_json(silent=True) or {}


# ---------- dashboard ----------
@bp.get("/dashboard")
def dashboard():
    orders = Order.query.all()
    by_status = {}
    revenue = 0
    for o in orders:
        by_status[o.status] = by_status.get(o.status, 0) + 1
        if o.status != "cancelled":
            revenue += o.total or 0
    products = Product.query.all()
    low = [product_row(p) for p in products if (p.stock or 0) <= LOW_STOCK]
    low.sort(key=lambda r: r["stock"])
    recent = Order.query.order_by(Order.created_at.desc()).limit(6).all()
    pending_reviews = Review.query.filter_by(approved=False).count()
    return jsonify({
        "orders": {"total": len(orders), "byStatus": by_status, "revenue": revenue},
        "products": {"total": len(products), "lowStockCount": len(low)},
        "reviews": {"pending": pending_reviews},
        "lowStock": low[:8],
        "recentOrders": [order_row(o) for o in recent],
    })


# ---------- products ----------
@bp.get("/products")
def products_list():
    items = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([product_row(p) for p in items])


def _apply_product(p: Product, d: dict):
    if "name" in d: p.name = (d.get("name") or "").strip()
    if "slug" in d: p.slug = (d.get("slug") or "").strip()
    if "price" in d: p.price = int(d.get("price") or 0)
    p.old_price = int(d["oldPrice"]) if d.get("oldPrice") else None
    if "img" in d: p.img = (d.get("img") or "").strip()
    p.tag = (d.get("tag") or "").strip() or None
    if "featured" in d: p.featured = bool(d.get("featured"))
    if "stock" in d: p.stock = int(d.get("stock") or 0)
    if "colors" in d: p.colors = (d.get("colors") or "").strip()
    if "sizes" in d: p.sizes = (d.get("sizes") or "").strip()
    if "images" in d:
        gallery = [x.strip() for x in (d.get("images") or "").split(",") if x.strip()][:6]
        p.images = ",".join(gallery)
    if "material" in d: p.material = (d.get("material") or "").strip()
    if "supplier" in d: p.supplier = (d.get("supplier") or "").strip()
    if "supplierContact" in d: p.supplier_contact = (d.get("supplierContact") or "").strip()
    if "rawMaterials" in d: p.raw_materials = (d.get("rawMaterials") or "").strip()
    if "category" in d:
        cat = Category.query.filter_by(slug=d.get("category")).first()
        p.category_id = cat.id if cat else None


@bp.post("/products")
def products_create():
    d = _body()
    if not d.get("name") or not d.get("slug"):
        return jsonify({"error": "name and slug are required"}), 400
    if Product.query.filter_by(slug=d["slug"].strip()).first():
        return jsonify({"error": "slug already exists"}), 400
    p = Product()
    _apply_product(p, d)
    db.session.add(p)
    db.session.commit()
    return jsonify(product_row(p)), 201


@bp.put("/products/<int:pid>")
def products_update(pid):
    p = Product.query.get_or_404(pid)
    _apply_product(p, _body())
    db.session.commit()
    return jsonify(product_row(p))


@bp.delete("/products/<int:pid>")
def products_delete(pid):
    p = Product.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- categories ----------
@bp.get("/categories")
def categories_list():
    items = Category.query.order_by(Category.id).all()
    return jsonify([category_row(c) for c in items])


def _apply_category(c: Category, d: dict):
    if "name" in d: c.name = (d.get("name") or "").strip()
    if "slug" in d: c.slug = (d.get("slug") or "").strip()
    if "blurb" in d: c.blurb = (d.get("blurb") or "").strip()
    if "img" in d: c.img = (d.get("img") or "").strip()
    if "group" in d: c.group = (d.get("group") or "uniform").strip()


@bp.post("/categories")
def categories_create():
    d = _body()
    if not d.get("name") or not d.get("slug"):
        return jsonify({"error": "name and slug are required"}), 400
    if Category.query.filter_by(slug=d["slug"].strip()).first():
        return jsonify({"error": "slug already exists"}), 400
    c = Category()
    _apply_category(c, d)
    db.session.add(c)
    db.session.commit()
    return jsonify(category_row(c)), 201


@bp.put("/categories/<int:cid>")
def categories_update(cid):
    c = Category.query.get_or_404(cid)
    _apply_category(c, _body())
    db.session.commit()
    return jsonify(category_row(c))


@bp.delete("/categories/<int:cid>")
def categories_delete(cid):
    c = Category.query.get_or_404(cid)
    db.session.delete(c)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- reviews ----------
@bp.get("/reviews")
def reviews_list():
    items = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([review_row(r) for r in items])


@bp.put("/reviews/<int:rid>")
def reviews_update(rid):
    r = Review.query.get_or_404(rid)
    d = _body()
    if "approved" in d: r.approved = bool(d["approved"])
    if "comment" in d: r.comment = d["comment"]
    if "rating" in d: r.rating = int(d["rating"])
    db.session.commit()
    return jsonify(review_row(r))


@bp.delete("/reviews/<int:rid>")
def reviews_delete(rid):
    r = Review.query.get_or_404(rid)
    db.session.delete(r)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- orders ----------
@bp.get("/orders")
def orders_list():
    items = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([order_row(o) for o in items])


@bp.put("/orders/<int:oid>")
def orders_update(oid):
    o = Order.query.get_or_404(oid)
    d = _body()
    if d.get("status") in ("new", "confirmed", "delivered", "cancelled"):
        o.status = d["status"]
    if "eta" in d:
        val = d.get("eta")
        o.eta = datetime.strptime(val, "%Y-%m-%d").date() if val else None
    db.session.commit()
    return jsonify(order_row(o))


@bp.delete("/orders/<int:oid>")
def orders_delete(oid):
    o = Order.query.get_or_404(oid)
    db.session.delete(o)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- adverts ----------
@bp.get("/adverts")
def adverts_list():
    items = Advert.query.order_by(Advert.sort).all()
    return jsonify([advert_row(a) for a in items])


def _apply_advert(a: Advert, d: dict):
    if "title" in d: a.title = (d.get("title") or "").strip()
    if "subtitle" in d: a.subtitle = (d.get("subtitle") or "").strip()
    if "priceLabel" in d: a.price_label = (d.get("priceLabel") or "").strip()
    if "ctaLabel" in d: a.cta_label = (d.get("ctaLabel") or "Shop Now").strip()
    if "href" in d: a.href = (d.get("href") or "/ppe").strip()
    if "img" in d: a.img = (d.get("img") or "").strip()
    if "placement" in d: a.placement = (d.get("placement") or "home").strip()
    if "active" in d: a.active = bool(d.get("active"))
    if "sort" in d: a.sort = int(d.get("sort") or 0)


@bp.post("/adverts")
def adverts_create():
    d = _body()
    if not d.get("title"):
        return jsonify({"error": "title is required"}), 400
    a = Advert()
    _apply_advert(a, d)
    db.session.add(a)
    db.session.commit()
    return jsonify(advert_row(a)), 201


@bp.put("/adverts/<int:aid>")
def adverts_update(aid):
    a = Advert.query.get_or_404(aid)
    _apply_advert(a, _body())
    db.session.commit()
    return jsonify(advert_row(a))


@bp.delete("/adverts/<int:aid>")
def adverts_delete(aid):
    a = Advert.query.get_or_404(aid)
    db.session.delete(a)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- stats ----------
@bp.get("/stats")
def stats_list():
    items = Stat.query.order_by(Stat.sort).all()
    return jsonify([stat_row(s) for s in items])


@bp.post("/stats")
def stats_create():
    d = _body()
    s = Stat(value=(d.get("value") or "").strip(), label=(d.get("label") or "").strip(), sort=int(d.get("sort") or 0))
    db.session.add(s)
    db.session.commit()
    return jsonify(stat_row(s)), 201


@bp.put("/stats/<int:sid>")
def stats_update(sid):
    s = Stat.query.get_or_404(sid)
    d = _body()
    if "value" in d: s.value = (d.get("value") or "").strip()
    if "label" in d: s.label = (d.get("label") or "").strip()
    if "sort" in d: s.sort = int(d.get("sort") or 0)
    db.session.commit()
    return jsonify(stat_row(s))


@bp.delete("/stats/<int:sid>")
def stats_delete(sid):
    s = Stat.query.get_or_404(sid)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"ok": True})


# ---------- settings ----------
@bp.get("/settings")
def settings_list():
    items = Setting.query.order_by(Setting.id).all()
    return jsonify([setting_row(s) for s in items])


@bp.put("/settings/<int:sid>")
def settings_update(sid):
    s = Setting.query.get_or_404(sid)
    d = _body()
    if "value" in d: s.value = d.get("value") or ""
    if "img" in d: s.img = d.get("img") or ""
    if "label" in d: s.label = (d.get("label") or "").strip()
    db.session.commit()
    return jsonify(setting_row(s))


@bp.post("/settings")
def settings_create():
    d = _body()
    key = (d.get("key") or "").strip()
    if not key:
        return jsonify({"error": "key is required"}), 400
    if Setting.query.filter_by(key=key).first():
        return jsonify({"error": "key already exists"}), 400
    s = Setting(
        key=key,
        label=(d.get("label") or "").strip(),
        value=(d.get("value") or "").strip(),
        img=(d.get("img") or "").strip(),
    )
    db.session.add(s)
    db.session.commit()
    return jsonify(setting_row(s)), 201


@bp.delete("/settings/<int:sid>")
def settings_delete(sid):
    s = Setting.query.get_or_404(sid)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"ok": True})


@bp.post("/settings/seed")
def settings_seed():
    """Ensure a standard set of section/image settings exists."""
    defaults = [
        {"key": "hero_image", "label": "Homepage hero background", "value": "", "img": "/images/hero-bg.png"},
        {"key": "hero_products_image", "label": "Homepage hero products collage", "value": "", "img": "/images/hero-products.png"},
        {"key": "overview_image", "label": "Who we are section image", "value": "", "img": "/neo1.jpeg"},
        {"key": "newsletter_image", "label": "Newsletter background", "value": "", "img": "/images/catalog/rack.jpg"},
        {"key": "branding_services_image", "label": "Homepage Branding Services section image", "value": "", "img": "/neo2.jpeg"},
        {"key": "industries_image", "label": "Industries section background", "value": "", "img": "/images/catalog/scene.jpg"},
        {"key": "sustainability_image", "label": "Sustainability section image", "value": "", "img": "/neorecycle.jpeg"},
        {"key": "about_hero", "label": "About page hero image", "value": "", "img": "/images/catalog/coveralls-set.jpg"},
        {"key": "about_collage1", "label": "About page collage image 1", "value": "", "img": "/images/catalog/shirts-rack.jpg"},
        {"key": "about_collage2", "label": "About page collage image 2", "value": "", "img": "/images/catalog/worker-hivis.jpg"},
        {"key": "about_collage3", "label": "About page collage image 3", "value": "", "img": "/images/catalog/nurse-female.jpg"},
        {"key": "about_stats_bg", "label": "About page stats background", "value": "", "img": "/images/catalog/suits-rack.jpg"},
    ]
    created = 0
    for d in defaults:
        if not Setting.query.filter_by(key=d["key"]).first():
            s = Setting(key=d["key"], label=d["label"], value=d["value"], img=d["img"])
            db.session.add(s)
            created += 1
    db.session.commit()
    return jsonify({"created": created, "total": len(defaults)})


import os
from werkzeug.utils import secure_filename

ALLOWED = {"png", "jpg", "jpeg", "gif", "webp", "svg"}

def allowed_file(fn):
    return "." in fn and fn.rsplit(".", 1)[1].lower() in ALLOWED


@bp.post("/upload")
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    if not file or not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    filename = secure_filename(file.filename)
    # prefix with timestamp to avoid collisions
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{int(datetime.utcnow().timestamp())}{ext}"
    upload_dir = current_app.config.get("UPLOAD_FOLDER")
    os.makedirs(upload_dir, exist_ok=True)
    dest = os.path.join(upload_dir, filename)
    file.save(dest)
    # return web path (uploads are served from /uploads/* via Next.js public folder)
    return jsonify({"path": f"/uploads/{filename}"})
