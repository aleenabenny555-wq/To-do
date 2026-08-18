# Minimalist To-Do Application

A clean, modern, responsive task-management application built with a **Django REST Framework** backend and a **React (Vite)** frontend styled with pure modern CSS.

Designed for college project presentations, portfolio showcases, and daily personal productivity with secure multi-tenant user isolation.

---

## Table of Contents
1. [Project Description](#project-description)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Database Migration Commands](#database-migration-commands)
8. [How to Run Django Backend](#how-to-run-django-backend)
9. [How to Run React Frontend](#how-to-run-react-frontend)
10. [REST API Endpoints & Specification](#rest-api-endpoints--specification)
11. [Communication Architecture](#communication-architecture)
12. [Screenshots & UI Preview](#screenshots--ui-preview)
13. [Future Improvements](#future-improvements)

---

## Project Description

The **Minimalist To-Do Application** provides an intuitive, distraction-free environment for managing daily goals and tasks. Built on a decoupled client-server architecture, it pairs the security and relational integrity of Django ORM with the speed and reactivity of a modern React single-page application.

All tasks are stored in a SQLite database and automatically associated with the authenticated user via JSON Web Tokens (JWT). Users can create tasks, mark them complete (moving them to a distinct Completed section), toggle them back, or delete them with instant UI feedback.

---

## Features

- **Authentication & User Isolation**:
  - Secure JWT-based authentication (`SimpleJWT`).
  - Automatic token refresh on expired sessions via Axios response interceptors.
  - Strict database-level scoping: users can **only** view, edit, or delete their own tasks.
  - 1-Click "Demo Account" login for rapid evaluation and grading.

- **Task Management (CRUD)**:
  - **Add Daily Tasks**: Input with validation against empty submissions and instant `Enter` key support.
  - **Pending vs. Completed Separation**: Separate sections for active and finished tasks with real-time counters.
  - **Dynamic Status Toggling**: Checkbox toggle seamlessly transfers tasks between Pending and Completed with strikethrough styling.
  - **Instant Deletion**: Remove tasks immediately with optimistic UI updates (no full page reload required).
  - **Full Persistence**: All task states are persisted in the Django database.

- **Aesthetics & UX**:
  - Minimalist, crisp typography (`Plus Jakarta Sans` & `Inter`).
  - Subtle shadows, micro-interactions, responsive progress bar, and empty states.
  - Fully responsive on mobile, tablet, and desktop viewports.

---

## Technology Stack

### Backend
- **Python** (3.11+)
- **Django** (6.x)
- **Django REST Framework (DRF)**
- **djangorestframework-simplejwt** (JWT authentication)
- **django-cors-headers** (CORS management)
- **SQLite** (Development database with Django ORM)

### Frontend
- **React 18**
- **Vite**
- **Axios** (with JWT request/response interceptors)
- **Lucide React** (icons)
- **Vanilla CSS** (custom modern design system)

---

## Project Structure

```text
task/
├── README.md                   # Project documentation
├── verify_live.py              # Live end-to-end integration test script
│
├── todo_backend/               # Django REST API Backend
│   ├── manage.py
│   ├── requirements.txt        # Backend dependencies
│   ├── seed_demo.py            # Database seeder (creates 'demo' & 'admin' users)
│   ├── test_api.py             # DRF test suite
│   ├── db.sqlite3              # SQLite database
│   ├── todo_backend/
│   │   ├── __init__.py
│   │   ├── settings.py         # App settings, CORS, DRF & JWT config
│   │   ├── urls.py             # Root routing
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── tasks/                  # Tasks application
│       ├── __init__.py
│       ├── admin.py            # Django Admin registration
│       ├── models.py           # Task model (title, is_completed, created_at, owner)
│       ├── serializers.py      # Serializers for Task, User, & Registration
│       ├── views.py            # TaskViewSet (owner-scoped) & Auth views
│       ├── urls.py             # API route registrations
│       └── migrations/
│
└── todo_frontend/              # React + Vite Frontend
    ├── index.html              # HTML entry with custom typography
    ├── package.json            # Frontend dependencies
    ├── vite.config.js          # Vite config
    └── src/
        ├── main.jsx            # React root mount
        ├── App.jsx             # Main dashboard
        ├── index.css           # Minimalist CSS design system
        ├── context/
        │   └── AuthContext.jsx # Auth state, login/register/logout
        ├── services/
        │   └── api.js          # Axios instance with JWT interceptors
        └── components/
            ├── Navbar.jsx      # Navigation bar with user badge & progress pill
            ├── TaskInput.jsx   # Input bar with Add Task button
            ├── TaskSection.jsx # Section wrapper for Pending & Completed
            ├── TaskList.jsx    # Task list renderer
            ├── TaskItem.jsx    # Task card with checkbox and delete button
            └── AuthModal.jsx   # Sign In, Register, and Demo login modal
```

---

## Backend Setup

1. Open a terminal in the `todo_backend` directory:
   ```bash
   cd todo_backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

---

## Database Migration Commands

Run the standard Django database migration commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Seed Demo Account & Initial Tasks
To automatically create the demo user (`demo` / `password123`) and initial sample tasks:

```bash
python seed_demo.py
```

To create an admin superuser manually:
```bash
python manage.py createsuperuser
```

---

## How to Run Django Backend

Start the development server on port `8000`:

```bash
python manage.py runserver 127.0.0.1:8000
```

The API will be available at `http://127.0.0.1:8000/api/`.

---

## Frontend Setup

1. Open a new terminal in the `todo_frontend` directory:
   ```bash
   cd todo_frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

---

## How to Run React Frontend

Start the Vite development server:

```bash
npm run dev
```

The frontend will be accessible at: `http://localhost:5173/`

---

## REST API Endpoints & Specification

All task endpoints require an `Authorization: Bearer <access_token>` header.

### 1. Authentication Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/token/` | Obtain JWT access & refresh token | `{"username": "...", "password": "..."}` |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token | `{"refresh": "..."}` |
| `POST` | `/api/auth/register/` | Register new user account | `{"username": "...", "password": "...", "email": "..."}` |
| `GET` | `/api/auth/me/` | Get current logged-in user profile | *None* |

### 2. Task Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/` | Retrieve all tasks belonging to current user | *None* |
| `POST` | `/api/tasks/` | Create a new task | `{"title": "Complete assignment"}` |
| `GET` | `/api/tasks/<id>/` | Retrieve specific task detail | *None* |
| `PATCH`| `/api/tasks/<id>/` | Update task status or title | `{"is_completed": true}` |
| `DELETE`| `/api/tasks/<id>/`| Permanently delete a task | *None* |

#### Example Task Object:
```json
{
  "id": 1,
  "title": "Complete Python assignment",
  "is_completed": false,
  "created_at": "2026-08-14T07:50:00Z",
  "owner": {
    "id": 1,
    "username": "demo",
    "email": "demo@example.com"
  }
}
```

---

## Communication Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Vite)                       │
│  [TaskInput] ──> [TaskSection] ──> [TaskList] ──> [TaskItem]│
│                           │                                 │
│                   [AuthContext]                             │
│                           │                                 │
│               [Axios Interceptors (api.js)]                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP JSON / REST (Bearer JWT)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Django REST Backend                         │
│  [CORS Middleware] ──> [SimpleJWT Auth] ──> [TaskViewSet]   │
│                                                   │         │
│                                            [Django ORM]     │
│                                                   │         │
│                                           [SQLite Database] │
└─────────────────────────────────────────────────────────────┘
```

1. **Request Lifecycle**: When a user adds, toggles, or deletes a task, React triggers a call through `taskService` in `src/services/api.js`.
2. **Token Attachment**: The Axios request interceptor attaches `Authorization: Bearer <access_token>` from `localStorage`.
3. **Scoping & Security**: The Django `TaskViewSet` executes `get_queryset()` scoped strictly to `request.user`. The task creation view automatically injects `owner = request.user`.
4. **Token Refresh**: If the access token expires (401 response), the Axios response interceptor pauses outgoing requests, posts to `/api/auth/token/refresh/`, updates the access token, and retries the original request seamlessly.

---

## Screenshots & UI Preview

```text
+-----------------------------------------------------------------------+
|  [✓] Minimalist Tasks           (3/5 Done [■■■□□])  (•) demo [Logout] |
+-----------------------------------------------------------------------+
|                                                                       |
|   My Tasks                                                            |
|   Stay organized and get things done.                                 |
|                                                                       |
|   +---------------------------------------------+ +-----------------+ |
|   | Enter a new task...                         | | + Add Task      | |
|   +---------------------------------------------+ +-----------------+ |
|                                                                       |
|   Pending Tasks                                          3 tasks      |
|   -----------------------------------------------------------------   |
|   [ ] Complete project report                               [🗑]      |
|   [ ] Study React & Django REST Framework                   [🗑]      |
|   [ ] Submit assignment                                     [🗑]      |
|                                                                       |
|   Completed                                              2 tasks      |
|   -----------------------------------------------------------------   |
|   [✓] Finish Python assignment                              [🗑]      |
|   [✓] Attend project meeting                                [🗑]      |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Future Improvements

- **Task Categories & Tags**: Allow organizing tasks by custom labels (e.g. Work, Study, Personal).
- **Due Dates & Reminders**: Add target completion deadlines and calendar integration.
- **Drag-and-Drop Reordering**: Integrate `@hello-pangea/dnd` for customizable task prioritization.
- **Dark Mode**: Add a dark theme toggle with custom CSS variable overrides.
