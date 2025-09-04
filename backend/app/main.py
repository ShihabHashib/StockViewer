from fastapi import FastAPI
from . import models, database, routes

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Stock Data API")

app.include_router(routes.router)
