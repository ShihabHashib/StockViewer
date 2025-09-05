from sqlmodel import SQLModel
from typing import Optional
from datetime import date

class StockDataBase(SQLModel):
    date: date
    trade_code: str
    high: Optional[float]
    low: Optional[float]
    open: Optional[float]
    close: Optional[float]
    volume: Optional[int]

class StockDataCreate(StockDataBase):
    pass

class StockDataUpdate(StockDataBase):
    pass

class StockDataOut(StockDataBase):
    id: int
