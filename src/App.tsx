import React, { useState } from 'react';
import { AddTaskModal } from './components/web/AddTaskModal';
import { DeleteTaskModal } from './components/web/DeleteTaskModal';
import { NewProjectModal } from './components/web/NewProjectModal';
import { TaskDetailDrawer } from './components/web/TaskDetailDrawer';
import { WebDashboard } from './components/web/WebDashboard';
import { WebDiagnostics } from './components/web/WebDiagnostics';
import { WebLayout } from './components/web/WebLayout';
import { WebLogin } from './components/web/WebLogin';
import { WebProjectDetail } from './components/web/WebProjectDetail';
import { WebProjectsList } from './components/web/WebProjectsList';
import { WebRegister } from './components/web/WebRegister';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const { activeWebPage } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'dark bg-slate-950 text-white' : 'light bg-slate-100 text-slate-900'
      } transition-colors flex flex-col font-sans`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {!isAuthenticated ? (
          authMode === 'login' ? (
            <WebLogin onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <WebRegister onSwitchToLogin={() => setAuthMode('login')} />
          )
        ) : (
          <WebLayout>
            {activeWebPage === 'dashboard' && <WebDashboard />}
            {activeWebPage === 'projects' && <WebProjectsList />}
            {activeWebPage === 'project-detail' && <WebProjectDetail />}
            {activeWebPage === 'tasks' && <WebProjectDetail />}
            {activeWebPage === 'edge-states' && <WebDiagnostics />}
          </WebLayout>
        )}
      </div>

      {/* Shared Enterprise Modals and Drawers */}
      <NewProjectModal />
      <AddTaskModal />
      <DeleteTaskModal />
      <TaskDetailDrawer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
