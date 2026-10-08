import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Flag,
  Folder
} from 'lucide-react';
import React, { useState } from 'react';
import { Project, Task } from '../../types';

interface WebCalendarViewProps {
  tasks: Task[];
  project?: Project;
  onSelectTask?: (task: Task) => void;
}

export const WebCalendarView: React.FC<WebCalendarViewProps> = ({
  tasks,
  project,
  onSelectTask
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // Default Oct 2024 to match seed data
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2024-10-18');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const pad = (n: number) => String(n).padStart(2, '0');
    setSelectedDateStr(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const pad = (n: number) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${pad(m)}-${pad(d)}` });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const pad = (n: number) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: true, dateStr: `${year}-${pad(month + 1)}-${pad(d)}` });
  }

  // Next month leading days to complete full grid (multiple of 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    const pad = (n: number) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${pad(m)}-${pad(d)}` });
  }

  // Map tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const key = t.dueDate.split('T')[0];
    if (!tasksByDate[key]) tasksByDate[key] = [];
    tasksByDate[key].push(t);
  });

  // Selected date tasks
  const selectedDateTasks = tasksByDate[selectedDateStr] || [];

  // Check if project deadline falls on this date
  const isProjectDeadline = project?.endDate && project.endDate.split('T')[0] === selectedDateStr;

  const todayStr = (() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid Container */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        {/* Calendar Header with Navigation */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{monthName}</h3>
              <p className="text-[11px] text-slate-400">Project and task deliverable deadlines</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              Today
            </button>
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>

        {/* Date Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((cell) => {
            const dateTasks = tasksByDate[cell.dateStr] || [];
            const hasTasks = dateTasks.length > 0;
            const hasOverdue = dateTasks.some((t) => t.status !== 'Completed' && new Date(t.dueDate) < new Date());
            const hasCompleted = dateTasks.some((t) => t.status === 'Completed');
            const isSelected = selectedDateStr === cell.dateStr;
            const isToday = todayStr === cell.dateStr;
            const isProjDue = project?.endDate && project.endDate.split('T')[0] === cell.dateStr;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[64px] p-1.5 rounded-xl text-left border flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs ring-1 ring-blue-600'
                    : isToday
                    ? 'border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900'
                    : cell.isCurrentMonth
                    ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'border-transparent bg-slate-50/50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : isToday
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : cell.isCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {isProjDue && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Project Deadline" />
                  )}
                </div>

                {/* Deadlines indicators in cell */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {hasTasks && (
                    <div className="flex items-center gap-0.5">
                      {hasOverdue && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Overdue Task" />
                      )}
                      {!hasOverdue && !hasCompleted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Upcoming Task" />
                      )}
                      {hasCompleted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Completed Task" />
                      )}
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        {dateTasks.length > 1 ? `+${dateTasks.length}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Overdue Deadline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Upcoming Deliverable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Project Target</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Selected Date
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h4>
            </div>
            <div className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          {/* Project Target Alert if applicable */}
          {isProjectDeadline && project && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 mb-3 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
                <Folder className="w-3.5 h-3.5" />
                <span>Project Target Milestone</span>
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
                {project.name} scheduled for delivery
              </div>
            </div>
          )}

          {/* Tasks List for Date */}
          {selectedDateTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">No deliverables scheduled for this date</p>
              <p className="text-[11px] mt-0.5">Select highlighted dates to view scheduled milestones.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {selectedDateTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask?.(t)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-snug">
                      {t.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        t.priority === 'High'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                          : t.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {t.priority}
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {t.status}
                    </span>

                    <span className="text-slate-400 ml-auto font-mono">
                      {t.dueDate ? t.dueDate.split('T')[0] : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom context notice */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Synced with deliverable dates</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">ProjectFlow Deadlines</span>
        </div>
      </div>
    </div>
  );
};
