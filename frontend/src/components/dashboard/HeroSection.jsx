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
  const roleIcon = user?.role === 'hospital' ? '🏥' : user?.role === 'admin' ? '⚡' : '🩸';
  const displayName = user?.name?.split(' ')[0] || user?.role || 'Operator';

  const liveStats = [
    { label: 'Active Requests', value: activeRequests, suffix: ' live', color: '#C62A47' },
    { label: 'Donors Online', value: eligibleDonors, suffix: ' ready', color: '#059669' },
    { label: 'Total Inventory', value: totalUnits, suffix: ' units', color: '#0EA5E9' },
    { label: 'Average Match', value: '38', suffix: 's avg', color: '#6366F1' },
  ];

  return (
    <motion.section
      className="dashboard-hero relative overflow-hidden rounded-3xl border border-black/05 dark:border-white/05 dark:bg-darksurf/90 shadow-lg"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Premium ambient grid and background blur orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="dashboard-orb dashboard-orb-red animate-float-slow opacity-15" />
        <div className="dashboard-orb dashboard-orb-blue animate-float-delayed opacity-12" />
        <div className="dashboard-orb dashboard-orb-sky animate-float opacity-10" />
        <div className="dashboard-hero-grid opacity-70" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-9">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          
          {/* Left Greeting Column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="section-label !mb-0 shadow-sm border border-bloodred/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Live Operations Center
              </span>
              {userLocation && (
                <span className="text-[11px] font-bold text-muted bg-black/03 dark:bg-white/04 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-black/05 dark:border-white/05">
                  <FiMapPin className="w-3.5 h-3.5 text-bloodred" />
                  {userLocation.name}
                </span>
              )}
            </div>

            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] font-black text-slate dark:text-white leading-[1.08] tracking-tight mb-3">
              {getGreeting()},{' '}
              <span className="text-gradient-red">{displayName}</span>
              <span className="inline-block ml-2.5 text-[30px] md:text-[34px] animate-bounce">{roleIcon}</span>
            </h1>

            <p className="text-muted text-[13px] md:text-[14px] max-w-xl leading-relaxed mb-6 font-medium">
              BloodBridge AI monitoring is active. Currently tracking{' '}
              <strong className="text-slate dark:text-white font-bold">{activeRequests} emergency requests</strong>
              {criticalCount > 0 ? (
                <> with <strong className="text-bloodred font-black underline decoration-2">{criticalCount} low stock alerts</strong></>
              ) : (
                <> with stable operations</>
              )}
              . Overall system load is optimized.
            </p>

            {/* Premium Stat Pills Grid */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 mb-6">
              {liveStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="dashboard-stat-pill hover:border-black/15 dark:hover:border-white/15 transition-all duration-200 cursor-default flex items-center gap-2.5 p-2 px-3 rounded-2xl bg-white/70 dark:bg-darksurf2/75 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: stat.color, boxShadow: `0 0 10px ${stat.color}aa` }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none">{stat.label}</span>
                    <span className="text-[13px] font-black text-slate dark:text-white mt-0.5 leading-none">
                      <AnimatedCounter value={stat.value} duration={1200 + i * 100} />
                      <span className="text-muted font-bold text-[10px] ml-0.5">{stat.suffix}</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action buttons with Framer Motion triggers */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewRequest} 
                className="btn-primary py-2.5 px-5 text-[13px] font-bold shadow-md hover:shadow-lg cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                New Request
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenMap} 
                className="btn-secondary py-2.5 px-5 text-[13px] font-bold cursor-pointer"
              >
                <FiActivity className="w-4 h-4 text-bloodred" />
                Live Network Map
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAI} 
                className="btn-ghost py-2.5 px-4 text-[13px] font-bold !text-aiblue hover:!bg-aiblue/08 cursor-pointer flex items-center gap-1.5"
              >
                <FiZap className="w-4 h-4 animate-bounce" />
                AI Console
              </motion.button>
            </div>
          </div>

          {/* Right Visual Dial Cluster */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 xl:mr-4">
            <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
              {/* Outer decorative ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-bloodred/10 dark:border-bloodred/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner dashed ring */}
              <motion.div
                className="absolute inset-3 rounded-full border border-aiblue/10 dark:border-aiblue/15 border-dashed"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center glass dial */}
              <div className="absolute inset-7 glass-card rounded-full flex flex-col items-center justify-center shadow-premium border border-white/40 dark:border-white/10 relative overflow-hidden">
                {/* Visual grid inside dial */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C62A47 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <FiTrendingUp className="w-7 h-7 text-bloodred mb-0.5" />
                    <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  </div>
                  <p className="text-[26px] font-black text-slate dark:text-white leading-none mt-0.5">
                    <AnimatedCounter value={94} />%
                  </p>
                  <p className="text-[9px] font-extrabold text-muted uppercase tracking-widest mt-1">Efficiency</p>
                </div>
              </div>

              {/* Floating micro indicators */}
              <motion.div
                className="absolute -top-2 right-2 glass-card px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/50 dark:border-white/05 cursor-default hover:scale-105 transition-transform"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiAlertCircle className="w-3 h-3 text-bloodred animate-ping" />
                <span className="text-[10px] font-bold text-slate dark:text-white">{activeRequests} Emergencies</span>
              </motion.div>

              <motion.div
                className="absolute bottom-1 -left-3 glass-card px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/50 dark:border-white/05 cursor-default hover:scale-105 transition-transform"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <FiClock className="w-3 h-3 text-aiblue animate-spin-slow" />
                <span className="text-[10px] font-bold text-slate dark:text-white">38s Matches</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Ticker Alert (If critical inventory issues) */}
        {criticalCount > 0 && (
          <motion.div
            className="mt-6 flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-bloodred/06 dark:bg-bloodred/10 border border-bloodred/15 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-bloodred" />
            <div className="w-8 h-8 rounded-xl bg-bloodred/12 flex items-center justify-center flex-shrink-0 border border-bloodred/15">
              <FiAlertCircle className="w-4 h-4 text-bloodred" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-black text-bloodred uppercase tracking-wider">CRITICAL SYSTEM DISPATCH</p>
                <span className="text-[9px] font-bold bg-bloodred text-white px-1.5 py-0.2 rounded-md uppercase tracking-wider animate-pulse">ACTION REQ</span>
              </div>
              <p className="text-muted text-[11px] font-medium leading-relaxed mt-0.5">
                Depletion warning: {criticalCount} blood groups critically low. AI recommends auto-dispatching matching donors.
              </p>
            </div>
            
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider whitespace-nowrap hidden sm:block">SYSTEM MONITORED</span>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
