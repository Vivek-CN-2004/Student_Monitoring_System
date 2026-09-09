import os
import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_students.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_students.db"):
        try:
            os.remove("./test_students.db")
        except OSError:
            pass

client = TestClient(app)

def test_create_student_success():
    payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.smith@university.edu",
        "date_of_birth": "2001-05-15",
        "enrollment_status": "active"
    }
    response = client.post("/students", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Alice"
    assert data["last_name"] == "Smith"
    assert data["email"] == "alice.smith@university.edu"
    assert data["enrollment_status"] == "active"
    assert "id" in data

def test_create_student_validation_future_dob():
    future_date = (date.today() + timedelta(days=365)).strftime("%Y-%m-%d")
    payload = {
        "first_name": "Bob",
        "last_name": "Jones",
        "email": "bob.jones@university.edu",
        "date_of_birth": future_date,
        "enrollment_status": "active"
    }
    response = client.post("/students", json=payload)
    assert response.status_code == 400
    assert "detail" in response.json()

def test_create_student_validation_empty_name():
    payload = {
        "first_name": "   ",
        "last_name": "Jones",
        "email": "bob.empty@university.edu",
        "date_of_birth": "2000-01-01",
        "enrollment_status": "active"
    }
    response = client.post("/students", json=payload)
    assert response.status_code == 400

def test_create_student_duplicate_email():
    payload = {
        "first_name": "Charlie",
        "last_name": "Brown",
        "email": "charlie@university.edu",
        "date_of_birth": "1999-12-10",
        "enrollment_status": "active"
    }
    resp1 = client.post("/students", json=payload)
    assert resp1.status_code == 201

    resp2 = client.post("/students", json=payload)
    assert resp2.status_code == 409
    assert "already exists" in resp2.json()["detail"]

def test_get_student_not_found():
    response = client.get("/students/99999")
    assert response.status_code == 404

def test_get_students_pagination_and_filter():
    # Insert 3 students
    s1 = {"first_name": "S1", "last_name": "L1", "email": "s1@test.com", "date_of_birth": "2000-01-01", "enrollment_status": "active"}
    s2 = {"first_name": "S2", "last_name": "L2", "email": "s2@test.com", "date_of_birth": "2000-01-01", "enrollment_status": "graduated"}
    s3 = {"first_name": "S3", "last_name": "L3", "email": "s3@test.com", "date_of_birth": "2000-01-01", "enrollment_status": "active"}
    
    client.post("/students", json=s1)
    client.post("/students", json=s2)
    client.post("/students", json=s3)

    # Test list all
    res = client.get("/students?page=1&limit=2")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 3
    assert len(data["items"]) == 2
    assert data["total_pages"] == 2

    # Test filter by status
    res_filter = client.get("/students?enrollment_status=active")
    assert res_filter.status_code == 200
    data_filter = res_filter.json()
    assert data_filter["total"] == 2
    assert all(item["enrollment_status"] == "active" for item in data_filter["items"])

def test_update_and_delete_student():
    # Create student
    create_res = client.post("/students", json={
        "first_name": "David",
        "last_name": "Miller",
        "email": "david@test.com",
        "date_of_birth": "2002-02-02",
        "enrollment_status": "active"
    })
    s_id = create_res.json()["id"]

    # Update
    update_res = client.put(f"/students/{s_id}", json={
        "enrollment_status": "graduated"
    })
    assert update_res.status_code == 200
    assert update_res.json()["enrollment_status"] == "graduated"

    # Delete
    del_res = client.delete(f"/students/{s_id}")
    assert del_res.status_code == 200

    # Verify deleted
    get_res = client.get(f"/students/{s_id}")
    assert get_res.status_code == 404
