from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    image_path: Mapped[Optional[str]] = mapped_column(String(255))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(40), unique=True)


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price_kobo >= 0", name="ck_product_price_not_negative"),
        CheckConstraint("stock_quantity >= 0", name="ck_product_stock_not_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    slug: Mapped[str] = mapped_column(String(160), unique=True)
    description: Mapped[str] = mapped_column(Text, default="")
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"))
    price_kobo: Mapped[int] = mapped_column(Integer)
    stock_quantity: Mapped[Decimal] = mapped_column(Numeric(12, 3), default=Decimal("0"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    image_path: Mapped[Optional[str]] = mapped_column(String(255))

    category: Mapped[Category] = relationship(back_populates="products")
    unit: Mapped[Unit] = relationship()
