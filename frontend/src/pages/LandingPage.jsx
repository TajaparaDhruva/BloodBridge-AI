import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  FiHeart, FiActivity, FiMapPin, FiCheckCircle, FiBell, FiShield,
  FiClock, FiTrendingUp, FiSearch, FiSliders, FiDatabase, FiGrid,
  FiPlus, FiChevronDown, FiPlay, FiMap, FiChevronRight, FiUsers, FiAward
} from 'react-icons/fi';

// AnimatedCounter Component for statistics counters
const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const cleanVal = typeof value === 'string' ? value.replace(/,/g, '') : value;
    const isSpecial = typeof value === 'string' && (value.includes('<') || value.includes('s'));
    const target = isSpecial ? 45 : parseInt(cleanVal, 10);

    if (isNaN(target)) {
      setCount(value);
      return;
    }

    const end = target;
    const totalSteps = 40;
    const stepTime = (duration * 1000) / totalSteps;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  if (typeof value === 'string' && value.includes('<')) {
    return <span>&lt; {count}s</span>;
  }
  return <span>{typeof count === 'number' ? count.toLocaleString() : count}</span>;
};

// Animation settings
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requests, createRequest } = useAuth();

  // States for FAQs
  const [activeFaq, setActiveFaq] = useState(null);

  // Interactive Live Matching Simulator States
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulator = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs(['[0.0s] Emergency Request received for B- Positive...']);

    setTimeout(() => {
      setSimStep(2);
      setSimLogs(prev => [...prev, '[0.6s] Spatial AI matching engine initialized...']);
    }, 800);

    setTimeout(() => {
      setSimStep(3);
      setSimLogs(prev => [...prev, '[1.2s] Querying live database for O-Negative and B- negative donors...']);
    }, 1500);

    setTimeout(() => {
      setSimStep(4);
      setSimLogs(prev => [...prev, '[1.8s] Filtering 42 donors by travel distance and medical eligibility...']);
    }, 2200);

    setTimeout(() => {
      setSimStep(5);
      setSimLogs(prev => [...prev, '[2.4s] Dispatched real-time push alert to top 3 eligible matches...']);
    }, 2900);

    setTimeout(() => {
      setSimStep(6);
      setSimLogs(prev => [...prev, '[3.0s] Match confirmed! Donor Rajesh Kumar (O-) accepted dispatch request. Routing live...']);
      setIsSimulating(false);
    }, 3600);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
    { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
    { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
    { q: t('landing.faq.q4'), a: t('landing.faq.a4') }
  ];

  return (
    <div className="bg-[#FAF9F6] text-darkslate dark:bg-[#0F172A] dark:text-[#F9FAFB] min-h-screen transition-colors duration-300">
      <Navbar />

      {/* 2. Hero Section */}
      <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-bloodred/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-crimson/5 rounded-full blur-[130px] pointer-events-none"></div>

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Col */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >

              {/* Emergency Banner */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bloodred/10 dark:bg-bloodred/20 border border-bloodred/25 mb-6 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-bloodred"></span>
                <span className="text-xs font-bold text-bloodred uppercase tracking-wider">
                  {t('common.appName')} LIVE STATUS
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
              >
                {t('landing.hero.titleLine1')}
                <br />
                <span className="bg-gradient-to-r from-bloodred via-crimson to-rose-600 bg-clip-text text-transparent">
                  {t('landing.hero.titleLine2')}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10 max-w-2xl"
              >
                {t('landing.hero.subtitle')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 mb-10 w-full sm:w-auto"
              >
                <Link
                  to="/signup"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold bg-gradient-to-r from-bloodred to-crimson text-white hover:shadow-premium-hover hover:scale-102 transition-all duration-300 text-base"
                >
                  {t('landing.hero.ctaRegister')}
                </Link>

                <Link
                  to="/login"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold bg-white dark:bg-[#1E293B] border border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-300 text-base shadow-premium"
                >
                  {t('landing.hero.ctaRequest')}
                </Link>

                <button
                  onClick={startSimulator}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold bg-bloodred/5 dark:bg-bloodred/10 text-bloodred border border-bloodred/10 hover:bg-bloodred/10 transition-all duration-300 text-sm"
                >
                  <FiPlay className="w-4 h-4 fill-current" />
                  {t('landing.hero.ctaDemo')}
                </button>
              </motion.div>

              {/* Trust Badge Grid */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 mt-2"
              >
                <div className="flex -space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 border-2 border-[#FAF9F6] dark:border-[#0F172A] flex items-center justify-center text-white text-xs font-bold shadow-md">O-</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 border-2 border-[#FAF9F6] dark:border-[#0F172A] flex items-center justify-center text-white text-xs font-bold shadow-md">A+</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 border-2 border-[#FAF9F6] dark:border-[#0F172A] flex items-center justify-center text-white text-xs font-bold shadow-md">B-</div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">5,000+ Active Donors</h4>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Live & geographically mapped across cities</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Col: AI Matching Simulator visualization */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative w-full flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md glass-card rounded-3xl p-6 shadow-2xl relative border border-white/20 dark:border-white/5 transition-all duration-500 hover:scale-102">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Dispatch Core</span>
                  </div>
                  <span className="text-[10px] py-0.5 px-2 bg-bloodred/10 text-bloodred font-semibold rounded-full uppercase">Simulator</span>
                </div>

                {/* Simulated Map Visual */}
                <div className="h-44 bg-gray-50 dark:bg-slate-900/80 rounded-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden mb-4 flex items-center justify-center shadow-inner">
                   {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(#d7263810_1px,transparent_1.5px)] bg-[size:16px_16px] opacity-70 pointer-events-none"></div>

                  {/* Visual States */}
                  {simStep === 0 && (
                    <div className="text-center p-6 flex flex-col items-center relative z-10">
                      <FiMap className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2 animate-bounce" />
                      <span className="text-xs font-medium text-gray-400 mb-3.5">Ready to simulate real-time AI matching?</span>
                      <button
                        onClick={startSimulator}
                        className="px-4 py-2 bg-gradient-to-r from-bloodred to-crimson hover:bg-crimson text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-102 hover:shadow-premium-hover transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <FiPlay className="w-3.5 h-3.5 fill-current" />
                        Click Watch Demo
                      </button>
                    </div>
                  )}

                  {simStep > 0 && (
                    <>
                      {/* Pulse Hospital Node */}
                      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="w-6 h-6 rounded-full bg-bloodred/20 flex items-center justify-center border border-bloodred relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-bloodred animate-pulse"></span>
                          <span className="absolute inset-0 w-full h-full rounded-full bg-bloodred/30 animate-ping"></span>
                        </div>
                        <span className="text-[9px] font-extrabold bg-gray-900 text-white dark:bg-white dark:text-black py-0.5 px-1 rounded shadow-sm mt-1 uppercase">HOSPITAL</span>
                      </div>

                      {/* Connection Line */}
                      {simStep >= 4 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <path
                            d="M 125,88 Q 170,50 250,98"
                            fill="none"
                            stroke="#D72638"
                            strokeWidth="2"
                            strokeDasharray="5"
                            className="animate-[dash_2s_linear_infinite]"
                          />
                        </svg>
                      )}

                      {/* Donor Node */}
                      {simStep >= 3 && (
                        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 relative ${simStep >= 6 ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-amber-100 border-amber-300 text-amber-600'
                            }`}>
                            {simStep >= 6 ? '✓' : 'O-'}
                            {simStep >= 6 && <span className="absolute inset-0 w-full h-full rounded-full bg-emerald-500/30 animate-ping"></span>}
                          </div>
                          <span className="text-[9px] font-extrabold bg-gray-900 text-white dark:bg-white dark:text-black py-0.5 px-1 rounded shadow-sm mt-1 uppercase">DONOR</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Progress Timeline inside Simulator */}
                <div className="flex flex-col gap-2 h-28 overflow-y-auto bg-gray-900 text-gray-300 dark:bg-[#0B0F19] p-3.5 rounded-xl font-mono text-[10px] leading-relaxed border border-gray-800">
                  {simLogs.map((log, index) => (
                    <div key={index} className="flex gap-1.5">
                      <span className="text-bloodred">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {isSimulating && (
                    <div className="w-12 h-3.5 bg-bloodred/20 rounded animate-pulse border border-bloodred/30"></div>
                  )}
                </div>

                {/* Simulator Trigger */}
                <button
                  disabled={isSimulating}
                  onClick={startSimulator}
                  className="w-full mt-4 py-2.5 rounded-xl font-bold bg-bloodred text-white hover:bg-crimson disabled:opacity-50 transition-all text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
                >
                  {isSimulating ? 'AI Matching...' : 'Run Match Simulation'}
                </button>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Trusted By Section */}
      <section className="py-12 bg-gray-50/50 dark:bg-[#0B0F19]/40 border-y border-gray-100/70 dark:border-gray-900/60">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <motion.p variants={fadeInUp} className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">Empowering National Medical Networks</motion.p>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-center opacity-65 dark:opacity-50"
          >
            {['APEX CLINICS', 'RED CROSS ASSOC', 'MEDGRID INTL', 'LIFESPAN LABS', 'HEALTHALLIANCE'].map((logo, idx) => (
              <motion.span
                key={idx}
                variants={fadeInUp}
                className={`font-extrabold text-lg text-gray-500 tracking-tight ${idx === 4 ? 'hidden lg:block' : ''}`}
              >
                {logo}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Statistics */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12"
        >

          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center border border-white/20 dark:border-white/5 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-bloodred/10 text-bloodred flex items-center justify-center mb-3">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value="5,842" />
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{t('landing.stats.donors')}</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center border border-white/20 dark:border-white/5 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <FiActivity className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value="142" />
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{t('landing.stats.hospitals')}</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center border border-white/20 dark:border-white/5 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <FiBell className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value="1,945" />
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{t('landing.stats.requests')}</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-6 text-center border border-white/20 dark:border-white/5 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <FiHeart className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value="3,480" />
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{t('landing.stats.lives')}</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-6 col-span-2 lg:col-span-1 text-center border border-white/20 dark:border-white/5 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <FiClock className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value="< 45s" />
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{t('landing.stats.matchTime')}</span>
          </motion.div>

        </motion.div>
      </section>

      {/* 5. Features Section */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              {t('landing.features.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >

            {/* Feat 1 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-bloodred/10 text-bloodred flex items-center justify-center mb-6">
                <FiActivity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.ai.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.ai.desc')}</p>
            </motion.div>

            {/* Feat 2 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <FiBell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.alerts.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.alerts.desc')}</p>
            </motion.div>

            {/* Feat 3 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.verified.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.verified.desc')}</p>
            </motion.div>

            {/* Feat 4 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <FiGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.dashboard.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.dashboard.desc')}</p>
            </motion.div>

            {/* Feat 5 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.tracking.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.tracking.desc')}</p>
            </motion.div>

            {/* Feat 6 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                <FiDatabase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.inventory.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.inventory.desc')}</p>
            </motion.div>

            {/* Feat 7 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center mb-6">
                <FiSliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.rare.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.rare.desc')}</p>
            </motion.div>

            {/* Feat 8 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-6">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">{t('landing.features.items.predictive.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('landing.features.items.predictive.desc')}</p>
            </motion.div>

            {/* Feat 9 */}
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-md hover:-translate-y-1.5 transition-all duration-300 hover:shadow-premium-hover hover:border-bloodred/25 dark:hover:border-bloodred/25 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-6">
                <FiSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3">Location Intelligence</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Dynamic geofencing boundaries mapped automatically based on donor transport options.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 6. AI Matching Workflow */}
      <section id="workflow" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            {t('landing.workflow.title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('landing.workflow.subtitle')}
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 items-center relative">
          {[
            { step: '1', title: t('landing.workflow.steps.step1'), desc: 'Hospital triggers demand' },
            { step: '2', title: t('landing.workflow.steps.step2'), desc: 'AI analyzes records' },
            { step: '3', title: t('landing.workflow.steps.step3'), desc: 'Geofence matches' },
            { step: '4', title: t('landing.workflow.steps.step4'), desc: 'Eligibility query' },
            { step: '5', title: t('landing.workflow.steps.step5'), desc: 'Availability verification' },
            { step: '6', title: t('landing.workflow.steps.step6'), desc: 'Donor tiering' },
            { step: '7', title: t('landing.workflow.steps.step7'), desc: 'Best match output' },
            { step: '8', title: t('landing.workflow.steps.step8'), desc: 'SMS + Push alert' },
            { step: '9', title: t('landing.workflow.steps.step9'), desc: 'Confirmed donation' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-bloodred to-crimson text-white flex items-center justify-center font-extrabold text-sm shadow-md mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                {item.step}
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1 max-w-[100px]">{item.title}</h4>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 px-2 leading-tight">{item.desc}</span>

              {/* Connector Line for Desktop */}
              {i < 8 && (
                <div className="hidden lg:block absolute top-6 left-[65%] w-[70%] h-0.5 bg-gradient-to-r from-bloodred/60 to-bloodred/10 -z-0"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Dashboard Preview */}
      <section className="py-24 bg-gray-50/50 dark:bg-slate-900/40 border-y border-gray-100 dark:border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >

            {/* Text */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 text-left">
              <span className="text-xs font-bold text-bloodred tracking-widest uppercase mb-3 block">SaaS Panel</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                Premium Panels Built for Hospitals & Donors
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Hospitals gain access to full donor availability timelines, live dispatcher maps, and predictive inventory warnings. Donors enjoy scheduling portals, medical eligibility tests, and digital badge metrics.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live coordinates matching within 10km radius</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">One-click scheduling with partner clinics</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Predictive replenishment queues powered by AI</span>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-bloodred text-white hover:bg-crimson hover:scale-102 transition-all duration-300"
                >
                  Explore Dashboard Panel
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Mock Visual */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-800 p-5 relative"
              >

                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-bloodred animate-pulse"></span>
                    <span className="font-extrabold text-sm text-gray-800 dark:text-white">Metro Clinic Admin</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold text-[10px] uppercase">Critical stock</span>
                    <span className="px-2 py-0.5 rounded bg-bloodred/10 text-bloodred font-semibold text-[10px] uppercase">Active Alerts</span>
                  </div>
                </div>

                {/* Mock Widgets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <motion.div whileHover={{ scale: 1.02 }} className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-left transition-colors">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Donors Match</span>
                    <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">456</h4>
                    <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">↑ 12% this week</span>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-left transition-colors">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Alerts</span>
                    <h4 className="text-2xl font-extrabold text-bloodred mt-1">3 Pending</h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">A-, O-, AB-</span>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-left transition-colors">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Match Success</span>
                    <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">98.4%</h4>
                    <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Highly stable</span>
                  </motion.div>
                </div>

                {/* Mock Chart Area */}
                <div className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-left mb-4">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-3 block">Replenishment Rate (Last 30 Days)</span>
                  <div className="h-28 flex items-end gap-3.5 pt-2">
                    {[30, 45, 60, 40, 75, 90, 85, 100, 70, 80, 95, 110].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(val / 110) * 80}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.03 }}
                          className="w-full bg-gradient-to-t from-bloodred/80 to-bloodred rounded-t"
                        ></motion.div>
                        <span className="text-[8px] text-gray-400 font-mono">D{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 8. How It Works Timeline */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Simple 3-Step Process
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            How BloodBridge AI streamlines donation routing in emergencies.
          </p>
        </motion.div>

        {/* Desktop timeline, horizontal layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="hidden md:grid grid-cols-3 gap-8 relative"
        >
          <div className="absolute top-[42px] left-[15%] w-[70%] h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-xl font-bold text-bloodred mb-6 relative">
              01
            </motion.div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Request is Made</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Hospital fills out an emergency blood request through our secure cloud panel.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-xl font-bold text-bloodred mb-6">
              02
            </motion.div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">AI Analyzes & Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Geolocation algorithm matches nearby active, eligible donors, sending SMS and push notifications.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-xl font-bold text-bloodred mb-6">
              03
            </motion.div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Donation is Delivered</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Donor accepts, travels, and donates, automatically updating local blood inventory registers.</p>
          </motion.div>
        </motion.div>

        {/* Mobile vertical timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex md:hidden flex-col gap-8 text-left border-l-2 border-gray-200 dark:border-gray-800 pl-6 ml-4"
        >
          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-bloodred border-4 border-white dark:border-[#0F172A] shadow-md"></div>
            <h4 className="text-base font-bold text-gray-950 dark:text-white mb-1">01. Request is Made</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hospital fills out an emergency blood request through our secure cloud panel.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-bloodred border-4 border-white dark:border-[#0F172A] shadow-md"></div>
            <h4 className="text-base font-bold text-gray-950 dark:text-white mb-1">02. AI Analyzes & Alerts</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Geolocation algorithm matches nearby active, eligible donors, sending SMS and push notifications.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-bloodred border-4 border-white dark:border-[#0F172A] shadow-md"></div>
            <h4 className="text-base font-bold text-gray-950 dark:text-white mb-1">03. Donation is Delivered</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Donor accepts, travels, and donates, automatically updating local blood inventory registers.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-24 bg-gray-50/50 dark:bg-slate-900/40 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              Trusted by the Medical Community
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Real testimonials from doctors, donors, and hospital administrators.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >

            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card rounded-2xl p-8 border border-white/20 dark:border-white/5 shadow-sm text-left transition-all duration-300"
            >
              <div className="flex gap-1 text-amber-500 mb-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 italic">
                "We had a case requiring rare AB- blood. BloodBridge AI notified 8 matching donors within 10 seconds. The donor arrived at our ICU in under 30 minutes. Incredible service!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bloodred to-rose-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  DR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">Dr. Vikram Rathore</h4>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">ICU Chief, Metro Hospital</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card rounded-2xl p-8 border border-white/20 dark:border-white/5 shadow-sm text-left transition-all duration-300"
            >
              <div className="flex gap-1 text-amber-500 mb-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 italic">
                "Signing up was incredibly simple. The SMS dispatch lists travel routing directions and hospital gate codes clearly. Being able to track my impact metrics keeps me motivated."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  SM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">Sagar Mehta</h4>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">O+ Active Donor, 8 Donations</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card rounded-2xl p-8 border border-white/20 dark:border-white/5 shadow-sm text-left transition-all duration-300"
            >
              <div className="flex gap-1 text-amber-500 mb-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 italic">
                "Integrating BloodBridge AI resolved our inventory checking bottlenecks completely. Our blood reserve data syncs automatically, which has halved matching delays."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  SK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">Sunita Kulkarni</h4>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">Blood Bank Operations Lead</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 11. Future Vision */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Future Scale & National Vision
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our technology roadmap to integrate with state-level disaster response frameworks.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >

          <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-left flex flex-col items-start transition-all">
            <div className="w-10 h-10 rounded-xl bg-bloodred/10 text-bloodred flex items-center justify-center mb-4">
              <FiPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2">Government Integration</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">Direct synchronization with national digital health ID grids for authenticated medical histories.</p>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-left flex flex-col items-start transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
              <FiActivity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2">Ambulance Dispatch</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">Live emergency matching directly triggered from on-road ambulances during critical transit.</p>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-left flex flex-col items-start transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2">National Donor Registry</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">A unified cross-state alert grid enabling drone delivery logistics for ultra-rare blood types.</p>
          </motion.div>

        </motion.div>
      </section>

      {/* 12. FAQ Accordion */}
      <section id="faq" className="py-24 bg-gray-50/50 dark:bg-slate-900/40 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {t('landing.faq.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                      {faq.q}
                    </span>
                    <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-gray-50 dark:border-gray-800/50 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 13. Contact Form & Maps */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Form */}
          <div className="lg:col-span-6 text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              {t('landing.contact.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {t('landing.contact.subtitle')}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Emergency Inquiry Submitted.'); }} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('landing.contact.name')}</label>
                  <input
                    type="text"
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-bloodred/15 focus:border-bloodred text-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('landing.contact.email')}</label>
                  <input
                    type="email"
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-bloodred/15 focus:border-bloodred text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('landing.contact.message')}</label>
                <textarea
                  rows="4"
                  required
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-bloodred/15 focus:border-bloodred text-gray-800 dark:text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-bloodred to-crimson text-white font-bold hover:shadow-premium-hover transition-all text-sm uppercase tracking-wider shadow-md"
              >
                {t('landing.contact.send')}
              </button>
            </form>
          </div>

          {/* Right Column: Maps Placeholder & Info */}
          <div className="lg:col-span-6 text-left flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/60 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Emergency Dispatch HQ</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('landing.contact.address')}
                <br />
                {t('landing.contact.phone')}
              </p>

              {/* Maps visual mock */}
              <div className="h-60 bg-gray-100 dark:bg-slate-800/70 rounded-2xl relative overflow-hidden border border-gray-200/40 dark:border-gray-700 shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#d7263815_1px,transparent_1.5px)] bg-[size:16px_16px]"></div>

                {/* Heart Center Node */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-bloodred/20 text-bloodred flex items-center justify-center animate-pulse border border-bloodred relative shadow-lg">
                    <span>📍</span>
                  </div>
                  <span className="text-[10px] font-bold bg-gray-950 text-white dark:bg-white dark:text-black py-0.5 px-2 rounded-md uppercase shadow mt-1">HQ Main Dispatcher</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
