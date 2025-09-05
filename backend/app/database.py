import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("postgresql://stock_pnxc_user:cMQd1QnbyRwSrwz28sZ2yDpkEVxckfkx@dpg-d2smtap5pdvs739l9b9g-a/stock_pnxc")
engine = create_engine(DATABASE_URL, echo=True)

def get_db():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)
