"""DEMONSTRATION DATA ONLY. Sample categories, units and products with sample prices.
Replace with real data through the admin dashboard (Phase 6)."""
from decimal import Decimal

from .database import Base, SessionLocal, engine
from .models import Category, Product, Unit

CATEGORIES = [
    ("grains", "Grains and cereals", "images/products/rice.jpg"),
    ("beans", "Beans and legumes", "images/products/brown-beans.jpg"),
    ("tubers", "Tubers and roots", "images/products/yam.jpg"),
    ("veg", "Vegetables", "images/products/tomatoes.jpg"),
    ("fruit", "Fruits", "images/products/plantain.jpg"),
    ("food", "Foodstuffs and oils", "images/products/palm-oil.jpg"),
]
UNITS = ["kg", "piece", "basket", "bunch", "bag", "litre", "100 g"]
# name, slug, category, unit, price in naira, stock, image file
PRODUCTS = [
    ("Rice (local, white)", "rice", "grains", "kg", 2200, 80, "rice.jpg"),
    ("Brown beans", "brown-beans", "beans", "kg", 2500, 40, "brown-beans.jpg"),
    ("Yam tubers", "yam", "tubers", "piece", 3000, 25, "yam.jpg"),
    ("Irish potatoes", "potatoes", "tubers", "kg", 2000, 45, "potatoes.jpg"),
    ("Tomatoes", "tomatoes", "veg", "basket", 1800, 12, "tomatoes.jpg"),
    ("Fresh peppers (tatashe)", "fresh-peppers", "veg", "kg", 1200, 0, "fresh-peppers.jpg"),
    ("Onions", "onions", "veg", "kg", 1500, 60, "onions.jpg"),
    ("Spring onions", "spring-onions", "veg", "bunch", 500, 30, "spring-onions.jpg"),
    ("Ugu (pumpkin leaf)", "ugu", "veg", "bunch", 500, 30, "ugu.jpg"),
    ("Plantain", "plantain", "fruit", "bunch", 1000, 20, "plantain.jpg"),
    ("Watermelon", "watermelon", "fruit", "piece", 2000, 15, "watermelon.jpg"),
    ("Garri (white)", "garri", "food", "bag", 28000, 10, "garri.jpg"),
    ("Palm oil", "palm-oil", "food", "litre", 3500, 35, "palm-oil.jpg"),
    ("Crayfish", "crayfish", "food", "100 g", 1500, 50, "crayfish.jpg"),
]


def main():
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if db.query(Category).count():
            print("The database already has data. Nothing was added.")
            return
        cats = {s: Category(slug=s, name=n, image_path=i, sort_order=k) for k, (s, n, i) in enumerate(CATEGORIES)}
        units = {u: Unit(label=u) for u in UNITS}
        db.add_all([*cats.values(), *units.values()])
        db.flush()
        for name, slug, cat, unit, naira, stock, img in PRODUCTS:
            db.add(Product(
                name=name, slug=slug, category_id=cats[cat].id, unit_id=units[unit].id,
                price_kobo=naira * 100, stock_quantity=Decimal(stock),
                image_path="images/products/" + img,
            ))
        db.commit()
    print(f"Added {len(CATEGORIES)} categories, {len(UNITS)} units and {len(PRODUCTS)} demo products.")


if __name__ == "__main__":
    main()
