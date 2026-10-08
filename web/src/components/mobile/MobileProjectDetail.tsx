import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Filter,
  Kanban,
  List,
  MoreVertical,
  Plus,
  Search,
  User as UserIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskStatus } from '../../types';

interface MobileProjectDetailProps {
  onBack: () => void;
}

export const MobileProjectDetail: React.FC<MobileProjectDetailProps> = ({ onBack }) => {
  const {
    activeProject,
    tasks,
    setSelectedTask,
    setIsAddTaskModalOpen,
    moveTaskStatus,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeKanbanCol, setActiveKanbanCol] = useState<TaskStatus>('In Progress');
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeProject) return null;

  const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);
  const completed = projectTasks.filter((t) => t.status === 'Completed').length;
  const total = projectTasks.length || 12;
  const pct = Math.round((completed / total) * 100);

  const filteredTasks = projectTasks.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Top Header Bar matching M5 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Projects</span>
        </button>

        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
          {activeProject.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <button className="p-1 text-slate-500 hover:text-slate-800">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 text-slate-500 hover:text-slate-800">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Card Header matching M5 */}
      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-[10px] font-semibold">
            {activeProject.status}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Q4 Strategic</span>
        </div>

        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          {activeProject.name}
        </h2>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {activeProject.description}
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center justify-between">
            <span>Due {new Date(activeProject.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} (in 14 days)</span>
          </div>
          <div>
            <span>Owner: {activeProject.owner.name}</span>
          </div>
        </div>

        {/* Progress summary */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-500">
            <span>Progress</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {completed} of {total} completed ({pct}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Tasks Section Header with Add Task */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tasks</h3>
          <span className="text-xs text-slate-400 font-mono">({projectTasks.length})</span>
        </div>

        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add task</span>
        </button>
      </div>

      {/* View Switcher: List View vs Kanban Board matching M5-kanban-variant */}
      <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'kanban'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Kanban Board</span>
        </button>
      </div>

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="space-y-2.5">
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => {
                      e.stopPropagation();
                      moveTaskStatus(t.id, isCompleted ? 'In Progress' : 'Completed', 'mobile');
                    }}
                    className="w-4 h-4 rounded text-blue-600 mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-semibold leading-tight ${
                        isCompleted
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {t.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.priority}
                      </span>

                      <span
                        className={`text-[10px] font-mono flex items-center gap-1 ${
                          t.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {t.isOverdue && <AlertTriangle className="w-3 h-3" />}
                        <span>
                          {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                          {t.isOverdue && ' (Overdue)'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(t);
                    }}
                    className="p-1 text-slate-400"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Kanban Board View for Mobile matching M5-kanban-variant */
        <div className="space-y-3">
          {/* Column filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['To Do', 'In Progress', 'In Review'] as TaskStatus[]).map((col) => (
              <button
                key={col}
                onClick={() => setActiveKanbanCol(col)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  activeKanbanCol === col
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {col} ({projectTasks.filter((t) => t.status === col).length})
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeKanbanCol} ({projectTasks.filter((t) => t.status === activeKanbanCol).length} tasks)
            </span>
            <span>Swipe or tap to edit</span>
          </div>

          <div className="space-y-2.5">
            {projectTasks
              .filter((t) => t.status === activeKanbanCol)
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-blue-400 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{t.code}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-400">
                      {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                      {t.assignee.initials}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
