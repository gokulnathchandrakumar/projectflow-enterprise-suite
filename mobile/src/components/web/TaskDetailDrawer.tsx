import {
  AlertTriangle,
  AtSign,
  Bold,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FolderOpen,
  Link,
  MoreHorizontal,
  Paperclip,
  Send,
  Trash2,
  User as UserIcon,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const TaskDetailDrawer: React.FC = () => {
  const {
    selectedTask,
    setSelectedTask,
    toggleSubtask,
    addComment,
    moveTaskStatus,
    setTaskToDelete
  } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'comments' | 'system'>('all');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedTask) return null;

  const totalSubtasks = selectedTask.subtasks.length;
  const completedSubtasks = selectedTask.subtasks.filter((s) => s.completed).length;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const filteredLogs = selectedTask.activityLogs.filter((log) => {
    if (activeTab === 'comments') return log.type === 'comment';
    if (activeTab === 'system') return log.type === 'system';
    return true;
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedTask.id, commentText, user?.name || 'GOKULNATH', 'web');
    setCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isCompleted = selectedTask.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
              {selectedTask.code}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                selectedTask.priority === 'High'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                  : selectedTask.priority === 'Medium'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {selectedTask.priority} Priority
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {selectedTask.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Copy task link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link className="w-4 h-4" />}
            </button>
            <button
              onClick={() => alert(`Task ID: ${selectedTask.id}`)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {selectedTask.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTask.description || 'No detailed instructions provided.'}
            </p>
          </div>

          {/* Properties & Assignments Table */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Properties & Assignments
            </div>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {selectedTask.assignee.initials}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedTask.assignee.name}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Due Date</span>
                <div className="flex items-center gap-1.5">
                  {selectedTask.isOverdue && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  <span
                    className={`font-semibold font-mono ${
                      selectedTask.isOverdue
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                    {selectedTask.isOverdue && ' (Overdue)'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Priority</span>
                <span
                  className={`font-semibold ${
                    selectedTask.priority === 'High'
                      ? 'text-rose-600 dark:text-rose-400'
                      : selectedTask.priority === 'Medium'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {selectedTask.priority}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Status Column</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedTask.status}
                </span>
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                Subtasks ({completedSubtasks} of {totalSubtasks} completed)
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {subtaskPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${subtaskPercent}%` }}
              />
            </div>

            {/* Checkbox List */}
            <div className="space-y-2">
              {selectedTask.subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(selectedTask.id, st.id, 'web')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                  />
                  <span
                    className={`text-xs transition-colors ${
                      st.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900'
                    }`}
                  >
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Log & Audit Trail */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Activity Log & Audit Trail</span>
              </div>

              {/* Filter Tabs matching W9 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All {selectedTask.activityLogs.length}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeTab === 'comments'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Comments {selectedTask.activityLogs.filter((l) => l.type === 'comment').length}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('system')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeTab === 'system'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  System Audits {selectedTask.activityLogs.filter((l) => l.type === 'system').length}
                </button>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mb-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-600 bg-white dark:bg-slate-800">
                <div className="flex items-start gap-2.5 p-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    AM
                  </div>
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment or mention @team with updates..."
                    className="w-full text-xs outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                  />
                </div>
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400">
                    <button type="button" className="p-1 hover:text-slate-600 rounded">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-slate-600 rounded">
                      <Link className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-slate-600 rounded">
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-slate-600 rounded">
                      <AtSign className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <span>Post</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>

            {/* List of activity items */}
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-white font-bold text-[9px] flex items-center justify-center ${
                          log.type === 'system' ? 'bg-slate-500' : 'bg-blue-600'
                        }`}
                      >
                        {log.authorInitials}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {log.author}
                      </span>
                      {log.authorRole && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {log.authorRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 pl-8 leading-relaxed">
                    {log.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => {
              setTaskToDelete(selectedTask);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() =>
                moveTaskStatus(selectedTask.id, isCompleted ? 'In Progress' : 'Completed', 'web')
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-slate-700 hover:bg-slate-800'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Reopen Task' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
