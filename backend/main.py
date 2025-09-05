import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# -------------------
# DATABASE
# -------------------
DATABASE_URL = "postgresql://root:hMI7NYnXiggXPpYyG8MDtm5EZgZskGG5@dpg-d2tfjkje5dus73dq4ge0-a.oregon-postgres.render.com/stock_data_2i5f" # Example for PostgreSQL on Render.com - Yes I know It's risky

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class StockDB(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    trade_code = Column(String, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    open = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Integer, nullable=False)


# Create tables if not exist
Base.metadata.create_all(bind=engine)

# -------------------
# SCHEMAS
# -------------------
class Stock(BaseModel):
    id: Optional[int] = None
    date: str
    trade_code: str
    high: float
    low: float
    open: float
    close: float
    volume: int

    class Config:
        from_attributes = True  # Enable ORM mode


# -------------------
# APP SETUP
# -------------------
app = FastAPI(debug=True)

origins = [
    "http://localhost:5173",  # Vite frontend
    "http://localhost:3000",  # Next.js frontend
    "https://stockviewer-2.onrender.com",  # Deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------
# ROUTES
# -------------------
@app.get("/stocks", response_model=List[Stock])
def get_stocks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(StockDB).offset(skip).limit(limit).all()


@app.post("/stocks", response_model=Stock)
def add_stock(stock: Stock, db: Session = Depends(get_db)):
    db_stock = StockDB(**stock.dict(exclude={"id"}))
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@app.put("/stocks/{stock_id}", response_model=Stock)
def update_stock(stock_id: int, stock: Stock, db: Session = Depends(get_db)):
    db_stock = db.query(StockDB).filter(StockDB.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    for key, value in stock.dict(exclude={"id"}).items():
        setattr(db_stock, key, value)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@app.delete("/stocks/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    db_stock = db.query(StockDB).filter(StockDB.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db.delete(db_stock)
    db.commit()
    return {"message": "Deleted successfully"}


# -------------------
# ENTRY POINT
# -------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
