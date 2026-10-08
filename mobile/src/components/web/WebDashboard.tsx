import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Folder,
  Moon,
  MoreVertical,
  PieChart,
  RefreshCw,
  Sun,
  TrendingUp,
  Tv,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const WebDashboard: React.FC = () => {
  const {
    projects,
    tasks,
    setActiveWebPage,
    setSelectedProjectId,
    setSelectedTask,
    syncWarningVisible,
    dismissSyncWarning,
    retrySync,
    queuedSyncCount,
  } = useApp();
  const { user } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();

  const [quarterDropdown, setQuarterDropdown] = useState('This Quarter');
  const [taskFilter, setTaskFilter] = useState<'all' | 'assigned'>('all');

  // Compute live stats
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'To Do' || t.status === 'In Review').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Active projects for progress display
  const activeProjects = projects.filter((p) => p.status === 'In Progress').slice(0, 4);

  // Filtered upcoming tasks
  const upcomingTasks = tasks
    .filter((t) => {
      if (taskFilter === 'assigned') {
        const query = (user?.name || 'GOKULNATH').toLowerCase();
        return t.assignee.name.toLowerCase().includes(query) || t.assignee.name.toLowerCase().includes('gokul');
      }
      return true;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Good morning, {user?.name || 'GOKULNATH'}. Here is an overview of your team's workload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Appearance Toggle matching W3-dashboard-light-with-theme-toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                themeMode === 'light'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Light Appearance"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                themeMode === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dark Appearance"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('system')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="System Appearance"
            >
              <Tv className="w-3.5 h-3.5 text-slate-400" />
              <span>System</span>
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{quarterDropdown}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sync Warning Banner matching W3-dashboard */}
      {syncWarningVisible && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Sync warning: Some task updates pending offline sync
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5">
                {queuedSyncCount} changes staged locally on your machine will propagate when verified.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={retrySync}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={dismissSyncWarning}
              className="p-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-900 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5 Metric Summary Cards matching W3 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Projects */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Projects</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Folder className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {totalProjects}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2 this month</span>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {totalTasks}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>14 due this week</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Tasks</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {completedTasks}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>{completionRate}% completion rate</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Tasks</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {pendingTasks}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
            <span className="font-bold">!</span>
            <span>5 urgent</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {inProgressTasks}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
            <span>&bull;</span>
            <span>on schedule</span>
          </div>
        </div>
      </div>

      {/* Two Middle Feature Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task status breakdown Donut Chart Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Task status breakdown
              </h3>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Distribution across all active sprints
            </p>

            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center py-4">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="14"
                  className="text-slate-100 dark:text-slate-800"
                />
                {/* Completed Slice (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#16A34A"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="124.15" // 48%
                  className="transition-all duration-500"
                />
                {/* In Progress Slice (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563EB"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="188.62" // 21%
                  style={{ transformOrigin: 'center', transform: 'rotate(172.8deg)' }}
                  className="transition-all duration-500"
                />
                {/* Pending Slice (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="164.74" // 31%
                  style={{ transformOrigin: 'center', transform: 'rotate(248.4deg)' }}
                  className="transition-all duration-500"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {totalTasks}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Total Tasks
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-900 dark:text-white font-semibold">{completedTasks} tasks</span>
                  <span className="text-slate-400 w-8 text-right">48%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-900 dark:text-white font-semibold">{inProgressTasks} tasks</span>
                  <span className="text-slate-400 w-8 text-right">21%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Pending</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-900 dark:text-white font-semibold">{pendingTasks} tasks</span>
                  <span className="text-slate-400 w-8 text-right">31%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveWebPage('tasks')}
            className="mt-6 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
          >
            <span>View full analytics report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Projects in progress Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Projects in progress
              </h3>
              <button
                onClick={() => setActiveWebPage('projects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Live tracking of ongoing departmental milestones
            </p>

            {/* Project List with Progress Bars */}
            <div className="space-y-4">
              {activeProjects.map((proj, idx) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const projDone = projTasks.filter((t) => t.status === 'Completed').length;
                const total = projTasks.length || 10;
                const pct = Math.round((projDone / total) * 100);

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveWebPage('project-detail');
                    }}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {proj.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[10px] font-medium">
                          In Progress
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Due {new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{projDone}/{total} tasks done</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing 4 of {activeProjects.length} active items
            </span>
            <button
              onClick={() => setActiveWebPage('projects')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 text-xs transition-colors"
            >
              Manage Workstreams
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Due Tasks Section matching W3-dashboard-overlap-variant */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming due tasks
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized deliverables needing direct or cross-functional action
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                taskFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Tasks ({totalTasks})
            </button>
            <button
              onClick={() => setTaskFilter('assigned')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                taskFilter === 'assigned'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Assigned to {user?.name.split(' ')[0] || 'GOKULNATH'}
            </button>
          </div>
        </div>

        {/* Task rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {upcomingTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTask(t)}
              className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  {t.code}
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                  {t.name}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    t.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : t.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {t.priority}
                </span>

                <span
                  className={`text-[11px] font-mono ${
                    t.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {t.isOverdue && '! '}
                  {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </span>

                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                  {t.assignee.initials}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
