from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import Student, EnrollmentStatus
from app.schemas import StudentCreate, StudentUpdate

def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()

def get_student_by_email(db: Session, email: str) -> Optional[Student]:
    return db.query(Student).filter(Student.email.ilike(email.strip())).first()

def get_students(
    db: Session,
    page: int = 1,
    limit: int = 10,
    status: Optional[EnrollmentStatus] = None,
    search: Optional[str] = None
) -> Tuple[List[Student], int]:
    query = db.query(Student)

    if status:
        query = query.filter(Student.enrollment_status == status)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Student.first_name.ilike(search_pattern),
                Student.last_name.ilike(search_pattern),
                Student.email.ilike(search_pattern)
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    students = query.order_by(Student.created_at.desc()).offset(offset).limit(limit).all()

    return students, total

def create_student(db: Session, student_in: StudentCreate) -> Student:
    db_student = Student(
        first_name=student_in.first_name,
        last_name=student_in.last_name,
        email=student_in.email,
        date_of_birth=student_in.date_of_birth,
        enrollment_status=student_in.enrollment_status,
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, db_student: Student, student_in: StudentUpdate) -> Student:
    update_data = student_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, db_student: Student) -> None:
    db.delete(db_student)
    db.commit()
