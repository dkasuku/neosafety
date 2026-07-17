from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from routes.catalog import bp as catalog_bp
    from routes.reviews import bp as reviews_bp
    from routes.orders import bp as orders_bp
    from routes.admin_api import bp as admin_api_bp
    app.register_blueprint(catalog_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_api_bp)

    # Ensure all ORM relationships are configured before first use
    from sqlalchemy.orm import configure_mappers
    import models  # noqa: F401  (register models)
    configure_mappers()

    # Self-heal the local SQLite schema + default section-image settings.
    from dbsync import run_dbsync
    run_dbsync(app)

    @app.get("/")
    def root():
        return jsonify({"service": "NEO Safety API", "api": "/api", "admin": "managed by the Next.js app at /admin"})

    # CLI: flask init-db  /  flask seed
    @app.cli.command("init-db")
    def init_db():
        db.create_all()
        print("Tables created.")

    @app.cli.command("seed")
    def seed_cmd():
        from seed import run_seed
        run_seed()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
