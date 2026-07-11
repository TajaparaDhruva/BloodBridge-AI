import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FiCheck, FiZap, FiShield, FiTrendingUp, FiUsers, FiActivity,
  FiHeart, FiStar, FiArrowRight, FiClock, FiDatabase, FiAward,
  FiBell, FiFileText, FiLock, FiCalendar, FiGlobe,
  FiChevronDown, FiPlay, FiPhone
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const TRUST_STATS = [
  { value: '1,200+', label: 'Partner Hospitals', icon: FiHeart },
  { value: '50,000+', label: 'Active Donors', icon: FiUsers },
  { value: '<45s', label: 'Avg AI Match Time', icon: FiZap },
  { value: '99.8%', label: 'Platform Uptime', icon: FiActivity },
];

const FEATURES = [
  { icon: FiZap, title: 'AI-Powered Matching', desc: 'Our neural network matches blood requests to compatible nearby donors in under 45 seconds, 24/7.', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' },
  { icon: FiShield, title: 'HIPAA-Compliant Security', desc: 'AES-256 encrypted data, strict access controls, and full audit trail — your patient data stays protected.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
  { icon: FiTrendingUp, title: 'Predictive Inventory', desc: 'Machine learning models predict blood type shortages before they occur, giving you time to act proactively.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { icon: FiDatabase, title: 'Real-Time Dashboard', desc: 'Monitor all live requests, inventory levels, donor networks, and AI match performance from one command center.', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
  { icon: FiBell, title: 'Smart Notifications', desc: 'Context-aware alerts go to the right staff at the right time — never miss a critical blood shortage event again.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
  { icon: FiGlobe, title: 'Nationwide Network', desc: 'Tap into India\'s largest verified blood donor registry across 50+ cities — instantly accessible to partner hospitals.', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30' },
];

const FAQS = [
  { q: 'How does the 7-day free trial work?', a: 'Your trial starts immediately after hospital registration — no credit card required. You get full access to all professional features for 7 days. At trial end, upgrade to a paid plan to keep access.' },
  { q: 'What happens to my data after the trial ends?', a: 'Your data is securely retained for 30 days after trial expiry. Simply upgrade to a paid plan to restore full access instantly — no data loss occurs.' },
  { q: 'Can I switch between Professional and Enterprise?', a: 'Yes, you can upgrade or downgrade your plan at any time from the Billing section of your dashboard. Changes take effect immediately.' },
  { q: 'Is there a setup fee?', a: 'No. BloodBridge AI has zero setup fees. You start free, and only pay when you choose to subscribe. Annual billing options with discounts are coming soon.' },
  { q: 'How is patient data protected?', a: 'We are fully HIPAA-compliant and use AES-256 encryption at rest and in transit. Access is role-based and all actions are audited. Our infrastructure is hosted on ISO 27001-certified data centers in India.' },
];

const HospitalPartnership = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoModal, setDemoModal] = useState(false);

  // Selected Pricing Plan State
  const [activePlan, setActivePlan] = useState('professional');

  // Pricing Plans Data Structure
  const plansData = {
    free_trial: {
      name: '7-Day Free Trial',
      price: 'FREE',
      period: '/ 7 Days',
      desc: 'Perfect for testing our AI donor matching engine and checking platform capabilities.',
      badge: 'Recommended',
      badgeColor: 'bg-emerald-500 text-white',
      icon: <FiDatabase className="w-[1.1em] h-[1.1em] text-emerald-500 inline-block align-middle" />,
      buttonText: 'Start Free Trial',
      to: '/signup',
      features: [
        'Full access to all premium features',
        'AI Donor Matching Engine',
        'Unlimited Blood Requests',
        'Hospital Dashboard',
        'Real-Time Notifications',
        'Blood Inventory Dashboard',
        'Analytics & Staff Accounts'
      ]
    },
    professional: {
      name: 'Professional Plan',
      price: '₹2,999',
      period: '/month',
      desc: 'Ideal for clinics, single hospitals, and emergency dispatch centers looking to scale operations.',
      badge: 'Most Popular',
      badgeColor: 'bg-[#E11D48] text-white',
      icon: <FiActivity className="w-[1.1em] h-[1.1em] text-rose-500 inline-block align-middle" />,
      buttonText: 'Upgrade to Professional',
      to: '/signup',
      features: [
        'Everything in Free Trial',
        'Unlimited AI Matching',
        'Verified Partner Badge',
        'Advanced Predictive Analytics',
        'Hospital Collaboration Tools',
        'Monthly Reports & API Access'
      ]
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '₹7,999',
      period: '/month',
      desc: 'Designed for multi-facility networks, large healthcare systems, and government ID integrations.',
      badge: 'Best Value',
      badgeColor: 'bg-[#6366F1] text-white',
      icon: <FiAward className="w-[1.1em] h-[1.1em] text-[#6366F1] inline-block align-middle" />,
      buttonText: 'Contact Sales',
      to: '/signup',
      features: [
        'Everything in Professional',
        'AI Priority Matching Priority Route',
        'Predictive Network Analytics',
        'Disaster Response Activation Mode',
        'Unlimited Staff & Node Access',
        'Custom API & Government ID Sync'
      ]
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070B13] text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e1183808_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Live badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Hospital Partnership Program</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Partner with{' '}
              <span className="text-[#E11D48]">BloodBridge AI</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              Join India's AI-powered emergency blood network and connect your hospital with verified nearby blood donors in real time.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-[#E11D48] hover:bg-red-600 text-white shadow-xl shadow-red-500/20 hover:-translate-y-0.5 transition-all duration-300 text-[15px]"
              >
                <FiZap className="w-4.5 h-4.5" />
                Start Free Trial
              </Link>
              <button
                onClick={() => setDemoModal(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 text-[15px] shadow-sm"
              >
                <FiPlay className="w-4.5 h-4.5" />
                Schedule a Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl shadow-2xl p-6 overflow-hidden">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/05">
                <div className="w-8 h-8 rounded-xl bg-[#E11D48] flex items-center justify-center">
                  <FiHeart className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-[14px] block">BloodBridge AI</span>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Operations Control</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  System Live
                </div>
              </div>
              {/* Mock stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Active Requests', val: '24', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                  { label: 'AI Matches Today', val: '138', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                  { label: 'Donors Online', val: '1,204', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                  { label: 'Match Speed', val: '<45s', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/20' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-black/04 dark:border-white/04`}>
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] font-bold text-muted mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Mock request rows */}
              <div className="space-y-2">
                {[
                  { id: 'REQ-101', bg: 'O-', hospital: 'Metro Critical Care', status: 'Matching', statusColor: 'bg-rose-50 text-rose-600' },
                  { id: 'REQ-102', bg: 'AB+', hospital: 'Apollo Speciality', status: 'Dispatched', statusColor: 'bg-emerald-50 text-emerald-600' },
                  { id: 'REQ-103', bg: 'A+', hospital: 'Fortis Hiranandani', status: 'Completed', statusColor: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400' },
                ].map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-gray-50 dark:bg-white/03 rounded-xl px-4 py-2.5 border border-gray-100 dark:border-white/05">
                    <span className="text-[11px] font-bold text-muted">{r.id}</span>
                    <span className="text-[11px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-lg">{r.bg}</span>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">{r.hospital}</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${r.statusColor}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow below card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ── Trust Stats ─────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-gray-100 dark:border-white/05 bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {TRUST_STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <stat.icon className="w-6 h-6 text-[#E11D48] mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[11px] font-black text-[#E11D48] uppercase tracking-widest mb-3">Why Partner With Us</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Built for the <span className="text-[#E11D48]">Modern Hospital</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Every feature is designed to reduce response time, improve patient outcomes, and streamline your blood supply chain.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/06 rounded-3xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Section (Redesigned Premium Look) ─────────────────────────── */}
      <section id="pricing" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8F9FA] to-white overflow-hidden border-t border-slate-100">
        {/* Soft background glow decoration */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/03 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E11D48]/03 rounded-full blur-[120px] pointer-events-none translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-3">
               <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
               <span className="text-[10px] font-black text-[#E11D48] uppercase tracking-widest">Revenue Model</span>
             </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4 font-poppins">
              Partnership <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E11D48] to-rose-500">Plans</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              AI-powered emergency blood supply network for clinics, hospitals, and healthcare systems.
            </p>
          </motion.div>

          {/* Interactive Plans Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto px-2 sm:px-0 mb-12">
            {/* Left Column: Tab Selectors */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {Object.entries(plansData).map(([key, plan]) => {
                const isActive = activePlan === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActivePlan(key)}
                    whileHover={{ scale: 1.015, x: 4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.985 }}
                    className={`w-full text-left p-6 rounded-3xl relative flex items-center justify-between cursor-pointer border ${
                      isActive 
                        ? 'border-rose-500/0 dark:border-rose-500/0 text-[#E11D48] dark:text-[#F43F5E] shadow-md' 
                        : 'border-slate-100 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
                    }`}
                  >
                    {/* Morphing Background Pill Slider */}
                    {isActive && (
                      <motion.div
                        layoutId="activePricingTab"
                        className="absolute inset-0 border border-[#E11D48] bg-rose-50/40 dark:bg-rose-950/15 rounded-3xl -z-10 shadow-lg shadow-rose-500/[0.03]"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}

                    <div className="flex flex-col gap-1.5 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{plan.icon}</span>
                        <span className={`text-[15px] font-black ${isActive ? 'text-[#E11D48] dark:text-[#F43F5E]' : 'text-slate-800 dark:text-slate-200'}`}>{plan.name}</span>
                      </div>
                      <span className="text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                        {key === 'free_trial' && 'Ideal for testing platform limits'}
                        {key === 'professional' && 'Best for clinics & single hospitals'}
                        {key === 'enterprise' && 'For multi-facility systems'}
                      </span>
                    </div>
                    <div className="text-right relative z-10">
                      <p className={`text-[18px] font-extrabold ${isActive ? 'text-[#E11D48] dark:text-[#F43F5E]' : 'text-slate-900 dark:text-white'}`}>{plan.price}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{plan.period}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Column: Focused Details Card */}
            <div className="lg:col-span-7">
              <div className="border border-slate-100 dark:border-slate-800/60 rounded-[32px] p-8 md:p-10 bg-white/80 dark:bg-slate-900/65 backdrop-blur-md shadow-xl shadow-black/[0.02] h-full relative overflow-hidden flex flex-col justify-between">
                {/* Soft inner glow decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E11D48]/05 rounded-full blur-2xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePlan}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{plansData[activePlan].icon}</span>
                          <h3 className="text-2xl font-black text-slate-950 dark:text-white font-poppins">{plansData[activePlan].name}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9.5px] font-black uppercase tracking-wider shadow-sm ${plansData[activePlan].badgeColor}`}>
                          {plansData[activePlan].badge}
                        </span>
                      </div>

                      <p className="text-[14.5px] text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium font-poppins">
                        {plansData[activePlan].desc}
                      </p>

                      <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-slate-100 dark:border-white/05">
                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{plansData[activePlan].price}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-[14px]">{plansData[activePlan].period}</span>
                      </div>

                      <div className="mb-8">
                        <p className="text-[11px] font-black text-[#E11D48] uppercase tracking-widest mb-4 font-poppins">Features Included:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {plansData[activePlan].features.map((feat) => (
                            <motion.li 
                              key={feat} 
                              whileHover={{ x: 2 }}
                              className="flex items-start gap-3 text-[13.5px] text-slate-650 dark:text-slate-350 font-medium leading-tight group"
                            >
                              <motion.span 
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm transition-colors group-hover:bg-rose-100/60 dark:group-hover:bg-rose-900/40"
                              >
                                <FiCheck className="w-3.5 h-3.5 text-[#E11D48] stroke-[2.5]" />
                              </motion.span>
                              <span>{feat}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.015, y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      {activePlan === 'enterprise' ? (
                        <button
                          onClick={() => setDemoModal(true)}
                          className="w-full py-4.5 rounded-2xl text-white font-bold text-[14px] text-center transition-all bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 dark:text-slate-900 shadow-lg font-poppins"
                        >
                          {plansData[activePlan].buttonText}
                        </button>
                      ) : (
                        <Link
                          to={plansData[activePlan].to}
                          className="block w-full py-4.5 rounded-2xl text-white font-bold text-[14px] text-center transition-all bg-[#E11D48] hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 font-poppins"
                        >
                          {plansData[activePlan].buttonText}
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[11px] font-black text-[#E11D48] uppercase tracking-widest mb-3">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight">Common Questions</motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="space-y-3"
          >
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/06 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-[14px] text-slate-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/03 transition-colors cursor-pointer"
                >
                  {faq.q}
                  <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FiChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-6 pb-5 text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#E11D48]/5 dark:bg-[#E11D48]/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[11px] font-black text-[#E11D48] uppercase tracking-widest mb-4">Get Started Today</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
              Ready to Save More Lives?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Join 1,200+ hospitals already using BloodBridge AI to speed up emergency blood matching and save critical time.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-bold bg-[#E11D48] hover:bg-red-600 text-white shadow-xl shadow-red-500/25 hover:-translate-y-1 transition-all duration-300 text-[15px]"
              >
                <FiHeart className="w-4.5 h-4.5 fill-current" />
                Start 7-Day Free Trial
              </Link>
              <button
                onClick={() => setDemoModal(true)}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl font-bold bg-white dark:bg-white/05 border border-gray-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-[15px] shadow-sm"
              >
                <FiPhone className="w-4.5 h-4.5" />
                Talk to Sales
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ── Demo Booking Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {demoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-[#E11D48]">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-[17px]">Schedule a Demo</h3>
                  <p className="text-muted text-[12px]">We'll reach out within 24 hours</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {['Hospital Name', 'Contact Person', 'Email Address', 'Phone Number'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/05 border border-gray-200 dark:border-white/10 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all"
                  />
                ))}
              </div>

              <button
                onClick={() => setDemoModal(false)}
                className="w-full py-3.5 rounded-2xl font-bold bg-[#E11D48] hover:bg-red-600 text-white transition-colors text-[14px]"
              >
                Request Demo
              </button>
              <p className="text-center text-[11px] text-muted mt-3">Our team will confirm within 1 business day</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalPartnership;
