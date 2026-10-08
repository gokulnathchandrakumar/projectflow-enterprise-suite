import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  Lock,
  Mail,
  ShieldCheck
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface MobileLoginProps {
  onSwitchToRegister?: () => void;
}

export const MobileLogin: React.FC<MobileLoginProps> = ({ onSwitchToRegister }) => {
  const { login, loginError, clearErrors } = useAuth();
  const [email, setEmail] = useState('Gokulnathchandrakumar@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="p-6 flex flex-col justify-between min-h-full font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div>
        {/* Brand Header matching M1 */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md mb-3">
            <LayoutGrid className="w-7 h-7" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              ProjectFlow
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
              Enterprise Suite
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Plan, track and deliver projects with your team
          </p>
        </div>

        {/* Error Alert Box matching M1 */}
        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Invalid email or password.</span>
            </div>
            <p className="text-[11px] pl-5 text-rose-600 dark:text-rose-400/90">
              Please check your enterprise credentials and retry.
            </p>
          </div>
        )}

        {/* Form Body matching M1 */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Work email
              </label>
              <span className="text-[10px] text-rose-500 font-medium">Required</span>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Gokulnathchandrakumar@gmail.com"
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-rose-300 dark:border-rose-900/80 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-rose-500"
                required
              />
              <AlertCircle className="w-4 h-4 text-rose-500 absolute right-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1">
              Please enter a valid work email address
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-semibold text-blue-600 dark:text-blue-400"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>Must contain at least 8 characters</span>
              <span className="text-emerald-600 font-medium">SSO ready</span>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Keep me signed in on this device
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white dark:bg-slate-900 px-2">or continue with</span>
          </div>
        </div>

        {/* SSO Button matching M1 */}
        <button
          type="button"
          onClick={() => {
            setEmail('Gokulnathchandrakumar@gmail.com');
            setPassword('ProjectFlow2025!');
            clearErrors();
          }}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
        >
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Enterprise SAML / Okta SSO</span>
        </button>
      </div>

      {/* Bottom Footer matching M1 */}
      <div className="pt-6 space-y-3 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Create an account
          </button>
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trusted by 500+ engineering and product teams</span>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <span>Security &amp; SOC2</span>
          <span>&bull;</span>
          <span>Privacy</span>
          <span>&bull;</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
};
