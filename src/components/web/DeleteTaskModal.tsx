import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DeleteTaskModal: React.FC = () => {
  const { taskToDelete, setTaskToDelete, deleteTask } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!taskToDelete) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 250));
    deleteTask(taskToDelete.id, 'web');
    setIsDeleting(false);
    setTaskToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-150">
        {/* Warning Icon with soft red circle */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto mb-4 text-rose-600">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Delete this task?
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-left">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{taskToDelete.name}"</span>?
          This action cannot be undone and all associated task history and comments will be permanently removed.
        </p>

        {/* Informational Callout */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left flex items-start gap-2.5 mb-5 text-[11px] text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            3 dependencies and 14 team activity logs tied to this item will be archived.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTaskToDelete(null)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
