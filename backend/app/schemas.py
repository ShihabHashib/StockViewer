from pydantic import BaseModel
from datetime import date
from typing import Optional

class StockDataBase(BaseModel):
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

    class Config:
        orm_mode = True
