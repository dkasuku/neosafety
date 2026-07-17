import random
from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import db
from models import Order, OrderItem

bp = Blueprint("orders", __name__, url_prefix="/api")


def _order_number():
    return "NEO-" + datetime.utcnow().strftime("%y%m%d") + "-" + str(random.randint(1000, 9999))


@bp.post("/orders")
def create_order():
    data = request.get_json(silent=True) or {}
    name = (data.get("customerName") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip()
    notes = (data.get("notes") or "").strip()
    items = data.get("items") or []
    if not name or not phone or not items:
        return jsonify({"error": "Name, phone and at least one item are required"}), 400

    total = 0
    order = Order(order_number=_order_number(), customer_name=name, phone=phone, email=email, notes=notes)
    db.session.add(order)
    db.session.flush()
    for it in items:
        try:
            price = int(it.get("price", 0))
            qty = max(1, int(it.get("qty", 1)))
        except (TypeError, ValueError):
            continue
        total += price * qty
        db.session.add(OrderItem(order_id=order.id, slug=it.get("slug"), name=it.get("name"), price=price, qty=qty))
    order.total = total
    db.session.commit()
    return jsonify({"orderNumber": order.order_number, "total": total}), 201


@bp.get("/orders/track")
def track_order():
    num = (request.args.get("order") or "").strip()
    phone = (request.args.get("phone") or "").strip()
    if not num or not phone:
        return jsonify({"error": "Order number and phone are required"}), 400
    digits = "".join(ch for ch in phone if ch.isdigit())
    o = Order.query.filter_by(order_number=num).first()
    stored = "".join(ch for ch in (o.phone if o else "") if ch.isdigit())
    if not o or len(digits) < 6 or digits[-6:] not in stored:
        return jsonify({"error": "Order not found. Please check the order number and phone."}), 404
    return jsonify(o.to_dict())
