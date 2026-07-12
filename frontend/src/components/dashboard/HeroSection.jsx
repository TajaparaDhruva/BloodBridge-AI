import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiAlertCircle, FiMapPin, FiPlus, FiZap, FiTrendingUp, FiClock, FiArrowLeft
} from 'react-icons/fi';
import { getGreeting } from './shared';

const HeroSection = ({
  user,
  userLocation,
  requests,
  inventory,
  donors,
  onNewRequest,
  onOpenMap,
  onOpenAI,
}) => {
  const activeRequests = requests.filter((r) => r.status !== 'completed').length;
  const criticalCount = inventory.filter((i) => i.status === 'critical').length;
  const displayName = user?.name?.split(' ')[0] || user?.role || 'System';

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 glass-card shadow-sm"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle decorative rings on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden hidden lg:block select-none z-0 opacity-40">
        <svg className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/4 text-[#E11D48]" width="480" height="480" viewBox="0 0 480 480" fill="none">
          <circle cx="240" cy="240" r="220" stroke="currentColor" strokeWidth="1" strokeDasharray="3 8" opacity="0.15" />
          <circle cx="240" cy="240" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" opacity="0.10" />
          <circle cx="240" cy="240" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.08" />
        </svg>
      </div>

      <div className="relative z-10 p-7 md:p-9 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left: Greeting + Description + Actions */}
          <div className="flex-1 min-w-0">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors uppercase tracking-widest mb-4">
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            {/* Status Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/80 dark:bg-rose-950/20 border border-rose-100/50 text-[#E11D48] text-[10px] font-black tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                Live Operations Center
              </span>
              {userLocation && (
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <FiMapPin className="w-3 h-3 text-[#E11D48]" />
                  {userLocation.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[34px] md:text-[42px] font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-3">
              {getGreeting()},{' '}
              <span className="text-[#E11D48]">{displayName}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl leading-relaxed mb-7 font-medium">
              BloodBridge AI is actively monitoring operations.{' '}
              {activeRequests > 0 && (
                <>
                  Tracking <strong className="text-gray-900 dark:text-white font-extrabold">{activeRequests} active</strong> emergency{activeRequests !== 1 ? ' requests' : ' request'}
                  {criticalCount > 0 && (
                    <> with <strong className="text-[#E11D48] font-extrabold">{criticalCount} critical stock alert{criticalCount !== 1 ? 's' : ''}</strong></>
                  )}.
                </>
              )}
              {activeRequests === 0 && ' All operations are stable and optimized.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewRequest}
                className="bg-[#E11D48] hover:bg-rose-600 text-white py-3 px-5 rounded-xl text-[13px] font-semibold shadow-md shadow-rose-500/15 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4 stroke-[2.5]" />
                New Blood Request
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenMap}
                className="glass-panel hover:bg-white/50 dark:hover:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-200 py-3 px-5 rounded-xl text-[13px] font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                Live Network Map
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAI}
                className="glass-panel hover:bg-white/50 dark:hover:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-200 py-3 px-5 rounded-xl text-[13px] font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <FiZap className="w-4 h-4 text-violet-500" />
                AI Console
              </motion.button>
            </div>
          </div>

          {/* Right: Efficiency Dial */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 relative z-10">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Rotating ring */}
              <motion.div
                className="absolute w-40 h-40 rounded-full border border-rose-100/40 dark:border-rose-950/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute w-32 h-32 rounded-full border border-dashed border-rose-100/30 dark:border-rose-950/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              />

              {/* Progress arc */}
              <svg className="absolute w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#F3F4F6" strokeWidth="4" fill="none" className="dark:stroke-slate-800" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  stroke="url(#hero-gradient)"
                  strokeWidth="4"
                  strokeDasharray="264"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 * 0.06 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
                <defs>
                  <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#FDA4AF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center readout */}
              <div className="w-24 h-24 rounded-full flex flex-col items-center justify-center glass-panel border border-white/30 dark:border-white/10 shadow-sm z-10">
                <FiTrendingUp className="w-4 h-4 text-[#E11D48] mb-1" />
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">94%</p>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Efficiency</p>
              </div>

              {/* Floating micro-tags */}
              <motion.div
                className="absolute -top-2 glass-panel border border-rose-200/50 dark:border-rose-950/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiAlertCircle className="w-3 h-3 text-[#E11D48]" />
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{activeRequests} Active</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-2 glass-panel border border-blue-200/50 dark:border-blue-950/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <FiClock className="w-3 h-3 text-[#3B82F6]" />
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">38s Avg Match</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <motion.div
            className="mt-7 flex items-center gap-4 px-5 py-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/15 border border-rose-100/60 dark:border-rose-900/30 relative overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-[#E11D48]" />
            <FiAlertCircle className="w-4 h-4 text-[#E11D48] flex-shrink-0 ml-1" />
            <p className="text-[12px] text-gray-700 dark:text-gray-300 font-medium">
              <strong className="text-[#E11D48] font-bold">Critical Alert:</strong>{' '}
              {criticalCount} blood group{criticalCount !== 1 ? 's' : ''} critically low. AI recommends dispatching matching donors immediately.
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
