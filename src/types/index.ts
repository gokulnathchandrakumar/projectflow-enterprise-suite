export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
  tier: string;
  department: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'comment' | 'system';
  author: string;
  authorInitials: string;
  authorRole?: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  code: string; // e.g. TASK-105
  projectId: string;
  projectName: string;
  name: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  isOverdue?: boolean;
  assignee: {
    name: string;
    email: string;
    initials: string;
  };
  subtasks: Subtask[];
  activityLogs: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  createdDate: string;
  owner: {
    name: string;
    email: string;
    initials: string;
  };
  lead: string;
  priority: Priority;
  tags?: string[];
  department?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveWebPage = 'dashboard' | 'projects' | 'tasks' | 'project-detail' | 'edge-states';
export type ActiveMobileTab = 'dashboard' | 'projects' | 'tasks' | 'profile' | 'diagnostics';
