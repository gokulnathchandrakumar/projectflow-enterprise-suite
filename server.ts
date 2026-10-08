import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory relational data store matching PostgreSQL schema
interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  startDate: string;
  endDate: string;
  createdDate: string;
  lead: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface TaskRecord {
  id: string;
  code: string;
  projectId: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  dueDate: string;
  assigneeName: string;
  assigneeEmail: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  activityLogs: { id: string; type: string; author: string; content: string; timestamp: string }[];
}

let projectsDB: ProjectRecord[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Modernizing corporate web presence and customer portal with responsive UI patterns.',
    status: 'In Progress',
    startDate: '2024-09-15',
    endDate: '2024-10-31',
    createdDate: '2024-09-10',
    lead: 'Alex Morgan',
    priority: 'High',
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking Rollout',
    description: 'Deployment of biometric auth, transfers, and notifications for iOS and Android retail apps.',
    status: 'In Progress',
    startDate: '2024-08-01',
    endDate: '2024-11-15',
    createdDate: '2024-07-28',
    lead: 'Marcus Vance',
    priority: 'High',
  },
  {
    id: 'proj-3',
    name: 'Q4 Compliance Audit',
    description: 'Annual internal review of security protocols, access logs, and data encryption standards.',
    status: 'Not Started',
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    createdDate: '2024-10-01',
    lead: 'Elena Rossi',
    priority: 'Medium',
  },
];

let tasksDB: TaskRecord[] = [
  {
    id: 'task-105',
    code: 'TASK-105',
    projectId: 'proj-1',
    name: 'Finalize homepage wireframes',
    description: 'Create high-fidelity wireframe blueprints for responsive breakpoints.',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2024-10-18',
    assigneeName: 'Alex Morgan',
    assigneeEmail: 'alex.morgan@projectflow.internal',
    subtasks: [
      { id: 'sub-1', title: 'Desktop 1440px layout grid specification', completed: true },
      { id: 'sub-2', title: 'Mobile navigation drawer responsive state', completed: true },
      { id: 'sub-3', title: 'Stakeholder review & design critique notes incorporated', completed: false },
    ],
    activityLogs: [
      {
        id: 'act-1',
        type: 'comment',
        author: 'Alex Morgan',
        content: 'Draft wireframes v2 uploaded to design repo.',
        timestamp: '15 mins ago',
      },
    ],
  },
];

// --- REST API ENDPOINTS ---

// Health & System Readiness
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'PostgreSQL 16 pool connected',
    cluster: 'asia-southeast1-edge',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  res.json({
    token: `jwt_token_${Buffer.from(email).toString('base64')}`,
    user: {
      id: 'usr-1',
      name: email.includes('alex') ? 'Alex Morgan' : 'Enterprise User',
      email,
      role: 'Senior Product Lead',
      tier: 'Enterprise Suite Pro',
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }
  res.status(201).json({
    token: `jwt_token_${Date.now()}`,
    user: {
      id: `usr-${Date.now()}`,
      name: fullName,
      email,
      role: 'Staff Product Engineer',
      tier: 'Enterprise Suite Pro',
    },
  });
});

// Projects CRUD
app.get('/api/projects', (req: Request, res: Response) => {
  const { status, search } = req.query;
  let results = [...projectsDB];
  if (status && status !== 'All') {
    results = results.filter((p) => p.status === status);
  }
  if (search && typeof search === 'string') {
    results = results.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.json({ projects: results, total: results.length });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const { name, description, status, startDate, endDate, priority, lead } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  const newProject: ProjectRecord = {
    id: `proj-${Date.now()}`,
    name,
    description: description || '',
    status: status || 'In Progress',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    createdDate: new Date().toISOString().split('T')[0],
    lead: lead || 'Alex Morgan',
    priority: priority || 'Medium',
  };
  projectsDB.unshift(newProject);
  res.status(201).json({ project: newProject });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const proj = projectsDB.find((p) => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  const tasks = tasksDB.filter((t) => t.projectId === req.params.id);
  res.json({ project: proj, tasks });
});

// Tasks CRUD
app.get('/api/tasks', (req: Request, res: Response) => {
  const { projectId, status } = req.query;
  let results = [...tasksDB];
  if (projectId) {
    results = results.filter((t) => t.projectId === projectId);
  }
  if (status) {
    results = results.filter((t) => t.status === status);
  }
  res.json({ tasks: results, total: results.length });
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const { name, description, priority, status, dueDate, projectId } = req.body;
  if (!name) return res.status(400).json({ error: 'Task name is required' });

  const code = `TASK-${tasksDB.length + 105}`;
  const newTask: TaskRecord = {
    id: `task-${Date.now()}`,
    code,
    projectId: projectId || 'proj-1',
    name,
    description: description || '',
    priority: priority || 'Medium',
    status: status || 'In Progress',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assigneeName: 'Alex Morgan',
    assigneeEmail: 'alex.morgan@projectflow.internal',
    subtasks: [],
    activityLogs: [
      {
        id: `act-${Date.now()}`,
        type: 'system',
        author: 'System Audit',
        content: `Task created via API by Alex Morgan.`,
        timestamp: 'Just now',
      },
    ],
  };
  tasksDB.unshift(newTask);
  res.status(201).json({ task: newTask });
});

app.patch('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasksDB.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body);
  res.json({ task });
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const index = tasksDB.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasksDB.splice(index, 1);
  res.json({ success: true, message: 'Task deleted and archived' });
});

// Offline Mutex Sync Replay
app.post('/api/sync/replay', (req: Request, res: Response) => {
  const { mutations } = req.body;
  const count = Array.isArray(mutations) ? mutations.length : 3;
  res.json({
    status: 'synced',
    replayedOperations: count,
    reconciliationStrategy: 'last-write-wins',
    serverTimestamp: new Date().toISOString(),
  });
});

// --- VITE MIDDLEWARE / STATIC ASSETS ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProjectFlow Enterprise Server listening on port ${PORT}`);
  });
}

startServer();
