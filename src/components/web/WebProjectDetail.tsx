import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Filter,
  Kanban,
  MoreVertical,
  Plus,
  Search,
  Table,
  Trash2,
  User as UserIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';
import { WebKanbanBoard } from './WebKanbanBoard';

export const WebProjectDetail: React.FC = () => {
  const {
    activeProject,
    tasks,
    setActiveWebPage,
    setIsAddTaskModalOpen,
    setSelectedTask,
    moveTaskStatus,
    setTaskToDelete,
    deleteProject
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  if (!activeProject) {
    return (
      <div className="p-8 text-center text-slate-500">
        Project not found.{' '}
        <button
          onClick={() => setActiveWebPage('projects')}
          className="text-blue-600 underline font-semibold"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);

  const completedCount = projectTasks.filter((t) => t.status === 'Completed').length;
  const totalCount = projectTasks.length || 12;
  const percentDone = Math.round((completedCount / totalCount) * 100);

  const filteredTasks = projectTasks.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDeleteProject = () => {
    if (confirm(`Are you sure you want to delete project "${activeProject.name}" and all its tasks?`)) {
      deleteProject(activeProject.id, 'web');
      setActiveWebPage('projects');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs matching W5 */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setActiveWebPage('projects')}
          className="hover:text-blue-600 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          {activeProject.name}
        </span>
      </div>

      {/* Project Header Banner Card matching W5 */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeProject.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>{activeProject.status}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed pt-1">
              {activeProject.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => alert(`Edit Project details for: ${activeProject.name}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 4 Metadata Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Start Date</span>
            <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
              {new Date(activeProject.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">End Date</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(activeProject.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
              <span className="text-[10px] text-amber-600 font-sans font-medium">(in 14 days)</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Created</span>
            <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
              {new Date(activeProject.createdDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">Owner</span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                {activeProject.owner.initials}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {activeProject.owner.name}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Summary Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="font-medium text-slate-600 dark:text-slate-400">Progress Summary</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {completedCount} of {totalCount} completed ({percentDone}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${percentDone}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks Section Header matching W5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tasks
          </h2>
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
            {projectTasks.length}
          </span>
        </div>

        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add task</span>
        </button>
      </div>

      {/* Task Filters & Table / Kanban Toggle Bar */}
      <div className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Status & Priority dropdowns */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Table vs Kanban Toggle Button */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Switch: Table View or Kanban View */}
      {viewMode === 'kanban' ? (
        <WebKanbanBoard tasks={filteredTasks} />
      ) : (
        /* Tasks Table matching W5 */
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTasks.map((t) => {
                const isCompleted = t.status === 'Completed';

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() =>
                          moveTaskStatus(t.id, isCompleted ? 'In Progress' : 'Completed', 'web')
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                    </td>

                    {/* Task Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 group-hover:text-blue-600 transition-colors">
                          {t.code}
                        </span>
                        <span
                          className={`font-medium ${
                            isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors'
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>
                    </td>

                    {/* Priority badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {t.priority === 'High' && '^'}
                        {t.priority === 'Medium' && '='}
                        {t.priority === 'Low' && 'v'}
                        <span>{t.priority}</span>
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          t.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : t.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : t.status === 'In Review'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`flex items-center gap-1.5 ${
                          t.isOverdue
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {t.isOverdue && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                        <span>
                          {new Date(t.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                        {t.isOverdue && <span>(Overdue)</span>}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedTask(t)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
