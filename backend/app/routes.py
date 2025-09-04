from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, schemas, database

router = APIRouter()

@router.get("/stocks/", response_model=List[schemas.StockDataOut])
def read_stocks(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    return crud.get_all(db, skip=skip, limit=limit)

@router.post("/stocks/", response_model=schemas.StockDataOut)
def create_stock(stock: schemas.StockDataCreate, db: Session = Depends(database.get_db)):
    return crud.create(db, stock)

@router.put("/stocks/{stock_id}", response_model=schemas.StockDataOut)
def update_stock(stock_id: int, stock: schemas.StockDataUpdate, db: Session = Depends(database.get_db)):
    db_item = crud.update(db, stock_id, stock)
    if not db_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_item

@router.delete("/stocks/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(database.get_db)):
    db_item = crud.delete(db, stock_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {"message": "Deleted successfully"}
