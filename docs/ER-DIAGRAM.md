# Database Architecture & Entity Relationship Diagram (ERD)

## 1. Relational Entity Overview

The system is designed with 3NF normalization for MySQL (and compatible SQL engines), enforcing referential integrity, foreign key constraints, cascading task deletion, and optimized query indexes.

```
       +---------------------------------------------+
       |                    users                    |
       +---------------------------------------------+
       | PK id: VARCHAR(36) / UUID                   |
       |    full_name: VARCHAR(100) NOT NULL         |
       |    email: VARCHAR(255) NOT NULL UNIQUE      |
       |    password_hash: VARCHAR(255) NOT NULL     |
       |    created_at: DATETIME(3) DEFAULT NOW()    |
       |    updated_at: DATETIME(3) DEFAULT NOW()    |
       +---------------------------------------------+
                             |
                      1:N (ON DELETE CASCADE)
                             v
       +---------------------------------------------+
       |                  projects                   |
       +---------------------------------------------+
       | PK id: VARCHAR(36) / UUID                   |
       | FK user_id: VARCHAR(36) -> users(id)        |
       |    name: VARCHAR(150) NOT NULL              |
       |    description: TEXT NULL                   |
       |    status: ENUM('NOT_STARTED',              |
       |                 'IN_PROGRESS',              |
       |                 'COMPLETED')                |
       |    start_date: DATE NOT NULL                |
       |    end_date: DATE NOT NULL                  |
       |    created_at: DATETIME(3) DEFAULT NOW()    |
       |    updated_at: DATETIME(3) DEFAULT NOW()    |
       +---------------------------------------------+
                             |
                      1:N (ON DELETE CASCADE)
                             v
       +---------------------------------------------+
       |                    tasks                    |
       +---------------------------------------------+
       | PK id: VARCHAR(36) / UUID                   |
       | FK project_id: VARCHAR(36) -> projects(id)  |
       |    name: VARCHAR(255) NOT NULL              |
       |    description: TEXT NULL                   |
       |    priority: ENUM('LOW', 'MEDIUM', 'HIGH')  |
       |    status: ENUM('PENDING',                  |
       |                 'IN_PROGRESS',              |
       |                 'COMPLETED')                |
       |    due_date: DATE NOT NULL                  |
       |    created_at: DATETIME(3) DEFAULT NOW()    |
       |    updated_at: DATETIME(3) DEFAULT NOW()    |
       +---------------------------------------------+
```

---

## 2. Table Specifications

### Users Table (`users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique UUID v4 identifier |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Full legal or display name |
| `email` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Unique email for authentication |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | bcrypt hashed password (salt >= 10) |
| `created_at` | `DATETIME(3)` | `DEFAULT CURRENT_TIMESTAMP(3)` | Registration timestamp |
| `updated_at` | `DATETIME(3)` | `ON UPDATE CURRENT_TIMESTAMP(3)` | Last update timestamp |

### Projects Table (`projects`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique UUID v4 identifier |
| `user_id` | `VARCHAR(36)` | `NOT NULL, FK -> users(id)` | Project owner/creator |
| `name` | `VARCHAR(150)` | `NOT NULL` | Project title |
| `description` | `TEXT` | `NULL` | Detailed scope/specs |
| `status` | `ENUM` | `DEFAULT 'IN_PROGRESS'` | `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |
| `start_date` | `DATE` | `NOT NULL` | Project timeline start |
| `end_date` | `DATE` | `NOT NULL` | Project milestone deadline |
| `created_at` | `DATETIME(3)` | `DEFAULT CURRENT_TIMESTAMP(3)` | Record creation timestamp |
| `updated_at` | `DATETIME(3)` | `ON UPDATE CURRENT_TIMESTAMP(3)` | Record update timestamp |

### Tasks Table (`tasks`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique UUID v4 identifier |
| `project_id` | `VARCHAR(36)` | `NOT NULL, FK -> projects(id)` | Parent project container |
| `name` | `VARCHAR(255)` | `NOT NULL` | Actionable task name |
| `description` | `TEXT` | `NULL` | Task deliverables & acceptance criteria |
| `priority` | `ENUM` | `DEFAULT 'MEDIUM'` | `LOW`, `MEDIUM`, `HIGH` |
| `status` | `ENUM` | `DEFAULT 'PENDING'` | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `due_date` | `DATE` | `NOT NULL` | Task completion cutoff date |
| `created_at` | `DATETIME(3)` | `DEFAULT CURRENT_TIMESTAMP(3)` | Task creation timestamp |
| `updated_at` | `DATETIME(3)` | `ON UPDATE CURRENT_TIMESTAMP(3)` | Task update timestamp |

---

## 3. Referential Integrity & Cascade Rules

1. **User Deletion**: When a user account is deleted, all owned projects cascade delete (`ON DELETE CASCADE`).
2. **Project Deletion**: When a project is deleted, all constituent tasks cascade delete (`ON DELETE CASCADE`), ensuring **no orphan tasks** can exist.
3. **Query Indexes**:
   - `idx_users_email` (Unique index for instantaneous login lookups)
   - `idx_projects_user_id` (Scoped user project retrieval)
   - `idx_projects_status` (Filtering projects by state)
   - `idx_tasks_project_id` (Retrieval of tasks per project)
   - `idx_tasks_status` (Dashboard completion aggregation & status filtering)
   - `idx_tasks_priority` (Priority triage queries)
