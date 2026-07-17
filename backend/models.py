from datetime import datetime
from extensions import db


class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    blurb = db.Column(db.String(255), default="")
    img = db.Column(db.String(255), default="")
    group = db.Column(db.String(20), default="uniform")  # ppe | uniform
    products = db.relationship("Product", back_populates="category", lazy=True)

    def to_dict(self):
        return {"slug": self.slug, "name": self.name, "blurb": self.blurb, "img": self.img, "group": self.group}

    def __str__(self):
        return self.name


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(160), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    old_price = db.Column(db.Integer, nullable=True)
    img = db.Column(db.String(255), default="")
    tag = db.Column(db.String(40), nullable=True)
    featured = db.Column(db.Boolean, default=False)
    stock = db.Column(db.Integer, default=0)
    colors = db.Column(db.String(400), default="")  # "Navy:#0C192B,Orange:#F26A21"
    sizes = db.Column(db.String(160), default="")   # "S,M,L,XL"
    images = db.Column(db.String(1000), default="") # extra gallery images, comma-separated
    material = db.Column(db.String(200), default="")        # e.g. "100% cotton drill"
    supplier = db.Column(db.String(200), default="")        # supplier / vendor name
    supplier_contact = db.Column(db.String(200), default="")# supplier phone / email
    raw_materials = db.Column(db.Text, default="")          # raw materials used (internal)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.relationship("Category", back_populates="products")
    reviews = db.relationship("Review", back_populates="product", lazy=True, cascade="all, delete-orphan")

    @property
    def rating_avg(self):
        approved = [r for r in self.reviews if r.approved]
        if not approved:
            return 5.0
        return round(sum(r.rating for r in approved) / len(approved), 1)

    @property
    def reviews_count(self):
        return len([r for r in self.reviews if r.approved])

    def to_dict(self):
        return {
            "slug": self.slug, "name": self.name, "price": self.price, "oldPrice": self.old_price,
            "img": self.img, "tag": self.tag, "featured": self.featured, "stock": self.stock,
            "category": self.category.slug if self.category else None,
            "rating": self.rating_avg, "reviewsCount": self.reviews_count,
            "colors": self._colors(), "sizes": self._sizes(), "images": self._images(),
            "material": self.material or "",
            "discount": self._discount(),
        }

    def _colors(self):
        out = []
        for part in (self.colors or "").split(","):
            part = part.strip()
            if not part:
                continue
            if ":" in part:
                name, hex_ = part.split(":", 1)
                out.append({"name": name.strip(), "hex": hex_.strip()})
            else:
                out.append({"name": part, "hex": part})
        return out

    def _sizes(self):
        return [s.strip() for s in (self.sizes or "").split(",") if s.strip()]

    def _images(self):
        return [s.strip() for s in (self.images or "").split(",") if s.strip()]

    def _discount(self):
        if self.old_price and self.old_price > self.price:
            return round((self.old_price - self.price) / self.old_price * 100)
        return 0

    def __str__(self):
        return self.name


class Review(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    product = db.relationship("Product", back_populates="reviews")
    name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=5)
    comment = db.Column(db.Text, default="")
    approved = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "rating": self.rating, "comment": self.comment,
            "createdAt": self.created_at.strftime("%d %b %Y"),
        }


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(40), unique=True, nullable=False)
    customer_name = db.Column(db.String(160), nullable=False)
    phone = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(160), default="")
    notes = db.Column(db.Text, default="")
    total = db.Column(db.Integer, default=0)
    status = db.Column(db.String(30), default="new")  # new | confirmed | delivered | cancelled
    eta = db.Column(db.Date, nullable=True)  # estimated delivery date
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship("OrderItem", back_populates="order", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "orderNumber": self.order_number, "customerName": self.customer_name, "phone": self.phone,
            "email": self.email, "notes": self.notes, "total": self.total, "status": self.status,
            "createdAt": self.created_at.strftime("%d %b %Y %H:%M"),
            "eta": self.eta.strftime("%d %b %Y") if self.eta else None,
            "items": [i.to_dict() for i in self.items],
        }

    def __str__(self):
        return f"{self.order_number} — {self.customer_name}"


class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    order = db.relationship("Order", back_populates="items")
    slug = db.Column(db.String(120))
    name = db.Column(db.String(160))
    price = db.Column(db.Integer, default=0)
    qty = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {"slug": self.slug, "name": self.name, "price": self.price, "qty": self.qty}


class Advert(db.Model):
    __tablename__ = "adverts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    subtitle = db.Column(db.String(255), default="")
    price_label = db.Column(db.String(60), default="")   # e.g. "From KSh 720"
    cta_label = db.Column(db.String(60), default="Shop Now")
    href = db.Column(db.String(255), default="/ppe")
    img = db.Column(db.String(255), default="")
    placement = db.Column(db.String(40), default="home")  # home | shop_top | shop_side
    active = db.Column(db.Boolean, default=True)
    sort = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "subtitle": self.subtitle,
            "priceLabel": self.price_label, "ctaLabel": self.cta_label, "href": self.href,
            "img": self.img, "placement": self.placement, "sort": self.sort,
        }

    def __str__(self):
        return f"{self.title} ({self.placement})"


class Stat(db.Model):
    __tablename__ = "stats"
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(40), nullable=False)   # e.g. "10+"
    label = db.Column(db.String(120), nullable=False)  # e.g. "Years of experience"
    sort = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {"value": self.value, "label": self.label}

    def __str__(self):
        return f"{self.value} {self.label}"


class Setting(db.Model):
    __tablename__ = "settings"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False)  # e.g. "overview_image"
    label = db.Column(db.String(160), default="")                # human description
    value = db.Column(db.Text, default="")                       # text value (optional)
    img = db.Column(db.String(255), default="")                  # image path/upload (optional)

    def to_dict(self):
        return {"value": self.value, "img": self.img}

    def __str__(self):
        return self.label or self.key
