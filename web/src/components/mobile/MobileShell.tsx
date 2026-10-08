import {
  Battery,
  CheckCircle2,
  Folder,
  LayoutGrid,
  Signal,
  User,
  Wifi
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MobileDashboard } from './MobileDashboard';
import { MobileEdgeDiagnostics } from './MobileEdgeDiagnostics';
import { MobileLogin } from './MobileLogin';
import { MobileProfileSettings } from './MobileProfileSettings';
import { MobileProjectDetail } from './MobileProjectDetail';
import { MobileProjects } from './MobileProjects';
import { MobileRegister } from './MobileRegister';
import { MobileTasks } from './MobileTasks';

interface MobileShellProps {
  isFramed?: boolean;
}

export const MobileShell: React.FC<MobileShellProps> = ({ isFramed = false }) => {
  const { isAuthenticated } = useAuth();
  const {
    activeMobileTab,
    setActiveMobileTab,
    tasks,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedMobileProjectId, setSelectedMobileProjectId] = useState<string | null>(null);

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none">
      {/* iOS / Touch Native Status Bar */}
      <div className="h-11 px-6 pt-2 flex items-center justify-between text-xs font-semibold shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 z-20">
        <span className="font-mono text-[11px] tracking-tight">9:41</span>
        {/* Dynamic Island Pill */}
        <div className="w-20 h-4 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center gap-1.5 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[8px] font-mono text-slate-300">PF Live</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Main Scrollable View Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!isAuthenticated ? (
          authMode === 'login' ? (
            <MobileLogin onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <MobileRegister onSwitchToLogin={() => setAuthMode('login')} />
          )
        ) : (
          <>
            {activeMobileTab === 'dashboard' && <MobileDashboard />}
            {activeMobileTab === 'projects' && (
              selectedMobileProjectId ? (
                <MobileProjectDetail onBack={() => setSelectedMobileProjectId(null)} />
              ) : (
                <MobileProjects onSelectProject={(id) => setSelectedMobileProjectId(id)} />
              )
            )}
            {activeMobileTab === 'tasks' && <MobileTasks />}
            {activeMobileTab === 'profile' && <MobileProfileSettings />}
            {activeMobileTab === 'diagnostics' && (
              <MobileEdgeDiagnostics
                onBack={() => setActiveMobileTab('profile')}
                onLoginAgain={() => setActiveMobileTab('dashboard')}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Touch Navigation Bar matching M2-M6 */}
      {isAuthenticated && (
        <div className="h-16 px-4 border-t border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg flex items-center justify-around shrink-0 z-20">
          <button
            onClick={() => {
              setActiveMobileTab('dashboard');
              setSelectedMobileProjectId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeMobileTab === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveMobileTab('projects');
              setSelectedMobileProjectId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeMobileTab === 'projects'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <Folder className="w-5 h-5" />
            <span className="text-[10px]">Projects</span>
          </button>

          <button
            onClick={() => {
              setActiveMobileTab('tasks');
              setSelectedMobileProjectId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              activeMobileTab === 'tasks'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <CheckCircle2 className="w-5 h-5" />
              {pendingTasksCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center absolute -top-1.5 -right-2 ring-2 ring-white dark:ring-slate-900">
                  {pendingTasksCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Tasks</span>
          </button>

          <button
            onClick={() => {
              setActiveMobileTab('profile');
              setSelectedMobileProjectId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeMobileTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      )}

      {/* Home Indicator Bar */}
      <div className="h-4 pb-1.5 flex items-center justify-center bg-white dark:bg-slate-900 shrink-0">
        <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
      </div>
    </div>
  );

  if (isFramed) {
    return (
      <div className="w-[390px] h-[810px] max-h-[92vh] rounded-[48px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-700 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden relative">
        <div className="w-full h-full rounded-[38px] overflow-hidden flex flex-col bg-white dark:bg-slate-900">
          {content}
        </div>
      </div>
    );
  }

  return <div className="h-screen w-full flex flex-col">{content}</div>;
};
