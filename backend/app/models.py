from sqlalchemy import Column, Integer, String, Date, Numeric, BigInteger
from .database import Base

class StockData(Base):
    __tablename__ = "stock_data"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    trade_code = Column(String(50), nullable=False)
    high = Column(Numeric)
    low = Column(Numeric)
    open = Column(Numeric)
    close = Column(Numeric)
    volume = Column(BigInteger)
