import {
  Calendar,
  ChevronDown,
  Folder,
  Menu,
  MoreVertical,
  Plus,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

interface MobileProjectsProps {
  onSelectProject?: (id: string) => void;
}

export const MobileProjects: React.FC<MobileProjectsProps> = ({ onSelectProject }) => {
  const { projects, tasks, setSelectedProjectId, setIsNewProjectModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectStatus>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? true : p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-3.5 pb-8">
      {/* Mobile Header Bar matching M4 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Projects
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-600 dark:text-slate-300">
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by name..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-blue-600"
        />
      </div>

      {/* Filter Horizontal Scrollable Pills matching M4 */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeFilter === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All ({projects.length})
        </button>

        <button
          onClick={() => setActiveFilter('In Progress')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeFilter === 'In Progress'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          In Progress ({projects.filter((p) => p.status === 'In Progress').length})
        </button>

        <button
          onClick={() => setActiveFilter('Not Started')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
            activeFilter === 'Not Started'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Not Started
        </button>

        <button className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span>Due date</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Project Cards List matching M4 */}
      <div className="space-y-3 pt-1">
        {filteredProjects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const done = projTasks.filter((t) => t.status === 'Completed').length;
          const total = projTasks.length || 12;
          const pct = Math.round((done / total) * 100);

          return (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                if (onSelectProject) onSelectProject(proj.id);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    proj.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : proj.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {proj.status}
                </span>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(proj.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} -{' '}
                    {new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                  </span>
                  <MoreVertical className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {proj.name}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-500">
                  <span>Progress</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {done} of {total} tasks ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      proj.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[10px] text-slate-400 font-mono">
        Showing 1 to {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
};
