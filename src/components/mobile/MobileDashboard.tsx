import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Folder,
  LayoutGrid,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  RefreshCw,
  Sun,
  TrendingUp,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';

export const MobileDashboard: React.FC = () => {
  const {
    projects,
    tasks,
    setActiveMobileTab,
    setSelectedProjectId,
    syncWarningVisible,
    dismissSyncWarning,
    retrySync,
    queuedSyncCount,
    setIsAddTaskModalOpen,
  } = useApp();
  const { user } = useAuth();
  const { isDark, setThemeMode } = useTheme();

  const [quarterDropdown, setQuarterDropdown] = useState('This Quarter');
  const rangeMap: Record<string, 'this_week' | 'this_month' | 'this_quarter'> = {
    'This Week': 'this_week',
    'This Month': 'this_month',
    'This Quarter': 'this_quarter',
  };
  const apiRange = rangeMap[quarterDropdown] || 'this_quarter';
  const { data: apiData } = useDashboardSummary(apiRange);

  const totalProjects = apiData?.totalProjects ?? projects.length;
  const totalTasks = apiData?.totalTasks ?? tasks.length;
  const completedTasks = apiData?.completedTasks ?? tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = apiData?.inProgressTasks ?? tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = apiData?.pendingTasks ?? tasks.filter((t) => t.status === 'To Do' || t.status === 'In Review').length;
  const completionRate = apiData?.completionRate ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  const urgentTasks = apiData?.urgentTasks ?? 0;
  const dueThisWeek = apiData?.dueThisWeek ?? 0;

  const completedPct = apiData?.completedPct ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  const inProgressPct = apiData?.inProgressPct ?? (totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0);
  const pendingPct = apiData?.pendingPct ?? (totalTasks > 0 ? Math.max(0, 100 - completedPct - inProgressPct) : 0);

  const activeProjects = apiData?.activeProjects || projects.slice(0, 3).map((p, idx) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    status: p.status,
    startDate: '',
    endDate: 'Oct 28',
    totalTasks: 4,
    completedTasks: 2,
    progressPct: idx === 0 ? 75 : idx === 1 ? 42 : 90,
  }));

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Mobile Header Bar matching M3 */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <div className="flex items-center gap-2.5">
          <button className="p-1 text-slate-700 dark:text-slate-200">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-blue-600 tracking-tight">
            ProjectFlow
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-600 dark:text-slate-300 relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1"></span>
          </button>
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
            {user?.avatarInitials || 'GC'}
          </div>
        </div>
      </div>

      {/* Greeting and Quarter Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            Good morning, {user?.name || 'GOKULNATH'}
          </h2>
          <p className="text-[11px] text-slate-400">
            Overview of your team's workload
          </p>
        </div>

        <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[11px] font-semibold">
          <span>This Quarter</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Sync Warning Toast matching M3 */}
      {syncWarningVisible && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 truncate">
                Sync warning
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 truncate">
                Some task updates pending offline sync
              </div>
            </div>
          </div>
          <button
            onClick={retrySync}
            className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* System Metrics 2x2 Grid matching M3 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">System Metrics</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">View breakdown</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px]">Projects</span>
              <Folder className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{totalProjects}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+2 this mo</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px]">Tasks</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{totalTasks}</div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
              <Clock className="w-2.5 h-2.5" />
              <span>{dueThisWeek} due wk</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px]">Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{completedTasks}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              {completionRate}% rate
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px]">In Progress</span>
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{inProgressTasks}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">
              On schedule
            </div>
          </div>
        </div>

        {/* Pending tasks banner */}
        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs">
          <span className="text-rose-800 dark:text-rose-300 font-medium text-[11px]">
            Pending Tasks: {pendingTasks} total
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200 text-[10px] font-bold">
            {urgentTasks} urgent
          </span>
        </div>
      </div>

      {/* Task Status Distribution Donut Card matching M3 */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Task Status Distribution
          </h3>
          <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Mini Donut */}
        <div className="relative flex items-center justify-center py-2">
          {(() => {
            const circumference = 2 * Math.PI * 38;
            const completedLen = (completedPct / 100) * circumference;
            const inProgressLen = (inProgressPct / 100) * circumference;
            const pendingLen = (pendingPct / 100) * circumference;

            const inProgressRotation = -90 + (completedPct / 100) * 360;
            const pendingRotation = -90 + ((completedPct + inProgressPct) / 100) * 360;

            return (
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-100 dark:text-slate-700" />
                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#16A34A" strokeWidth="14"
                  strokeDasharray={`${completedLen} ${circumference - completedLen}`}
                  strokeDashoffset="0"
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#2563EB" strokeWidth="14"
                  strokeDasharray={`${inProgressLen} ${circumference - inProgressLen}`}
                  style={{ transformOrigin: 'center', transform: `rotate(${inProgressRotation}deg)` }}
                />
                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#F59E0B" strokeWidth="14"
                  strokeDasharray={`${pendingLen} ${circumference - pendingLen}`}
                  style={{ transformOrigin: 'center', transform: `rotate(${pendingRotation}deg)` }}
                />
              </svg>
            );
          })()}
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{totalTasks}</span>
            <span className="text-[10px] text-slate-400">Total Tasks</span>
          </div>
        </div>

        <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
            </span>
            <span className="font-mono text-slate-500">{completedTasks} &bull; {completedPct}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress
            </span>
            <span className="font-mono text-slate-500">{inProgressTasks} &bull; {inProgressPct}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending
            </span>
            <span className="font-mono text-slate-500">{pendingTasks} &bull; {pendingPct}%</span>
          </div>
        </div>
      </div>

      {/* Projects in Progress list matching M3 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Projects in progress</span>
          <button
            onClick={() => setActiveMobileTab('projects')}
            className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold"
          >
            See all ({totalProjects})
          </button>
        </div>

        <div className="space-y-2.5">
          {activeProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                setActiveMobileTab('projects');
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{proj.name}</h4>
                  <span className="text-[10px] text-slate-400">{proj.description || 'Active sprint deliverable'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-[10px] font-semibold">
                  In Progress
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden my-2">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${proj.progressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{proj.endDate ? new Date(proj.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Ongoing'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {proj.progressPct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
