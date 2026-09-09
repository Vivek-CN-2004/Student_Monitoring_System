from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from app.models import EnrollmentStatus

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    date_of_birth: date
    enrollment_status: EnrollmentStatus = EnrollmentStatus.ACTIVE

    @field_validator("first_name", "last_name")
    @classmethod
    def name_must_not_be_empty(cls, v: str, info) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError(f"{info.field_name.replace('_', ' ').title()} cannot be empty or whitespace only.")
        return stripped

    @field_validator("date_of_birth")
    @classmethod
    def dob_cannot_be_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Date of birth cannot be in the future.")
        return v

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    enrollment_status: Optional[EnrollmentStatus] = None

    @field_validator("first_name", "last_name")
    @classmethod
    def name_must_not_be_empty(cls, v: Optional[str], info) -> Optional[str]:
        if v is not None:
            stripped = v.strip()
            if not stripped:
                raise ValueError(f"{info.field_name.replace('_', ' ').title()} cannot be empty or whitespace only.")
            return stripped
        return v

    @field_validator("date_of_birth")
    @classmethod
    def dob_cannot_be_in_future(cls, v: Optional[date]) -> Optional[date]:
        if v is not None and v > date.today():
            raise ValueError("Date of birth cannot be in the future.")
        return v

class StudentResponse(StudentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StudentPaginatedResponse(BaseModel):
    items: List[StudentResponse]
    total: int
    page: int
    limit: int
    total_pages: int
