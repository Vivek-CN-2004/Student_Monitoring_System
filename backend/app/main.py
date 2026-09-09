import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.routers import students

logger = logging.getLogger("uvicorn")

# Create database tables automatically if engine is reachable
try:
    Base.metadata.create_all(bind=engine)
except Exception as exc:
    logger.warning("Database table creation deferred: %s", exc)

app = FastAPI(
    title="Student Management System API",
    description="RESTful API for managing student records with pagination and status filters",
    version="1.0.0"
)

# Explicit allowed origins for local React frontend development
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler returning 400 Bad Request with consistent error details
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error["loc"] if loc != "body"])
        errors.append({
            "field": field,
            "message": error["msg"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": "Validation error occurred.",
            "errors": errors
        }
    )

app.include_router(students.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "healthy",
        "message": "Student Management System API is operational",
        "docs": "/docs"
    }
