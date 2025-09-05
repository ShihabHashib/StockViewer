from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import routes, database

app = FastAPI(title="Stock API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://stockviewer-2.onrender.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    return {"message": "Backend is alive!"}

@app.on_event("startup")
def on_startup():
    database.SQLModel.metadata.create_all(database.engine)

app.include_router(routes.router)
