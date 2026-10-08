import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Folder,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Mail,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Tv,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveWebPage } from '../../types';

interface WebLayoutProps {
  children: React.ReactNode;
}

// Sample notification data (could be fetched from API in future)
const NOTIFICATIONS = [
  { id: 'n1', type: 'task' as const, title: 'Task TASK-107 marked complete', desc: 'API Gateway Security Audit was completed by the team.', time: '5 min ago', read: false },
  { id: 'n2', type: 'comment' as const, title: 'New comment on TASK-104', desc: 'Sarah left a review comment on the deployment pipeline task.', time: '18 min ago', read: false },
  { id: 'n3', type: 'project' as const, title: 'Project milestone reached', desc: 'Cloud Infrastructure Migration hit 75% completion.', time: '1 hour ago', read: false },
  { id: 'n4', type: 'system' as const, title: 'System update scheduled', desc: 'Maintenance window planned for this weekend.', time: '3 hours ago', read: true },
  { id: 'n5', type: 'task' as const, title: 'Task TASK-109 overdue', desc: 'Performance optimization sprint item is past its due date.', time: '1 day ago', read: true },
];

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
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown="create"]')) setCreateDropdownOpen(false);
      if (!target.closest('[data-dropdown="notifications"]')) setNotificationPanelOpen(false);
      if (!target.closest('[data-dropdown="profile"]')) setProfileDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'comment': return <Mail className="w-4 h-4 text-blue-500" />;
      case 'project': return <Folder className="w-4 h-4 text-violet-500" />;
      case 'system': return <Settings className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

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
            {/* Notification Bell — fully interactive */}
            <div className="relative" data-dropdown="notifications">
              <button
                type="button"
                onClick={() => { setNotificationPanelOpen(!notificationPanelOpen); setProfileDropdownOpen(false); setCreateDropdownOpen(false); }}
                className={`p-2 rounded-xl relative transition-colors ${
                  notificationPanelOpen
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900 text-[9px] text-white font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationPanelOpen && (
                <div className="absolute right-0 mt-1.5 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-30 animate-in fade-in zoom-in-95 overflow-hidden">
                  {/* Panel Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors group ${
                            n.read
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                              : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs leading-snug ${n.read ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-900 dark:text-white font-semibold'}`}>
                                {n.title}
                              </p>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                                className="p-0.5 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{n.desc}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1"></span>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Panel Footer */}
                  <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                    <button
                      onClick={() => { setNotificationPanelOpen(false); setActiveWebPage('edge-states'); }}
                      className="w-full text-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
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
            <div className="relative" data-dropdown="create">
              <button
                type="button"
                onClick={() => { setCreateDropdownOpen(!createDropdownOpen); setNotificationPanelOpen(false); setProfileDropdownOpen(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
                <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${createDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {createDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs z-30 animate-in fade-in zoom-in-95"
                >
                  <button
                    onClick={() => { setIsNewProjectModalOpen(true); setCreateDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Folder className="w-3.5 h-3.5 text-blue-500" />
                    <span>New Project</span>
                  </button>
                  <button
                    onClick={() => { setIsAddTaskModalOpen(true); setCreateDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>New Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar / Profile Dropdown — fully interactive */}
            <div className="relative" data-dropdown="profile">
              <button
                type="button"
                onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationPanelOpen(false); setCreateDropdownOpen(false); }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  profileDropdownOpen
                    ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                title="Profile"
              >
                {user?.avatarInitials || 'GC'}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-30 animate-in fade-in zoom-in-95 overflow-hidden">
                  {/* Profile Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                        {user?.avatarInitials || 'GC'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold truncate">{user?.name || 'GOKULNATH'}</div>
                        <div className="text-[11px] text-blue-200 truncate">{user?.email || 'Gokulnathchandrakumar@gmail.com'}</div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-semibold">{user?.role || 'Staff Product Engineer'}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-[10px] font-semibold text-emerald-100">{user?.tier || 'Enterprise Pro'}</span>
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  <div className="py-1.5">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); setActiveWebPage('edge-states'); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); setActiveWebPage('edge-states'); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); setActiveWebPage('edge-states'); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
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

