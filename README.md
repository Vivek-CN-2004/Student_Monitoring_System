# Student Management System
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy_2.0+-D71F00?style=flat&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-7%20Passed-brightgreen?style=flat&logo=pytest&logoColor=white)](https://docs.pytest.org/)

A fullstack **Student Management System** built with **FastAPI** (Python 3), **SQLAlchemy ORM**, **MYSQL**, and a **React + Vite** single-page application styled with **Tailwind CSS** and **Framer Motion**.

Designed for the **MintMesh Take-Home Assessment (Fullstack SDE)** with a focus on strong backend fundamentals, validation, automated test coverage, and a responsive component-based UI.

---
# 📸 Screenshots

The following screenshots demonstrate the main functionality, CRUD operations,
validation, and error handling of the application.

<table>
  <tr>
    <td align="center">
      <strong>1. Dashboard — Student List</strong><br>
      <img src="screenshots/dashboard_list_view.png" width="420">
    </td>
    <td align="center">
      <strong>2. Home / Dashboard</strong><br>
      <img src="screenshots/home_page.png" width="420">
    </td>
  </tr>

  <tr>
    <td align="center">
      <strong>3. Add Student</strong><br>
      <img src="screenshots/add_student.png" width="420">
    </td>
    <td align="center">
      <strong>4. Update Student</strong><br>
      <img src="screenshots/upadate_student.png" width="420">
    </td>
  </tr>

  <tr>
    <td align="center">
      <strong>5. Get Single Student</strong><br>
      <img src="screenshots/get_single_student.png" width="420">
    </td>
    <td align="center">
      <strong>6. Delete Student</strong><br>
      <img src="screenshots/delete_student.png" width="420">
    </td>
  </tr>

  <tr>
    <td align="center">
      <strong>7. Duplicate Email Validation</strong><br>
      <img src="screenshots/duplicate_email_error.png" width="420">
    </td>
    <td align="center">
      <strong>8. Backend Server Error</strong><br>
      <img src="screenshots/server_error.png" width="420">
    </td>
    ### MySQL Database Table

  <p align="center">
   <img src="screenshots/database_table_view.png" width="700">
  </p>
  </tr>
</table>

## 🚀 Quickstart (Clean Clone in < 5 Minutes)

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Vivek-CN-2004/student-management-system.git
cd student-management-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on port 8000)
uvicorn app.main:app --reload --port 8000
```
>> **Note**: The `student_management` MySQL database must exist before starting the backend.
> The application automatically creates the required tables through SQLAlchemy metadata on startup.

- **Swagger Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc API Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Frontend Setup (New Terminal)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 3000)
npm run dev
```
- **Web Application UI**: [http://localhost:3000](http://localhost:3000)

### 4. Running Backend Tests
```bash
# From the project root (with venv activated):
python -m pytest backend/tests/test_students.py -v
```

---

## 🛠️ Tech Choices & Rationale

| Layer | Choice | Rationale & Trade-offs |
|---|---|---|
| **Backend** | **FastAPI (Python)** | High-performance asynchronous REST framework. Provides native Pydantic schema validation, automatic OpenAPI / Swagger generation, and strict typing. |
| **Database** | **MySQL (via SQLAlchemy 2.0)** | Relational database suitable for structured student records, constraints, and unique email handling. | 
| **Frontend** | **React + Vite** | Fast HMR build tooling with a clean component architecture. *(Note: React was selected as permitted by the assignment brief; Vue.js/Angular principles apply identically).* |
| **Styling & Animation** | **Tailwind CSS + Framer Motion** | Utility-first CSS allowing custom slate-indigo dark/light aesthetics. Framer Motion provides physics-based springs, sliding tab pills, and responsive layout transitions. |
| **Service Layer** | **Axios (`api.js`)** | Centralized API client isolating all HTTP calls and error formatting from React view components. |


---

## 📡 REST API Reference

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/students` | Register a new student record | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `GET` | `/students` | List students (with pagination & status filter) | `200 OK` |
| `GET` | `/students/{id}` | Fetch a single student profile by ID | `200 OK`, `404 Not Found` |
| `PUT` | `/students/{id}` | Update student fields | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/students/{id}` | Permanently delete a student record | `200 OK`, `404 Not Found` |

### Error Response Schema
Validation and business errors return a structured JSON response:
```json
{
  "detail": "Validation Error",
  "errors": [
    {
      "field": "date_of_birth",
      "message": "Date of birth cannot be in the future."
    }
  ]
}
```

---

## 🧪 Automated Test Suite

The test suite in [`backend/tests/test_students.py`](backend/tests/test_students.py) exercises every endpoint and validation constraint:

```text
backend/tests/test_students.py::test_create_student_success PASSED               [ 14%]
backend/tests/test_students.py::test_create_student_validation_future_dob PASSED  [ 28%]
backend/tests/test_students.py::test_create_student_validation_empty_name PASSED  [ 42%]
backend/tests/test_students.py::test_create_student_duplicate_email PASSED        [ 57%]
backend/tests/test_students.py::test_get_student_not_found PASSED                 [ 71%]
backend/tests/test_students.py::test_get_students_pagination_and_filter PASSED   [ 85%]
backend/tests/test_students.py::test_update_and_delete_student PASSED             [100%]
================================= 7 passed in 1.61s =================================
```

---
## 🤖 AI Usage Report (Graded Transparency)

### 1. AI Tool Used

**Antigravity Agent**  
**Model:** Claude Sonnet 4.6 (Thinking)  
**Sessions:** September 9–10, 2026

I used the Antigravity Agent with Claude Sonnet 4.6 (Thinking) as a development
assistant throughout the project.

AI assistance was used for:
- FastAPI backend implementation
- Pydantic schemas and validation
- SQLAlchemy database operations
- React component development
- Axios API/service-layer implementation
- Frontend validation and error handling
- Automated backend tests
- UI improvements
- Debugging and troubleshooting
- Git/project setup guidance
- Documentation

I reviewed and tested the generated suggestions before incorporating them into
the project. I used the AI as an engineering assistant rather than treating
generated code as automatically correct.

### 2. How I Verified AI-Generated Code

I verified the implementation by:
- Running the FastAPI application locally.
- Testing REST endpoints through Swagger.
- Running the automated Pytest suite.
- Checking records and database behavior using MySQL Workbench.
- Testing the React frontend manually.
- Testing validation, loading, empty, and error states.
- Checking commands in my Windows PowerShell environment.
- Reviewing Git changes before committing.

### 3. Concrete AI Mistake Caught and Fixed

#### PowerShell Command Compatibility

- **AI Output:** The AI suggested using a command such as:
  `cd frontend && npm install recharts`
- **Problem:** This command did not work as expected in my PowerShell
  environment because the suggested command used shell syntax that was not
  appropriate for the environment.
- **Detection:** PowerShell returned a command parsing error.
- **Fix:** I ran the commands separately using PowerShell-compatible syntax
  and installed the dependency from the frontend directory.
- **Verification:** The frontend dependency installation completed
  successfully and the application was run again to verify the setup.

### 4. AI-Assisted Development Lesson

The main lesson from using AI was that generated code and commands still need
to be checked against the actual project environment.

I verified framework versions, API constraints, database configuration,
commands, and runtime behavior before considering the implementation complete.
This helped me catch mismatches between AI suggestions and the actual project.
## 📁 Repository Structure

```text
student_manegementsystem/
├── backend/
│   ├── app/
│   │   ├── config.py         # App configuration & DB settings
│   │   ├── crud.py           # SQLAlchemy database query operations
│   │   ├── database.py       # Engine & session dependency
│   │   ├── main.py           # FastAPI entrypoint, CORS & error handlers
│   │   ├── models.py         # Student SQL model & EnrollmentStatus Enum
│   │   ├── routers/
│   │   │   └── students.py   # 5 REST endpoints
│   │   └── schemas.py        # Pydantic schemas & validators
│   ├── tests/
│   │   └── test_students.py  # 7 Pytest integration tests
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment configuration template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.jsx      # Breakdown charts
│   │   │   ├── DeleteConfirmModal.jsx  # Confirmation dialog
│   │   │   ├── EmptyState.jsx          # Filter-aware empty screen
│   │   │   ├── ErrorBoundary.jsx       # Client crash safeguard
│   │   │   ├── Navbar.jsx              # Responsive header & theme toggle
│   │   │   ├── SkeletonRow.jsx         # Loading state placeholder
│   │   │   ├── StatsCards.jsx          # Metric cards & quick filters
│   │   │   ├── StudentFormModal.jsx    # Create/Edit modal with validation
│   │   │   ├── StudentTable.jsx        # Dual-mode responsive list
│   │   │   └── Toast.jsx               # Animated timed toast alert
│   │   ├── services/
│   │   │   └── api.js                  # Axios REST API service layer
│   │   ├── App.jsx                     # Root application state
│   │   ├── main.jsx                    # DOM entrypoint
│   │   └── index.css                   # Tailwind CSS directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── screenshots/              # UI verification screenshots
├── DESIGN.md                 # Architecture & design document
└── README.md                 # Setup & documentation
```

---

## 🔮 Known Limitations & Future Enhancements

1. **Authentication & Authorization**: Currently open for local assessment. In production, OAuth2 / JWT with role-based access control (Admin vs Faculty) would be implemented.
2. **Soft Deletion**: Records are permanently deleted from the database. A `deleted_at` timestamp column could be introduced for audit trailing.
3. **Database Migration Pipeline**: Production deployment would integrate **Alembic** for schema migrations.
