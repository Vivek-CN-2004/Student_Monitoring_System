import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum as SQLEnum, func
from app.database import Base

class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    GRADUATED = "graduated"
    DROPPED = "dropped"

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    enrollment_status = Column(SQLEnum(EnrollmentStatus), nullable=False, default=EnrollmentStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
