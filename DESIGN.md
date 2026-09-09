# DESIGN.md — Architecture & Design System Documentation

## 1. Architectural Overview

AcademyHub is designed as a decoupled, full-stack Single Page Application (SPA) architecture:

```
[ React SPA Frontend ]  <--- Axios (Service Layer) --->  [ FastAPI Backend ]  <--- SQLAlchemy ORM --->  [ MySQL / SQLite Database ]
  (Tailwind CSS +                                          (Pydantic Schema                                (Indexed Email & ID)
   Framer Motion)                                           Validation)
```

- **Backend Layer (FastAPI)**: Operates statelessly with strict schema validation using Pydantic V2 and ORM modeling via SQLAlchemy 2.0.
- **Service Layer (`/services/api.js`)**: Encapsulates all HTTP protocol logic, header configurations, status handling, and error response formatting away from React UI components.
- **Frontend Layer (React)**: Component-driven architecture using Tailwind CSS for custom dark theme styling and Framer Motion for non-disruptive, purposeful UI animations.

---

## 2. Database Model & Schema Rationale

### `Student` Entity Schema
| Field Name | Datatype | Constraints | Rationale |
|---|---|---|---|
| `id` | `INTEGER` | Primary Key, Auto-increment | Fast integer index, clean REST resource URL path parameter. |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | Required name field; stripped of accidental leading/trailing whitespace. |
| `last_name` | `VARCHAR(100)` | `NOT NULL` | Required name field; stripped of accidental leading/trailing whitespace. |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE`, `INDEX` | Fast lookup index (`ilike` case-insensitive check), prevents duplicate student registrations. |
| `date_of_birth` | `DATE` | `NOT NULL` | Store standard calendar date (`YYYY-MM-DD`). Validated to ensure DOB <= current date. |
| `enrollment_status` | `ENUM` | `NOT NULL`, Default: `'active'` | Restricted values: `active`, `graduated`, `dropped`. Ensures database-level constraint integrity. |
| `created_at` | `DATETIME` | `NOT NULL`, Server default `now()` | Managed by database server. |
| `updated_at` | `DATETIME` | `NOT NULL`, Server default `now()`, `onupdate=now()` | Managed by database server. |

---

## 3. REST API Design Decisions & Error Handling Shape

### Status Codes
- `200 OK`: Successful retrieval, update, or deletion.
- `201 Created`: Successful creation of a new student.
- `400 Bad Request`: Validation failure (empty names, future DOB, invalid email format, invalid query params).
- `404 Not Found`: Resource with requested `student_id` does not exist.
- `409 Conflict`: Duplicate email registration attempted.

### Standardized JSON Error Format
All errors returned by the API adhere to a predictable structure:
```json
{
  "detail": "Validation error occurred.",
  "errors": [
    {
      "field": "email",
      "message": "value is not a valid email address"
    }
  ]
}
```
For non-validation errors (e.g. 409 Conflict or 404 Not Found), `detail` provides a human-readable string explanation.

---

## 4. Note on Authentication Omission

**Auth was intentionally omitted from this application.** 
Per the assignment specification, user login/registration, JWT tokens, OAuth, RBAC, and session middleware were out of scope. Omitting auth keeps the codebase focused, readable, and ready for rapid live extension during technical interviews.

---

## 5. Validation Strategy

1. **Backend Authoritative Validation**: The FastAPI backend performs full validation on every request via Pydantic model validators. Even if client-side validation is bypassed, invalid requests are caught and returned as HTTP 400 or 409.
2. **Client-Side UX Validation**: In the React frontend modal, inputs perform immediate field checking prior to network dispatch to deliver instantaneous feedback to the user without unnecessary network roundtrips.

---

## 6. Frontend Component Architecture & Service Layer Isolation

The frontend codebase separates presentation from data fetching:

- `src/services/api.js`: Low-level HTTP requests via Axios instance with unified error catchers.
- `src/components/Navbar.jsx`: Header brand bar and global primary action trigger.
- `src/components/StatsCards.jsx`: Metric summaries with interactive filter triggers.
- `src/components/StudentTable.jsx`: Paginated table view with status badges, search filter, and skeleton loading state.
- `src/components/StudentFormModal.jsx`: Modal form for Create/Edit operations with animated inline validation messages.
- `src/components/DeleteConfirmModal.jsx`: Confirmation modal for destructive actions.
- `src/components/Toast.jsx`: Sliding notification alert system.

---

## 7. Visual & Motion Design System

- **Color Palette**: Dark Slate (`#0f172a`, `#090d16`) with a primary Indigo accent (`brand-500` / `#6366f1`) and semantic status accents (`Emerald` for active, `Sky` for graduated, `Rose` for dropped).
- **Typography**: `Outfit` (Heading font for bold, clean titles) paired with `Inter` (Body font for high legibility table and form text).
- **Purposeful Motion**:
  - **Framer Motion `AnimatePresence`**: Smooth layout shifts during table row updates and status filtering.
  - **Modal Scale & Fade**: Dialogs enter with a gentle scale-in effect rather than abrupt pops.
  - **Skeleton Pulse**: Replaces jarring spinners with layout-preserving skeleton rows during data fetches.
  - **Inline Validation Animations**: Field error messages slide down softly under inputs without shifting form alignment aggressively.
