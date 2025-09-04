from sqlalchemy.orm import Session
from . import models, schemas

def get_all(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.StockData).offset(skip).limit(limit).all()

def get_by_id(db: Session, stock_id: int):
    return db.query(models.StockData).filter(models.StockData.id == stock_id).first()

def create(db: Session, stock: schemas.StockDataCreate):
    db_item = models.StockData(**stock.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update(db: Session, stock_id: int, stock: schemas.StockDataUpdate):
    db_item = get_by_id(db, stock_id)
    if db_item:
        for key, value in stock.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete(db: Session, stock_id: int):
    db_item = get_by_id(db, stock_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
