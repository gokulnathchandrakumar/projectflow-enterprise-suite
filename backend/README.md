# ProjectFlow Enterprise Suite — Backend Service

A high-performance Node.js & Express REST API powered by Prisma ORM and MySQL. Serves as the single unified backend for both the React Web and React Native mobile clients.

---

## 1. Features
- **Prisma ORM**: 3NF normalized schema with MySQL database engine.
- **Stateless JWT Authentication**: Bearer token authentication with bcrypt password hashing (salt rounds: 10).
- **Strict Authorization**: Multi-tenant isolation ensuring users can only read, mutate, or delete their own projects and tasks.
- **Input Validation**: Robust request parsing and sanitization using Zod.
- **Security Engineering**: HTTP security headers via `helmet`, rate limiting via `express-rate-limit`, and CORS origin validation.
- **Relational Integrity**: Foreign key constraints and cascading task deletion.

---

## 2. API Endpoints

### Health & Readiness
- `GET /api/health` — Cluster uptime and health check

### Authentication
- `POST /api/auth/register` — Create new account (`fullName`, `email`, `password`)
- `POST /api/auth/login` — Authenticate and receive JWT (`email`, `password`)
- `POST /api/auth/logout` — Client-side token invalidation
- `GET /api/auth/me` — Retrieve authenticated user profile

### Projects
- `GET /api/projects` — List authenticated user's projects (`?search=`, `?status=`)
- `GET /api/projects/:id` — Get project details by ID
- `POST /api/projects` — Create project (`name`, `description`, `status`, `startDate`, `endDate`)
- `PUT /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project (cascades to tasks)

### Tasks
- `GET /api/tasks` — List tasks (`?projectId=`, `?status=`, `?priority=`, `?search=`)
- `GET /api/tasks/:id` — Get task details by ID
- `POST /api/tasks` — Create task (`projectId`, `name`, `description`, `priority`, `status`, `dueDate`)
- `PUT /api/tasks/:id` — Update task status/priority
- `DELETE /api/tasks/:id` — Delete task

### Dashboard
- `GET /api/dashboard` — Aggregated metrics (`totalProjects`, `totalTasks`, `completedTasks`, `pendingTasks`, `projectsInProgress`)

---

## 3. Local Setup & Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env

# 3. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 4. Start backend development server
npm run dev
```
