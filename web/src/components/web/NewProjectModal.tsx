import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, addProject } = useApp();

  const [name, setName] = useState('Global Payment Gateway Expansion');
  const [description, setDescription] = useState(
    'Architecting multi-currency payment rails, Stripe Connect integration, and automated tax calculation for EMEA regions.'
  );
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-10-15'); // Intentionally set to trigger validation as in screenshot!
  const [isSaving, setIsSaving] = useState(false);

  if (!isNewProjectModalOpen) return null;

  // Validation: End date cannot be before start date
  const isDateInvalid = startDate && endDate && new Date(endDate) < new Date(startDate);
  const isFormValid = name.trim().length > 0 && !isDateInvalid;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDateInvalid) return;

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 350));

    addProject({
      name,
      description,
      status,
      startDate,
      endDate,
    }, 'web');

    setIsSaving(false);
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              New project
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure project details, timeframe, and initial delivery status
            </p>
          </div>
          <button
            onClick={() => setIsNewProjectModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Project name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Global Payment Gateway Expansion"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-500"
              required
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Keep project names concise and recognizable across departments.
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <span className="text-[11px] text-slate-400">Optional summary</span>
            </div>
            <textarea
              rows={3}
              value={description}
              maxLength={2000}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, architectural scope, and squad goals..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 resize-none"
            />
            <div className="text-right text-[11px] text-slate-400 mt-1 font-mono">
              {description.length} / 2000
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Initial Status
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['In Progress', 'Not Started', 'Completed'] as ProjectStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    status === st
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st === 'Completed'
                        ? 'bg-emerald-500'
                        : st === 'In Progress'
                        ? 'bg-blue-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Pickers with Validation Warning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-semibold ${
                    isDateInvalid ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  End date
                </label>
                {isDateInvalid && (
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                    Invalid
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2 rounded-xl border text-xs font-mono outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    isDateInvalid
                      ? 'border-red-500 dark:border-red-500 text-red-700 dark:text-red-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-blue-600'
                  }`}
                />
                <AlertCircle
                  className={`w-4 h-4 absolute right-3 top-2.5 pointer-events-none ${
                    isDateInvalid ? 'text-red-500' : 'text-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Validation Alert matching screenshot */}
          {isDateInvalid && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>
                End date cannot be before start date (Start:{' '}
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}).
              </span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Draft autosaved 2m ago</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving project...</span>
                  </>
                ) : (
                  <span>Save project</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
