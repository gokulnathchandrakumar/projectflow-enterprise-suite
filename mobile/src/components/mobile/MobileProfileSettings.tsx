import {
  Bell,
  ChevronRight,
  Database,
  Edit2,
  Globe,
  Lock,
  LogOut,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Tv
} from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const MobileProfileSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { queuedSyncCount } = useApp();

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Top Header Bar matching M6 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Profile & Settings
        </h2>

        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-500 hover:text-slate-800">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-500 hover:text-slate-800">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Profile Card matching M6 */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
              {user?.avatarInitials || 'GC'}
            </div>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute bottom-0 right-0"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || 'GOKULNATH'}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                Lead
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Senior Product Lead
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {user?.email || 'Gokulnathchandrakumar@gmail.com'}
            </div>
          </div>
        </div>

        {/* 3 Stats Counters */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
              Projects
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              14
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
              Completed
            </span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              128
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
              Sprints
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              32
            </span>
          </div>
        </div>
      </div>

      {/* Appearance Section matching M6 */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-0.5">
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-500" />
              <span>Appearance</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Personalize workspace</span>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              themeMode === 'light'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              themeMode === 'dark'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('system')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              themeMode === 'system'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400">
          Currently active: <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{themeMode} ({isDark ? 'Dark UI' : 'Light UI'})</span>. Tap to switch.
        </p>
      </div>

      {/* General Settings List matching M6 */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden text-xs">
        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Notifications</div>
              <div className="text-[10px] text-slate-400">Push, Email summaries</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Security & 2FA</div>
              <div className="text-[10px] text-slate-400">Hardware key & Authenticator</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-semibold">
            Enabled
          </span>
        </div>

        <div
          onClick={() => setActiveMobileTab('diagnostics')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Offline Sync & Cache</div>
              <div className="text-[10px] text-slate-400">3 changes staged locally</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-semibold">
            {queuedSyncCount} queued
          </span>
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Language & Region</div>
              <div className="text-[10px] text-slate-400">English - US</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">EN (US)</span>
        </div>
      </div>

      {/* Log Out button matching M6 */}
      <button
        onClick={logout}
        className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>

      <div className="text-center text-[10px] text-slate-400 pt-2 font-mono">
        ProjectFlow Mobile Client v4.12.0 &bull; Build #8921 &bull; Enterprise Tier
      </div>
    </div>
  );
};
