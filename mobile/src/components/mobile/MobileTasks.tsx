import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  Kanban,
  List,
  Plus,
  Search,
  Tag
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';

export const MobileTasks: React.FC = () => {
  const {
    tasks,
    projects,
    setSelectedTask,
    setIsAddTaskModalOpen,
    moveTaskStatus,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'All' ? true : t.status === activeFilter;
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statuses: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Completed'];

  return (
    <div className="p-4 space-y-4 pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Task Execution
          </h2>
          <p className="text-[11px] text-slate-400">
            {tasks.filter((t) => t.status === 'Completed').length} of {tasks.length} deliverables completed
          </p>
        </div>

        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by code, title, or tag..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-blue-600"
        />
      </div>

      {/* Horizontal Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeFilter === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All ({tasks.length})
        </button>
        {statuses.map((st) => {
          const count = tasks.filter((t) => t.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* List vs Kanban Toggle */}
      <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'list'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>List View</span>
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'kanban'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Kanban Columns</span>
        </button>
      </div>

      {/* Tasks List */}
      {viewMode === 'list' ? (
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No tasks match current filter
              </div>
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isCompleted = t.status === 'Completed';
              const project = projects.find((p) => p.id === t.projectId);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => {
                        e.stopPropagation();
                        moveTaskStatus(t.id, isCompleted ? 'In Progress' : 'Completed', 'mobile');
                      }}
                      className="w-4 h-4 rounded text-blue-600 mt-0.5 cursor-pointer accent-blue-600"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                          {t.code}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            t.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : t.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t.name}
                      </h4>

                      {project && (
                        <div className="text-[10px] text-slate-400 mt-1 truncate">
                          📁 {project.name}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              t.status === 'Completed'
                                ? 'bg-emerald-500'
                                : t.status === 'In Progress'
                                ? 'bg-blue-500'
                                : t.status === 'In Review'
                                ? 'bg-purple-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span>{t.status}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{t.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Mobile Kanban Board */
        <div className="space-y-4">
          {statuses.map((st) => {
            const columnTasks = tasks.filter((t) => t.status === st);
            return (
              <div
                key={st}
                className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {st}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {t.code}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                            t.priority === 'High'
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                        {t.name}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
