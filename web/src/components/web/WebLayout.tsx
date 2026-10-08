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
  Tv,
  User,
  X,
  Check
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const notifications = [
    { id: '1', title: 'Sprint 03 deadline updated', desc: 'Website Redesign deliverables moved to Oct 31', time: '10m ago', unread: true },
    { id: '2', title: 'Security review sign-off', desc: 'Marcus Vance marked SOC2 audit task as ready', time: '1h ago', unread: true },
    { id: '3', title: 'New comments on Compliance Audit', desc: 'Elena Rossi added 2 attachments to legacy log', time: '3h ago', unread: false },
  ];

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
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity"
              title="View Profile"
            >
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
            </button>
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
            {/* Notification Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900"></span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-xs z-30 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">Notifications</div>
                      <button
                        onClick={() => setHasUnread(false)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                            {hasUnread && n.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

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
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-blue-400 transition-all"
              title="User Profile"
            >
              {user?.avatarInitials || 'GC'}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Profile Dialog Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="font-bold text-base">User Profile & Account</div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                {user?.avatarInitials || 'GC'}
              </div>
              <div>
                <div className="font-bold text-base flex items-center gap-2">
                  <span>{user?.name || 'GOKULNATH'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    Enterprise Pro
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user?.email || 'Gokulnathchandrakumar@gmail.com'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium">
                  Senior Product Lead • ProjectFlow Enterprise Suite
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Organization</span>
                <span className="font-semibold">ProjectFlow Internal</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Security / 2FA</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Hardware Key & SSO
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setProfileModalOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
