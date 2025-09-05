from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.on_event("startup")
def on_startup():
    database.init_db()
