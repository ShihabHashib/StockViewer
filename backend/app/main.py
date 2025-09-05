from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from . import routes, database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    SQLModel.metadata.create_all(database.engine)
    yield
    # Shutdown code (optional)
    # You can close connections here if needed

app = FastAPI(title="Stock API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://stockviewer-2.onrender.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root test endpoint
@app.get("/test")
def test():
    return {"message": "Backend is alive!"}

# Include API routes
app.include_router(routes.router)
