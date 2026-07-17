"""Seed the database with NEO Safety catalog (matches the frontend lib/data.ts)."""
from extensions import db
from models import Category, Product, Review, Advert, Stat, Setting

C = "/images/catalog"

CATEGORIES = [
    ("reflector-jackets", "Reflector Jackets", "Hi-vis vests & reflective wear", f"{C}/hivis-vest.jpg", "uniform"),
    ("overalls", "Overalls", "Boiler suits & coveralls", f"{C}/coveralls.jpg", "uniform"),
    ("industrial-uniforms", "Industrial Uniforms", "Heavy-duty wear for plants & sites", f"{C}/coveralls-set.jpg", "uniform"),
    ("head-protection", "Head Protection", "Hard hats & helmets", f"{C}/hardhat.jpg", "ppe"),
    ("hand-protection", "Hand Protection", "Work & cut-resistant gloves", f"{C}/gloves.jpg", "ppe"),
    ("security-uniforms", "Security Uniforms", "Guard uniforms & accessories", f"{C}/security-jacket.jpg", "uniform"),
    ("corporate-uniforms", "Corporate Uniforms", "Shirts, suits & office wear", f"{C}/suits-rack.jpg", "uniform"),
    ("fire-safety", "Fire Safety", "Extinguishers & fire equipment", "/images/products/fire.png", "ppe"),
    ("cleaners-uniforms", "Cleaners Uniforms", "Housekeeping & janitorial wear", f"{C}/housekeeping-blue.jpg", "uniform"),
    ("dust-coats", "Dust Coats", "Lab coats & warehouse dust coats", f"{C}/dustcoat.jpg", "uniform"),
    ("school-uniforms", "School Uniforms", "Durable uniforms for schools", f"{C}/school-uniform.jpg", "uniform"),
    ("hospitality-service", "Hospitality & Service", "Chef, waiter & service wear", f"{C}/chef-set.jpg", "uniform"),
    ("medical-scrubs", "Medical & Healthcare", "Scrubs, tunics & theatre wear", f"{C}/scrubs-blue.jpg", "uniform"),
]

# (slug, name, price, old_price, category_slug, img, tag, featured, stock)
PRODUCTS = [
    ("industrial-safety-helmet", "Industrial Safety Helmet", 850, 1100, "head-protection", f"{C}/hardhat.jpg", "-23%", True, 120),
    ("vented-ratchet-hard-hat", "Vented Ratchet Hard Hat", 1200, None, "head-protection", f"{C}/hardhat.jpg", None, False, 80),
    ("impact-resistant-gloves", "Impact-Resistant Gloves", 980, None, "hand-protection", f"{C}/gloves.jpg", None, True, 200),
    ("cut-resistant-gloves", "Cut-Resistant Work Gloves", 640, None, "hand-protection", f"{C}/gloves.jpg", None, False, 200),
    ("fire-extinguisher-6kg", "6kg Fire Extinguisher", 4200, 4800, "fire-safety", "/images/products/fire.png", "-13%", True, 40),
    ("fire-extinguisher-9kg", "9kg Fire Extinguisher", 5600, None, "fire-safety", "/images/products/fire.png", None, False, 30),
    ("hi-vis-reflector-vest", "Hi-Vis Reflector Vest", 720, 900, "reflector-jackets", f"{C}/hivis-vest.jpg", "-20%", True, 300),
    ("hi-vis-safety-apparel-set", "Hi-Vis Safety Apparel Set", 3800, None, "reflector-jackets", f"{C}/coveralls-set.jpg", None, False, 60),
    ("reflective-bomber-jacket", "Reflective Bomber Jacket", 2900, None, "reflector-jackets", f"{C}/hivis-jacket.jpg", "New", False, 50),
    ("navy-work-coverall", "Navy Work Coverall", 2650, None, "overalls", f"{C}/coveralls.jpg", None, True, 90),
    ("cotton-boiler-suit", "Cotton Boiler Suit", 2400, None, "overalls", f"{C}/coveralls-set.jpg", None, False, 70),
    ("industrial-uniform-set", "Industrial Uniform Set", 3100, None, "industrial-uniforms", f"{C}/industrial.jpg", "New", True, 55),
    ("two-tone-work-shirt-trouser", "Two-Tone Work Shirt & Trouser", 2750, None, "industrial-uniforms", f"{C}/industrial.jpg", None, False, 65),
    ("supervisor-reflective-vest", "Supervisor Reflective Vest", 1450, None, "security-uniforms", f"{C}/security.jpg", None, False, 100),
    ("security-guard-uniform", "Security Guard Uniform", 3200, None, "security-uniforms", f"{C}/security-guard.jpg", None, False, 45),
    ("corporate-shirt-trouser", "Corporate Shirt & Trouser", 2200, None, "corporate-uniforms", f"{C}/shirts-rack.jpg", None, False, 80),
    ("branded-office-polo", "Branded Office Polo", 1150, None, "corporate-uniforms", f"{C}/branded-polo.jpg", None, False, 150),
    ("cleaners-coverall", "Cleaners Coverall", 1900, None, "cleaners-uniforms", f"{C}/housekeeping-blue.jpg", None, False, 70),
    ("housekeeping-tunic", "Housekeeping Tunic", 1450, None, "cleaners-uniforms", f"{C}/housekeeping-green.jpg", None, False, 60),
    ("white-dust-coat", "White Dust Coat", 1300, None, "dust-coats", f"{C}/dustcoat.jpg", None, False, 90),
    ("warehouse-dust-coat", "Warehouse Dust Coat", 1250, None, "dust-coats", f"{C}/dustcoat.jpg", None, False, 90),
    ("school-uniform-set", "School Uniform Set", 1800, None, "school-uniforms", f"{C}/school-uniform.jpg", None, False, 120),
    ("school-sports-kit", "School Sports Kit", 1500, None, "school-uniforms", f"{C}/school-uniform.jpg", None, False, 120),
    ("chef-jacket-apron", "Chef Jacket & Apron", 2100, None, "hospitality-service", f"{C}/chef-set.jpg", None, False, 40),
    ("waiter-service-uniform", "Waiter Service Uniform", 1950, None, "hospitality-service", f"{C}/chef-apron.jpg", None, False, 40),
    ("blue-medical-scrubs", "Blue Medical Scrubs Set", 2400, None, "medical-scrubs", f"{C}/scrubs-blue.jpg", None, False, 60),
    ("navy-medical-scrubs", "Navy Scrubs Set", 2500, None, "medical-scrubs", f"{C}/scrubs-navy.jpg", "New", True, 60),
    ("green-theatre-scrubs", "Green Theatre Scrubs", 2300, None, "medical-scrubs", f"{C}/scrubs-green.jpg", None, False, 50),
    ("nurse-tunic", "Nurse Tunic", 1800, None, "medical-scrubs", f"{C}/nurse-tunic.jpg", None, False, 70),
]

