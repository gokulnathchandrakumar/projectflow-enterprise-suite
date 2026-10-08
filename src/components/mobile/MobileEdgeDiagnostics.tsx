import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Database,
  Headphones,
  Lock,
  Menu,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  WifiOff,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface MobileEdgeDiagnosticsProps {
  onBack?: () => void;
  onLoginAgain?: () => void;
}

export const MobileEdgeDiagnostics: React.FC<MobileEdgeDiagnosticsProps> = ({
  onBack,
  onLoginAgain
}) => {
  const { user } = useAuth();
  const { isOffline, setIsOffline, retrySync } = useApp();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [supportAlert, setSupportAlert] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await retrySync();
    setTimeout(() => {
      setRetrying(false);
      setIsOffline(false);
    }, 600);
  };

  return (
    <div className="p-4 space-y-4 pb-8 font-sans">
      {/* Top Header Bar matching Screenshot 4 */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 text-slate-700 dark:text-slate-200"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-blue-600 tracking-tight">
            ProjectFlow
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-600 dark:text-slate-300 relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1"></span>
          </button>
        </div>
      </div>

      {/* Top Offline Warning Banner matching Screenshot 4 */}
      {bannerVisible && (
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-tight">
              <span className="font-semibold">You're offline</span> — Changes saved locally, will sync when connected.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold text-[11px] shadow-2xs hover:bg-blue-50"
            >
              {retrying ? 'Retrying...' : 'Retry'}
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Error 500 Interrupted Card matching Screenshot 4 */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold font-mono text-[9px] uppercase tracking-wide">
                ERROR 500
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Sync Queue</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              Something went wrong — Server connection interrupted.
            </h3>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
          Requests could not be verified by the cloud cluster. Background queued updates are held safely in persistent device storage.
        </p>

        {/* Local Cache Healthy Pill */}
        <div className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              Local Cache Healthy (94.2 MB Cached)
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>

        {/* Dual Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleRetry}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>

          <button
            onClick={() => setSupportAlert(true)}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Headphones className="w-3.5 h-3.5 text-slate-500" />
            <span>Contact support</span>
          </button>
        </div>

        {supportAlert && (
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[10px] text-blue-700 dark:text-blue-300 text-center">
            Support ticket #9482 registered. Engineering team auto-notified.
          </div>
        )}
      </div>

      {/* ACTIVE INTERRUPTION Section Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <span className="bg-slate-50 dark:bg-slate-950 px-3">ACTIVE INTERRUPTION</span>
        </div>
      </div>

      {/* Session Expired Card matching Screenshot 4 */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center relative space-y-3">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-2"></div>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Session expired
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Your session has expired. Please log in again to continue working safely.
          </p>
        </div>

        {/* User Snapshot Card */}
        <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.avatarInitials || 'AM'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Alex Morgan'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {user?.email || 'alex.morgan@example.com'}
              </div>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-semibold flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            <span>Timeout</span>
          </span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onLoginAgain}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Log in again</span>
        </button>

        <div>
          <button
            onClick={() => alert('Workspace switch dialog opened.')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Switch workspace account
          </button>
        </div>
      </div>

      {/* Edge Node Diagnostics Card matching Screenshot 4 */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>Edge Node Diagnostics</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Auto-polling</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
              Sync Pending
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              14 Operations
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
              Network Protocol
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Offline / IndexedDB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
