import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  Lock,
  Mail,
  User as UserIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface MobileRegisterProps {
  onSwitchToLogin?: () => void;
}

export const MobileRegister: React.FC<MobileRegisterProps> = ({ onSwitchToLogin }) => {
  const { register, registerError } = useAuth();
  const [fullName, setFullName] = useState('GOKULNATH');
  const [email, setEmail] = useState('Gokulnathchandrakumar@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await register(fullName, email, password);
    setIsLoading(false);
  };

  return (
    <div className="p-6 flex flex-col justify-between min-h-full font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div>
        {/* Brand Lockup matching M2 */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md mb-2">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-blue-600">
            ProjectFlow
          </h1>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Create your account
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Start planning projects with your team
          </p>
        </div>

        {/* Existing email banner matching M2 */}
        {registerError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>An account with this email already exists.</span>
            </div>
            <p className="text-[11px] pl-5 text-rose-600 dark:text-rose-400/90">
              Please try logging in instead or use another organization address.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Full name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="GOKULNATH"
                className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
                required
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Work email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Gokulnathchandrakumar@gmail.com"
                className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-rose-400 dark:border-rose-900 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-rose-500"
                required
              />
              <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-2.5" />
            </div>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1">
              Email is linked to an existing ProjectFlow organization.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
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
          </div>

          {/* Password Requirements Checklist matching M2 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Password requirements
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Contains at least one letter and one number</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              <span className="text-slate-500">Contains a special character</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600"
              required
            />
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account &rarr;</span>
            )}
          </button>
        </form>
      </div>

      <div className="pt-4 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 font-semibold"
        >
          Log in
        </button>
      </div>
    </div>
  );
};
