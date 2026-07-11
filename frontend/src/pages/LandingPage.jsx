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
  FiPlus, FiChevronDown, FiPlay, FiMap, FiChevronRight, FiUsers, FiAward, FiArrowRight, FiCheck
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
      to: '/hospital-partnership',
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
      to: '/hospital-partnership',
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
      to: '/hospital-partnership',
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
      <section 
        id="hero" 
        className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden min-h-screen flex items-center bg-[#FAF9F6] dark:bg-[#070B13] transition-colors"
      >
        {/* === THEMED BACKGROUND SYSTEM === */}

        {/* Layer 1: Radial gradient mesh — crimson aurora */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full bg-gradient-radial from-rose-200/60 via-rose-100/20 to-transparent dark:from-rose-900/25 dark:via-rose-900/10 dark:to-transparent blur-[80px]" />
          <div className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-radial from-red-100/70 via-rose-50/30 to-transparent dark:from-red-950/30 dark:to-transparent blur-[100px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-radial from-pink-100/40 to-transparent dark:from-rose-900/10 dark:to-transparent blur-[70px]" />
        </div>

        {/* Layer 2: Dot-grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E11D4810_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none z-0" />

        {/* Layer 3: Decorative SVG — network nodes + heartbeat line */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.12]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Network connection lines */}
            <line x1="120" y1="200" x2="380" y2="420" stroke="#E11D48" strokeWidth="1.2" strokeDasharray="6 4"/>
            <line x1="380" y1="420" x2="700" y2="280" stroke="#E11D48" strokeWidth="1.2" strokeDasharray="6 4"/>
            <line x1="700" y1="280" x2="1050" y2="480" stroke="#E11D48" strokeWidth="1.2" strokeDasharray="6 4"/>
            <line x1="1050" y1="480" x2="1340" y2="310" stroke="#E11D48" strokeWidth="1.2" strokeDasharray="6 4"/>
            <line x1="220" y1="680" x2="580" y2="540" stroke="#E11D48" strokeWidth="1" strokeDasharray="4 6"/>
            <line x1="580" y1="540" x2="900" y2="700" stroke="#E11D48" strokeWidth="1" strokeDasharray="4 6"/>
            <line x1="900" y1="700" x2="1200" y2="580" stroke="#E11D48" strokeWidth="1" strokeDasharray="4 6"/>
            {/* Heartbeat/ECG line across middle */}
            <polyline points="0,450 160,450 200,450 230,350 260,580 290,420 320,420 440,420 470,300 500,580 530,420 560,420 720,420 750,350 780,520 810,420 840,420 1000,420 1030,380 1060,490 1090,420 1120,420 1440,420" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="none" opacity="0.6"/>
            {/* Node dots */}
            <circle cx="120" cy="200" r="6" fill="#E11D48" opacity="0.5"/>
            <circle cx="380" cy="420" r="8" fill="#E11D48" opacity="0.4"/>
            <circle cx="700" cy="280" r="10" fill="#E11D48" opacity="0.35"/>
            <circle cx="1050" cy="480" r="7" fill="#E11D48" opacity="0.45"/>
            <circle cx="1340" cy="310" r="6" fill="#E11D48" opacity="0.4"/>
            <circle cx="220" cy="680" r="5" fill="#E11D48" opacity="0.5"/>
            <circle cx="580" cy="540" r="8" fill="#E11D48" opacity="0.4"/>
            <circle cx="900" cy="700" r="6" fill="#E11D48" opacity="0.35"/>
            <circle cx="1200" cy="580" r="7" fill="#E11D48" opacity="0.45"/>
            {/* Ripple rings around key nodes */}
            <circle cx="700" cy="280" r="22" stroke="#E11D48" strokeWidth="1" fill="none" opacity="0.25"/>
            <circle cx="700" cy="280" r="38" stroke="#E11D48" strokeWidth="0.7" fill="none" opacity="0.15"/>
            <circle cx="380" cy="420" r="18" stroke="#E11D48" strokeWidth="1" fill="none" opacity="0.2"/>
          </svg>
        </div>

        {/* Layer 4: Large decorative blood-drop silhouette — right side */}
        <div className="absolute right-[-60px] top-[-80px] w-[520px] h-[520px] pointer-events-none z-0 opacity-[0.04] dark:opacity-[0.06]">
          <svg viewBox="0 0 200 260" fill="#E11D48" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10 C100 10 20 100 20 160 C20 205 56 240 100 240 C144 240 180 205 180 160 C180 100 100 10 100 10Z"/>
          </svg>
        </div>

        {/* Layer 5: Soft edge vignette to blend */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-white/0 via-white/0 to-rose-50/40 dark:from-transparent dark:to-rose-950/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column (Brand Information) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col items-start text-left font-poppins relative z-10"
            >

              {/* Status Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                  LIVE SYSTEM ACTIVE
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6 text-slate-900 dark:text-white"
              >
                Finding Blood<br />
                Saves Lives.<br />
                <span className="text-[#E11D48]">BloodBridge AI</span><br />
                Finds It Faster.
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-8 max-w-xl font-sans"
              >
                Our AI connects the right donors, nearby hospitals, and urgent requests in real-time. No delays. Just impact.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 mb-10 w-full sm:w-auto font-poppins"
              >
                <Link
                  to="/signup"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-[#E11D48] hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 transition-all duration-300 text-[14px]"
                >
                  <FiHeart className="w-4 h-4 fill-current" />
                  <span>Register as Donor</span>
                </Link>

                <Link
                  to="/login"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-white dark:bg-[#0F1420] border border-gray-200 dark:border-white/10 text-[#E11D48] hover:bg-gray-50 dark:hover:bg-white/02 transition-all duration-300 text-[14px] shadow-sm"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Request Blood</span>
                </Link>

                <button
                  onClick={startSimulator}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-rose-50/70 dark:bg-rose-950/20 text-[#E11D48] hover:bg-rose-100/40 dark:hover:bg-rose-950/30 transition-all duration-300 text-[14px]"
                >
                  <FiPlay className="w-4 h-4 fill-current" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
                className="bg-white/95 dark:bg-[#0F1420]/95 backdrop-blur-md border border-gray-100 dark:border-white/05 hover:border-rose-500/20 dark:hover:border-rose-500/10 p-5 rounded-3xl shadow-lg shadow-black/02 flex items-center justify-between gap-1 max-w-lg w-full transition-all duration-300"
              >
                {/* Stat 1 */}
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 text-[15px] font-black text-slate-800 dark:text-white">
                    <span className="text-red-500 text-[13px]">👥</span>
                    <span>5,000+</span>
                  </div>
                  <p className="text-[9.5px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">Active Donors</p>
                </div>
                <div className="h-6 w-[1px] bg-gray-100 dark:bg-white/05" />

                {/* Stat 2 */}
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 text-[15px] font-black text-slate-800 dark:text-white">
                    <span className="text-purple-500 text-[13px]">🏥</span>
                    <span>1,200+</span>
                  </div>
                  <p className="text-[9.5px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">Hospitals</p>
                </div>
                <div className="h-6 w-[1px] bg-gray-100 dark:bg-white/05" />

                {/* Stat 3 */}
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 text-[15px] font-black text-slate-800 dark:text-white">
                    <span className="text-emerald-500 text-[13px]">🛡️</span>
                    <span>98%</span>
                  </div>
                  <p className="text-[9.5px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">Match Accuracy</p>
                </div>
                <div className="h-6 w-[1px] bg-gray-100 dark:bg-white/05" />

                {/* Stat 4 */}
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 text-[15px] font-black text-slate-800 dark:text-white">
                    <span className="text-amber-500 text-[13px]">⚡</span>
                    <span>30s</span>
                  </div>
                  <p className="text-[9.5px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">Avg. Response</p>
                </div>
              </motion.div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative w-full flex flex-col items-center gap-8 justify-center z-10"
            >
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className="w-full max-w-md bg-white/95 dark:bg-[#0F1420]/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl relative border border-gray-100 dark:border-white/05 hover:border-rose-500/20 dark:hover:border-rose-500/10 transition-all duration-300"
              >

                {/* Simulator Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/05 pb-4 mb-4 font-poppins">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI DISPATCH CORE</span>
                  </div>
                  <span className="text-[9px] font-bold py-0.5 px-2 bg-red-50 dark:bg-red-950/20 text-[#E11D48] rounded-full uppercase tracking-wider">Simulator</span>
                </div>

                {/* Simulated Visual Dashboard — themed */}
                <div className="h-44 bg-[#FAF9F6] dark:bg-[#070B13]/40 rounded-2xl border border-rose-100 dark:border-white/05 relative overflow-hidden mb-4 shadow-inner">

                  {/* Dot-grid — matches page background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#E11D4812_1.5px,transparent_1.5px)] bg-[size:14px_14px]" />

                  {/* Soft rose radial glow in center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-rose-100/60 dark:bg-rose-900/10 blur-2xl pointer-events-none" />

                  {/* Pulse rings from center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="absolute inset-0 -m-8 rounded-full border border-[#E11D48]/20 animate-ping" style={{animationDuration:'2s'}} />
                    <div className="absolute inset-0 -m-14 rounded-full border border-[#E11D48]/10 animate-ping" style={{animationDuration:'2.8s', animationDelay:'0.4s'}} />
                    <div className="absolute inset-0 -m-20 rounded-full border border-[#E11D48]/06 animate-ping" style={{animationDuration:'3.5s', animationDelay:'0.8s'}} />
                  </div>

                  {/* SVG connections with moving dots */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 176" fill="none">
                    {/* Hospital → Center */}
                    <line x1="72" y1="88" x2="185" y2="88" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5"/>
                    {/* Center → Donor 1 */}
                    <line x1="215" y1="88" x2="315" y2="46" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
                    {/* Center → Donor 2 */}
                    <line x1="215" y1="88" x2="320" y2="134" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5"/>
                    {/* Moving dot — hospital to center */}
                    <circle r="3" fill="#3B82F6" opacity="0.8">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M72,88 L185,88"/>
                    </circle>
                    {/* Moving dot — center to donor 1 */}
                    <circle r="3" fill="#E11D48" opacity="0.8">
                      <animateMotion dur="1.8s" repeatCount="indefinite" path="M215,88 L315,46"/>
                    </circle>
                    {/* Moving dot — center to donor 2 */}
                    <circle r="3" fill="#E11D48" opacity="0.7">
                      <animateMotion dur="2.3s" repeatCount="indefinite" path="M215,88 L320,134"/>
                    </circle>
                  </svg>

                  {/* Center blood-drop badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1E293B] shadow-lg border border-rose-100 dark:border-white/05 flex items-center justify-center relative">
                      <span className="text-[#E11D48] text-xl">🩸</span>
                      <div className="absolute inset-0 rounded-full bg-[#E11D48]/08 animate-ping pointer-events-none" />
                    </div>
                  </div>

                  {/* Hospital badge — left */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] shadow-md border border-blue-100 dark:border-white/05 flex items-center justify-center text-blue-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"/>
                      </svg>
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 tracking-wider uppercase">Hospital</span>
                  </div>

                  {/* Donor 1 badge — top right */}
                  <div className="absolute right-10 top-4 z-10 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] shadow-md border border-rose-100 dark:border-white/05 flex items-center justify-center text-[#E11D48]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                      </svg>
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 tracking-wider uppercase">Donor</span>
                  </div>

                  {/* Donor 2 badge — bottom right */}
                  <div className="absolute right-8 bottom-4 z-10 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] shadow-md border border-rose-100 dark:border-white/05 flex items-center justify-center text-[#E11D48]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                      </svg>
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 tracking-wider uppercase">Donor</span>
                  </div>

                  {/* AI Matching pill — top center */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#0F1420]/90 backdrop-blur border border-rose-100 dark:border-white/05 rounded-full px-3 py-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">AI Matching</span>
                    </div>
                  </div>

                </div>

                {/* Match progress bar box */}
                <div className="bg-gray-50 dark:bg-[#070B13]/40 border border-slate-100 dark:border-white/05 p-4 rounded-2xl text-left font-poppins">
                  <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200">Real-Time Match in Progress</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">Scanning donors · Checking availability · Optimizing route</p>
                  
                  {/* Animated crimson progress bar */}
                  <div className="mt-3.5 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#E11D48] transition-all duration-1000 ease-out rounded-full" 
                        style={{ width: isSimulating ? `${(simStep / 6) * 100}%` : '78%' }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-[#E11D48] w-8 text-right">
                      {isSimulating ? `${Math.floor((simStep / 6) * 100)}%` : '78%'}
                    </span>
                  </div>
                </div>

                {/* Simulator Trigger */}
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={startSimulator}
                  className="w-full mt-4 bg-[#E11D48] hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide font-poppins"
                >
                  {isSimulating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Matching Logistics...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Run Match Simulation</span>
                      <FiArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>

              </motion.div>

            </motion.div>



          </div>
        </div>
      </section>


      {/* 3b. Partner Network Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center mb-8"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            TRUSTED BY LEADING <span className="text-[#E11D48]">HEALTHCARE NETWORKS</span>
          </p>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {[
            { name: 'APEX', sub: 'CLINICS', color: 'text-[#E11D48]', bg: 'bg-rose-50', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg> },
            { name: 'RED CROSS', sub: 'ASSOCIATION', color: 'text-red-500', bg: 'bg-red-50', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/></svg> },
            { name: 'MEDGRID', sub: 'INTERNATIONAL', color: 'text-blue-500', bg: 'bg-blue-50', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
            { name: 'LIFESPAN', sub: 'LABS', color: 'text-teal-500', bg: 'bg-teal-50', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
            { name: 'HEALTHALLIANCE', sub: 'NETWORK', color: 'text-indigo-500', bg: 'bg-indigo-50', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.025, transition: { duration: 0.2 } }}
              className={`group bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-rose-500/20 dark:hover:border-rose-500/10 transition-all duration-300 ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} dark:bg-white/5 flex items-center justify-center flex-shrink-0 ${item.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                {item.icon}
              </div>
              <div className="text-left leading-tight">
                <p className="font-black text-[12px] text-slate-700 dark:text-slate-200 tracking-tight transition-colors duration-300 group-hover:text-[#E11D48]">{item.name}</p>
                <p className="text-[9px] font-semibold text-slate-400 tracking-widest mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-gray-100 dark:bg-white/05 w-full" />

      {/* 4. Statistics — OUR IMPACT IN REAL TIME */}
      <section id="impact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            OUR <span className="text-[#E11D48]">IMPACT</span> IN REAL TIME
          </h2>
          <div className="flex justify-center mt-3">
            <svg className="w-5 h-5 text-[#E11D48]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {/* Stat 1 — Donors (rose) */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-white dark:bg-slate-900 rounded-2xl pt-8 pb-0 px-4 text-center border border-gray-100/70 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-rose-500/20 dark:hover:border-rose-500/10 flex flex-col items-center relative overflow-hidden transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <FiUsers className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-[#E11D48] mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105"><AnimatedCounter value="5,842" /></h3>
            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1 relative z-10">Registered Donors</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-16 relative z-10">Generous donors ready<br/>to save lives</p>
            <div className="absolute bottom-0 left-0 right-0 z-0 transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 300 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                <path d="M0,45 C50,15 100,60 150,35 C200,10 250,55 300,30 L300,70 L0,70 Z" fill="#FFE4E6"/>
                <path d="M0,55 C60,35 120,65 180,45 C230,28 270,60 300,45 L300,70 L0,70 Z" fill="#FECDD3" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

          {/* Stat 2 — Hospitals (blue) */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-white dark:bg-slate-900 rounded-2xl pt-8 pb-0 px-4 text-center border border-gray-100/70 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/10 flex flex-col items-center relative overflow-hidden transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <FiActivity className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-blue-500 mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105"><AnimatedCounter value="142" /></h3>
            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1 relative z-10">Connected Hospitals</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-16 relative z-10">Hospitals connected<br/>across the nation</p>
            <div className="absolute bottom-0 left-0 right-0 z-0 transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 300 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                <path d="M0,35 C70,10 130,60 190,30 C240,5 270,50 300,25 L300,70 L0,70 Z" fill="#DBEAFE"/>
                <path d="M0,50 C80,30 150,65 210,40 C260,20 285,55 300,40 L300,70 L0,70 Z" fill="#BFDBFE" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

          {/* Stat 3 — Requests (amber) */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-white dark:bg-slate-900 rounded-2xl pt-8 pb-0 px-4 text-center border border-gray-100/70 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-amber-500/20 dark:hover:border-amber-500/10 flex flex-col items-center relative overflow-hidden transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <FiBell className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-amber-500 mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105"><AnimatedCounter value="1,945" /></h3>
            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1 relative z-10">Emergency Requests</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-16 relative z-10">Urgent requests<br/>handled instantly</p>
            <div className="absolute bottom-0 left-0 right-0 z-0 transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 300 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                <path d="M0,40 C60,15 110,65 170,35 C220,10 265,55 300,30 L300,70 L0,70 Z" fill="#FEF3C7"/>
                <path d="M0,55 C70,35 130,65 190,48 C240,30 275,60 300,48 L300,70 L0,70 Z" fill="#FDE68A" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

          {/* Stat 4 — Lives (emerald) */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-white dark:bg-slate-900 rounded-2xl pt-8 pb-0 px-4 text-center border border-gray-100/70 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-500/10 flex flex-col items-center relative overflow-hidden transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <FiHeart className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-emerald-500 mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105"><AnimatedCounter value="3,480" /></h3>
            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1 relative z-10">Lives Saved</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-16 relative z-10">Real people.<br/>Real impact.</p>
            <div className="absolute bottom-0 left-0 right-0 z-0 transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 300 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                <path d="M0,38 C55,12 115,62 175,32 C225,8 268,52 300,28 L300,70 L0,70 Z" fill="#D1FAE5"/>
                <path d="M0,52 C65,32 125,65 185,45 C235,28 272,58 300,44 L300,70 L0,70 Z" fill="#A7F3D0" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

          {/* Stat 5 — Match Time (pink) */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-white dark:bg-slate-900 rounded-2xl pt-8 pb-0 px-4 col-span-2 lg:col-span-1 text-center border border-gray-100/70 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-pink-500/20 dark:hover:border-pink-500/10 flex flex-col items-center relative overflow-hidden transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-400 flex items-center justify-center mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <FiClock className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-rose-400 mb-2 relative z-10 transition-transform duration-300 group-hover:scale-105"><AnimatedCounter value="< 45s" /></h3>
            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1 relative z-10">Avg Match Time</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-16 relative z-10">Fastest average match<br/>time in India</p>
            <div className="absolute bottom-0 left-0 right-0 z-0 transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 300 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
                <path d="M0,42 C65,18 120,62 180,36 C228,14 268,56 300,32 L300,70 L0,70 Z" fill="#FCE7F3"/>
                <path d="M0,55 C70,38 130,66 192,48 C242,30 278,62 300,48 L300,70 L0,70 Z" fill="#FBCFE8" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 5. Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[#E11D48] text-lg">🩸</span>
              <span className="text-xs font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
                Powered by AI &bull; Driven by Compassion
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-gray-900 dark:text-white">
              Revolutionizing <span className="text-gray-900 dark:text-white">Blood Logistics</span> with AI
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              How our ecosystem ensures no request goes unanswered.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >

            {/* Feature 1 — Smart AI Matching */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#E11D48]/20 dark:hover:border-[#E11D48]/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiActivity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-[#E11D48]">Smart AI Matching</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Our predictive routing connects requests with matching eligible donors in milliseconds.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-4 right-4 w-28 h-28 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" viewBox="0 0 120 120" fill="none">
                <circle cx="90" cy="90" r="25" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="90" cy="90" r="5" fill="#E11D48" opacity="0.7" />
                <path d="M30 60 L60 40 L90 65" stroke="#E11D48" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <circle cx="30" cy="60" r="4" fill="#E11D48" opacity="0.6" />
                <circle cx="60" cy="40" r="4" fill="#E11D48" opacity="0.6" />
                <path d="M50 85 L50 55" stroke="#FECDD3" strokeWidth="2.5" />
                <path d="M45 55 L50 45 L55 55" fill="#E11D48" opacity="0.7" />
              </svg>
            </motion.div>

            {/* Feature 2 — Emergency Alerts */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-amber-500/20 dark:hover:border-amber-500/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiBell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-amber-550">Emergency Alerts</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Instant push and SMS notifications broadcasted to high-priority donor circles.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-4 right-4 w-28 h-28 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" viewBox="0 0 120 120" fill="none">
                <rect x="60" y="30" width="40" height="50" rx="6" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <rect x="68" y="42" width="24" height="3" rx="1.5" fill="#F59E0B" opacity="0.7" />
                <rect x="68" y="50" width="18" height="3" rx="1.5" fill="#F59E0B" opacity="0.6" />
                <rect x="68" y="58" width="20" height="3" rx="1.5" fill="#F59E0B" opacity="0.5" />
                <path d="M80 30 L80 22" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="80" cy="18" r="4" fill="#F59E0B" opacity="0.6" />
                <path d="M40 70 Q50 60 60 70" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                <path d="M35 80 Q50 68 60 80" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
              </svg>
            </motion.div>

            {/* Feature 3 — Verified Donors */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-emerald-500/20 dark:hover:border-emerald-500/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-emerald-550">Verified Donors</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Rigorous donor profiling and medical log synchronization to ensure blood safety.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-2 right-2 w-32 h-32 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" viewBox="0 0 130 130" fill="none">
                <circle cx="85" cy="75" r="30" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M73 75 L81 83 L97 67" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="105" cy="100" r="10" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.8" />
                <path d="M101 100 L104 103 L110 97" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              </svg>
            </motion.div>

            {/* Feature 4 — Hospital Dashboard */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-violet-500/20 dark:hover:border-violet-500/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-500 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-violet-550">Hospital Dashboard</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Real-time blood bank status, predictive stock metrics, and request trackers.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-4 right-4 w-32 h-24 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 140 100" fill="none">
                <rect x="20" y="20" width="100" height="65" rx="6" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <line x1="20" y1="35" x2="120" y2="35" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.6" />
                <rect x="30" y="45" width="8" height="30" rx="2" fill="#8B5CF6" opacity="0.35" />
                <rect x="44" y="52" width="8" height="23" rx="2" fill="#8B5CF6" opacity="0.45" />
                <rect x="58" y="42" width="8" height="33" rx="2" fill="#8B5CF6" opacity="0.5" />
                <rect x="72" y="55" width="8" height="20" rx="2" fill="#8B5CF6" opacity="0.4" />
                <rect x="86" y="48" width="8" height="27" rx="2" fill="#8B5CF6" opacity="0.55" />
                <rect x="100" y="40" width="8" height="35" rx="2" fill="#8B5CF6" opacity="0.35" />
              </svg>
            </motion.div>

            {/* Feature 5 — Real-Time Tracking */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#E11D48]/20 dark:hover:border-[#E11D48]/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-[#E11D48]">Real-Time Tracking</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Live donor dispatch maps show exactly when and where help is arriving.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-4 right-2 w-32 h-28 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 140 120" fill="none">
                <path d="M20 90 Q50 50 80 70 Q110 90 130 60" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="5 4" fill="none" />
                <circle cx="20" cy="90" r="5" fill="#E11D48" opacity="0.6" />
                <circle cx="80" cy="70" r="5" fill="#E11D48" opacity="0.6" />
                <path d="M130 60 L130 40" stroke="#E11D48" strokeWidth="2.5" />
                <path d="M122 48 L130 35 L138 48" fill="#E11D48" opacity="0.7" />
                <circle cx="130" cy="35" r="3" fill="#E11D48" opacity="0.8" />
              </svg>
            </motion.div>

            {/* Feature 6 — Blood Inventory */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-teal-500/20 dark:hover:border-teal-500/10 transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-500 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FiDatabase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-teal-555">Blood Inventory</h3>
              <div className="w-8 h-[3px] bg-[#E11D48] rounded-full mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Live cloud analytics sync with hospital blood banks to check reserves instantly.</p>
              {/* Decorative Illustration */}
              <svg className="absolute bottom-4 right-2 w-32 h-28 opacity-60 dark:opacity-30 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 140 120" fill="none">
                <ellipse cx="90" cy="40" rx="30" ry="12" stroke="#14B8A6" strokeWidth="2" fill="none" />
                <path d="M60 40 L60 55 Q60 67 90 67 Q120 67 120 55 L120 40" stroke="#14B8A6" strokeWidth="2" fill="none" />
                <line x1="75" y1="52" x2="105" y2="52" stroke="#14B8A6" strokeWidth="1.5" opacity="0.6" />
                <rect x="25" y="70" width="30" height="35" rx="4" stroke="#14B8A6" strokeWidth="2" fill="none" opacity="0.8" />
                <rect x="30" y="80" width="8" height="18" rx="2" fill="#14B8A6" opacity="0.35" />
                <rect x="42" y="85" width="8" height="13" rx="2" fill="#14B8A6" opacity="0.45" />
                <path d="M55 87 L60 55" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
              </svg>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 6. AI Matching Workflow */}
      <section id="workflow" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle wavy background decoration at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full opacity-40 dark:opacity-20">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFE4E6" className="dark:fill-rose-950/30"></path>
          </svg>
        </div>

        {/* Corner dot grid left */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>
        {/* Corner dot grid right */}
        <div className="absolute bottom-6 right-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#E11D48] text-lg">🩸</span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#E11D48] uppercase">
                AI-Powered &bull; Fast &bull; Reliable
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              The <span className="text-gray-900 dark:text-white">BloodBridge AI</span> Matching Protocol
            </h2>

            {/* Heartbeat line */}
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-8 text-[#E11D48]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 15 h30 l5 -10 l5 20 l5 -15 h25" />
              </svg>
            </div>

            <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From a hospital emergency to a confirmed donation in minutes.
            </p>
          </motion.div>

          {/* Workflow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-y-12 gap-x-4 items-start relative">
            {[
              {
                step: '1',
                badgeColor: 'bg-[#E11D48]',
                borderColor: 'border-[#E11D48]',
                title: 'HOSPITAL REQUEST',
                desc: 'Hospital triggers demand for specific blood.',
                iconColor: 'text-[#E11D48]',
                arrowColor: '#E11D48',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22V8h16v14M12 2v6M9 5h6" />
                    <rect x="9" y="12" width="6" height="10" />
                    <path d="M12 15v4M10 17h4" />
                  </svg>
                )
              },
              {
                step: '2',
                badgeColor: 'bg-[#EC4899]',
                borderColor: 'border-[#EC4899]',
                title: 'AI ANALYSIS',
                desc: 'AI analyzes patient data and blood requirements.',
                iconColor: 'text-[#EC4899]',
                arrowColor: '#EC4899',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5" />
                    <path d="M12 5h4.5A2.5 2.5 0 0 1 19 7.5v0A2.5 2.5 0 0 1 16.5 10H12" />
                    <path d="M12 14h4.5A2.5 2.5 0 0 1 19 16.5v0a2.5 2.5 0 0 1-2.5 2.5H12" />
                    <path d="M12 5H7.5A2.5 2.5 0 0 0 5 7.5v0A2.5 2.5 0 0 0 7.5 10H12" />
                    <path d="M12 14H7.5A2.5 2.5 0 0 0 5 16.5v0A2.5 2.5 0 0 0 7.5 19H12" />
                  </svg>
                )
              },
              {
                step: '3',
                badgeColor: 'bg-[#8B5CF6]',
                borderColor: 'border-[#8B5CF6]',
                title: 'LOCATION FILTERING',
                desc: 'Geofence matches nearby eligible donors.',
                iconColor: 'text-[#8B5CF6]',
                arrowColor: '#8B5CF6',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                )
              },
              {
                step: '4',
                badgeColor: 'bg-[#3B82F6]',
                borderColor: 'border-[#3B82F6]',
                title: 'MEDICAL ELIGIBILITY',
                desc: 'Eligibility query checks donor medical history.',
                iconColor: 'text-[#3B82F6]',
                arrowColor: '#3B82F6',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                )
              },
              {
                step: '5',
                badgeColor: 'bg-[#14B8A6]',
                borderColor: 'border-[#14B8A6]',
                title: 'AVAILABILITY CHECK',
                desc: 'Real-time availability verification of donors.',
                iconColor: 'text-[#14B8A6]',
                arrowColor: '#14B8A6',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M9 16l2 2 4-4" />
                  </svg>
                )
              },
              {
                step: '6',
                badgeColor: 'bg-[#F59E0B]',
                borderColor: 'border-[#F59E0B]',
                title: 'PRIORITY RANKING',
                desc: 'AI ranks donors based on priority and proximity.',
                iconColor: 'text-[#F59E0B]',
                arrowColor: '#F59E0B',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                    <polygon points="12,5 13,8 16,8 13.5,9.5 14.5,12 12,10.5 9.5,12 10.5,9.5 8,8 11,8" fill="currentColor" />
                  </svg>
                )
              },
              {
                step: '7',
                badgeColor: 'bg-[#F97316]',
                borderColor: 'border-[#F97316]',
                title: 'BEST DONOR SELECTOR',
                desc: 'Best match donor is selected by AI engine.',
                iconColor: 'text-[#F97316]',
                arrowColor: '#F97316',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="11" r="2" />
                    <path d="M8 16c0-2 2-3 4-3s4 1 4 3" />
                  </svg>
                )
              },
              {
                step: '8',
                badgeColor: 'bg-[#F43F5E]',
                borderColor: 'border-[#F43F5E]',
                title: 'LIVE NOTIFICATION',
                desc: 'SMS + Push alert sent to the donor instantly.',
                iconColor: 'text-[#F43F5E]',
                arrowColor: '#F43F5E',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                )
              },
              {
                step: '9',
                badgeColor: 'bg-[#10B981]',
                borderColor: 'border-[#10B981]',
                title: 'SUCCESSFUL DONATION',
                desc: 'Donation completed and confirmed successfully.',
                iconColor: 'text-[#10B981]',
                arrowColor: '#10B981',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                
                {/* Connecting Arched Line on Large Screens */}
                {i < 8 && (
                  <div className="hidden lg:block absolute top-[28px] left-[65%] w-[70%] h-12 pointer-events-none z-0">
                    <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 100 50">
                      <path d="M 0,20 Q 50,0 100,20" stroke={item.arrowColor} strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M 52,9 L 55,7 L 52,5" fill="none" stroke={item.arrowColor} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                
                {/* Number Badge + Circle Wrapper */}
                <div className="relative w-20 h-20 mb-4 z-10 flex items-center justify-center">
                  {/* Outer dotted ring */}
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed ${item.borderColor}/40 group-hover:scale-105 group-hover:rotate-45 transition-transform duration-500`}></div>
                  
                  {/* Inner Solid Circle */}
                  <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:shadow-lg transition-shadow duration-300">
                    <div className={`${item.iconColor}`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Number Badge */}
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow-md ${item.badgeColor}`}>
                    {item.step}
                  </div>
                </div>
                
                {/* Title */}
                <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 mt-1">
                  {item.title}
                </h4>
                
                {/* Accent Line */}
                <div className={`w-8 h-[2px] rounded-full mb-3 ${item.badgeColor}`}></div>
                
                {/* Description */}
                <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-normal max-w-[100px] px-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pill Badge at the bottom */}
          <div className="flex justify-center mt-16 relative z-10">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-md text-xs font-semibold text-gray-700 dark:text-gray-300 hover:shadow-lg transition-shadow duration-300">
              <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center">
                <FiHeart className="w-3.5 h-3.5 fill-[#E11D48]" />
              </div>
              <span>Every step powered by AI &bull; Every second counts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dashboard Preview */}
      <section id="hospitals" className="py-24 bg-gray-50/30 dark:bg-slate-900/10 border-y border-gray-100 dark:border-gray-900 overflow-hidden relative">
        <div id="donors" className="absolute top-0" />
        {/* Decorative background dot pattern */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >

            {/* Left Panel: Text & Features list */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 text-left">
              {/* Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 w-fit mb-6">
                <span className="text-[#E11D48] text-xs">👑</span>
                <span className="text-[10px] font-black tracking-wider text-[#E11D48] uppercase">SaaS Panel</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                Premium Panels<br />Built for <span className="text-[#E11D48]">Hospitals & Donors</span>
              </h2>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Hospitals gain access to full donor availability timelines, live dispatcher maps, and predictive inventory warnings. Donors enjoy scheduling portals, medical eligibility tests, and digital badge metrics.
              </p>

              {/* 3 Styled List Items */}
              <div className="flex flex-col gap-6">
                
                {/* Item 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Live coordinates matching within 10km radius</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Real-time geo-matching to find nearby eligible donors instantly.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">One-click scheduling with partner clinics</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Seamless appointment booking with integrated clinics.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5" />
                      <path d="M12 5h4.5A2.5 2.5 0 0 1 19 7.5v0A2.5 2.5 0 0 1 16.5 10H12" />
                      <path d="M12 14h4.5A2.5 2.5 0 0 1 19 16.5v0a2.5 2.5 0 0 1-2.5 2.5H12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Predictive replenishment queues powered by AI</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI forecasts blood demand and optimizes stock automatically.</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold bg-[#E11D48] text-white hover:bg-crimson shadow-md shadow-rose-500/10 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Explore Dashboard Panel
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Panel: Interactive SaaS Dashboard Mockup */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 relative transition-shadow duration-300"
              >

                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-[#E11D48]">
                      <span className="text-lg">🩸</span>
                    </div>
                    <div className="text-left">
                      <span className="font-extrabold text-sm text-gray-800 dark:text-white block">Metro Clinic Admin</span>
                      <span className="text-[10px] text-gray-400 font-medium">Real-time Operations Dashboard</span>
                    </div>
                  </div>
                  
                  {/* Caution Pills */}
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 border border-amber-100/50 dark:border-amber-900/30">
                      <span>⚠️</span> CRITICAL STOCK
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 border border-rose-100/50 dark:border-rose-900/30">
                      <span>🔔</span> ACTIVE ALERTS
                    </span>
                  </div>
                </div>

                {/* 3 Color-Coded Mock Widgets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  
                  {/* Widget 1 — Total Donors Match (Rose) */}
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 p-4 rounded-2xl text-left transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-rose-100/50 dark:bg-rose-900/30 text-[#E11D48] flex items-center justify-center mb-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Total Donors Match</span>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">456</h4>
                    <span className="text-[10px] text-emerald-500 font-bold mt-1 block flex items-center gap-0.5">
                      <span>↗</span> 12% this week
                    </span>
                  </motion.div>

                  {/* Widget 2 — Active Alerts (Yellow) */}
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-900/20 p-4 rounded-2xl text-left transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100/50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mb-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Active Alerts</span>
                    <h4 className="text-2xl font-black text-[#E11D48] mt-1">3 Pending</h4>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                      A-, O-, AB-
                    </span>
                  </motion.div>

                  {/* Widget 3 — Match Success (Teal) */}
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-4 rounded-2xl text-left transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Match Success</span>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">98.4%</h4>
                    <span className="text-[10px] text-emerald-500 font-bold mt-1 block flex items-center gap-0.5">
                      <span>↗</span> Highly stable
                    </span>
                  </motion.div>

                </div>

                {/* Mock Chart Area */}
                <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900/40 p-5 rounded-2xl text-left shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Replenishment Rate (Last 30 Days)</span>
                    
                    {/* Units dropdown mock */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] text-[9px] font-black border border-rose-100/50 dark:border-rose-900/20 cursor-pointer">
                      <span>🩸 Units Replenished</span>
                      <span className="text-[7px]">▼</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between text-[8px] text-gray-400 font-mono h-32 pr-1 pb-4 text-right">
                      <span>500</span>
                      <span>400</span>
                      <span>300</span>
                      <span>200</span>
                      <span>100</span>
                      <span>0</span>
                    </div>
                    
                    {/* Bars container */}
                    <div className="flex-1 flex items-end gap-2.5 sm:gap-3.5 h-32 border-b border-gray-100 dark:border-gray-800 pb-4">
                      {[
                        { label: 'D1', val: 110 },
                        { label: 'D2', val: 150 },
                        { label: 'D3', val: 200 },
                        { label: 'D4', val: 135 },
                        { label: 'D5', val: 250 },
                        { label: 'D6', val: 310 },
                        { label: 'D7', val: 290 },
                        { label: 'D8', val: 375 },
                        { label: 'D9', val: 250 },
                        { label: 'D10', val: 305 },
                        { label: 'D11', val: 360 },
                        { label: 'D12', val: 450 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${(item.val / 500) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.03 }}
                            className="w-full bg-gradient-to-t from-rose-500 to-[#E11D48] rounded-t-sm"
                          ></motion.div>
                          <span className="text-[8px] text-gray-400 font-mono font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 8. How It Works Timeline */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle wavy background decoration at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full opacity-40 dark:opacity-20">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFE4E6" className="dark:fill-rose-950/30"></path>
          </svg>
        </div>

        {/* Corner dot grid left */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>
        {/* Corner dot grid right */}
        <div className="absolute bottom-6 right-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#E11D48] text-lg">🩸</span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#E11D48] uppercase">
                Fast &bull; Smart &bull; Life-saving
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              Simple <span className="text-[#E11D48]">3-Step</span> Process
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              How BloodBridge AI streamlines donation routing in emergencies.
            </p>
          </motion.div>

          {/* Timeline Process Flow */}
          <div className="relative">
            
            {/* Desktop Connectors (Dotted arches with right arrows) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
              
              {/* Connector 1 to 2 */}
              <div className="absolute top-[48px] left-[23%] w-[18%] h-12">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 100 30">
                  <path d="M 0,15 Q 50,30 100,15" stroke="#FFE4E6" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-rose-950/50" />
                </svg>
                {/* Arrow badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 shadow-sm flex items-center justify-center text-[#E11D48] text-[10px] font-black z-10">
                  <span>❯</span>
                </div>
              </div>

              {/* Connector 2 to 3 */}
              <div className="absolute top-[48px] left-[58%] w-[18%] h-12">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 100 30">
                  <path d="M 0,15 Q 50,30 100,15" stroke="#FFE4E6" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-rose-950/50" />
                </svg>
                {/* Arrow badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 shadow-sm flex items-center justify-center text-[#E11D48] text-[10px] font-black z-10">
                  <span>❯</span>
                </div>
              </div>

            </div>

            {/* Desktop & Mobile Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 relative z-10"
            >

              {/* Step 01: Request is Made */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
                
                {/* Number ring */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-rose-100 dark:border-rose-950 shadow-[0_0_20px_rgba(225,29,72,0.1)] dark:shadow-[0_0_20px_rgba(225,29,72,0.05)] flex items-center justify-center text-2xl font-black text-[#E11D48] mb-8 relative group-hover:scale-105 transition-transform duration-300">
                  {/* Glowing inner shadow ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#E11D48]/30"></div>
                  01
                </div>

                {/* Gradient Box Icon */}
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100/40 dark:border-rose-900/20 text-[#E11D48] flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11c-1.5 0-3 1.5-3 3s1.35 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="currentColor" fillOpacity="0.15" />
                    <path d="M12 9c0 0-3 3.5-3 5.5a3 3 0 0 0 6 0c0-2-3-5.5-3-5.5z" />
                  </svg>
                </div>

                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Request is Made</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                  Hospital fills out an emergency blood request through our secure cloud panel.
                </p>

                {/* Accent bar */}
                <div className="w-12 h-[3px] bg-[#E11D48] rounded-full mt-6"></div>
              </motion.div>

              {/* Step 02: AI Analyzes & Alerts */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
                
                {/* Number ring */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-violet-100 dark:border-violet-950 shadow-[0_0_20px_rgba(139,92,246,0.1)] dark:shadow-[0_0_20px_rgba(139,92,246,0.05)] flex items-center justify-center text-2xl font-black text-[#8B5CF6] mb-8 relative group-hover:scale-105 transition-transform duration-300">
                  {/* Glowing inner shadow ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#8B5CF6]/30"></div>
                  02
                </div>

                {/* Gradient Box Icon */}
                <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100/40 dark:border-violet-900/20 text-[#8B5CF6] flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                    <path d="M9 17v3M15 17v3M9 4v3M15 4v3M4 9h3M4 15h3M17 9h3M17 15h3" />
                    <circle cx="12" cy="12" r="1.5" />
                    <path d="M10.5 12h3" />
                    <text x="12" y="14" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">AI</text>
                  </svg>
                </div>

                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">AI Analyzes & Alerts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                  Geolocation algorithm matches nearby active, eligible donors, sending SMS and push notifications.
                </p>

                {/* Accent bar */}
                <div className="w-12 h-[3px] bg-[#8B5CF6] rounded-full mt-6"></div>
              </motion.div>

              {/* Step 03: Donation is Delivered */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
                
                {/* Number ring */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.05)] flex items-center justify-center text-2xl font-black text-[#10B981] mb-8 relative group-hover:scale-105 transition-transform duration-300">
                  {/* Glowing inner shadow ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#10B981]/30"></div>
                  03
                </div>

                {/* Gradient Box Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-900/20 text-[#10B981] flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
                    <path d="M16 9h4l3 3v4a2 2 0 0 1-2 2h-5" />
                    <circle cx="7.5" cy="18.5" r="2.5" />
                    <circle cx="17" cy="18.5" r="2.5" />
                    <path d="M10 10.7a1.5 1.5 0 0 0-2.3 0c-.3.3-.3.9 0 1.2l2.3 2.3 2.3-2.3c.3-.3.3-.9 0-1.2a1.5 1.5 0 0 0-2.3 0z" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                </div>

                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Donation is Delivered</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                  Donor accepts, travels, and donates, automatically updating local blood inventory registers.
                </p>

                {/* Accent bar */}
                <div className="w-12 h-[3px] bg-[#10B981] rounded-full mt-6"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle wavy background decoration at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full opacity-40 dark:opacity-20">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFE4E6" className="dark:fill-rose-950/30"></path>
          </svg>
        </div>

        {/* Corner dot grid left */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>
        {/* Corner dot grid right */}
        <div className="absolute bottom-6 right-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#E11D48] text-lg">🩸</span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#E11D48] uppercase">
                Backed by Experts &bull; Driven by Trust
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              Trusted by the <span className="text-[#E11D48]">Medical Community</span>
            </h2>

            {/* Heartbeat line */}
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-8 text-[#E11D48]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 15 h30 l5 -10 l5 20 l5 -15 h25" />
              </svg>
            </div>

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

            {/* Card 1 — Dr. Vikram Rathore */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-left transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 text-amber-500 mb-5 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                {/* Testimonial body with red quotes */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                  <span className="text-[#E11D48] font-bold text-sm mr-1">❝</span>
                  We had a case requiring rare AB- blood. BloodBridge AI notified 8 matching donors within 10 seconds. The donor arrived at our ICU in under 30 minutes. Incredible service!
                  <span className="text-[#E11D48] font-bold text-sm ml-1">❞</span>
                </p>
              </div>
              
              <div>
                {/* Horizontal separator */}
                <div className="h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-5" />
                
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#E11D48] flex items-center justify-center text-white font-extrabold text-xs shadow-sm flex-shrink-0">
                    DR
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Dr. Vikram Rathore</h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">ICU Chief, Metro Hospital</span>
                    
                    {/* Verification Badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] text-[9px] font-bold border border-rose-100/50 dark:border-rose-900/20">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22V8h16v14M12 2v6M9 5h6" />
                        <rect x="9" y="12" width="6" height="10" />
                      </svg>
                      Verified Hospital
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 — Sagar Mehta */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-left transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 text-amber-500 mb-5 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                {/* Testimonial body with red quotes */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                  <span className="text-[#E11D48] font-bold text-sm mr-1">❝</span>
                  Signing up was incredibly simple. The SMS dispatch lists travel routing directions and hospital gate codes clearly. Being able to track my impact metrics keeps me motivated.
                  <span className="text-[#E11D48] font-bold text-sm ml-1">❞</span>
                </p>
              </div>
              
              <div>
                {/* Horizontal separator */}
                <div className="h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-5" />
                
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#F97316] flex items-center justify-center text-white font-extrabold text-xs shadow-sm flex-shrink-0">
                    SM
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Sagar Mehta</h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">O+ Active Donor, 8 Donations</span>
                    
                    {/* Verification Badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] text-[9px] font-bold border border-rose-100/50 dark:border-rose-900/20">
                      <span className="text-[9px]">🩸</span>
                      Verified Donor
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 — Sunita Kulkarni */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-left transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 text-amber-500 mb-5 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                {/* Testimonial body with red quotes */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                  <span className="text-[#E11D48] font-bold text-sm mr-1">❝</span>
                  Integrating BloodBridge AI resolved our inventory checking bottlenecks completely. Our blood reserve data syncs automatically, which has halved matching delays.
                  <span className="text-[#E11D48] font-bold text-sm ml-1">❞</span>
                </p>
              </div>
              
              <div>
                {/* Horizontal separator */}
                <div className="h-[1px] bg-gray-100 dark:bg-gray-800 w-full mb-5" />
                
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#10B981] flex items-center justify-center text-white font-extrabold text-xs shadow-sm flex-shrink-0">
                    SK
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Sunita Kulkarni</h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">Blood Bank Operations Lead</span>
                    
                    {/* Verification Badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-100/50 dark:border-emerald-900/20">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      Verified Organization
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 11. Future Vision */}
      <section id="about-us" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Card 1: Government Integration */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }} 
            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-lg hover:border-rose-500/20 dark:hover:border-rose-500/10 text-left flex flex-col items-start transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-bloodred/10 text-bloodred flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#E11D48]/20">
              <FiPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2 transition-colors duration-300 group-hover:text-[#E11D48]">Government Integration</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">Direct synchronization with national digital health ID grids for authenticated medical histories.</p>
          </motion.div>

          {/* Card 2: Ambulance Dispatch */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }} 
            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-lg hover:border-rose-500/20 dark:hover:border-rose-500/10 text-left flex flex-col items-start transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-500/20">
              <FiActivity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2 transition-colors duration-300 group-hover:text-[#E11D48]">Ambulance Dispatch</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">Live emergency matching directly triggered from on-road ambulances during critical transit.</p>
          </motion.div>

          {/* Card 3: National Donor Registry */}
          <motion.div 
            variants={fadeInUp} 
            whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }} 
            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-lg hover:border-rose-500/20 dark:hover:border-rose-500/10 text-left flex flex-col items-start transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-550 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-500/20">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2 transition-colors duration-300 group-hover:text-[#E11D48]">National Donor Registry</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">A unified health system-wide secure donor registry for regional and local clinics.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 11b. Partnership Plans Section */}
      <section id="partnership-plans" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF9F6] to-white dark:from-[#070B13] dark:to-slate-950/40 border-t border-b border-gray-100 dark:border-slate-800/40 overflow-hidden">
        {/* Soft background glow decoration */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-rose-500/03 dark:bg-rose-950/05 rounded-full blur-[130px] pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-[#E11D48]/03 dark:bg-[#E11D48]/05 rounded-full blur-[130px] pointer-events-none translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
              <span className="text-[10px] font-bold text-[#E11D48] dark:text-rose-400 uppercase tracking-widest">Revenue Model</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-5 font-poppins">
              Partnership <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E11D48] to-rose-500 dark:from-red-500 dark:to-rose-400">Plans</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
              AI-powered emergency blood supply network for clinics, hospitals, and healthcare systems.
            </motion.p>
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
                      <Link
                        to="/hospital-partnership"
                        className="block w-full py-4.5 rounded-2xl text-white font-bold text-[14px] text-center transition-all bg-[#E11D48] hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 font-poppins"
                      >
                        {plansData[activePlan].buttonText}
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Custom CTA Banner to go to full Hospital Partnership page */}
          <motion.div 
            className="mt-20 max-w-5xl mx-auto px-4 sm:px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="relative overflow-hidden rounded-[32px] border border-rose-100/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-black/[0.02]">
              {/* Soft decorative background glows */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#E11D48]/05 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-rose-500/05 rounded-full blur-3xl pointer-events-none" />

              <div className="text-left max-w-2xl relative z-10 font-poppins">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#E11D48] dark:text-rose-400 uppercase tracking-widest">Enterprise & Custom Solutions</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                  Explore the Complete Hospital Partnership Program
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Learn how we handle hospital integrations, custom API synchronization, SLAs, and direct ambulance dispatch routes.
                </p>
              </div>

              <motion.div 
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.975 }}
                className="w-full md:w-auto relative z-10 flex-shrink-0"
              >
                <Link
                  to="/hospital-partnership"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-2xl font-bold bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/20 transition-all duration-300 group"
                >
                  <span>Explore Program</span>
                  <FiArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 12. FAQ Accordion */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle wavy background decoration at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full opacity-40 dark:opacity-20">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFE4E6" className="dark:fill-rose-950/30"></path>
          </svg>
        </div>

        {/* Corner dot grid left */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>
        {/* Corner dot grid right */}
        <div className="absolute bottom-6 right-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">

          <div className="text-center mb-16">
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#E11D48] text-lg">🩸</span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#E11D48] uppercase">
                Questions? We've Got Answers
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
              Frequently Asked <span className="text-[#E11D48]">Questions</span>
            </h2>

            {/* Heartbeat line */}
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-8 text-[#E11D48]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 15 h30 l5 -10 l5 20 l5 -15 h25" />
              </svg>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Learn more about how BloodBridge AI operates.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {[
              {
                q: "How does the AI matching work?",
                a: "Our machine learning routing engine analyzes donor distance, travel times, eligibility records, and donation queues to locate the single best donor match in milliseconds.",
                icon: (
                  <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="6" width="16" height="12" rx="2" />
                    <path d="M9 12h6M12 2v4" />
                    <circle cx="12" cy="2" r="1" />
                    <path d="M2 10h2M20 10h2" />
                    <circle cx="8" cy="10" r="1" />
                    <circle cx="16" cy="10" r="1" />
                  </svg>
                )
              },
              {
                q: "Is BloodBridge AI free for hospitals?",
                a: "Yes! BloodBridge AI is completely free for nonprofit hospitals and government clinics. Premium dashboard plans are available for private medical networks.",
                icon: (
                  <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <path d="M12 2v6M7 5a2.5 2.5 0 0 1 5 0M12 5a2.5 2.5 0 0 1 5 0" />
                    <text x="12" y="15" fontSize="4" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">FREE</text>
                  </svg>
                )
              },
              {
                q: "How are donor health records protected?",
                a: "We adhere strictly to medical privacy regulations. Health history logs are fully encrypted at rest and in transit, and are never shared with unauthorized parties.",
                icon: (
                  <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <rect x="10" y="11" width="4" height="4" rx="1" />
                    <path d="M11 11V9a1 1 0 0 1 2 0v2" />
                  </svg>
                )
              },
              {
                q: "Who is eligible to register as a donor?",
                a: "Anyone between 18-65 years of age, weighing above 45kg, and in general good health can register. Final eligibility checks are run before each donation request.",
                icon: (
                  <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <circle cx="19" cy="12" r="3" fill="currentColor" fillOpacity="0.15" />
                    <path d="M17.5 12l1 1 2-2" />
                  </svg>
                )
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center flex-shrink-0 mr-4">
                        {faq.icon}
                      </div>
                      <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {faq.q}
                      </span>
                    </div>
                    <FiChevronDown className={`w-5 h-5 text-[#E11D48] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-1 pl-6 sm:pl-[76px] text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Support CTA Banner */}
          <div className="bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/40 dark:border-rose-900/10 p-5 rounded-3xl mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-rose-100/50 dark:bg-rose-950/30 flex items-center justify-center text-[#E11D48] flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Still have questions?</h4>
                <p className="text-[11px] text-[#E11D48] dark:text-[#E11D48]/70">Our support team is here to help you 24/7.</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                const contactSec = document.getElementById('contact');
                if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E11D48] text-white text-xs font-bold hover:bg-crimson shadow-md shadow-rose-500/10 hover:shadow-lg transition-all duration-300 flex-shrink-0"
            >
              <span>Contact Support</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 13. Contact Form & Maps */}
      <section id="contact" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle background decoration waves */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full opacity-30 dark:opacity-10">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFE4E6" className="dark:fill-rose-950/30"></path>
          </svg>
        </div>

        {/* Corner dot grid left */}
        <div className="absolute bottom-6 left-6 w-24 h-24 opacity-15 pointer-events-none hidden md:block z-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column: Form */}
            <div className="lg:col-span-6 text-left">
              {/* Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 w-fit mb-6">
                <span className="text-[#E11D48] text-xs">🎧</span>
                <span className="text-[10px] font-black tracking-wider text-[#E11D48] uppercase">We're Here to Help</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
                Contact Our <span className="text-[#E11D48]">Emergency Desk</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Reach out for system integrations or support questions.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); alert('Emergency Inquiry Submitted.'); }} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Name</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-[#E11D48] text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Email</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-[#E11D48] text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">How can we help you?</label>
                  <div className="relative">
                    <svg className="absolute left-4 top-4 text-gray-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <textarea
                      rows="4"
                      required
                      placeholder="Type your message here..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-[#E11D48] text-gray-800 dark:text-white"
                    ></textarea>
                  </div>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-700 to-crimson text-white font-bold hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md shadow-rose-500/10"
                >
                  <svg className="w-4 h-4 transform rotate-45 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Emergency Inquiry
                </button>
              </form>
            </div>

            {/* Right Column: Maps & Info */}
            <div className="lg:col-span-6 text-left">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                
                {/* HQ Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">Emergency Dispatch HQ</h3>
                  </div>
                </div>

                {/* Details layout */}
                <div className="flex flex-col gap-3.5 mb-6 pl-1">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-[#E11D48] text-sm">📍</span>
                    <span>BloodBridge AI Headquarters, Sector 5, Tech City, IN</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-[#E11D48] text-sm">📞</span>
                    <span className="font-bold text-[#E11D48]">+1 (800) 555-BLOOD</span>
                  </div>
                </div>

                {/* Maps visual mock */}
                <div className="h-60 bg-gray-50 dark:bg-slate-900/60 rounded-2xl relative overflow-hidden border border-slate-100 dark:border-gray-800/80 shadow-inner flex items-center justify-center">
                  {/* Mock Map Grid lines */}
                  <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="50" x2="100%" y2="50" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="0" y1="120" x2="100%" y2="120" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="0" y1="190" x2="100%" y2="190" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="80" y1="0" x2="80" y2="100%" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="180" y1="0" x2="180" y2="100%" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="320" y1="0" x2="320" y2="100%" stroke="currentColor" strokeWidth="1.5" />
                      {/* Diagonal routes */}
                      <path d="M0,0 Q150,150 400,240" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M300,0 C220,100 120,180 0,220" fill="none" stroke="currentColor" strokeWidth="2" />
                      {/* River shape */}
                      <path d="M0,20 Q120,40 240,110 T480,180" fill="none" stroke="#93C5FD" strokeWidth="7" opacity="0.6" />
                    </svg>
                  </div>
                  
                  {/* Pulsating concentric circles */}
                  <div className="absolute w-36 h-36 rounded-full bg-rose-500/10 animate-ping opacity-60"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-rose-500/15 animate-pulse"></div>
                  
                  {/* Heart Center Node */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-11 h-11 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-black bg-[#E11D48] text-white py-0.5 px-2.5 rounded-full uppercase shadow-md mt-2 tracking-wider">HQ Main Dispatcher</span>
                  </div>
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
