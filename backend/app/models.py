from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class StockData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    trade_code: str
    high: Optional[float]
    low: Optional[float]
    open: Optional[float]
    close: Optional[float]
    volume: Optional[int]
