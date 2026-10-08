# ProjectFlow Enterprise Suite — Production Deployment Guide

This document outlines the professional deployment architecture connecting:
- **Database**: Supabase (PostgreSQL managed cloud)
- **Backend API**: Render (Node.js/Express with Prisma ORM)
- **Frontend Web**: Vercel (React 19 + Vite SPA)
- **Source Control**: GitHub (`gokulnathchandrakumar/projectflow-enterprise-suite`)

---

## Architecture Flow

```
┌─────────────────────────────────┐
│     Vercel (Frontend Web)       │
│  React 19 + Vite + Tailwind CSS │
│  https://<app>.vercel.app       │
└────────────────┬────────────────┘
                 │
                 │ HTTPS (Bearer Token Auth)
                 │ VITE_API_URL: https://<render-backend>/api
                 ▼
┌─────────────────────────────────┐
│      Render (Backend API)       │
│  Node.js 22 + Express 4.21      │
│  Prisma 5.22 ORM + JWT Auth     │
│  https://<backend>.onrender.com │
└────────────────┬────────────────┘
                 │
                 │ PostgreSQL Protocol (TLS/SSL)
                 │ DATABASE_URL: postgresql://postgres:...@...supabase.co:5432/postgres
                 ▼
┌─────────────────────────────────┐
│       Supabase (Database)       │
│   Managed PostgreSQL Database   │
│   Auto-schema & Auto-seed       │
└─────────────────────────────────┘
```

---

## Step 1: Database Setup (Supabase)

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g. `projectflow-enterprise`) or select your existing project.
3. Set a strong database password and choose your nearest region.
4. Go to **Project Settings** (gear icon) → **Database** → scroll down to **Connection String**.
5. Select the **URI** tab.
6. Copy the connection string. It will look like:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   *(Or the Transaction Pooler URI if using serverless pooling: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`)*

---

## Step 2: Backend Deployment (Render)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint specification.

### Option A: Using Render Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `gokulnathchandrakumar/projectflow-enterprise-suite`.
4. Render will parse [`render.yaml`](../render.yaml) and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `node src/server.js`
   - **Health Check Path**: `/api/health`
5. Under Environment Variables, input:
   - `DATABASE_URL`: Paste your Supabase URI from Step 1.
6. Click **Apply Blueprint**.
7. Once deployed, note down your Render Web Service URL (e.g., `https://projectflow-backend-xxxx.onrender.com`).

### Option B: Manual Web Service on Render
1. Click **New +** → **Web Service**.
2. Select repository: `gokulnathchandrakumar/projectflow-enterprise-suite`.
3. Configure the service settings:
   - **Name**: `projectflow-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `node src/server.js`
   - **Health Check Path**: `/api/health`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `CORS_ORIGIN` = `*`
   - `JWT_SECRET` = `(click generate or provide a secure 32+ character random string)`
   - `DATABASE_URL` = `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
5. Click **Create Web Service**.

> **Note on Auto-Seeding**: When the backend starts up and connects to Supabase, `server.js` automatically checks if the database is empty (`user.count() === 0`). If empty, it automatically provisions the initial dataset (Alex Morgan demo user, 4 corporate projects, and 12 categorized tasks).

---

## Step 3: Frontend Deployment (Vercel)

The repository includes a [`vercel.json`](../vercel.json) configuration for SPA routing and Vite builds.

1. Log in to [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New…** → **Project**.
3. Import Git Repository: `gokulnathchandrakumar/projectflow-enterprise-suite`.
4. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<YOUR-RENDER-BACKEND-URL>/api` *(e.g., `https://projectflow-backend-xxxx.onrender.com/api`)*
6. Click **Deploy**.

---

## Step 4: Verification & End-to-End Testing

### 1. Test Backend Health Probe
Open in your browser or run:
```bash
curl https://<YOUR-RENDER-BACKEND-URL>/api/health
```
**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-10-08T...",
  "database": "connected"
}
```

### 2. Test Frontend Access & Live Operations
1. Open the Vercel deployed URL: `https://<YOUR-APP>.vercel.app`.
2. Sign in with the default seeded credentials:
   - **Email**: `alex.morgan@example.com`
   - **Password**: `Password123!`
3. Verify Dashboard KPIs:
   - Total Projects, Tasks, and Completion Rate load directly from Supabase.
4. Verify Interactive Features:
   - **Quarter Selector**: Toggle between *This Week*, *This Month*, and *This Quarter*.
   - **Filter Drawer**: Filter deliverables by Priority (*High*, *Medium*, *Low*) and Status (*In Progress*, *Completed*).
   - **Notification Panel**: Bell icon shows interactive notification center with dismiss and mark-as-read controls.
   - **Profile Menu**: Top-right avatar shows profile drawer with user tier and sign-out controls.
5. Create a new task or project to confirm write-path persistence to Supabase.
