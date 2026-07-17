from flask import Blueprint, jsonify
from flask import request
from models import Product, Category, Advert, Stat, Setting

bp = Blueprint("catalog", __name__, url_prefix="/api")


@bp.get("/health")
def health():
    return jsonify({"ok": True})


@bp.get("/categories")
def categories():
    cats = Category.query.order_by(Category.id).all()
    return jsonify([c.to_dict() for c in cats])


@bp.get("/products")
def products():
    items = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in items])


@bp.get("/products/<slug>")
def product(slug):
    p = Product.query.filter_by(slug=slug).first()
    if not p:
        return jsonify({"error": "not found"}), 404
    data = p.to_dict()
    data["reviews"] = [r.to_dict() for r in p.reviews if r.approved]
    return jsonify(data)


@bp.get("/adverts")
def adverts():
    q = Advert.query.filter_by(active=True)
    place = request.args.get("placement")
    if place:
        q = q.filter_by(placement=place)
    items = q.order_by(Advert.sort).all()
    return jsonify([a.to_dict() for a in items])


@bp.get("/stats")
def stats():
    items = Stat.query.order_by(Stat.sort).all()
    return jsonify([s.to_dict() for s in items])


@bp.get("/settings")
def settings():
    items = Setting.query.all()
    return jsonify({s.key: s.to_dict() for s in items})
