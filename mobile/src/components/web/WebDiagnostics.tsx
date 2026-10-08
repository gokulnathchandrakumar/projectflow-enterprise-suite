import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  RefreshCw,
  Server,
  Shield,
  WifiOff
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const WebDiagnostics: React.FC = () => {
  const {
    isOffline,
    setIsOffline,
    is500Error,
    setIs500Error,
    queuedSyncCount,
    retrySync
  } = useApp();
  const { user, isSessionExpired, setSessionExpired } = useAuth();

  const [cacheSize, setCacheSize] = useState('94.2 MB');
  const [heartbeatSeconds, setHeartbeatSeconds] = useState(165);

  const formatTTL = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `TTL 0${mins}:${secs < 10 ? '0' : ''}${secs} remaining`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Offline Toast Banner matching W8 */}
      {isOffline && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-500" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">You're offline:</span> You are currently working offline. Changes are saved locally and will sync when connection returns.
            </div>
          </div>
          <button
            onClick={() => {
              setIsOffline(false);
              retrySync();
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            Reconnect & Sync
          </button>
        </div>
      )}

      {/* Header matching W8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
            WS Milestone &bull; System States & Diagnostics
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise Edge States & Fallbacks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Standardized resilient design patterns for transient network degradation, expired security sessions, broken entity pathways, and upstream infrastructural faults.
          </p>
        </div>

        <button
          onClick={() => setSessionExpired(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Test Expired Session</span>
        </button>
      </div>

      {/* Simulated 500 Server Error Card */}
      <div className="p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              FAULT 500
            </span>
            <span className="text-xs text-slate-500 font-medium">Upstream Cluster Response</span>
          </div>
          <span className="text-xs font-mono text-rose-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Incident #9482
          </span>
        </div>

        <div className="max-w-md mx-auto text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto mb-4 text-rose-600">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Could not reach the server cluster. Our platform reliability engineering team has been notified.
            Queued writes remain securely buffered in local storage.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                alert('Diagnostic ping returned 200 OK. Resuming normal operations.');
                setIs500Error(false);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => alert('Support ticket #9482 opened. Engineering response SLA < 15m.')}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Contact support
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Diagnostics & Edge Readiness Grid matching W8 */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workspace Diagnostics & Edge Readiness
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time status of caching adapters, offline storage, and active worker nodes.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Local Cache Healthy</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* IndexedDB Persistence */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[11px] text-slate-400 block mb-1">IndexedDB Persistence</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {cacheSize}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              12 tables hydrated with zero latency
            </span>
          </div>

          {/* Queue Synchronization */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[11px] text-slate-400 block mb-1">Queue Synchronization</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {isOffline ? queuedSyncCount : 0} Mutex Tasks Pending
              </span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Optimistic updates with background re-sync
            </span>
          </div>

          {/* Auth Heartbeat Token */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[11px] text-slate-400 block mb-1">Auth Heartbeat Token</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                {formatTTL(heartbeatSeconds)}
              </span>
              <button
                onClick={() => setSessionExpired(true)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Simulate Expire
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Automatic refresh token rolling cycle
            </span>
          </div>
        </div>
      </div>

      {/* Session Expired Modal Modal Overlay matching W8 */}
      {isSessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Session expired
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Your session has expired. Please log in again to continue working safely.
            </p>

            {/* User Session Snapshot */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between mb-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {user?.avatarInitials || 'GC'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'GOKULNATH'}</div>
                  <div className="text-[11px] text-slate-400">Enterprise Suite &bull; US-East</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-semibold">
                Timeout
              </span>
            </div>

            <button
              onClick={() => setSessionExpired(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm mb-3"
            >
              <span>&rarr; Log in again</span>
            </button>

            <button
              onClick={() => {
                setSessionExpired(false);
                alert('Workspace account selector modal');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            >
              Switch workspace account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