SAMPLE_REVIEWS = [
    ("hi-vis-reflector-vest", "James M.", 5, "Bright, well-made and the reflective strips are solid. Ordered 20 for our road crew."),
    ("hi-vis-reflector-vest", "Achieng O.", 4, "Good quality and fast delivery in Nairobi. Sizing runs slightly large."),
    ("industrial-safety-helmet", "Peter K.", 5, "Comfortable ratchet fit and sturdy shell. Great value."),
    ("navy-work-coverall", "Brian W.", 5, "Tough fabric, held up well on site. Got them branded with our logo too."),
]


def run_seed():
    db.create_all()
    if Category.query.count() == 0:
        cats = {}
        for slug, name, blurb, img, group in CATEGORIES:
            c = Category(slug=slug, name=name, blurb=blurb, img=img, group=group)
            db.session.add(c)
            cats[slug] = c
        db.session.flush()
        for slug, name, price, old, cat_slug, img, tag, feat, stock in PRODUCTS:
            db.session.add(Product(
                slug=slug, name=name, price=price, old_price=old, img=img, tag=tag,
                featured=feat, stock=stock, category_id=cats[cat_slug].id,
            ))
        db.session.flush()
        # Variations (colors / sizes) on relevant products
        APPAREL = ["hi-vis-reflector-vest","hi-vis-safety-apparel-set","reflective-bomber-jacket",
                   "navy-work-coverall","cotton-boiler-suit","industrial-uniform-set","two-tone-work-shirt-trouser",
                   "supervisor-reflective-vest","security-guard-uniform","corporate-shirt-trouser","branded-office-polo",
                   "cleaners-coverall","housekeeping-tunic","white-dust-coat","warehouse-dust-coat",
                   "school-uniform-set","school-sports-kit","chef-jacket-apron","waiter-service-uniform","blue-medical-scrubs","navy-medical-scrubs","green-theatre-scrubs","nurse-tunic"]
        COLORS = {
            "hi-vis-reflector-vest": "Yellow:#C9E265,Orange:#F26A21",
            "hi-vis-safety-apparel-set": "Yellow:#C9E265,Orange:#F26A21,Navy:#0C192B",
            "reflective-bomber-jacket": "Yellow:#C9E265,Orange:#F26A21,Navy:#0C192B",
            "navy-work-coverall": "Navy:#0C192B,Grey:#5b6672",
            "cotton-boiler-suit": "Navy:#0C192B,Khaki:#b9a06b,Grey:#5b6672",
            "industrial-uniform-set": "Orange:#F26A21,Navy:#0C192B",
            "two-tone-work-shirt-trouser": "Orange:#F26A21,Navy:#0C192B",
            "supervisor-reflective-vest": "Blue:#1D4ED8,Green:#1B933C,Orange:#F26A21",
            "corporate-shirt-trouser": "White:#f3f4f6,Navy:#0C192B,Sky:#3B82F6",
            "branded-office-polo": "White:#f3f4f6,Navy:#0C192B,Green:#1B933C,Maroon:#7B1E1E",
            "school-uniform-set": "Maroon:#7B1E1E,Green:#1B933C,Navy:#0C192B,Sky:#3B82F6",
        }
        GLOVES = ["impact-resistant-gloves","cut-resistant-gloves"]
        for p in Product.query.all():
            if p.slug in APPAREL:
                p.sizes = "S,M,L,XL,XXL"
            if p.slug in GLOVES:
                p.sizes = "S,M,L,XL"
            if p.slug in COLORS:
                p.colors = COLORS[p.slug]

        # Adverts (managed in the admin)
        ADVERTS = [
            ("New Season Hi-Vis Range", "Get 10 to 20% off when you order online", "From KSh 720", "Shop Now", "/category/reflector-jackets", C + "/hivis.jpg", "home", 1),
            ("Bulk PPE for Worksites", "Volume pricing for teams and sites, delivered across Kenya", "Request a quote", "Get Quote", "/contact", C + "/scene.jpg", "home", 2),
            ("Branded Workwear", "Your logo, embroidered or printed in-house", "", "Explore", "/branding", C + "/security.jpg", "shop_top", 1),
            ("Fire Safety Essentials", "Extinguishers and signage, always in stock", "", "Shop", "/category/fire-safety", "/images/products/fire.png", "shop_side", 1),
            ("PPE & Safety Gear", "Helmets, gloves and boots - certified", "", "Shop PPE", "/ppe", C + "/worker-hivis.jpg", "shop_side", 2),
            ("Branding & Printing", "Your logo on any garment, in-house", "", "Explore", "/branding", C + "/security-jacket.jpg", "shop_side", 3),
        ]
        for t, sub, pl, cta, href, img, place, sort in ADVERTS:
            db.session.add(Advert(title=t, subtitle=sub, price_label=pl, cta_label=cta, href=href, img=img, placement=place, sort=sort))

        # About stats (editable in admin)
        if Stat.query.count() == 0:
            for v, l, srt in [("5+", "Years of experience", 1), ("500+", "Products in our range", 2), ("47", "Counties reached", 3), ("12+", "Industries served", 4)]:
                db.session.add(Stat(value=v, label=l, sort=srt))
        # Section images (editable in admin)
        SETTINGS = [
            ("overview_image", "Who-we-are image (portrait)", "/neo1.jpeg"),
            ("overview_image2", "Who-we-are image (landscape)", "/1d.jpg"),
            ("newsletter_image", "Newsletter background", f"{C}/rack.jpg"),
            ("industries_image", "Industries background", f"{C}/scene.jpg"),
            ("branding_hero", "Branding hero image", f"{C}/security.jpg"),
            ("branding_image", "Branding side image", f"{C}/security.jpg"),
            ("about_hero", "About hero image", f"{C}/coveralls-set.jpg"),
            ("about_collage1", "About collage 1", f"{C}/shirts-rack.jpg"),
            ("about_collage2", "About collage 2", f"{C}/worker-hivis.jpg"),
            ("about_collage3", "About collage 3", f"{C}/nurse-female.jpg"),
            ("about_stats_bg", "About stats background", f"{C}/suits-rack.jpg"),
        ]
        for k, lbl, img in SETTINGS:
            if not Setting.query.filter_by(key=k).first():
                db.session.add(Setting(key=k, label=lbl, img=img))

        for pslug, rname, rating, comment in SAMPLE_REVIEWS:
            p = Product.query.filter_by(slug=pslug).first()
            if p:
                db.session.add(Review(product_id=p.id, name=rname, rating=rating, comment=comment, approved=True))
        db.session.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")
    else:
        print("Database already seeded — skipping.")


if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        run_seed()
