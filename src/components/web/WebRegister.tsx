import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  GitBranch,
  Kanban,
  LayoutGrid,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface WebRegisterProps {
  onSwitchToLogin?: () => void;
}

export const WebRegister: React.FC<WebRegisterProps> = ({ onSwitchToLogin }) => {
  const { register, registerError } = useAuth();
  const [fullName, setFullName] = useState('GOKULNATH');
  const [email, setEmail] = useState('Gokulnathchandrakumar@gmail.com');
  const [password, setPassword] = useState('ProjectFlow2025!');
  const [confirmPassword, setConfirmPassword] = useState('ProjectFlow2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password requirement tests
  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    await register(fullName, email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Left Hero Banner */}
      <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-700 text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
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

        {/* Center Copy & Pillars */}
        <div className="my-10 md:my-0 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs text-blue-100 font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Version 3.4 Enterprise Architecture</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
            Scale your team's execution with confidence
          </h1>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Centralized project roadmap and dependency graph
                </h4>
                <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                  Visualize real-time bottlenecks across enterprise functional workstreams.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Integrated sprint boards & automated task workflows
                </h4>
                <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                  Continuous delivery alignment with automated trigger pipelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Enterprise SLA and single sign-on readiness
                </h4>
                <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                  SOC-2 Type II compliant with SAML 2.0 & Okta integration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Copyright */}
        <div className="pt-6 border-t border-blue-500/40 flex items-center justify-between text-xs text-blue-100 relative z-10">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Workspace</span>
          </div>
          <span>© 2025 ProjectFlow Inc.</span>
        </div>
      </div>

      {/* Right Registration Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-14">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Start planning projects with your team
            </p>
          </div>

          {registerError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{registerError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="GOKULNATH"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Gokulnathchandrakumar@gmail.com"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Password Requirements
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={hasMinLength ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasLetterAndNumber ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={hasLetterAndNumber ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}>
                  Contains at least one letter and one number
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasSpecialChar ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={hasSpecialChar ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}>
                  Contains a special character
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account &rarr;</span>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Log in &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
