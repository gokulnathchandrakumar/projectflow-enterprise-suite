import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialProjects, initialTasks } from '../data/initialData';
import {
  ActiveMobileTab,
  ActiveWebPage,
  Project,
  Task,
  TaskStatus
} from '../types';

interface AppContextType {
  // Data
  projects: Project[];
  tasks: Task[];
  activeProject: Project | undefined;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // Actions
  addProject: (data: Partial<Project>, source?: 'web' | 'mobile') => Project;
  updateProject: (id: string, data: Partial<Project>, source?: 'web' | 'mobile') => void;
  deleteProject: (id: string, source?: 'web' | 'mobile') => void;

  addTask: (data: Partial<Task>, source?: 'web' | 'mobile') => Task;
  updateTask: (id: string, data: Partial<Task>, source?: 'web' | 'mobile') => void;
  deleteTask: (id: string, source?: 'web' | 'mobile') => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus, source?: 'web' | 'mobile') => void;
  toggleSubtask: (taskId: string, subtaskId: string, source?: 'web' | 'mobile') => void;
  addComment: (taskId: string, commentText: string, authorName: string, source?: 'web' | 'mobile') => void;

  // Navigation & Views
  activeWebPage: ActiveWebPage;
  setActiveWebPage: (page: ActiveWebPage) => void;
  activeMobileTab: ActiveMobileTab;
  setActiveMobileTab: (tab: ActiveMobileTab) => void;

  // Modals
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  taskToDelete: Task | null;
  setTaskToDelete: (task: Task | null) => void;

  // Sync & Edge States
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  queuedSyncCount: number;
  syncWarningVisible: boolean;
  dismissSyncWarning: () => void;
  retrySync: () => void;
  is500Error: boolean;
  setIs500Error: (val: boolean) => void;
  lastSyncTime: string;

  // Search & Global state
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projectflow_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('projectflow_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [activeWebPage, setActiveWebPage] = useState<ActiveWebPage>('dashboard');
  const [activeMobileTab, setActiveMobileTab] = useState<ActiveMobileTab>('dashboard');

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [queuedSyncCount, setQueuedSyncCount] = useState<number>(3);
  const [syncWarningVisible, setSyncWarningVisible] = useState<boolean>(true);
  const [is500Error, setIs500Error] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('projectflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('projectflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const addProject = (data: Partial<Project>, source: 'web' | 'mobile' = 'web'): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: data.name || 'Untitled Project',
      description: data.description || '',
      status: data.status || 'In Progress',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      owner: data.owner || {
        name: 'GOKULNATH',
        email: 'Gokulnathchandrakumar@gmail.com',
        initials: 'GC',
      },
      lead: data.lead || 'GOKULNATH',
      priority: data.priority || 'Medium',
      tags: data.tags || ['Enterprise'],
      department: data.department || 'Product & Engineering',
    };

    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, data: Partial<Project>, source: 'web' | 'mobile' = 'web') => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...data };
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string, source: 'web' | 'mobile' = 'web') => {
    const proj = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  const addTask = (data: Partial<Task>, source: 'web' | 'mobile' = 'web'): Task => {
    const currentProj = projects.find((p) => p.id === (data.projectId || selectedProjectId)) || projects[0];
    const taskCount = tasks.length + 105;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      code: `TASK-${taskCount}`,
      projectId: currentProj.id,
      projectName: currentProj.name,
      name: data.name || 'New Deliverable',
      description: data.description || '',
      priority: data.priority || 'Medium',
      status: data.status || 'In Progress',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignee: data.assignee || {
        name: 'GOKULNATH',
        email: 'Gokulnathchandrakumar@gmail.com',
        initials: 'GC',
      },
      subtasks: data.subtasks || [
        { id: `sub-${Date.now()}-1`, title: 'Initial technical specification review', completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Design system compliance audit', completed: false },
      ],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          type: 'system',
          author: 'System Audit',
          authorInitials: 'PF',
          content: `Task created via ${source} interface by GOKULNATH.`,
          timestamp: 'Just now',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, data: Partial<Task>, source: 'web' | 'mobile' = 'web') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...data, updatedAt: new Date().toISOString().split('T')[0] };
          if (selectedTask?.id === id) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string, source: 'web' | 'mobile' = 'web') => {
    const t = tasks.find((item) => item.id === id);
    setTasks((prev) => prev.filter((item) => item.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus, source: 'web' | 'mobile' = 'web') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: Task = {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0],
            activityLogs: [
              {
                id: `act-${Date.now()}`,
                type: 'system',
                author: 'System Audit',
                authorInitials: 'PF',
                content: `Status updated from "${t.status}" to "${newStatus}" via ${source}.`,
                timestamp: 'Just now',
              },
              ...t.activityLogs,
            ],
          };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string, source: 'web' | 'mobile' = 'web') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const updated = { ...t, subtasks: updatedSubtasks };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const addComment = (
    taskId: string,
    commentText: string,
    authorName: string,
    source: 'web' | 'mobile' = 'web'
  ) => {
    if (!commentText.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newLog = {
            id: `act-${Date.now()}`,
            type: 'comment' as const,
            author: authorName,
            authorInitials: authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            authorRole: 'Team Member',
            content: commentText.trim(),
            timestamp: 'Just now',
          };
          const updated = { ...t, activityLogs: [newLog, ...t.activityLogs] };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const retrySync = () => {
    setQueuedSyncCount(0);
    setSyncWarningVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        activeProject,
        selectedProjectId,
        setSelectedProjectId,
        selectedTask,
        setSelectedTask,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleSubtask,
        addComment,
        activeWebPage,
        setActiveWebPage,
        activeMobileTab,
        setActiveMobileTab,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        taskToDelete,
        setTaskToDelete,
        isOffline,
        setIsOffline,
        queuedSyncCount,
        syncWarningVisible,
        dismissSyncWarning: () => setSyncWarningVisible(false),
        retrySync,
        is500Error,
        setIs500Error,
        lastSyncTime,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
