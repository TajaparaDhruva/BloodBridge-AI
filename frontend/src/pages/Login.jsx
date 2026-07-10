import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';
import bloodDonationPhoto from '../assets/blood_donation_photo.png';

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
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

import {
  FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff,
  FiActivity, FiCheckCircle, FiAlertCircle, FiHeart
} from 'react-icons/fi';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'hospital', icon: '🏥', label: 'Hospital' },
    { id: 'donor', icon: '🩸', label: 'Donor' },
    { id: 'admin', icon: '⚡', label: 'Admin' },
  ];

  const liveStats = [
    { label: 'Active Donors', value: '50,000+' },
    { label: 'Hospitals', value: '1,200+' },
    { label: 'Avg Match', value: '<45s' },
    { label: 'Lives Saved', value: '12,400+' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login({ email, password, role });
      navigate('/dashboard');
    } catch (err) {
      const serverError = err.response?.data?.message || err.message;
      setError(serverError || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    setError('');
    const demos = {
      hospital: { email: 'hospital@demo.com', password: 'demo123', role: 'hospital' },
      donor: { email: 'donor@demo.com', password: 'demo123', role: 'donor' },
      admin: { email: 'admin@demo.com', password: 'demo123', role: 'admin' },
    };
    try {
      await login(demos[demoRole] || demos.hospital);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 overflow-hidden bg-canvas dark:bg-darkbg">

      {/* ── Left: Brand Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-8 xl:p-12 relative overflow-hidden h-full">
        {/* Full-bleed background image */}
        <img
          src={bloodDonationPhoto}
          alt="Blood Donation Theme"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in scale-105 blur-[3px]"
        />
        {/* Soft dark gradient overlays to guarantee logo and description readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10 self-start bg-black/20 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                fill="currentColor"
              />
              <path
                d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight">
              Blood<span className="text-bloodred-light">Bridge</span>
            </span>
          </div>
        </Link>

        {/* Simple overlaid brand copy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-md text-left"
        >
          <h2 className="font-extrabold text-white leading-tight mb-3 drop-shadow-md" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}>
            Saving Lives with<br />
            <span className="text-bloodred-light font-black">Intelligence & Speed</span>
          </h2>
          <p className="text-white/80 text-[13px] leading-relaxed max-w-sm drop-shadow-sm font-medium">
            Access the BloodBridge AI Emergency Operations Center — where every second matters.
          </p>
        </motion.div>
      </div>

      {/* ── Right: Login Form ──────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center bg-canvas dark:bg-darkbg px-6 py-6 sm:px-10 lg:px-12 xl:px-16 h-full overflow-y-auto lg:overflow-hidden">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                  fill="currentColor"
                />
                <path
                  d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-extrabold text-slate dark:text-white text-lg">Blood<span className="text-bloodred">Bridge</span></span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="hidden lg:flex justify-end mb-6">
          <ThemeToggle />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex justify-between items-start mb-5">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate dark:text-white tracking-tight leading-tight">
                Welcome Back
              </h1>
              <p className="text-muted text-[12px] mt-0.5 font-medium">
                Secure access · Emergency Network
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                System Live
              </div>
              <div className="flex items-center gap-1 justify-end font-extrabold text-bloodred text-base tracking-tight select-none">
                <span className="text-xs">🩸</span>
                Blood<span className="text-bloodred-light">Bridge</span>
              </div>
            </div>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            variants={itemVariants}
            className="flex gap-1.5 mb-5 p-1 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl relative z-0 border border-black/[0.04] dark:border-white/[0.04]"
          >
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="flex-1 relative flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-colors overflow-hidden"
              >
                {role === r.id && (
                  <motion.div
                    layoutId="activeRole"
                    className="absolute inset-0 bg-white dark:bg-darksurf rounded-xl shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${role === r.id
                    ? 'text-slate dark:text-white'
                    : 'text-muted hover:text-slate dark:hover:text-white'
                  }`}>
                  <span className="text-base">{r.icon}</span>
                  {r.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl mb-6"
              >
                <FiAlertCircle className="w-4 h-4 text-bloodred flex-shrink-0" />
                <p className="text-bloodred text-[13px] font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Email */}
            <motion.div variants={itemVariants} className="pt-8">
              <div className="relative">
                <div className="absolute -top-5 left-3 px-2 bg-canvas dark:bg-darkbg text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase z-10 select-none leading-none">
                  User Identifier
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-bold z-10 select-none">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dr.smith@hospital.org"
                    className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-darksurf border border-black/12 dark:border-white/12 hover:border-black/20 dark:hover:border-white/20 focus:shadow-[0_0_20px_rgba(198,42,71,0.08)] rounded-2xl text-[14px] font-medium text-slate dark:text-white placeholder-muted/40 focus:outline-none focus:border-bloodred focus:ring-2 focus:ring-bloodred/10 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="pt-12">
              <div className="relative">
                <div className="absolute -top-5 left-3 right-3 flex justify-between items-center px-0 z-10 select-none">
                  <span className="bg-canvas dark:bg-darkbg px-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase leading-none">
                    Authentication Key
                  </span>
                  <a href="#" className="bg-canvas dark:bg-darkbg px-2 text-[9px] font-bold text-slate-400 hover:text-bloodred dark:text-slate-500 dark:hover:text-bloodred hover:underline uppercase tracking-widest transition-colors duration-200 leading-none">
                    Recovery?
                  </a>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 z-10" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-darksurf border border-black/12 dark:border-white/12 hover:border-black/20 dark:hover:border-white/20 focus:shadow-[0_0_20px_rgba(198,42,71,0.08)] rounded-2xl text-[14px] font-medium text-slate dark:text-white placeholder-muted/40 focus:outline-none focus:border-bloodred focus:ring-2 focus:ring-bloodred/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-slate dark:hover:text-white transition-colors"
                  >
                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Maintain persistent session */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 pt-4 select-none">
              <input
                type="checkbox"
                id="persistent"
                className="w-4 h-4 rounded border-black/10 dark:border-white/10 accent-bloodred cursor-pointer"
              />
              <label htmlFor="persistent" className="text-[11px] text-muted font-semibold cursor-pointer hover:text-slate dark:hover:text-white transition-colors">
                Maintain persistent session
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-3">
              <motion.button
                whileHover={{ scale: 1.015, boxShadow: '0 8px 30px rgba(198,42,71,0.35)' }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="w-full justify-center py-3.5 text-[12px] font-bold text-white bg-bloodred hover:bg-bloodred-dark rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-300 uppercase tracking-[0.15em]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>Initialize Login <FiArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Status Ticker Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-4 bg-bloodred/[0.04] dark:bg-bloodred/[0.08] border border-bloodred/[0.12] rounded-2xl p-2.5 flex items-center justify-center gap-3 text-[9px] font-bold text-bloodred tracking-widest uppercase select-none overflow-hidden"
          >
            <span className="animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-bloodred animate-ping" />
              Processing Real-Time Logistics
            </span>
            <span className="opacity-20">•</span>
            <span className="opacity-80">Neural Match Active</span>
          </motion.div>

          {/* Divider & Subtitle */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-black/06 dark:bg-white/06" />
            <span className="text-[10px] text-muted font-semibold tracking-wide">Try a Demo</span>
            <div className="flex-1 h-px bg-black/06 dark:bg-white/06" />
          </motion.div>

          {/* Demo Logins */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
            {roles.map(r => (
              <motion.button
                whileHover={{ y: -3, borderColor: 'rgba(198,42,71,0.4)', boxShadow: '0 4px 16px rgba(198,42,71,0.12)' }}
                whileTap={{ scale: 0.97 }}
                key={r.id}
                onClick={() => handleDemoLogin(r.id)}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-white dark:bg-darksurf border border-black/08 dark:border-white/08 rounded-2xl transition-all duration-200 text-center disabled:opacity-40 shadow-sm"
              >
                <span className="text-xl">{r.icon}</span>
                <span className="text-[10px] font-bold text-muted">{r.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-4 pt-3 border-t border-black/05 dark:border-white/05 text-center">
            <p className="text-[11px] text-muted/70 font-medium">
              By signing in you agree to our{' '}
              <a href="#" className="text-bloodred/80 hover:text-bloodred hover:underline transition-colors">Terms</a>
              {' & '}
              <a href="#" className="text-bloodred/80 hover:text-bloodred hover:underline transition-colors">Privacy</a>
            </p>
            <p className="text-[8.5px] text-muted/40 font-bold uppercase tracking-[0.2em] mt-2 select-none">
              © 2026 BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
