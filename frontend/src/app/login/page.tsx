'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { useApp, UserRole } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  User,
  Briefcase,
  UserCheck,
  ConciergeBell,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthLeftPanel from '@/components/features/auth/AuthLeftPanel';
import AuthRightLayout from '@/components/features/auth/AuthRightLayout';

interface QuickRole {
  id: UserRole;
  label: string;
  badge: string;
  email: string;
  defaultPass: string;
  target: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUICK_ROLES: QuickRole[] = [
  {
    id: 'traveler',
    label: 'Traveler',
    badge: 'Trekker',
    email: 'aayush.traveler@visitnepal.com',
    defaultPass: 'NepalTourism2026!',
    target: '/dashboard',
    icon: User,
  },
  {
    id: 'guide',
    label: 'Guide',
    badge: 'IFMGA',
    email: 'pasang.sherpa@visitnepal.com',
    defaultPass: 'NepalTourism2026!',
    target: '/portals/guide',
    icon: UserCheck,
  },
  {
    id: 'business',
    label: 'Agency',
    badge: 'Operator',
    email: 'partner@himalayanexpeditions.com',
    defaultPass: 'NepalTourism2026!',
    target: '/portals/business',
    icon: Briefcase,
  },
  {
    id: 'butler',
    label: 'Butler',
    badge: 'Concierge',
    email: 'sherpa.butler@visitnepal.com',
    defaultPass: 'NepalTourism2026!',
    target: '/portals/butler',
    icon: ConciergeBell,
  },
  {
    id: 'admin',
    label: 'Admin',
    badge: 'NTB Officer',
    email: 'officer@ntb.gov.np',
    defaultPass: 'NepalTourism2026!',
    target: '/portals/admin',
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';

  const { loginUser, currentUser, verifyOtp } = useTravelStore();
  const { setRole, showToast } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('traveler');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Fields
  const [regName, setRegName] = useState('');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sync mode if query parameter changes
  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setAuthMode('register');
    }
  }, [searchParams]);

  // Handle Quick Demo role selection
  const handleSelectRole = (r: QuickRole) => {
    setSelectedRole(r.id);
    setEmail(r.email);
    setPassword(r.defaultPass);
    setErrorMsg('');
  };

  // Submit Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Backend authentication with fallback
      try {
        await api.auth.login(email.trim(), password, selectedRole);
      } catch (backendErr) {
        console.warn('Backend login fallback:', backendErr);
      }

      await setRole(selectedRole);

      const mockName = email.split('@')[0];
      const capitalizedName =
        mockName.charAt(0).toUpperCase() + mockName.slice(1);

      loginUser(
        authMode === 'register' && regName.trim()
          ? regName.trim()
          : `${capitalizedName} Explorer`,
        selectedRole,
        email.trim()
      );
      verifyOtp();

      showToast(`Welcome! Signed in successfully as ${selectedRole}.`);

      const activeConfig = QUICK_ROLES.find((r) => r.id === selectedRole);
      router.push(activeConfig?.target || '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    showToast(`Password recovery link dispatched to ${forgotEmail}`);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2000);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <div className="min-h-[calc(100vh-52px)] w-full relative overflow-x-hidden overflow-y-auto lg:h-[calc(100vh-52px)] lg:overflow-hidden flex flex-col lg:flex-row bg-[#FAF9F5] font-sans">
      {/* 1. Interactive Map of Nepal with Animations (Left Panel) */}
      <AuthLeftPanel
        imageSrc="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"
        imageAlt="Everest sunrise"
      />

      {/* 3. Shared Right Panel Layout */}
      <AuthRightLayout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col gap-3 sm:gap-3.5 lg:gap-3 relative z-10"
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-poppins font-semibold text-slate-900 tracking-tight leading-tight">
              {authMode === 'signin' ? (
                <>
                  Welcome <span className="font-poppins font-semibold text-[#0552A2]">Back</span>
                </>
              ) : (
                <>
                  Begin Your <span className="font-poppins font-semibold text-[#0552A2]">Journey</span>
                </>
              )}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-snug font-inter font-normal">
              {authMode === 'signin'
                ? 'Sign in to access your curated Himalayan routes, licensed guides, and expedition permits.'
                : 'Join the official Nepal tourism gateway for verified permits, local guides, and expedition routes.'}
            </p>
          </motion.div>

          {/* Fast Role Demo Switcher */}
          <motion.div variants={itemVariants} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[9.5px] uppercase font-mono text-slate-500 tracking-wider font-bold">
                Operational Role
              </label>
              <span className="text-[9.5px] text-[#0552A2] font-semibold">
                Quick Demo Autofill
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {QUICK_ROLES.map((roleItem) => {
                const Icon = roleItem.icon;
                const isSelected = selectedRole === roleItem.id;

                return (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => handleSelectRole(roleItem)}
                    className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0552A2] bg-gradient-to-b from-blue-50/90 to-blue-50/40 shadow-xs ring-1 ring-[#0552A2]/30 text-[#0552A2]'
                        : 'border-slate-200/90 bg-white/80 hover:bg-white hover:border-slate-300 text-slate-600 shadow-2xs'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mb-0.5" />
                    <span className="text-[8px] sm:text-[9px] font-inter font-semibold truncate max-w-full leading-tight">
                      {roleItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Error Message */}
          {errorMsg && (
            <motion.p
              variants={itemVariants}
              className="text-[10px] font-mono text-rose-600 font-bold border border-rose-500/10 bg-rose-500/5 px-3 py-1.5 rounded-xl text-left"
            >
              ⚠️ {errorMsg}
            </motion.p>
          )}

          {/* Form */}
          <form
            onSubmit={handleLoginSubmit}
            className="space-y-2 sm:space-y-2.5 text-xs font-inter text-left"
          >
            {/* Full Name Input (Register mode) */}
            {authMode === 'register' && (
              <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-bold">
                  Full Legal Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0552A2] pointer-events-none">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-slate-200/90 focus:border-[#0552A2] rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 font-inter font-medium focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-2xs focus:ring-2 focus:ring-[#0552A2]/10"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Email Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-bold">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0552A2] pointer-events-none">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-slate-200/90 focus:border-[#0552A2] rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 font-inter font-medium focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-2xs focus:ring-2 focus:ring-[#0552A2]/10"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-1 relative"
            >
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-bold">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[9.5px] text-[#0552A2] hover:text-[#EC1F27] font-inter font-semibold hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0552A2] pointer-events-none">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200/90 focus:border-[#0552A2] rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 font-inter font-medium focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-2xs focus:ring-2 focus:ring-[#0552A2]/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-inter font-medium uppercase tracking-wider text-white bg-gradient-to-r from-[#0552A2] via-[#094B8F] to-[#0552A2] hover:opacity-95 transition-all shadow-[0_4px_12px_rgba(5,82,162,0.22)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] group disabled:opacity-50 mt-1 border-t border-white/20"
            >
              {isSubmitting ? (
                <>
                  <Compass className="h-3.5 w-3.5 animate-spin text-white" />
                  <span>
                    {authMode === 'signin' ? 'Signing In...' : 'Registering...'}
                  </span>
                </>
              ) : (
                <span>
                  {authMode === 'signin'
                    ? `Sign In as ${selectedRole}`
                    : `Register as ${selectedRole}`}
                </span>
              )}
            </motion.button>

            {/* Social Divider */}
            <motion.div variants={itemVariants} className="flex items-center pt-0.5">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-2.5 text-[9.5px] uppercase font-mono text-slate-400 font-bold">
                Or continue with
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </motion.div>

            {/* Google & Apple Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('aayush.traveler@visitnepal.com');
                  setPassword('NepalTourism2026!');
                  showToast('Google authentication mock linked');
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 py-2 text-xs font-inter font-medium text-slate-800 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-2xs"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.99 1 12 1 7.35 1 3.39 3.67 1.39 7.56l3.85 2.99c.96-2.88 3.66-4.51 6.76-4.51z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.79a7.12 7.12 0 0 1 0-4.32L1.39 7.56C.5 9.35 0 11.45 0 13.5c0 2.05.5 4.15 1.39 5.94l3.85-2.99c-.45-.69-.73-1.48-.73-2.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.12.75-2.55 1.2-4.26 1.2-3.1 0-5.8-1.63-6.76-4.51L1.39 16.9C3.39 20.79 7.35 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('pasang.sherpa@visitnepal.com');
                  setPassword('NepalTourism2026!');
                  showToast('Apple ID authentication mock linked');
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 py-2 text-xs font-inter font-medium text-slate-800 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-2xs"
              >
                <svg className="h-3.5 w-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.86-1.02 2.98 1.09.08 2.2-.57 2.95-1.41z" />
                </svg>
                <span>Apple</span>
              </button>
            </motion.div>

            {/* Back to Login page or switch mode */}
            <motion.div
              variants={itemVariants}
              className="text-center border-t border-slate-200/80 pt-2 text-[11px] text-slate-500 font-inter font-normal"
            >
              {authMode === 'signin' ? (
                <>
                  Don't have a travel profile?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg('');
                    }}
                    className="text-[#0552A2] hover:text-[#EC1F27] font-inter font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMsg('');
                    }}
                    className="text-[#0552A2] hover:text-[#EC1F27] font-inter font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>
          </form>
        </motion.div>
      </AuthRightLayout>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setForgotModalOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[92vw] sm:max-w-md rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-5 relative"
            >
              <button
                onClick={() => setForgotModalOpen(false)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0552A2] border border-blue-100">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-poppins text-xl font-medium text-slate-900">
                    Reset Password
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    Enter your registered email to receive an official recovery link
                  </p>
                </div>
              </div>

              {forgotSuccess ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Password Reset Dispatched
                  </h4>
                  <p className="text-xs text-emerald-700 font-light leading-relaxed">
                    Instructions sent to{' '}
                    <strong className="font-semibold">{forgotEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="e.g. explorer@visitnepal.com"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/30 focus:border-[#0552A2]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#0552A2] px-5 py-2 text-xs font-bold text-white hover:bg-[#044182] transition-colors shadow-xs cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
