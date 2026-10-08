import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface WebLoginProps {
  onSwitchToRegister?: () => void;
}

export const WebLogin: React.FC<WebLoginProps> = ({ onSwitchToRegister }) => {
  const { login, loginError, clearErrors } = useAuth();
  const [email, setEmail] = useState('Gokulnathchandrakumar@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleFillDemo = () => {
    setEmail('Gokulnathchandrakumar@gmail.com');
    setPassword('ProjectFlow2025!');
    clearErrors();
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Left Hero Banner (Royal Blue) */}
      <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-700 text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative geometry */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-700/40 blur-3xl pointer-events-none"></div>

        {/* Top Brand Lockup */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white leading-none">ProjectFlow</div>
            <div className="text-[11px] font-medium text-blue-200 uppercase tracking-widest mt-0.5">Enterprise Suite</div>
          </div>
        </div>

        {/* Center Hero Copy */}
        <div className="my-12 md:my-0 relative z-10 max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
            Plan, track and deliver projects with your team
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/50 border border-white/30 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm md:text-base text-blue-100 font-normal">
                Real-time cross-functional milestone tracking
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/50 border border-white/30 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm md:text-base text-blue-100 font-normal">
                Granular role permissions & automated task dispatch
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/50 border border-white/30 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm md:text-base text-blue-100 font-normal">
                Enterprise-grade audit logs and SOC2 compliance
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="pt-8 border-t border-blue-500/40 flex items-center gap-3 relative z-10">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              GC
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              TC
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              VK
            </div>
          </div>
          <span className="text-xs text-blue-100 font-medium">
            Trusted by 500+ engineering and product teams
          </span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-14">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Log in to your ProjectFlow account
            </p>
          </div>

          {/* Error Banner matching W1-login */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="Gokulnathchandrakumar@gmail.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    emailTouched && !isEmailValid
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500'
                  }`}
                  required
                />
                {emailTouched && !isEmailValid && (
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-3" />
                )}
              </div>
              {emailTouched && !isEmailValid && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid work email address
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to enterprise directory administrator.')}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Create an account
              </button>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-slate-400 hover:text-blue-600 underline"
            >
              Fill Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
