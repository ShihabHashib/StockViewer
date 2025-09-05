from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from . import crud, schemas, database, models

router = APIRouter()

@router.get("/stocks/sql", response_model=List[schemas.StockDataOut])
def read_stocks(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all(db, skip, limit)

@router.post("/stocks/sql", response_model=schemas.StockDataOut)
def create_stock(stock: schemas.StockDataCreate, db: Session = Depends(database.get_db)):
    stock_model = models.StockData(**stock.dict())
    return crud.create(db, stock_model)

@router.put("/stocks/sql/{stock_id}", response_model=schemas.StockDataOut)
def update_stock(stock_id: int, stock: schemas.StockDataUpdate, db: Session = Depends(database.get_db)):
    db_item = crud.update(db, stock_id, stock.dict(exclude_unset=True))
    if not db_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_item

@router.delete("/stocks/sql/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(database.get_db)):
    db_item = crud.delete(db, stock_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {"message": "Deleted successfully"}
