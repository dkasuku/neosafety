from flask import Blueprint, jsonify, request
from extensions import db
from models import Product, Review

bp = Blueprint("reviews", __name__, url_prefix="/api")


@bp.get("/products/<slug>/reviews")
def list_reviews(slug):
    p = Product.query.filter_by(slug=slug).first()
    if not p:
        return jsonify({"error": "not found"}), 404
    approved = [r for r in p.reviews if r.approved]
    approved.sort(key=lambda r: r.created_at, reverse=True)
    return jsonify({
        "average": p.rating_avg,
        "count": p.reviews_count,
        "reviews": [r.to_dict() for r in approved],
    })


@bp.post("/products/<slug>/reviews")
def add_review(slug):
    p = Product.query.filter_by(slug=slug).first()
    if not p:
        return jsonify({"error": "not found"}), 404
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    comment = (data.get("comment") or "").strip()
    try:
        rating = int(data.get("rating", 5))
    except (TypeError, ValueError):
        rating = 5
    rating = max(1, min(5, rating))
    if not name or not comment:
        return jsonify({"error": "Name and comment are required"}), 400
    review = Review(product_id=p.id, name=name, rating=rating, comment=comment, approved=True)
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
