import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
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
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'hospital', icon: '🏥', label: 'Hospital / Blood Bank' },
    { id: 'donor', icon: '🩸', label: 'Blood Donor' },
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
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await googleLogin(tokenResponse.access_token, role);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Google Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login Failed.'),
  });

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
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen lg:overflow-hidden grid lg:grid-cols-2 bg-[#FAF9F6] dark:bg-[#070B13] relative font-sans">

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#0F1420]/95 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 hover:border-red-600/30 transition-all duration-200 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Left Brand Panel (Donation Room Background Scene) */}
      <div
        style={{
          backgroundImage: "url('/bloodbridge_bg_donation.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right"
        }}
        className="hidden lg:flex flex-col justify-between p-8 relative border-r border-gray-100 dark:border-white/05 h-full overflow-hidden"
      >

        {/* Soft light-gradient overlay on the text/features area for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent pointer-events-none" />

        {/* Logo and Subtitle */}
        <div className="relative z-10 font-poppins flex items-center gap-3">
          {/* Logo outline */}
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#E11D48] flex-shrink-0">
            <svg className="w-5.5 h-5.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-[16px] tracking-tight">BloodBridge <span className="text-red-500">AI</span></span>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Smarter Connections. Stronger Lives.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6 my-auto font-poppins max-w-md">

          {/* Header Typography */}
          <div className="space-y-3">
            <h1 className="font-black text-slate-900 text-[34px] leading-[1.1] tracking-tight">
              Saving Lives with<br />
              <span className="text-[#E11D48]">Intelligence & Speed</span>
            </h1>
            <p className="text-slate-600 text-[14px] leading-relaxed max-w-sm font-sans font-semibold">
              Access the BloodBridge AI Emergency Operations Center — where every second matters.
            </p>
          </div>

          {/* Interactive Bullet Lists */}
          <div className="grid grid-cols-2 gap-4 pt-4 font-sans">
            {[
              { title: 'AI Matching', sub: 'Under 45 Seconds', icon: '🧠', color: 'bg-rose-50 text-rose-500' },
              { title: 'Secure & Private', sub: 'AES-256 Encrypted', icon: '🛡️', color: 'bg-blue-50 text-blue-500' },
              { title: 'Smart Alerts', sub: 'Real-time Updates', icon: '🔔', color: 'bg-indigo-50 text-indigo-500' },
              { title: 'Verified Network', sub: 'Trusted Hospitals', icon: '👥', color: 'bg-amber-50 text-amber-500' }
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/80 border border-gray-100 p-2.5 rounded-xl shadow-sm">
                <div className={`w-8.5 h-8.5 rounded-lg ${bullet.color} flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-inner`}>
                  {bullet.icon}
                </div>
                <div>
                  <p className="text-[11.5px] font-bold text-slate-800 leading-tight">{bullet.title}</p>
                  <p className="text-[9.5px] font-bold text-gray-400 mt-0.5 leading-tight">{bullet.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 space-y-0.5 font-poppins">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11.5px] font-bold">
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 11l3 3 5-5" />
            </svg>
            <span>Trusted by 1,200+ hospitals across India</span>
          </div>
          <div className="text-slate-400 text-[10px] font-medium leading-tight">
            © 2026 BloodBridge AI. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="flex flex-col justify-center px-6 py-6 lg:px-12 xl:px-14 h-full overflow-y-auto relative z-10">
        <div className="w-full max-w-lg mx-auto">

          {/* Card Container */}
          <div className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/05 rounded-3xl p-6 sm:p-8 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.03)]">

            {/* Header info bar */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Welcome Back
                </h1>
                <p className="text-slate-400 text-[11px] mt-0.5 font-bold">
                  Secure access · Emergency Network
                </p>
              </div>
              <div className="text-right shrink-0 font-poppins">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  System Live
                </div>
                <div className="flex items-center gap-1 justify-end font-extrabold text-slate-900 dark:text-white text-[13.5px] tracking-tight select-none">
                  <span className="text-[#E11D48]">🩸</span>
                  BloodBridge <span className="text-[#E11D48] ml-0.5">AI</span>
                </div>
              </div>
            </div>

            {/* Horizontal Switcher Grid */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/05 relative z-0 select-none">
              {roles.map(r => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex-1 relative flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold transition-all ${isSelected
                        ? 'bg-rose-50/70 dark:bg-[#E11D48]/10 text-red-600 dark:text-red-400 shadow-sm border border-rose-100/30'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white border border-transparent'
                      }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl mb-4"
                >
                  <FiAlertCircle className="w-4 h-4 text-[#E11D48] flex-shrink-0" />
                  <p className="text-[#E11D48] text-[12.5px] font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* User Identifier */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase block mb-1">
                  User Identifier
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-red-600 z-10 flex-shrink-0">
                    <FiMail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={role === 'hospital' ? 'Enter hospital email or ID' : 'Enter registered email address'}
                    className="w-full pl-13 pr-4 py-2.5 bg-white dark:bg-darksurf border border-gray-200 dark:border-white/10 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all"
                  />
                </div>
              </div>

              {/* Authentication Key */}
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase block">
                    Authentication Key
                  </label>
                  <a href="#" className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors uppercase tracking-widest">
                    Recovery?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-red-600 z-10 flex-shrink-0">
                    <FiLock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-13 pr-12 py-2.5 bg-white dark:bg-darksurf border border-gray-200 dark:border-white/10 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-slate dark:hover:text-white transition-colors"
                  >
                    {showPw ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Persistent Session Checkbox */}
              <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-gray-300 dark:border-white/10 accent-[#E11D48] cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors leading-none">
                  Keep me signed in on this device
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E11D48] hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-[14px] uppercase tracking-wider"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Initialize Login</span>
                      <FiArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="w-full bg-white dark:bg-[#0F1420] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/05 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer text-[14px]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>


            {/* Create an account / Signup Link */}
            <div className="flex items-center justify-center gap-1.5 my-5 text-[12.5px] font-poppins font-bold text-slate-500 dark:text-slate-400">
              <span>Create an account?</span>
              <Link to="/signup" className="text-[#E11D48] hover:underline font-extrabold cursor-pointer">
                Signup?
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/05 text-center font-poppins">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">
                By signing in you agree to our{' '}
                <a href="#" className="text-red-600 hover:underline">Terms</a>
                {' & '}
                <a href="#" className="text-red-600 hover:underline">Privacy</a>
              </p>
              <p className="text-[8.5px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.2em] mt-2 select-none">
                © 2026 BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
