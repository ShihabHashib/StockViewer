from sqlmodel import Session, select
from .models import StockData

def get_all(db: Session, skip: int = 0, limit: int = 100):
    return db.exec(select(StockData).offset(skip).limit(limit)).all()

def create(db: Session, stock: StockData):
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock

def update(db: Session, stock_id: int, stock_data: dict):
    stock = db.get(StockData, stock_id)
    if not stock:
        return None
    for key, value in stock_data.items():
        setattr(stock, key, value)
    db.commit()
    db.refresh(stock)
    return stock

def delete(db: Session, stock_id: int):
    stock = db.get(StockData, stock_id)
    if not stock:
        return None
    db.delete(stock)
    db.commit()
    return stock
