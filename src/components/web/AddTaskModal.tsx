import {
  Calendar,
  ChevronDown,
  Loader2,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';

export const AddTaskModal: React.FC = () => {
  const { isAddTaskModalOpen, setIsAddTaskModalOpen, activeProject, addTask } = useApp();

  const [name, setName] = useState('Prepare production deployment checklist');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [status, setStatus] = useState<TaskStatus>('In Progress');
  const [dueDate, setDueDate] = useState('2024-10-31');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAddTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    addTask(
      {
        name,
        description,
        priority,
        status,
        dueDate,
        projectId: activeProject?.id || 'proj-1',
      },
      'web'
    );

    setIsSaving(false);
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Add task
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create a new deliverable within {activeProject?.name || 'Website Redesign'}
            </p>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Task name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prepare production deployment checklist"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide instructions, links, or context for the assignee..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('Low')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'Low'
                    ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Low</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Medium')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'Medium'
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="font-bold text-amber-500">=</span>
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('High')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  priority === 'High'
                    ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-400/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                <span>High</span>
              </button>
            </div>
          </div>

          {/* Status & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Assignee card */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assignee
            </label>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  GC
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">GOKULNATH</div>
                  <div className="text-[11px] text-slate-400">Gokulnathchandrakumar@gmail.com</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-[11px] font-medium">
                Assigned
              </span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
