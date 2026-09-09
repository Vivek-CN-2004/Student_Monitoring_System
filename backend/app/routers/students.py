import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import EnrollmentStatus
from app.schemas import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentPaginatedResponse
)
from app import crud

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_new_student(student_in: StudentCreate, db: Session = Depends(get_db)):
    # 1. Application-level email uniqueness check
    existing = crud.get_student_by_email(db, student_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A student with email '{student_in.email}' already exists."
        )

    # 2. Database-level execution with IntegrityError race-condition guard
    try:
        return crud.create_student(db, student_in)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A student with email '{student_in.email}' already exists."
        )

@router.get("", response_model=StudentPaginatedResponse, status_code=status.HTTP_200_OK)
def list_students(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    enrollment_status: Optional[EnrollmentStatus] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    db: Session = Depends(get_db)
):
    students, total = crud.get_students(
        db, page=page, limit=limit, status=enrollment_status, search=search
    )
    total_pages = math.ceil(total / limit) if total > 0 else 1

    return StudentPaginatedResponse(
        items=students,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/{student_id}", response_model=StudentResponse, status_code=status.HTTP_200_OK)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = crud.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )
    return student

@router.put("/{student_id}", response_model=StudentResponse, status_code=status.HTTP_200_OK)
def update_existing_student(
    student_id: int,
    student_in: StudentUpdate,
    db: Session = Depends(get_db)
):
    student = crud.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )

    # 1. Application-level check if email is being updated to an existing one
    if student_in.email and student_in.email != student.email:
        existing = crud.get_student_by_email(db, student_in.email)
        if existing and existing.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A student with email '{student_in.email}' already exists."
            )

    # 2. Database-level execution with IntegrityError race-condition guard
    try:
        return crud.update_student(db, student, student_in)
    except IntegrityError:
        db.rollback()
        target_email = student_in.email if student_in.email else student.email
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A student with email '{target_email}' already exists."
        )

@router.delete("/{student_id}", status_code=status.HTTP_200_OK)
def delete_existing_student(student_id: int, db: Session = Depends(get_db)):
    student = crud.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )
    
    crud.delete_student(db, student)
    return {"message": f"Student with ID {student_id} successfully deleted.", "id": student_id}
