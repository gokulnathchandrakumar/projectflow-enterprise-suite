import {
  Calendar,
  ChevronDown,
  Download,
  Folder,
  LayoutGrid,
  List,
  MoreVertical,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

export const WebProjectsList: React.FC = () => {
  const {
    projects,
    tasks,
    setSelectedProjectId,
    setActiveWebPage,
    setIsNewProjectModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'name' | 'progress'>('dueDate');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'dueDate') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    return 0;
  });

  const pageSize = 6;
  const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;
  const pagedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Name,Status,Start Date,End Date,Owner']
        .concat(projects.map(p => `"${p.name}","${p.status}","${p.startDate}","${p.endDate}","${p.owner.name}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'projectflow_projects.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header matching W4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage company projects, monitor delivery velocity, and assign team owners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-blue-600"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="All">Status: All ({projects.length})</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="dueDate">Sort by: Due date (soonest)</option>
              <option value="name">Sort by: Name</option>
              <option value="progress">Sort by: Progress</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Grid / List switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-md ${
                viewLayout === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-md ${
                viewLayout === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid matching W4 */}
      {viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pagedProjects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const projDone = projTasks.filter((t) => t.status === 'Completed').length;
            const total = projTasks.length || (proj.status === 'Completed' ? 16 : proj.status === 'Not Started' ? 6 : 12);
            const done = proj.status === 'Completed' ? total : proj.status === 'Not Started' ? 0 : projDone;
            const pct = Math.round((done / total) * 100);

            return (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveWebPage('project-detail');
                }}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : proj.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(proj.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} -{' '}
                      {new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {done} of {total} tasks ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          proj.status === 'Completed' ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          {pagedProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                setActiveWebPage('project-detail');
              }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {proj.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-xl">
                  {proj.description}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-slate-500">
                <span>Due {new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                <span className="text-blue-600 font-semibold">{proj.lead}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State Banner preview matching W4 */}
      {pagedProjects.length === 0 && (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No results for this search
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Looking for archived or cross-department work? Adjust status filters or clear search keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
            className="mt-4 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Pagination Footer matching W4 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-mono">
          Showing 1 to {Math.min(pageSize, sortedProjects.length)} of {sortedProjects.length} projects
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            &lt; Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
