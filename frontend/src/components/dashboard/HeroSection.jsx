import React from 'react';
import { motion } from 'framer-motion';
import {
  FiAlertCircle, FiMapPin, FiPlus, FiZap, FiActivity,
  FiTrendingUp, FiClock,
} from 'react-icons/fi';
import { AnimatedCounter, getGreeting } from './shared';

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
  const totalUnits = inventory.reduce((a, b) => a + b.units, 0);
  const eligibleDonors = donors.filter((d) => d.eligibility === 'eligible').length;
  const criticalCount = inventory.filter((i) => i.status === 'critical').length;
  const displayName = user?.name?.split(' ')[0] || user?.role || 'System';

  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl border border-[#F3F4F6] dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Concentric pink dots mesh grid inside the visual section */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden hidden lg:block select-none z-0">
        <svg className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/4 text-[#E11D48] opacity-10" width="600" height="600" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 8" />
          <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" />
          <circle cx="300" cy="300" r="160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1 10" />
          <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 12" />
        </svg>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-9 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left Greeting Column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6]/50 dark:bg-rose-950/20 border border-[#FDA4AF]/20 text-[#E11D48] text-[10px] font-black tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                Live Operations Center
              </span>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                <FiMapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                {userLocation?.name || 'Ahmedabad'}
              </span>
            </div>

            <h1 className="text-[36px] md:text-[44px] lg:text-[48px] font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-4 flex items-center gap-3">
              Good morning, <span className="text-[#E11D48]">{displayName}</span>
              <span className="inline-block text-[36px] ml-2 text-[#E11D48] animate-pulse select-none leading-none">🩸</span>
            </h1>

            <p className="text-[#64748B] dark:text-gray-400 text-sm md:text-base max-w-xl leading-relaxed mb-8 font-medium">
              BloodBridge AI monitoring is active. Currently tracking <strong className="text-gray-900 dark:text-white font-extrabold">{activeRequests} emergency</strong> requests with <strong className="text-[#E11D48] font-extrabold">{criticalCount} low stock alerts</strong>. Overall system load is optimized.
            </p>

            {/* Premium Stat Pills Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {/* Active Requests */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FCFBFA] dark:bg-slate-800/50 border border-[#F3F4F6] dark:border-slate-800/80 shadow-sm">
                <div className="w-8.5 h-8.5 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Active Requests</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-extrabold text-gray-900 dark:text-white leading-none">{activeRequests}</span>
                    <span className="text-[11px] font-bold text-[#E11D48] leading-none">live</span>
                  </div>
                </div>
              </div>

              {/* Donors Online */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FCFBFA] dark:bg-slate-800/50 border border-[#F3F4F6] dark:border-slate-800/80 shadow-sm">
                <div className="w-8.5 h-8.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Donors Online</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-extrabold text-gray-900 dark:text-white leading-none">{eligibleDonors}</span>
                    <span className="text-[11px] font-bold text-emerald-500 leading-none">ready</span>
                  </div>
                </div>
              </div>

              {/* Total Inventory */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FCFBFA] dark:bg-slate-800/50 border border-[#F3F4F6] dark:border-slate-800/80 shadow-sm">
                <div className="w-8.5 h-8.5 rounded-full bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center flex-shrink-0 text-sky-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Total Inventory</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-extrabold text-gray-900 dark:text-white leading-none">{totalUnits}</span>
                    <span className="text-[11px] font-bold text-sky-500 leading-none">units</span>
                  </div>
                </div>
              </div>

              {/* Average Match */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FCFBFA] dark:bg-slate-800/50 border border-[#F3F4F6] dark:border-slate-800/80 shadow-sm">
                <div className="w-8.5 h-8.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center flex-shrink-0 text-[#6366F1]">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Average Match</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-extrabold text-gray-900 dark:text-white leading-none">38s</span>
                    <span className="text-[11px] font-bold text-[#6366F1] leading-none">avg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewRequest} 
                className="bg-[#E11D48] hover:bg-rose-600 text-white py-3.5 px-6 rounded-2xl text-[13px] font-bold shadow-md shadow-rose-500/10 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <FiPlus className="w-4.5 h-4.5 stroke-[3]" />
                <span>New Request</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenMap} 
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-[#E5E7EB] dark:border-slate-700 text-gray-800 dark:text-gray-200 py-3.5 px-6 rounded-2xl text-[13px] font-bold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>Live Network Map</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAI} 
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-[#E5E7EB] dark:border-slate-700 text-gray-800 dark:text-gray-200 py-3.5 px-6 rounded-2xl text-[13px] font-bold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <FiZap className="w-4 h-4 text-[#8B5CF6]" />
                <span>AI Console</span>
              </motion.button>
            </div>
          </div>

          {/* Right Visual Dial Cluster */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 lg:mr-4 relative z-10">
            <div className="relative w-52 h-52 flex items-center justify-center flex-shrink-0">
              
              {/* Concentric rings */}
              <motion.div
                className="absolute w-44 h-44 rounded-full border border-rose-100/50 dark:border-rose-950/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute w-36 h-36 rounded-full border border-rose-100/50 dark:border-rose-950/20 border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Progress ring track */}
              <svg className="absolute w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#rose-grad-dial)"
                  strokeWidth="3.5"
                  strokeDasharray="264"
                  strokeDashoffset="15"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="rose-grad-dial" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#FDA4AF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center glass dial */}
              <div className="absolute w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg border border-[#F3F4F6] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
                <div className="flex flex-col items-center">
                  <FiTrendingUp className="w-5 h-5 text-[#E11D48] mb-0.5" />
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
                    94%
                  </p>
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Efficiency</p>
                </div>
              </div>

              {/* Floating micro indicators */}
              <motion.div
                className="absolute -top-3 bg-white dark:bg-slate-900 border border-[#FFE4E6] dark:border-rose-950/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm cursor-default hover:scale-105 transition-transform"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiAlertCircle className="w-3.5 h-3.5 text-[#E11D48] animate-pulse" />
                <span className="text-[10px] font-extrabold text-gray-900 dark:text-white leading-none">{activeRequests} Emergencies</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-950/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm cursor-default hover:scale-105 transition-transform"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <FiClock className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="text-[10px] font-extrabold text-gray-900 dark:text-white leading-none">38s Matches</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Ticker Alert (If critical inventory issues) */}
        {criticalCount > 0 && (
          <motion.div
            className="mt-8 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-rose-50/45 dark:bg-rose-950/15 border border-[#FFE4E6]/60 dark:border-rose-900/30 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E11D48]" />
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100/50 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0 text-[#E11D48]">
                <FiAlertCircle className="w-4.5 h-4.5" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 leading-relaxed">
                <span className="text-[11px] font-black text-[#E11D48] uppercase tracking-wider flex items-center gap-2">
                  Critical System Dispatch
                  <span className="text-[8px] font-black bg-[#E11D48] text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">Action Req</span>
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                  Depletion warning: {criticalCount} blood groups critically low. AI recommends auto-dispatching matching donors.
                </span>
              </div>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl text-[9px] font-extrabold text-gray-400 dark:text-gray-500 tracking-widest uppercase whitespace-nowrap hidden md:block">
              System Monitored
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
