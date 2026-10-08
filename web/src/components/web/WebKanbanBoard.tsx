import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Plus,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';

interface WebKanbanBoardProps {
  tasks: Task[];
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'To Do', title: 'To Do / Backlog', color: 'bg-slate-400' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-600' },
  { id: 'In Review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'Completed', title: 'Done', color: 'bg-emerald-600' },
];

export const WebKanbanBoard: React.FC<WebKanbanBoardProps> = ({ tasks }) => {
  const { setSelectedTask, moveTaskStatus, setIsAddTaskModalOpen } = useApp();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, targetStatus, 'web');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-3.5 min-h-[500px] flex flex-col justify-between"
          >
            <div>
              {/* Column Header matching W5-kanban-variant */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {col.title}
                  </span>
                  <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3">
                {columnTasks.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onClick={() => setSelectedTask(t)}
                    className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                  >
                    {/* Priority badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t.priority === 'High' && <TrendingUp className="w-3 h-3 text-rose-600" />}
                        {t.priority === 'Medium' && <span className="font-bold text-amber-500">=</span>}
                        {t.priority === 'Low' && <TrendingDown className="w-3 h-3 text-slate-500" />}
                        <span>{t.priority}</span>
                      </span>

                      <span className="text-[10px] font-mono text-slate-400">{t.code}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {t.name}
                    </h4>

                    {t.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    {/* Card Footer: Due date & subtask / assignee */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 font-mono">
                        {t.isOverdue && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        <span
                          className={t.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'}
                        >
                          {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                          {t.isOverdue && ' (Overdue)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.subtasks.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                          </span>
                        )}
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                          {t.assignee.initials}
                        </div>
                      </div>
                    </div>

                    {/* Quick Move controls */}
                    <div className="mt-2 pt-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {COLUMNS.filter((c) => c.id !== t.status).map((targetCol) => (
                        <button
                          key={targetCol.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTaskStatus(t.id, targetCol.id, 'web');
                          }}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                          title={`Move to ${targetCol.title}`}
                        >
                          &rarr; {targetCol.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="mt-3 w-full py-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
