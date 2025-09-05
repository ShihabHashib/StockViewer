import os
from sqlmodel import SQLModel, create_engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("postgresql://stock_pnxc_user:cMQd1QnbyRwSrwz28sZ2yDpkEVxckfkx@dpg-d2smtap5pdvs739l9b9g-a/stock_pnxc", "sqlite:///./test.db")  # fallback to local SQLite

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
