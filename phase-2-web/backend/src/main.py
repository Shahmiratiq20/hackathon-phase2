# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.models.database import init_db
from src.routers import auth_routes, task_routes

# Create FastAPI app
app = FastAPI(
    title="Todo API",
    description="Full-Stack Todo Application API",
    version="2.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(task_routes.router)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    print("✅ Database initialized!")

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Todo API - Phase II",
        "status": "running"
    }