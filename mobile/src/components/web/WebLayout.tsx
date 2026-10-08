import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Folder,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Tv
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveWebPage } from '../../types';

interface WebLayoutProps {
  children: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const {
    activeWebPage,
    setActiveWebPage,
    setIsNewProjectModalOpen,
    setIsAddTaskModalOpen,
    globalSearch,
    setGlobalSearch
  } = useApp();
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
        <div>
          {/* Logo & Brand Lockup */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                ProjectFlow
              </div>
              <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                Enterprise Suite
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveWebPage('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeWebPage === 'dashboard'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveWebPage('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeWebPage === 'projects' || activeWebPage === 'project-detail'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveWebPage('tasks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeWebPage === 'tasks'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Tasks</span>
            </button>

            <button
              onClick={() => setActiveWebPage('edge-states')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeWebPage === 'edge-states'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Edge States & Diagnostics</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Appearance, Settings & User Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Theme Mode Segmented Controller matching W3-dashboard */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 px-1 tracking-wider">
              Appearance
            </div>
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('system')}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tv className="w-3 h-3 text-slate-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setActiveWebPage('edge-states')}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          {/* User Account Lockup */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.avatarInitials || 'GC'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'GOKULNATH'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'Gokulnathchandrakumar@gmail.com'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          {/* Search Box */}
          <div className="relative w-80 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search projects, tasks, or teammates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Right Header Utility Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWebPage('edge-states')}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Help & Documentation"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Create New CTA */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {createDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs z-30 animate-in fade-in zoom-in-95"
                  onClick={() => setCreateDropdownOpen(false)}
                >
                  <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Folder className="w-3.5 h-3.5 text-blue-500" />
                    <span>New Project</span>
                  </button>
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>New Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
              {user?.avatarInitials || 'GC'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
