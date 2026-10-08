# ProjectFlow Unified REST API Specification

This document details the OpenAPI / REST endpoints for the Project Management System serving both the React Web and React Native mobile clients.

**Base URL**: `http://localhost:5000/api` (Production: `https://api.projectflow.internal/api`)

---

## 1. System & Health

### `GET /api/health`
Checks server readiness, uptime, and database connectivity.
- **Authentication**: None
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-10-08T04:00:00.000Z",
  "env": "development"
}
```

---

## 2. Authentication

### `POST /api/auth/register`
Creates a new user account with bcrypt hashed password.
- **Authentication**: None (Rate limited: 30 requests / 15 mins)
- **Request Body**:
```json
{
  "fullName": "Alex Morgan",
  "email": "alex.morgan@projectflow.internal",
  "password": "SecurePassword123!"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c1f7b82e-9d22-4a57-9d62-1b1234567890",
      "fullName": "Alex Morgan",
      "email": "alex.morgan@projectflow.internal",
      "createdAt": "2026-10-08T04:00:00.000Z",
      "updatedAt": "2026-10-08T04:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error `400 Bad Request`**: Validation error (invalid email, password < 6 chars)
- **Error `409 Conflict`**: Email already registered

---

### `POST /api/auth/login`
Authenticates existing user and generates JWT.
- **Authentication**: None (Rate limited)
- **Request Body**:
```json
{
  "email": "alex.morgan@projectflow.internal",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c1f7b82e-9d22-4a57-9d62-1b1234567890",
      "fullName": "Alex Morgan",
      "email": "alex.morgan@projectflow.internal"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error `401 Unauthorized`**: Invalid email or password

---

### `POST /api/auth/logout`
Client-side token disposal notification.
- **Authentication**: Optional
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### `GET /api/auth/me`
Retrieves currently authenticated user.
- **Authentication**: `Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c1f7b82e-9d22-4a57-9d62-1b1234567890",
      "fullName": "Alex Morgan",
      "email": "alex.morgan@projectflow.internal"
    }
  }
}
```
- **Error `401 Unauthorized`**: Expired or missing token

---

## 3. Projects

### `GET /api/projects`
Retrieves all projects owned by the authenticated user.
- **Authentication**: `Bearer <token>`
- **Query Parameters**:
  - `search` *(string, optional)*: Filter by project name substring
  - `status` *(string, optional)*: `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "p-101",
        "name": "Website Redesign",
        "description": "Modernizing corporate web portal",
        "status": "IN_PROGRESS",
        "startDate": "2026-10-01",
        "endDate": "2026-11-15",
        "totalTasks": 12,
        "completedTasks": 8,
        "progressPct": 67
      }
    ],
    "total": 1
  }
}
```

---

### `GET /api/projects/:id`
Retrieves a single project with its task list.
- **Authentication**: `Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "p-101",
      "name": "Website Redesign",
      "status": "IN_PROGRESS",
      "tasks": [...]
    }
  }
}
```
- **Error `404 Not Found`**: Project does not exist or belongs to another user

---

### `POST /api/projects`
Creates a new project for the authenticated user.
- **Authentication**: `Bearer <token>`
- **Request Body**:
```json
{
  "name": "Mobile Banking App",
  "description": "Biometric auth and transaction flows",
  "status": "IN_PROGRESS",
  "startDate": "2026-10-15",
  "endDate": "2026-12-31"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "p-102",
      "userId": "c1f7b82e-9d22-4a57-9d62-1b1234567890",
      "name": "Mobile Banking App",
      "status": "IN_PROGRESS",
      "startDate": "2026-10-15T00:00:00.000Z",
      "endDate": "2026-12-31T00:00:00.000Z"
    }
  }
}
```
- **Error `400 Bad Request`**: `endDate` earlier than `startDate` or missing name

---

### `PUT /api/projects/:id`
Updates an existing project.
- **Authentication**: `Bearer <token>`
- **Request Body**: Partial project fields (`name`, `description`, `status`, `startDate`, `endDate`)
- **Response `200 OK`**: Updated project object
- **Error `404 Not Found`**: Project not owned by user

---

### `DELETE /api/projects/:id`
Deletes a project and all associated tasks.
- **Authentication**: `Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "message": "Project and all associated tasks deleted successfully."
  }
}
```

---

## 4. Tasks

### `GET /api/tasks`
Lists tasks with multi-field filtering.
- **Authentication**: `Bearer <token>`
- **Query Parameters**:
  - `projectId` *(string, optional)*
  - `status` *(string, optional)*: `PENDING` | `IN_PROGRESS` | `COMPLETED`
  - `priority` *(string, optional)*: `LOW` | `MEDIUM` | `HIGH`
  - `search` *(string, optional)*
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "t-201",
        "projectId": "p-101",
        "name": "Implement JWT Auth Middleware",
        "priority": "HIGH",
        "status": "COMPLETED",
        "dueDate": "2026-10-20",
        "project": {
          "id": "p-101",
          "name": "Website Redesign"
        }
      }
    ],
    "total": 1
  }
}
```

---

### `POST /api/tasks`
Creates a new task inside a user-owned project.
- **Authentication**: `Bearer <token>`
- **Request Body**:
```json
{
  "projectId": "p-101",
  "name": "Create responsive navigation bar",
  "description": "Mobile drawer and desktop header",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-10-25"
}
```
- **Response `201 Created`**: Returns created task
- **Error `404 Not Found`**: Target project not owned by user

---

### `PUT /api/tasks/:id`
Updates task status, priority, due date, or details.
- **Authentication**: `Bearer <token>`
- **Request Body**: Partial task payload (e.g. `{ "status": "COMPLETED" }`)
- **Response `200 OK`**: Returns updated task
- **Error `404 Not Found`**: Task not found or not owned by user

---

### `DELETE /api/tasks/:id`
Deletes an individual task.
- **Authentication**: `Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully."
  }
}
```

---

## 5. Dashboard

### `GET /api/dashboard`
Aggregated overview KPI metrics scoped strictly to authenticated user.
- **Authentication**: `Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalProjects": 6,
    "totalTasks": 24,
    "completedTasks": 18,
    "pendingTasks": 6,
    "projectsInProgress": 4
  }
}
```
