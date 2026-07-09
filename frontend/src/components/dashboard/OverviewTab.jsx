import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertTriangle, FiCheck, FiUsers, FiZap, FiActivity, 
  FiMapPin, FiClock, FiShield, FiTrendingUp, FiCrosshair,
  FiMap, FiMessageSquare, FiFileText, FiUserPlus, FiPlusCircle,
  FiMaximize2, FiRadio, FiCheckCircle, FiXCircle, FiChevronRight
} from 'react-icons/fi';

// Premium Real-Time Medical Capsule Component for Blood Inventory
const MedicalCapsule = ({ group, units, status, prediction, days }) => {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';
  const fillPct = Math.min(100, Math.max(12, (units / 60) * 100));

  const statusColors = {
    critical: 'text-bloodred border-bloodred/20 bg-bloodred/06 shadow-sm shadow-bloodred/05',
    warning: 'text-amber border-amber/20 bg-amber/06 shadow-sm shadow-amber/05',
    stable: 'text-emerald border-emerald/20 bg-emerald/06 shadow-sm shadow-emerald/05'
  };

  const fillColors = {
    critical: 'from-[#D81B43] to-[#F03561] dark:from-[#D81B43]/90 dark:to-[#F03561]/90',
    warning: 'from-[#D97706] to-[#F59E0B]',
    stable: 'from-[#10B981] to-[#34D399]'
  };

  return (
    <motion.div
      className="p-4.5 rounded-[22px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf2/30 flex flex-col justify-between items-center h-60 hover:border-bloodred/20 transition-all duration-300 relative group shadow-sm hover:shadow-premium select-none overflow-hidden"
      whileHover={{ y: -3 }}
    >
      {/* Background radial glow */}
      <div className={`absolute -bottom-10 w-20 h-20 rounded-full filter blur-[30px] opacity-10 pointer-events-none ${
        isCritical ? 'bg-bloodred' : isWarning ? 'bg-amber' : 'bg-emerald'
      }`} />

      {/* Header Info */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[14px] font-black text-slate dark:text-white">{group}</span>
        <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.6 rounded-md border ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Main Capsule Visual Block */}
      <div className="flex items-center justify-center gap-4 my-2.5">
        {/* Real-time Tuber/Capsule Gauge */}
        <div className="w-4.5 h-24 rounded-full bg-black/04 dark:bg-white/04 border border-black/10 dark:border-white/10 relative p-0.5 overflow-hidden flex flex-col justify-end">
          {/* Animated Liquid Level Indicator */}
          <motion.div
            className={`w-full rounded-full bg-gradient-to-t ${fillColors[status]}`}
            initial={{ height: 0 }}
            animate={{ height: `${fillPct}%` }}
            transition={{ type: 'spring', damping: 15, stiffness: 80 }}
          />
          {/* Bubbles particle animation */}
          {units > 10 && (
            <div className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-3 opacity-40">
              <motion.span className="w-1 h-1 rounded-full bg-white" animate={{ y: [0, -35], opacity: [0.6, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
              <motion.span className="w-0.8 h-0.8 rounded-full bg-white" animate={{ y: [0, -45], opacity: [0.5, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }} />
            </div>
          )}
        </div>

        {/* Numeric stats block */}
        <div className="flex flex-col text-left">
          <p className="text-2xl font-black text-slate dark:text-white leading-none">{units}</p>
          <p className="text-[9px] font-bold text-muted uppercase tracking-wider mt-1.5 leading-none">Units Stock</p>
        </div>
      </div>

      {/* Footer statistics (depletion forecasts) */}
      <div className="w-full text-center border-t border-black/05 dark:border-white/05 pt-2.5">
        <p className="text-[11px] font-extrabold text-slate dark:text-white leading-none">{days} days left</p>
        <p className="text-[9.5px] text-muted font-bold mt-1 leading-none">{prediction}</p>
      </div>
    </motion.div>
  );
};

// Main Dashboard Redesigned Control Center
const OverviewTab = ({
  user,
  requests = [],
  inventory = [],
  donors = [],
  userLocation,
  onNewRequest,
  onNavigate,
  onOpenAI,
}) => {
  // Simulator logs / states
  const [systemBpm, setSystemBpm] = useState(62);
  const [activeRequests, setActiveRequests] = useState(16);
  const [bloodUnits, setBloodUnits] = useState(127);
  const [donorsOnline, setDonorsOnline] = useState(2);
  const [avgMatch, setAvgMatch] = useState(38.2);

  // Expanded dynamic states for Bento grid elements
  const [liveAccuracy, setLiveAccuracy] = useState(99.4);
  const [donorsBusy, setDonorsBusy] = useState(4);
  const [donorsRegistered, setDonorsRegistered] = useState(27);
  const [connectedHospitals, setConnectedHospitals] = useState(18);
  const [inventoryStock, setInventoryStock] = useState({
    Oplus: 48,
    Ominus: 5,
    Aplus: 36,
    Aminus: 4,
    Bplus: 27,
    Bminus: 8,
    ABplus: 18,
    ABminus: 3
  });

  const [chartData, setChartData] = useState([
    { day: 'Mon', req: 4, ok: 4 },
    { day: 'Tue', req: 7, ok: 6 },
    { day: 'Wed', req: 5, ok: 5 },
    { day: 'Thu', req: 12, ok: 10 },
    { day: 'Fri', req: 9, ok: 9 },
    { day: 'Sat', req: 6, ok: 5 }
  ]);

  const [heatmapRequests, setHeatmapRequests] = useState({
    Ahmedabad: 6,
    Surat: 3,
    Rajkot: 4,
    Vadodara: 1
  });

  // Dynamic real-time metrics simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemBpm(prev => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        const next = prev + diff;
        return next >= 58 && next <= 68 ? next : prev;
      });

      setActiveRequests(prev => {
        if (Math.random() > 0.85) {
          const diff = Math.random() > 0.5 ? 1 : -1;
          const next = prev + diff;
          return next >= 13 && next <= 19 ? next : prev;
        }
        return prev;
      });

      setBloodUnits(prev => {
        if (Math.random() > 0.7) {
          const diff = Math.random() > 0.5 ? 1 : -1;
          return prev + diff;
        }
        return prev;
      });

      setDonorsOnline(prev => {
        if (Math.random() > 0.8) {
          const diff = Math.random() > 0.5 ? 1 : -1;
          const next = prev + diff;
          return next >= 1 && next <= 6 ? next : prev;
        }
        return prev;
      });

      setAvgMatch(prev => {
        const diff = Number((Math.random() * 0.4 - 0.2).toFixed(1));
        const next = Number((prev + diff).toFixed(1));
        return next >= 35.0 && next <= 41.0 ? next : prev;
      });

      setLiveAccuracy(prev => {
        if (Math.random() > 0.9) {
          const diff = Number((Math.random() * 0.2 - 0.1).toFixed(1));
          const next = Number((prev + diff).toFixed(1));
          return next >= 98.8 && next <= 99.8 ? next : prev;
        }
        return prev;
      });

      setDonorsBusy(prev => {
        if (Math.random() > 0.85) {
          const diff = Math.random() > 0.5 ? 1 : -1;
          const next = prev + diff;
          return next >= 2 && next <= 7 ? next : prev;
        }
        return prev;
      });

      setConnectedHospitals(prev => {
        if (Math.random() > 0.95) {
          const diff = Math.random() > 0.5 ? 1 : -1;
          const next = prev + diff;
          return next >= 16 && next <= 20 ? next : prev;
        }
        return prev;
      });

      setInventoryStock(prev => {
        const keys = ['Oplus', 'Ominus', 'Aplus', 'Aminus', 'Bplus', 'Bminus', 'ABplus', 'ABminus'];
        const keyToUpdate = keys[Math.floor(Math.random() * 8)];
        const diff = Math.random() > 0.65 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        if (diff === 0) return prev;
        
        const nextVal = prev[keyToUpdate] + diff;
        const minBounds = { Ominus: 2, Aminus: 1, Bminus: 3, ABminus: 1, Oplus: 35, Aplus: 25, Bplus: 15, ABplus: 10 };
        const maxBounds = { Ominus: 10, Aminus: 9, Bminus: 14, ABminus: 8, Oplus: 60, Aplus: 48, Bplus: 38, ABplus: 28 };
        
        return nextVal >= minBounds[keyToUpdate] && nextVal <= maxBounds[keyToUpdate]
          ? { ...prev, [keyToUpdate]: nextVal } 
          : prev;
      });

      setChartData(prev => prev.map((item, idx) => {
        if (idx >= 3) {
          const diffReq = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const diffOk = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const nextReq = Math.max(4, Math.min(15, item.req + diffReq));
          const nextOk = Math.max(3, Math.min(nextReq, item.ok + diffOk));
          return { ...item, req: nextReq, ok: nextOk };
        }
        return item;
      }));

      setHeatmapRequests(prev => {
        const cities = ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara'];
        const cityToUpdate = cities[Math.floor(Math.random() * 4)];
        const diff = Math.random() > 0.75 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        if (diff === 0) return prev;
        
        const nextVal = prev[cityToUpdate] + diff;
        const minBounds = { Ahmedabad: 4, Surat: 2, Rajkot: 2, Vadodara: 0 };
        const maxBounds = { Ahmedabad: 10, Surat: 6, Rajkot: 7, Vadodara: 4 };
        
        return nextVal >= minBounds[cityToUpdate] && nextVal <= maxBounds[cityToUpdate]
          ? { ...prev, [cityToUpdate]: nextVal }
          : prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const [liveRequests, setLiveRequests] = useState(requests);

  // Sync state if props change
  useEffect(() => {
    if (requests && requests.length > 0) {
      setLiveRequests(requests);
    }
  }, [requests]);

  // Live incoming dispatch simulator
  useEffect(() => {
    const requestInterval = setInterval(() => {
      const hospitalNames = [
        'SVP Institute of Medical Sciences',
        'SAL Hospital & Medical Institute',
        'Zydus Hospital Ahmedabad',
        'Civil Hospital Ahmedabad',
        'CIMS Hospital',
        'Sterling Hospital',
        'Apollo Hospitals International'
      ];
      const patientNames = ['Karan Patel', 'Meera Joshi', 'Rohan Shah', 'Aarav Mehta', 'Anjali Trivedi', 'Priya Sharma', 'Rahul Varma'];
      const bloodGroups = ['O+', 'O-', 'B+', 'A+', 'AB+', 'AB-'];
      const urgencies = ['emergency', 'urgent', 'normal'];

      const randomHospital = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
      const randomPatient = patientNames[Math.floor(Math.random() * patientNames.length)];
      const randomBlood = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      const randomUrgency = urgencies[Math.floor(Math.random() * urgencies.length)];
      const randomUnits = Math.floor(Math.random() * 5) + 1; // 1 to 5 units

      const newRequest = {
        id: `REQ_${Date.now()}`,
        hospitalName: randomHospital,
        patientName: randomPatient,
        bloodGroup: randomBlood,
        urgency: randomUrgency,
        units: randomUnits,
        status: 'matching',
        time: 'Just Now',
        city: 'Ahmedabad'
      };

      setLiveRequests(prev => [newRequest, ...prev]);
      setActiveRequests(prev => prev + 1);
    }, 12000); // Prepend new request every 12 seconds

    return () => clearInterval(requestInterval);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const [countdown, setCountdown] = useState('14:24:59');
  const [selectedCity, setSelectedCity] = useState(null);
  const [aiAssistantText, setAiAssistantText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Operational Center ready. How can I assist you with dispatches today?' }
  ]);

  // AI recommendations list
  const [recommendations, setRecommendations] = useState([
    { id: 1, title: 'Increase O- inventory', desc: 'Auto-dispatch alerts to matching O- donors in Ahmedabad.', priority: 'Critical', color: 'text-bloodred border-bloodred/20 bg-bloodred/03', conf: 98 },
    { id: 2, title: 'Notify nearby donors', desc: 'Trigger broadcast callouts for urgent B- demand at Apollo.', priority: 'High', color: 'text-amber border-amber/20 bg-amber/03', conf: 94 },
    { id: 3, title: 'Optimize route to Civil Hospital', desc: 'Recalculating traffic buffers for active dispatch route.', priority: 'Normal', color: 'text-emerald border-emerald/20 bg-emerald/03', conf: 89 },
  ]);

  // Countdown timer for AI Prediction
  useEffect(() => {
    const timer = setInterval(() => {
      const parts = countdown.split(':').map(Number);
      let sec = parts[2] - 1;
      let min = parts[1];
      let hr = parts[0];
      if (sec < 0) {
        sec = 59;
        min -= 1;
      }
      if (min < 0) {
        min = 59;
        hr -= 1;
      }
      if (hr < 0) {
        hr = 24;
      }
      const pad = (n) => String(n).padStart(2, '0');
      setCountdown(`${pad(hr)}:${pad(min)}:${pad(sec)}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle recommendation action
  const handleRecAction = (id, action) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Submit AI Prompt
  const handleSendPrompt = (textToSend) => {
    const prompt = textToSend || aiAssistantText;
    if (!prompt.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: prompt }]);
    setAiAssistantText('');

    setTimeout(() => {
      let reply = "Processing command...";
      if (prompt.toLowerCase().includes('report')) {
        reply = "Report generated successfully. 16 dispatches analyzed. Match efficiency optimized at 95.4%.";
      } else if (prompt.toLowerCase().includes('shortage')) {
        reply = "Predictive analysis completed. O- group shows 84% probability of depletion within 24 hours. Dispatching notifications recommended.";
      } else if (prompt.toLowerCase().includes('donors')) {
        reply = "Found 7 matching donors within Ahmedabad city bounds for critical A+ requirement. Ready to ping.";
      } else if (prompt.toLowerCase().includes('optimize')) {
        reply = "Routes optimized. Submitting optimized dispatch plan to emergency response dispatch units.";
      }
      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 800);
  };

  // Static list of cities for custom vector map
  const cities = [
    { name: 'Ahmedabad', x: '45%', y: '35%', active: 6, code: 'AMD', donors: 12, glow: 'shadow-glow-red' },
    { name: 'Surat', x: '55%', y: '80%', active: 3, code: 'SRT', donors: 8, glow: 'shadow-glow-blue' },
    { name: 'Vadodara', x: '58%', y: '55%', active: 4, code: 'BDQ', donors: 9, glow: 'shadow-glow-blue' },
    { name: 'Rajkot', x: '20%', y: '50%', active: 2, code: 'RAJ', donors: 5, glow: 'shadow-glow-red' },
    { name: 'Mehsana', x: '40%', y: '20%', active: 1, code: 'MSN', donors: 4, glow: 'shadow-glow-blue' }
  ];

  const getGreetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <motion.div
      className="space-y-8 pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ─── SECTION 1: HERO COMMAND CENTER ────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Unified Hero Command Hub Card */}
        <div className="lg:col-span-12 p-8 md:p-10 rounded-[32px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 md:min-h-[340px] shadow-lg">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-bloodred/05 filter blur-[80px]" />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-bloodred/02 dark:bg-bloodred/04 filter blur-[100px]" />
          </div>

          {/* Left Side: Greetings & Pulse */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-bloodred/10 text-bloodred border border-bloodred/15 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-bloodred animate-pulse" />
                  Live Control Center
                </span>
                <span className="text-[10px] font-bold text-muted bg-black/03 dark:bg-white/04 px-2.5 py-1 rounded-full flex items-center gap-1 border border-black/05 dark:border-white/05">
                  <FiMapPin className="w-3.5 h-3.5 text-bloodred" />
                  Gujarat, India
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate dark:text-white tracking-tight leading-tight">
                {getGreetingText()}, <span className="bg-gradient-to-r from-[#D81B43] to-[#F03561] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0] || 'Dharmi'}</span> 
                <motion.span 
                  className="inline-block ml-2.5"
                  animate={{ rotate: [0, 15, -10, 15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-muted text-sm md:text-base mt-2.5 font-medium max-w-xl leading-relaxed">
                BloodBridge AI is actively monitoring emergency requests and predicting dispatch windows across Gujarat.
              </p>
            </div>

            {/* Pulse Indicator */}
            <div className="flex items-center gap-3.5 mt-6 py-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest leading-none">System Pulse</span>
                <span className="text-[13px] font-extrabold text-slate dark:text-white mt-1 leading-none">{systemBpm} BPM</span>
              </div>
              <div className="h-10 w-48 overflow-hidden rounded-xl bg-black/03 dark:bg-white/02 border border-black/05 dark:border-white/05">
                <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d="M 0 20 L 40 20 L 50 20 L 58 5 L 66 35 L 72 15 L 80 25 L 85 20 L 98 20 L 105 20 L 112 8 L 120 32 L 126 18 L 132 23 L 138 20 L 200 20"
                    fill="none"
                    stroke="rgba(216, 27, 67, 0.15)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path
                    d="M 0 20 L 40 20 L 50 20 L 58 5 L 66 35 L 72 15 L 80 25 L 85 20 L 98 20 L 105 20 L 112 8 L 120 32 L 126 18 L 132 23 L 138 20 L 200 20"
                    fill="none"
                    stroke="#D81B43"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0.15, pathOffset: 0 }}
                    animate={{ pathOffset: [0, 0.85] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
              </div>
            </div>

            {/* Monitoring States */}
            <div className="flex flex-wrap items-center gap-2.5 mt-6">
              {[
                { label: 'Monitoring', color: 'bg-emerald' },
                { label: 'Predicting', color: 'bg-aiblue animate-pulse' },
                { label: 'Matching', color: 'bg-bloodred' },
                { label: 'Dispatch Ready', color: 'bg-emerald' }
              ].map((state, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2.5 py-1.2 rounded-lg bg-black/03 dark:bg-white/03 border border-black/05 dark:border-white/05 shadow-sm text-[11px] font-bold text-slate dark:text-white hover:border-bloodred/20 transition-all duration-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${state.color}`} />
                  <span>{state.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-black/10 dark:via-white/10 to-transparent" />

          {/* Right Side: AI Health & Summary Metrics */}
          <div className="w-full md:w-80 flex flex-col justify-between gap-8 py-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate dark:text-white text-[12px] uppercase tracking-widest">AI Health Score</h3>
                <p className="text-[10px] text-muted font-semibold mt-0.5">Emergency Triage Health</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg width="80" height="80" className="-rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="4" className="text-black/06 dark:text-white/06" />
                  <motion.circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="#10B981" strokeWidth="5"
                    strokeDasharray="213.6"
                    initial={{ strokeDashoffset: 213.6 }}
                    animate={{ strokeDashoffset: 10.68 }} // 95% filled
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[13px] font-black text-slate dark:text-white">95%</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-black/05 dark:border-white/05">
              {[
                { label: 'Active Requests', val: activeRequests, color: 'text-bloodred' },
                { label: 'Blood Units', val: bloodUnits, color: 'text-slate dark:text-white' },
                { label: 'Donors Online', val: donorsOnline, color: 'text-emerald' },
                { label: 'Average Match', val: `${avgMatch}s`, color: 'text-aiblue' }
              ].map((stat, idx) => (
                <div key={idx} className="py-4 px-4.5 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/04 dark:border-white/04 shadow-inner hover:border-bloodred/25 transition-all">
                  <p className="text-[9px] font-bold text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-[17px] font-black mt-1.5 ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ─── SECTION 2: LIVE EMERGENCY FEED ───────────────────────────────────────── */}
      <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-bloodred/10 flex items-center justify-center shadow-inner">
              <FiRadio className="w-5 h-5 text-bloodred animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-slate dark:text-white text-lg tracking-tight">Live Emergency Activity</h2>
              <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-0.5">Real-time status feed</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-bloodred bg-bloodred/10 border border-bloodred/15 px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
            Live operations monitoring
          </span>
        </div>

        <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
          {liveRequests.slice(0, 8).map((req, i) => {
            const urgency = req.urgency || 'normal';
            const status = req.status || 'matching';
            
            // Set styles based on status
            const borderColors = {
              emergency: 'border-l-bloodred hover:bg-bloodred/02 dark:hover:bg-bloodred/04',
              urgent: 'border-l-amber hover:bg-amber/02 dark:hover:bg-amber/04',
              normal: 'border-l-emerald hover:bg-emerald/02 dark:hover:bg-emerald/04',
            };

            const colors = {
              emergency: 'text-bloodred bg-bloodred/10 border-bloodred/15',
              urgent: 'text-amber bg-amber/10 border-amber/15',
              normal: 'text-emerald bg-emerald/10 border-emerald/15',
            };

            return (
              <motion.div
                key={req.id}
                className={`p-4 pl-5 rounded-2xl border-l-[5px] bg-white/40 dark:bg-darksurf/30 border border-black/05 dark:border-white/05 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  borderColors[urgency] || 'border-l-blue-500'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Details Group */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-[13px] border shadow-sm flex-shrink-0 ${
                    colors[urgency] || 'bg-slate-100 text-slate-800'
                  }`}>
                    {req.bloodGroup}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-[14px] text-slate dark:text-white truncate">{req.hospitalName}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                        urgency === 'emergency' ? 'bg-bloodred text-white' : urgency === 'urgent' ? 'bg-amber text-black' : 'bg-emerald text-white'
                      }`}>
                        {urgency}
                      </span>
                    </div>
                    <p className="text-muted text-[12px] font-semibold mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>Patient: {req.patientName}</span>
                      <span>·</span>
                      <span className="text-slate dark:text-white font-bold">{req.units} units required</span>
                      <span>·</span>
                      <span className="text-aiblue font-extrabold">{req.matchTime} match</span>
                    </p>
                  </div>
                </div>

                {/* Meta details & status */}
                <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0 border-t md:border-t-0 border-black/05 dark:border-white/05 pt-2.5 md:pt-0">
                  <div className="text-[11px] font-bold text-muted text-left md:text-right">
                    <p className="flex items-center md:justify-end gap-1"><FiClock className="w-3.5 h-3.5 text-bloodred" />{req.time}</p>
                    <p className="text-[10px] text-muted/50 font-mono tracking-wider mt-0.5">{req.id}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] font-bold text-slate dark:text-white bg-black/03 dark:bg-white/04 p-1 px-2.5 rounded-lg border border-black/05 dark:border-white/05">
                      {req.donorsContacted} notified
                    </div>
                    <span className={`badge ${
                      status === 'completed' ? 'badge-stable' : status === 'dispatched' ? 'badge-urgent' : 'badge-info'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 3: SMART ANALYTICS BENTO GRID ─────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bento 1: Emergency Requests sparkline */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between group hover:border-bloodred/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest">Emergency Requests</h3>
            <FiActivity className="w-4 h-4 text-bloodred animate-pulse" />
          </div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate dark:text-white tracking-tight">{activeRequests}</span>
              <span className="text-[11px] font-black text-bloodred bg-bloodred/10 border border-bloodred/15 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                <FiTrendingUp className="w-3 h-3" />
                +2 today
              </span>
            </div>
            <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-1">Active live requests in queue</p>
          </div>

          {/* Mini Custom Sparkline */}
          <div className="h-14 mt-4 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full text-bloodred" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glowRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D81B43" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D81B43" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 25 Q 15 20 30 18 T 60 12 T 90 8 T 100 2 L 100 30 L 0 30 Z"
                fill="url(#glowRequests)"
              />
              <motion.path
                d="M 0 25 Q 15 20 30 18 T 60 12 T 90 8 T 100 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            </svg>
          </div>
        </div>

        {/* Bento 2: Blood Inventory distribution */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest">Inventory Distribution</h3>
            <FiShield className="w-4 h-4 text-emerald" />
          </div>
          
          <div className="space-y-2">
            {[
              { grp: 'O+', pct: Math.round((inventoryStock.Oplus / 60) * 100), units: inventoryStock.Oplus, status: 'stable', color: 'bg-emerald' },
              { grp: 'A+', pct: Math.round((inventoryStock.Aplus / 60) * 100), units: inventoryStock.Aplus, status: 'stable', color: 'bg-emerald' },
              { grp: 'B+', pct: Math.round((inventoryStock.Bplus / 60) * 100), units: inventoryStock.Bplus, status: 'stable', color: 'bg-emerald' },
              { grp: 'O-', pct: Math.round((inventoryStock.Ominus / 60) * 100), units: inventoryStock.Ominus, status: inventoryStock.Ominus < 8 ? 'critical' : 'stable', color: inventoryStock.Ominus < 8 ? 'bg-bloodred animate-pulse' : 'bg-emerald' }
            ].map((inv) => (
              <div key={inv.grp} className="flex items-center justify-between text-[11px] font-bold">
                <span className="w-6 text-slate dark:text-white font-black">{inv.grp}</span>
                <div className="flex-1 mx-3 h-2 rounded-full bg-black/04 dark:bg-white/04 overflow-hidden relative">
                  <motion.div 
                    className={`h-full rounded-full ${inv.color}`} 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(inv.pct, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-muted w-10 text-right">{inv.units} units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento 3: AI Match Performance gauge */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest">AI Performance</h3>
            <FiCrosshair className="w-4 h-4 text-aiblue" />
          </div>

          <div className="flex items-center justify-around py-1">
            <div className="text-center">
              <p className="text-3xl font-black text-slate dark:text-white leading-none">{Math.round(avgMatch)}s</p>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1.5">Avg Match Time</p>
            </div>
            <div className="w-px h-10 bg-black/05 dark:bg-white/05" />
            <div className="text-center">
              <p className="text-3xl font-black text-emerald leading-none">{liveAccuracy}%</p>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1.5">Live Accuracy</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/05 dark:border-white/05 text-[10px] font-extrabold text-muted text-center uppercase tracking-wider">
            Optimized Dispatch Routes Active
          </div>
        </div>

        {/* Bento 4: Donor Activity */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest">Donor Network</h3>
            <FiUsers className="w-4 h-4 text-muted" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-1.5 rounded-xl bg-emerald/05 border border-emerald/10">
              <p className="text-xs text-emerald font-black">{donorsOnline} Online</p>
              <p className="text-[8px] text-muted font-bold mt-0.5 uppercase">Available</p>
            </div>
            <div className="p-1.5 rounded-xl bg-amber/05 border border-amber/10">
              <p className="text-xs text-amber font-black">{donorsBusy} Busy</p>
              <p className="text-[8px] text-muted font-bold mt-0.5 uppercase">En Route</p>
            </div>
            <div className="p-1.5 rounded-xl bg-black/03 dark:bg-white/02 border border-black/05 dark:border-white/05">
              <p className="text-xs text-slate dark:text-white font-black">{donorsRegistered}</p>
              <p className="text-[8px] text-muted font-bold mt-0.5 uppercase">Registered</p>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-muted font-bold uppercase tracking-wider text-center">
            Weekly Trend: <span className="text-emerald">+12 registered</span>
          </div>
        </div>

        {/* Bento 5: Hospital Network mini-visualizer */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest">Hospital Network</h3>
            <FiMap className="w-4 h-4 text-muted" />
          </div>

          <div className="relative h-16 rounded-xl border border-black/05 dark:border-white/05 overflow-hidden bg-black/04 dark:bg-white/02 flex items-center justify-center">
            {/* Visual simulation of connected mesh nodes */}
            <svg className="w-full h-full text-slate-400 dark:text-slate-600" viewBox="0 0 100 40">
              <circle cx="20" cy="20" r="2.5" className="fill-emerald" />
              <circle cx="50" cy="15" r="2.5" className="fill-emerald" />
              <circle cx="80" cy="25" r="2.5" className="fill-bloodred animate-pulse" />
              <line x1="20" y1="20" x2="50" y2="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="50" y1="15" x2="80" y2="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onNavigate('hospitals')} className="text-[10px] font-black text-white px-2.5 py-1 rounded-lg bg-bloodred hover:bg-bloodred-dark transition-all flex items-center gap-1.5 shadow">
                <FiMaximize2 className="w-3 h-3" /> VIEW REGISTER
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted font-bold mt-2 uppercase tracking-wider">
            {connectedHospitals} connected emergency units
          </p>
        </div>

        {/* Bento 6: Critical Stock Prediction countdown */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-md flex flex-col justify-between border-l-4 border-l-bloodred">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-bloodred text-[14px] uppercase tracking-widest">Stock Depletion Prediction</h3>
            <FiAlertTriangle className="w-4 h-4 text-bloodred animate-bounce" />
          </div>

          <div>
            <p className="text-xl font-black text-slate dark:text-white leading-tight">O- and AB- Stock</p>
            <p className="text-muted text-[11px] font-semibold mt-1">Forecasted depletion time based on dynamic hospital intake logs.</p>
          </div>

          <div className="flex items-center gap-2 mt-3.5">
            <div className="text-[15px] font-mono font-black text-slate dark:text-white bg-black/04 dark:bg-white/05 px-3 py-1 rounded-lg border border-black/05 dark:border-white/05">
              {countdown}
            </div>
            <span className="text-[9px] font-black text-bloodred uppercase tracking-wider animate-pulse">Critical Warning</span>
          </div>
        </div>

      </div>

      {/* ─── SECTION 4: LIVE AI PREDICTION PANEL ─────────────────────────────────────── */}
      <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-aiblue/10 flex items-center justify-center glow-blue">
            <FiZap className="w-5 h-5 text-aiblue animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate dark:text-white text-lg tracking-tight">AI Recommendations</h3>
            <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-0.5">Automated triage decisions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between h-44 shadow-sm relative overflow-hidden group ${rec.color}`}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-black/05 dark:bg-white/05">
                      {rec.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold font-mono">
                      {rec.conf}% Conf.
                    </span>
                  </div>
                  
                  <h4 className="font-extrabold text-[14px] leading-tight text-slate-800 dark:text-white">{rec.title}</h4>
                  <p className="text-[12px] text-muted leading-relaxed mt-1">{rec.desc}</p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-2 border-t border-black/05 dark:border-white/05">
                  <button 
                    onClick={() => handleRecAction(rec.id, 'accept')}
                    className="flex-1 py-1.5 text-[11px] font-black rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button 
                    onClick={() => handleRecAction(rec.id, 'ignore')}
                    className="py-1.5 px-3 text-[11px] font-black rounded-lg border border-black/10 dark:border-white/10 text-muted hover:bg-black/03 dark:hover:bg-white/05 hover:text-slate dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FiXCircle className="w-3.5 h-3.5" /> Ignore
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── SECTION 5: INTERACTIVE GUJARAT MAP ────────────────────────────────────── */}
      <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4 relative z-10">
          <div>
            <h3 className="font-black text-slate dark:text-white text-lg tracking-tight">Interactive Gujarat Map</h3>
            <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-0.5">Live emergency dispatch nodes</p>
          </div>
          <span className="text-[10px] font-bold text-muted bg-black/03 dark:bg-white/04 p-1 px-2.5 rounded-lg border border-black/05 dark:border-white/05 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-bloodred animate-ping" />
            5 Connected Cities
          </span>
        </div>

        {/* Map Grid / Stylized Representation */}
        <div className="relative h-[380px] rounded-2xl border border-black/05 dark:border-white/05 bg-black/10 dark:bg-black/40 overflow-hidden flex items-center justify-center group select-none">
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Compass / HUD styling overlay */}
          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-muted flex flex-col gap-0.5">
            <span>GRID: GUJ_REG_23.0N</span>
            <span>SCALE: 1:520,000</span>
          </div>

          {/* SVG Map Path Drawing Vector Outline of Gujarat Map representation */}
          <svg className="absolute w-[80%] h-[80%] text-slate-300 dark:text-slate-700 opacity-20 pointer-events-none" viewBox="0 0 100 100">
            {/* Outline path representing the region shape */}
            <path
              d="M 30 10 Q 50 8 70 15 T 85 45 T 70 85 T 45 90 T 25 70 T 30 10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Stylized Active Vehicle Route dashed path */}
            <path
              d="M 45 35 Q 50 45 58 55 T 55 80"
              fill="none"
              stroke="#D81B43"
              strokeWidth="2.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
            <path
              d="M 20 50 Q 30 45 45 35"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
          </svg>

          {/* Animated City Pins */}
          {cities.map((city) => (
            <motion.div
              key={city.name}
              style={{ left: city.x, top: city.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() => setSelectedCity(city)}
              whileHover={{ scale: 1.15 }}
            >
              {/* Pulse Ring */}
              <span className={`absolute -inset-2.5 rounded-full animate-ping opacity-25 ${
                city.active > 3 ? 'bg-bloodred' : 'bg-aiblue'
              }`} />
              
              {/* Anchor Pin Circle */}
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md ${
                city.active > 3 ? 'bg-bloodred' : 'bg-aiblue'
              }`} />

              {/* Tag Label */}
              <span className="absolute left-6 -translate-y-1/2 top-1/2 bg-slate-900/90 text-white dark:bg-white/95 dark:text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
                {city.code}
              </span>
            </motion.div>
          ))}

          {/* Hover Details Triage Modal Card Overlay */}
          <AnimatePresence>
            {selectedCity && (
              <motion.div
                className="absolute p-4 rounded-xl glass-card border border-white/30 dark:border-white/10 bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 shadow-xl w-60 z-20"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
              >
                <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-200 pb-2 mb-2">
                  <h4 className="font-extrabold text-[13px]">{selectedCity.name} Hub</h4>
                  <button 
                    onClick={() => setSelectedCity(null)} 
                    className="text-[10px] hover:text-bloodred font-black"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 text-[11px] font-semibold">
                  <p className="flex justify-between">
                    <span className="opacity-70">Active Emergencies</span>
                    <span className="text-bloodred font-black">{selectedCity.active} operations</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="opacity-70">Available Donors</span>
                    <span className="text-emerald font-black">{selectedCity.donors} active</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="opacity-70">En Route Units</span>
                    <span className="text-aiblue font-black">2 vehicles</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── SECTION 6: BLOOD INVENTORY CAPSULES ─────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h3 className="font-black text-slate dark:text-white text-lg tracking-tight">Blood Inventory Visualizer</h3>
          <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-0.5">Real-time medical capsule monitors</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5">
          {[
            { group: 'O-', units: inventoryStock.Ominus, status: inventoryStock.Ominus < 8 ? 'critical' : 'warning', prediction: inventoryStock.Ominus < 8 ? `${inventoryStock.Ominus * 2}h depletion` : 'Alert pending', days: 2 },
            { group: 'O+', units: inventoryStock.Oplus, status: inventoryStock.Oplus < 20 ? 'warning' : 'stable', prediction: inventoryStock.Oplus < 20 ? 'Restock advised' : 'Healthy stock', days: 16 },
            { group: 'A-', units: inventoryStock.Aminus, status: inventoryStock.Aminus < 8 ? 'critical' : 'warning', prediction: inventoryStock.Aminus < 8 ? `${inventoryStock.Aminus * 2}h depletion` : 'Alert pending', days: 1 },
            { group: 'A+', units: inventoryStock.Aplus, status: inventoryStock.Aplus < 20 ? 'warning' : 'stable', prediction: inventoryStock.Aplus < 20 ? 'Restock advised' : 'Healthy stock', days: 12 },
            { group: 'B-', units: inventoryStock.Bminus, status: inventoryStock.Bminus < 10 ? 'warning' : 'stable', prediction: inventoryStock.Bminus < 10 ? 'Restock advised' : 'Healthy stock', days: 3 },
            { group: 'B+', units: inventoryStock.Bplus, status: inventoryStock.Bplus < 20 ? 'warning' : 'stable', prediction: inventoryStock.Bplus < 20 ? 'Restock advised' : 'Healthy stock', days: 11 },
            { group: 'AB-', units: inventoryStock.ABminus, status: inventoryStock.ABminus < 8 ? 'critical' : 'warning', prediction: inventoryStock.ABminus < 8 ? 'Immediate need' : 'Alert pending', days: 1 },
            { group: 'AB+', units: inventoryStock.ABplus, status: inventoryStock.ABplus < 15 ? 'warning' : 'stable', prediction: inventoryStock.ABplus < 15 ? 'Restock advised' : 'Healthy stock', days: 9 }
          ].map((capsule) => (
            <MedicalCapsule 
              key={capsule.group}
              group={capsule.group}
              units={capsule.units}
              status={capsule.status}
              prediction={capsule.prediction}
              days={capsule.days}
            />
          ))}
        </div>
      </div>

      {/* ─── SECTION 7: EMERGENCY HEATMAP ─────────────────────────────────────────── */}
      <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg">
        <h3 className="font-black text-slate dark:text-white text-lg tracking-tight mb-4">Emergency Heatmap Concentration</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { city: 'Ahmedabad', requests: heatmapRequests.Ahmedabad },
            { city: 'Surat', requests: heatmapRequests.Surat },
            { city: 'Rajkot', requests: heatmapRequests.Rajkot },
            { city: 'Vadodara', requests: heatmapRequests.Vadodara }
          ].map((item) => {
            const count = item.requests;
            const level = count >= 6 ? 'Critical' : count >= 3 ? 'High' : 'Normal';
            const glowColors = {
              Critical: 'bg-bloodred shadow-[0_0_25px_#D81B43]',
              High: 'bg-amber shadow-[0_0_20px_#D97706]',
              Normal: 'bg-emerald shadow-[0_0_15px_#10B981]'
            };
            const pulse = level === 'Critical' ? 'animate-ping' : level === 'High' ? 'animate-pulse' : '';

            return (
              <div key={item.city} className="p-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/04 dark:border-white/03 relative overflow-hidden flex flex-col justify-between h-28 group hover:border-bloodred/25 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black text-slate dark:text-white">{item.city}</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`${pulse} absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      level === 'Critical' ? 'bg-bloodred' : level === 'High' ? 'bg-amber' : 'bg-emerald'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${glowColors[level]}`}></span>
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate dark:text-white">{count} {count === 1 ? 'Request' : 'Requests'}</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">{level} alert priority</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 8: AI ASSISTANT PANEL ────────────────────────────────────────── */}
      <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-aiblue/10 flex items-center justify-center glow-blue">
            <FiMessageSquare className="w-5 h-5 text-aiblue" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate dark:text-white text-lg tracking-tight">AI Dispatch Assistant</h3>
            <p className="text-muted text-[11px] font-bold uppercase tracking-wider mt-0.5">Interactive dispatch agent</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Chat log */}
          <div className="lg:col-span-8 p-4 rounded-2xl border border-black/05 dark:border-white/05 bg-black/10 dark:bg-black/30 h-64 overflow-y-auto flex flex-col gap-3.5 custom-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-[12px] max-w-[80%] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-br-none shadow-sm'
                    : 'bg-white/80 dark:bg-darksurf2/80 text-slate dark:text-white rounded-bl-none shadow-sm border border-black/05 dark:border-white/05'
                }`}>
                  <p className="font-semibold">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt panel */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Quick Commands</span>
              {[
                'Generate Emergency Report',
                'Predict Shortage',
                'Find Donors',
                'Optimize Dispatch'
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(cmd)}
                  className="w-full text-left p-2.5 rounded-xl border border-black/05 dark:border-white/05 bg-white/40 dark:bg-darksurf2/30 hover:bg-bloodred hover:text-white text-slate dark:text-white hover:border-bloodred text-[11px] font-bold transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-between"
                >
                  <span>{cmd}</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Prompt input field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiAssistantText}
                onChange={(e) => setAiAssistantText(e.target.value)}
                placeholder="Ask dispatch agent..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                className="flex-1 bg-white/40 dark:bg-darksurf2/30 border border-black/10 dark:border-white/10 rounded-xl p-2.5 px-4 text-xs font-bold text-slate dark:text-white placeholder-muted focus:outline-none focus:border-bloodred transition-colors"
              />
              <button 
                onClick={() => handleSendPrompt()}
                className="btn-primary p-2.5 rounded-xl cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 9: MODERN CHARTS ─────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Chart 1: Fulfilled vs Requested dispatches */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg">
          <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest mb-4">Fulfilled Dispatch Analytics</h3>
          
          <div className="h-48 w-full flex items-end gap-3.5 pt-4">
            {chartData.map((d) => {
              const reqH = (d.req / 15) * 100;
              const okH = (d.ok / 15) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="h-32 w-full flex gap-1.5 justify-center items-end bg-black/02 dark:bg-white/01 rounded-xl p-1 relative group hover:bg-black/04 dark:hover:bg-white/02 transition-all duration-300">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md transition-all duration-200 z-10 whitespace-nowrap">
                      Req: {d.req} | OK: {d.ok}
                    </div>

                    {/* Req Bar */}
                    <motion.div 
                      style={{ height: `${reqH}%` }} 
                      className="w-3 bg-slate-300 dark:bg-slate-700 rounded-full"
                      layoutId={`req-bar-${d.day}`}
                    />
                    {/* Ok Bar */}
                    <motion.div 
                      style={{ height: `${okH}%` }} 
                      className="w-3 bg-gradient-to-t from-[#D81B43] to-[#F03561] dark:from-[#D81B43]/90 dark:to-[#F03561]/90 rounded-full shadow-lg shadow-bloodred/10"
                      layoutId={`ok-bar-${d.day}`}
                    />
                  </div>
                  <span className="text-[10px] text-muted font-bold group-hover:text-bloodred transition-colors">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Requested</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-[#D81B43] to-[#F03561]" /> Fulfilled</span>
          </div>
        </div>

        {/* Chart 2: Radial Match time efficiency */}
        <div className="p-6 rounded-[28px] glass-card border border-white/20 dark:border-white/05 dark:bg-darksurf/40 shadow-lg flex flex-col justify-between">
          <h3 className="font-extrabold text-slate dark:text-white text-[14px] uppercase tracking-widest mb-4">Response Efficiency Dials</h3>
          
          <div className="flex justify-around items-center py-2">
            {[
              { 
                title: 'Emergency', 
                pct: Math.min(100, Math.round((24 / (avgMatch - 14)) * 98)), 
                val: `${Math.round(avgMatch - 14.2)}s`, 
                color: 'stroke-bloodred text-bloodred',
                glow: 'shadow-bloodred/10'
              },
              { 
                title: 'Urgent', 
                pct: Math.min(100, Math.round((42 / (avgMatch + 4)) * 88)), 
                val: `${Math.round(avgMatch + 3.8)}s`, 
                color: 'stroke-amber text-amber',
                glow: 'shadow-amber/10'
              },
              { 
                title: 'Normal', 
                pct: Math.min(100, Math.round((78 / (avgMatch + 40)) * 72)), 
                val: `${Math.round(avgMatch + 39.8)}s`, 
                color: 'stroke-emerald text-emerald',
                glow: 'shadow-emerald/10'
              }
            ].map((dial) => {
              const r = 24;
              const circ = 2 * Math.PI * r;
              const offset = circ - (dial.pct / 100) * circ;
              return (
                <div key={dial.title} className="flex flex-col items-center">
                  <div className="relative w-18 h-18 flex items-center justify-center rounded-full bg-black/02 dark:bg-white/02 shadow-inner border border-black/05 dark:border-white/05">
                    <svg width="68" height="68" className="-rotate-90">
                      <circle cx="34" cy="34" r={r} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black/04 dark:text-white/04" />
                      <motion.circle 
                        cx="34" cy="34" r={r} fill="none" 
                        strokeWidth="3.5" 
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        className={`${dial.color} transition-all duration-500`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-slate dark:text-white">{dial.val}</span>
                  </div>
                  <span className="text-[10px] text-muted font-bold mt-2.5 uppercase tracking-wider">{dial.title}</span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[10px] text-muted font-bold mt-4 uppercase tracking-widest">
            Overall response rate optimized by 12% this week
          </p>
        </div>

      </div>

      {/* ─── SECTION 10: FLOATING QUICK ACTIONS DOCK ─────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/60 dark:bg-darksurf/60 backdrop-blur-xl p-2 rounded-full border border-white/40 dark:border-white/10 shadow-premium flex items-center gap-1.5 max-w-[90%] md:max-w-md">
        {[
          { label: 'Request', icon: FiPlusCircle, action: onNewRequest, color: 'text-bloodred hover:bg-bloodred/10' },
          { label: 'Donor', icon: FiUserPlus, action: () => onNavigate('donors'), color: 'text-emerald hover:bg-emerald/10' },
          { label: 'Broadcast', icon: FiRadio, action: () => onOpenAI(), color: 'text-aiblue hover:bg-aiblue/10' },
          { label: 'Inventory', icon: FiShield, action: () => onNavigate('inventory'), color: 'text-amber hover:bg-amber/10' },
          { label: 'Hospitals', icon: FiMapPin, action: () => onNavigate('hospitals'), color: 'text-sky hover:bg-sky/10' }
        ].map((act, idx) => (
          <button
            key={idx}
            onClick={act.action}
            className={`flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 cursor-pointer ${act.color}`}
            title={act.label}
          >
            <act.icon className="w-5.5 h-5.5" />
          </button>
        ))}
      </div>
      
    </motion.div>
  );
};

export default OverviewTab;
