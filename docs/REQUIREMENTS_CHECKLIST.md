# Full Stack Project Management System — Requirements Checklist

**Project Tracking Status**:
- `[ ]` Not Started
- `[/]` In Progress
- `[x]` Implemented, Tested & Verified

---

## A. Functional Requirements
- [ ] User Registration with unique email and bcrypt hashed password
- [ ] User Login with JWT credential generation
- [ ] User Logout with client-side token invalidation
- [ ] Dashboard statistics computation (Total Projects, Total Tasks, Completed Tasks, Pending Tasks, Projects in Progress)
- [ ] Project Management:
  - [ ] Create Project (Name, Description, Status, Start Date, End Date)
  - [ ] View Projects List (authenticated user isolation)
  - [ ] View Project Detail by ID
  - [ ] Edit/Update Project
  - [ ] Delete Project (cascading cleanup)
  - [ ] Search Projects by name query
  - [ ] Filter Projects by status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`)
- [ ] Task Management:
  - [ ] Create Task linked to Project (Name, Description, Priority, Status, Due Date)
  - [ ] View Tasks List (scoped to user's projects)
  - [ ] View Task Detail by ID
  - [ ] Edit/Update Task (Status, Priority, Due Date)
  - [ ] Delete Task
  - [ ] Mark Task as Completed
  - [ ] Change Task Status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
  - [ ] Change Task Priority (`LOW`, `MEDIUM`, `HIGH`)
  - [ ] Search Tasks by name/query
  - [ ] Filter Tasks by status, priority, and projectId
- [ ] Cross-Platform Synchronization:
  - [ ] Changes on Web appear on Mobile upon refresh/pull-to-refresh
  - [ ] Changes on Mobile appear on Web upon refresh

---

## B. Web Requirements
- [ ] Framework: React + Vite + React Router (No Next.js)
- [ ] HTTP Client: Axios with authorization bearer interceptor
- [ ] Responsive UI/UX with modern styling
- [ ] Routes:
  - [ ] `/login` (Login screen)
  - [ ] `/register` (Registration screen)
  - [ ] `/dashboard` (Dashboard statistics & overview)
  - [ ] `/projects` (Projects listing, search, status filter)
  - [ ] `/projects/:id` (Project details, task table & board, task creation)
- [ ] Components:
  - [ ] `Button`, `Input`, `Modal`, `LoadingSpinner`, `ErrorMessage`, `EmptyState`
  - [ ] `ProjectCard`, `TaskCard`, `StatusBadge`, `PriorityBadge`, `SearchBar`, `FilterControls`, `Navbar`
- [ ] Authentication Context:
  - [ ] Persistent login state
  - [ ] 401 response handling with automatic session expiry redirect
- [ ] Form validation & date consistency checks (e.g. `endDate >= startDate`)

---

## C. Mobile Requirements
- [ ] Framework: React Native with Expo (Mandatory Android Support)
- [ ] Navigation: React Navigation (Stack / Bottom Tabs)
- [ ] Token Storage: `expo-secure-store` (No plain AsyncStorage for JWT tokens)
- [ ] HTTP Client: Axios with baseURL and Bearer token attachment
- [ ] Screens:
  - [ ] Login Screen
  - [ ] Register Screen
  - [ ] Dashboard Screen (Metric cards, task distribution)
  - [ ] Projects Screen (List, search, filter)
  - [ ] Project Detail Screen (Task lists, status updates)
  - [ ] Tasks Screen (Direct task list & kanban view)
- [ ] Features:
  - [ ] Touch-native controls & card layouts
  - [ ] Pull-to-refresh (`RefreshControl`) for data synchronization
  - [ ] Offline & network degradation handling ("No internet connection" banner)
  - [ ] Session expiry handling with automatic redirect to Login

---

## D. Backend Requirements
- [ ] Runtime & Framework: Node.js + Express.js
- [ ] Clean Architecture:
  - [ ] `src/config/` (environment, database, constants)
  - [ ] `src/controllers/` (auth, projects, tasks, dashboard)
  - [ ] `src/middleware/` (authentication, authorization, error handling, rate limiting)
  - [ ] `src/routes/` (authRoutes, projectRoutes, taskRoutes, dashboardRoutes)
  - [ ] `src/services/` (business logic & Prisma queries)
  - [ ] `src/validators/` (request schemas & sanitizers)
  - [ ] `src/utils/` (JWT helper, password hasher, API response formatter)
  - [ ] `src/app.js` & `src/server.js`
- [ ] Single unified REST API serving both Web and Mobile clients
- [ ] Health Check endpoint: `GET /api/health`

---

## E. Database Requirements
- [ ] Database Engine: MySQL
- [ ] ORM: Prisma ORM with parameterized query engine
- [ ] Schema Entities:
  - [ ] `User` (`id`, `fullName`, `email`, `passwordHash`, `createdAt`, `updatedAt`)
  - [ ] `Project` (`id`, `userId`, `name`, `description`, `status`, `startDate`, `endDate`, `createdAt`, `updatedAt`)
  - [ ] `Task` (`id`, `projectId`, `name`, `description`, `priority`, `status`, `dueDate`, `createdAt`, `updatedAt`)
- [ ] Enums:
  - [ ] `ProjectStatus`: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`
  - [ ] `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`
  - [ ] `TaskStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- [ ] Relationships:
  - [ ] `User` 1:N `Project` (`onDelete: Cascade` / `Restrict`)
  - [ ] `Project` 1:N `Task` (`onDelete: Cascade`)
- [ ] Indexes for high velocity lookup:
  - [ ] `User.email` (UNIQUE index)
  - [ ] `Project.userId`
  - [ ] `Task.projectId`
  - [ ] `Task.status`, `Task.priority`

---

## F. Security Requirements
- [ ] Password Hashing: bcrypt with salt rounds >= 10
- [ ] Safe user serialization: Never expose `passwordHash` in API responses
- [ ] Authentication: Stateless Bearer JWT tokens (`authenticateToken` middleware)
- [ ] Strict Backend Authorization:
  - [ ] Verify `project.userId === authenticatedUser.id` on all project operations
  - [ ] Verify `task.project.userId === authenticatedUser.id` on all task operations
  - [ ] User A cannot access, mutate, or delete User B's resources
- [ ] Rate Limiting: `express-rate-limit` on auth endpoints (`/api/auth/*`)
- [ ] Security Headers: `helmet` enabled
- [ ] CORS: Configured for specific client origins (no open wildcard in production)
- [ ] SQL Injection Prevention: Prisma parameterized queries exclusively

---

## G. API Requirements
- [ ] Response Uniformity:
  - [ ] Success: `{ "success": true, "data": { ... } }`
  - [ ] Error: `{ "success": false, "message": "..." }`
- [ ] Standard HTTP status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `429`, `500`
- [ ] Centralized error handler preventing leakage of stack traces or internals
- [ ] Endpoints:
  - [ ] `POST /api/auth/register`
  - [ ] `POST /api/auth/login`
  - [ ] `POST /api/auth/logout`
  - [ ] `GET /api/auth/me`
  - [ ] `GET /api/projects`
  - [ ] `GET /api/projects/:id`
  - [ ] `POST /api/projects`
  - [ ] `PUT /api/projects/:id`
  - [ ] `DELETE /api/projects/:id`
  - [ ] `GET /api/tasks`
  - [ ] `GET /api/tasks/:id`
  - [ ] `POST /api/tasks`
  - [ ] `PUT /api/tasks/:id`
  - [ ] `DELETE /api/tasks/:id`
  - [ ] `GET /api/dashboard`

---

## H. Testing Requirements
- [ ] Automated Backend Unit & Integration Tests:
  - [ ] Authentication (register, duplicate email, login, invalid password)
  - [ ] Projects CRUD & search/filter
  - [ ] Tasks CRUD & priority/status transitions
  - [ ] Authorization isolation (User A vs User B)
  - [ ] Input validation (dates, enums, empty payloads)
  - [ ] Rate limiting enforcement
- [ ] End-to-End Cross-Platform Synchronization Test
- [ ] Edge cases: 401 expiration, offline retry, network failure handling

---

## I. Documentation Requirements
- [ ] `docs/REQUIREMENTS_CHECKLIST.md` (Requirement Decode)
- [ ] `docs/ER-DIAGRAM.md` (Database architecture, entity relations, schema DDL)
- [ ] `docs/API_DOCUMENTATION.md` (OpenAPI/REST specifications, sample payloads)
- [ ] `README.md` (Comprehensive root documentation, setup instructions, architecture)

---

## J. Deployment Requirements
- [ ] Production Database: Managed MySQL with connection pooling
- [ ] Production Backend: Node.js + Express with HTTPS, environment secrets, and strict CORS
- [ ] Production Web: React + Vite build deployed on professional host
- [ ] Production Mobile: React Native Expo Android configuration (`app.json`, `eas.json`)
- [ ] Docker Support: `backend/Dockerfile`, `docker-compose.yml`
- [ ] Verification of zero localhost URLs in production configurations

---

## K. Optional Bonus Features
- [ ] Dual-Sync Live Split Screen Simulator
- [ ] Interactive REST API tester console
- [ ] Dark / Light / System theme switching
