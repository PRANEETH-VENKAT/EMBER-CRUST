import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../features/checkout/validation';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, signUp } = useAuth();

  const [tab, setTab] = useState<'signin' | 'signup'>(authModalTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync tab with context initial tab
  useEffect(() => {
    setTab(authModalTab);
    setErrors({});
  }, [authModalTab, isAuthModalOpen]);

  // Focus first input on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isAuthModalOpen, tab]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string | null> = {};

    if (tab === 'signup' && (!name.trim() || name.trim().length < 2)) {
      newErrors.name = 'Please enter your name (min 2 characters).';
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      newErrors.email = emailVal.error;
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (tab === 'signup') {
      signUp(name, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Dark backdrop (solid alpha, ZERO backdrop-filter blur) */}
      <div
        className="anim-fade-in fixed inset-0 bg-black/85 transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="anim-modal-scale-in relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#0F0F0F] shadow-2xl overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#262626] bg-[#141414] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD60A] font-bebas text-sm font-bold text-black">
              E&amp;C
            </span>
            <h2
              id="auth-modal-title"
              className="font-sora text-sm font-bold text-[#F5F5F5]"
            >
              {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close sign in modal"
            className="press-scale flex h-8 w-8 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-[#A3A3A3] hover:border-[#FFD60A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-[#262626] bg-[#0A0A0A]">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrors({});
            }}
            className={`py-3 font-mono text-xs font-semibold tracking-wider transition-colors ${
              tab === 'signin'
                ? 'border-b-2 border-[#FFD60A] text-[#FFD60A] bg-[#141414]'
                : 'text-[#737373] hover:text-[#F5F5F5]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrors({});
            }}
            className={`py-3 font-mono text-xs font-semibold tracking-wider transition-colors ${
              tab === 'signup'
                ? 'border-b-2 border-[#FFD60A] text-[#FFD60A] bg-[#141414]'
                : 'text-[#737373] hover:text-[#F5F5F5]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* Create Account: Full Name */}
          {tab === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
              >
                Full Name <span className="text-[#FFD60A]">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
                <input
                  ref={firstInputRef}
                  id="auth-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Aditi Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  className={`w-full rounded-xl border bg-[#141414] pl-10 pr-4 py-2.5 font-inter text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                    errors.name ? 'border-rose-500' : 'border-[#262626]'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 font-mono text-xs text-rose-400">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label
              htmlFor="auth-email"
              className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
            >
              Email Address <span className="text-[#FFD60A]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
              <input
                ref={tab === 'signin' ? firstInputRef : undefined}
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                className={`w-full rounded-xl border bg-[#141414] pl-10 pr-4 py-2.5 font-inter text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                  errors.email ? 'border-rose-500' : 'border-[#262626]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 font-mono text-xs text-rose-400">{errors.email}</p>
            )}
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label
              htmlFor="auth-password"
              className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
            >
              Password <span className="text-[#FFD60A]">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                className={`w-full rounded-xl border bg-[#141414] pl-10 pr-11 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                  errors.password ? 'border-rose-500' : 'border-[#262626]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#F5F5F5] p-1"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 font-mono text-xs text-rose-400">{errors.password}</p>
            )}
          </div>

          {/* Notice: Simulated Auth */}
          <div className="flex items-center gap-2 rounded-lg bg-[#141414] p-2.5 border border-[#222222] text-[11px] font-mono text-[#737373]">
            <Sparkles className="h-3.5 w-3.5 text-[#FFD60A] shrink-0" />
            <span>Frontend demo: Any valid email format signs in locally.</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            id="auth-submit-btn"
            className="press-scale w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] py-3 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] shadow-md shadow-[#FFD60A]/10 transition-colors"
          >
            <span>{tab === 'signin' ? 'Sign In to Ember Club' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Continue as Guest option */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              id="continue-as-guest-btn"
              className="font-mono text-xs text-[#A3A3A3] hover:text-[#FFD60A] underline underline-offset-4 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
