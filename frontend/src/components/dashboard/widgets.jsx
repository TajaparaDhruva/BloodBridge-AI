import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import {
  FiAlertCircle, FiUsers, FiZap, FiDatabase, FiTrendingUp,
  FiChevronRight, FiCalendar, FiTarget, FiActivity, FiArrowUpRight, FiArrowDownRight, FiCheckCircle,
  FiLayers, FiMoreVertical, FiPlus
} from 'react-icons/fi';
import {
  AnimatedCounter, ProgressRing, StatusBadge, WidgetShell,
  weeklyData, aiRecommendations, activityTimeline, upcomingTasks, heatmapData,
} from './shared';

const DONUT_COLORS = ['#C62A47', '#059669', '#6366F1', '#0EA5E9', '#D97706', '#991B33', '#E8445F', '#831D2C'];

// Mock sparkline data for premium stat cards
const sparklineData = {
  'Active Requests': [
    { val: 2 }, { val: 4 }, { val: 3 }, { val: 5 }, { val: 4 }, { val: 6 }, { val: 5 }
  ],
  'Donors Online': [
    { val: 10 }, { val: 12 }, { val: 15 }, { val: 14 }, { val: 17 }, { val: 19 }, { val: 23 }
  ],
  'Avg Match Time': [
    { val: 48 }, { val: 44 }, { val: 41 }, { val: 43 }, { val: 39 }, { val: 38 }, { val: 38 }
  ],
  'Blood Units': [
    { val: 168 }, { val: 172 }, { val: 170 }, { val: 176 }, { val: 180 }, { val: 182 }, { val: 182 }
  ],
};

// ─── Stat Widgets Row ─────────────────────────────────────────────────────────
export const StatWidgets = ({ requests, donors, inventory }) => {
  const stats = [
    {
      label: 'Active Requests',
      value: requests.filter((r) => r.status !== 'completed').length,
      icon: FiAlertCircle,
      color: '#E11D48',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
      deltaBg: 'bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] border border-rose-100/25',
      delta: '+2 today',
      trend: 'up',
    },
    {
      label: 'Donors Online',
      value: donors.filter((d) => d.eligibility === 'eligible').length,
      icon: FiUsers,
      color: '#10B981',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      deltaBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100/25',
      delta: '+12 this week',
      trend: 'up',
    },
    {
      label: 'Avg Match Time',
      value: '38s',
      icon: FiZap,
      color: '#6366F1',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      deltaBg: 'bg-indigo-50 dark:bg-indigo-950/30 text-[#6366F1] border border-indigo-100/25',
      delta: '18s faster',
      trend: 'down',
    },
    {
      label: 'Blood Units',
      value: inventory.reduce((a, b) => a + b.units, 0),
      icon: FiDatabase,
      color: '#3B82F6',
      bgColor: 'bg-sky-50 dark:bg-sky-950/20',
      deltaBg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 border border-sky-100/25',
      delta: 'Stable',
      trend: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s, i) => {
        const trendData = sparklineData[s.label] || [{ val: 1 }, { val: 2 }];
        const isUp = s.trend === 'up';
        const isDown = s.trend === 'down';
        
        return (
          <div key={s.label} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            {/* Soft decorative glow behind the icon */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[30px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: s.color }} />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bgColor}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 leading-none uppercase tracking-wider ${s.deltaBg}`}>
                  {isUp && <FiArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {isDown && <FiArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {s.delta}
                </span>
              </div>

              <p className="text-[36px] font-extrabold text-gray-900 dark:text-white leading-none tracking-tight mb-1 text-left">
                <AnimatedCounter value={s.value} duration={1200 + i * 150} />
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black tracking-widest uppercase text-left mt-1.5">{s.label}</p>
            </div>

            {/* Sparkline line wave (no area fill, just stroke) */}
            <div className="h-10 mt-6 -mx-6 -mb-6 rounded-b-2xl overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 22, right: 0, left: 0, bottom: 0 }}>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={s.color}
                    strokeWidth={2.2}
                    fill="none"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const AIInsightsCard = ({ onNavigate }) => {
  const handleAction = (action) => {
    if (action === 'Find Donors') {
      onNavigate?.('donors');
    } else if (action === 'Dispatch Now') {
      onNavigate?.('map');
    } else if (action === 'View Inventory') {
      onNavigate?.('inventory');
    }
  };

  return (
    <div className="p-6 h-full flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[50px] opacity-10 bg-indigo-500 pointer-events-none" />
      
      <div>
        <div className="flex items-center justify-between mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
              <FiZap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">AI Insights</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-wider uppercase mt-0.5">Real-time optimization</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-xl border border-indigo-150/30 shadow-sm animate-pulse uppercase tracking-wider">
            3 Live Alerts
          </span>
        </div>

        <div className="space-y-4">
          {aiRecommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border border-[#F3F4F6] dark:border-slate-800/80 transition-all duration-200 group text-left ${
                rec.type === 'critical' ? 'bg-rose-50/15 dark:bg-rose-950/05' :
                rec.type === 'warning' ? 'bg-amber-50/15 dark:bg-amber-950/05' : 'bg-indigo-50/10 dark:bg-indigo-950/05'
              }`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ x: 4 }}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0 filter drop-shadow-sm leading-none select-none">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-extrabold text-gray-900 dark:text-white text-[13px] leading-snug">{rec.title}</p>
                  {rec.type === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-ping" />}
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-[12px] leading-relaxed mt-1 font-medium">{rec.desc}</p>
              </div>
              <button
                onClick={() => handleAction(rec.action)}
                className={`flex-shrink-0 text-[11px] font-black px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700/80 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer ${
                  rec.action === 'Dispatch Now' 
                    ? 'bg-white hover:bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white' 
                    : 'bg-white hover:bg-gray-50 dark:bg-slate-850 text-gray-600 dark:text-gray-300'
                }`}
              >
                {rec.action}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Performance Score ────────────────────────────────────────────────────────
export const PerformanceScore = ({ score = 94 }) => {
  const size = 136;
  const stroke = 8.5;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="p-6 flex flex-col items-center justify-between text-center h-full rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md" delay={0.15}>
      <div className="flex items-center gap-2.5 mb-5 self-start text-left">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
          <FiTarget className="w-4.5 h-4.5" />
        </div>
        <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Performance Score</h3>
      </div>

      <div className="relative my-4 flex items-center justify-center">
        {/* Glow behind the ring */}
        <div className="absolute w-24 h-24 rounded-full bg-emerald-500/05 filter blur-[15px]" />
        
        <svg width={size} height={size} className="-rotate-90 relative z-10">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-gray-100 dark:text-slate-800" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="#10B981" strokeWidth={stroke}
            strokeDasharray={circ} strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-[36px] font-extrabold text-gray-900 dark:text-white leading-none tracking-tight">
            <AnimatedCounter value={score} />%
          </span>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 leading-none">Excellent</span>
        </div>
      </div>

      <div className="w-full space-y-3.5 mt-5 pt-4 border-t border-[#F3F4F6] dark:border-slate-800/80">
        {[
          { label: 'Match Rate', value: 97, color: '#10B981' },
          { label: 'Response Time', value: 88, color: '#6366F1' },
          { label: 'Inventory Health', value: 72, color: '#F59E0B' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-[11px] mb-1.5 text-left">
              <span className="text-gray-400 dark:text-gray-500 font-bold">{item.label}</span>
              <span className="font-extrabold text-gray-900 dark:text-white">{item.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Live Activity Feed (Requests Stream) ──────────────────────────────────────
export const LiveActivityFeed = ({ requests, onNavigate }) => (
  <div className="p-6 h-full rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between mb-6 text-left">
      <div className="flex items-center gap-2">
        <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Live Requests Stream</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald"></span>
        </span>
      </div>
      <button onClick={() => onNavigate?.('map')} className="text-[11px] font-black text-[#E11D48] hover:underline flex items-center gap-0.5 cursor-pointer uppercase tracking-wider">
        Live Monitor <FiChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>

    <div className="space-y-3">
      {requests.slice(0, 5).map((req, i) => {
        let boxColor = 'bg-rose-50 text-[#E11D48] dark:bg-rose-950/20 dark:text-rose-400 border border-[#FFE4E6]/30';
        if (req.bloodGroup.includes('+')) {
          boxColor = req.bloodGroup.startsWith('AB') 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/20'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/20';
        } else if (req.bloodGroup === 'A-') {
          boxColor = 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-100/20';
        }
        
        return (
          <motion.div
            key={req.id}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800/80 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm transition-all duration-200 group cursor-default text-left"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${boxColor}`}>
              {req.bloodGroup}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold text-[13px] text-gray-900 dark:text-white truncate leading-snug">{req.patientName}</p>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider whitespace-nowrap">{req.time}</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-[11px] truncate mt-0.5 font-medium">{req.hospitalName}</p>
            </div>
            
            <div className="flex-shrink-0 pl-1.5">
              <span className="bg-indigo-50/60 dark:bg-indigo-950/20 text-[#4F46E5] dark:text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase border border-indigo-100/25">
                {req.status === 'matching' ? 'Matching' : req.status === 'dispatched' ? 'Dispatched' : 'Completed'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

// ─── Inventory Widget ───────────────────────────────────────────────────────────
export const InventoryWidget = ({ inventory, onNavigate }) => {
  const criticalGroups = inventory.filter((i) => i.status === 'critical' || i.status === 'warning');
  const donutData = inventory.map((b) => ({ name: b.group, value: b.units }));

  return (
    <div className="p-6 h-full flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-5 text-left">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Blood Inventory System</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">Real-time blood stock overview</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center flex-shrink-0">
            <FiDatabase className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          {/* Centered Donut Chart with clean style */}
          <div className="w-[124px] h-[124px] flex-shrink-0 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-[26px] font-extrabold text-gray-900 dark:text-white leading-none">
                {inventory.reduce((a, b) => a + b.units, 0)}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mt-1 leading-none">Total Units</span>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 mt-1 leading-none">
                <FiArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                +12 this week
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={58}
                  paddingAngle={2.5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean indicator dials */}
          <div className="grid grid-cols-4 gap-3.5 flex-1 w-full text-center">
            {inventory.map((b) => {
              const max = 60;
              const pct = Math.min(100, Math.round((b.units / max) * 100));
              const color = b.status === 'critical' ? '#E11D48' : b.status === 'warning' ? '#F59E0B' : '#10B981';
              const isCritical = b.status === 'critical';
              return (
                <div key={b.group} className="flex flex-col items-center justify-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-transparent transition-all">
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    {isCritical && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse border-2 border-white dark:border-slate-900 shadow-sm" />
                    )}
                    <ProgressRing pct={pct} color={color} size={42} stroke={3.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-gray-900 dark:text-white">{b.group}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-black text-gray-900 dark:text-white mt-1.5 leading-none">
                    <span className="font-extrabold">{b.units}</span>
                    <span className="text-gray-400 font-medium ml-0.5">u</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {criticalGroups.length > 0 && (
        <div 
          onClick={() => onNavigate?.('inventory')}
          className="mt-5 flex items-center justify-between gap-3 px-4.5 py-3 rounded-2xl bg-rose-50/45 dark:bg-rose-950/15 border border-[#FFE4E6]/60 dark:border-rose-900/30 shadow-sm text-[#E11D48] text-xs font-semibold leading-relaxed cursor-pointer hover:bg-rose-100/40 dark:hover:bg-rose-900/20 transition-all"
        >
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-[#E11D48]" />
          <span>{criticalGroups.length} groups critically low. Immediate replenishment required.</span>
          <FiChevronRight className="w-4 h-4 text-[#E11D48] ml-auto" />
        </div>
      )}
    </div>
  );
};

// ─── Weekly Chart ───────────────────────────────────────────────────────────────
export const WeeklyChart = () => {
  const [hoveredData, setHoveredData] = useState(null);

  return (
    <div className="p-6 h-full flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-5 text-left">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Weekly System Load</h3>
            <p className="text-[10px] text-[#10B981] font-black tracking-wider uppercase mt-0.5 flex items-center gap-1.5">
              <FiTrendingUp className="w-3.5 h-3.5 text-[#10B981] stroke-[2.5]" /> +18% operations efficiency
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shadow-sm" />Requests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-sm" />Fulfilled
            </span>
          </div>
        </div>

        <div className="relative mt-2 select-none">
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart 
              data={weeklyData} 
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              onMouseMove={(state) => {
                if (state && state.activePayload) {
                  setHoveredData(state.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <defs>
                <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D48" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} ticks={[0, 3, 6, 9, 12]} domain={[0, 12]} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #F3F4F6',
                  borderRadius: '16px',
                  fontSize: 11,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                }}
                itemStyle={{ color: '#1F2937', fontWeight: 700 }}
                labelStyle={{ color: '#94A3B8', fontWeight: 800 }}
              />
              <Area type="monotone" dataKey="requests" stroke="#E11D48" strokeWidth={2.5} fill="url(#gradRed)" activeDot={{ r: 5, strokeWidth: 1.5 }} />
              <Area type="monotone" dataKey="fulfilled" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gradSky)" activeDot={{ r: 5, strokeWidth: 1.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4 border-t border-[#F3F4F6] dark:border-slate-800/80 pt-3">
        <div className="bg-[#E8F8F5] dark:bg-emerald-950/20 text-[#1E8449] dark:text-emerald-400 px-3 py-1.5 rounded-xl font-black tracking-wider uppercase border border-emerald-100/25 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E8449] animate-pulse" />
          Operational Cycle: Active
        </div>
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-xl font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {hoveredData ? (
            <span className="font-extrabold text-gray-800 dark:text-white">
              {hoveredData.day}: {hoveredData.requests} reqs · {hoveredData.fulfilled} fulf
            </span>
          ) : (
            <span>Hover chart for values</span>
          )}
        </div>
      </div>
    </div>
  );
};


// ─── Activity Timeline ──────────────────────────────────────────────────────────
export const ActivityTimeline = () => {
  const { timeline } = useAuth();

  return (
    <WidgetShell className="p-6 h-full border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.22}>
      <div className="flex items-center gap-2 mb-5">
        <FiActivity className="w-4 h-4 text-aiblue" />
        <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Activity Log</h3>
      </div>

      <div className="relative pl-5 space-y-4">
        <div className="absolute left-[7px] top-2.5 bottom-2 w-0.5 bg-black/05 dark:bg-white/05" />
        {timeline.map((item, i) => (
        <motion.div
          key={item.id}
          className="relative flex gap-3 group"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.07 }}
        >
          {/* Glowing dot with status colors */}
          <div className={`absolute -left-5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface dark:border-darksurf transition-transform group-hover:scale-110 shadow-sm dashboard-timeline-dot ${item.type}`} />
          
          <div className="flex-1 min-w-0 bg-black/01 dark:bg-white/01 hover:bg-black/03 dark:hover:bg-white/02 p-2 rounded-xl border border-transparent hover:border-black/04 dark:hover:border-white/04 transition-all duration-200">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-[12px] text-slate dark:text-white leading-tight">{item.title}</p>
              <span className="text-[9px] text-muted font-bold whitespace-nowrap">{item.time}</span>
            </div>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </WidgetShell>
  );
};

// ─── AI Dispatch Radar ────────────────────────────────────────────────────────
export const AIDispatchRadar = () => {
  const [radius, setRadius] = useState(12);
  const [urgency, setUrgency] = useState('Critical');
  
  // Calculate simulated donor count based on radius and urgency
  const getDonorCount = () => {
    const multiplier = urgency === 'Critical' ? 3.5 : urgency === 'High' ? 2.1 : 1.2;
    return Math.round(radius * radius * 0.22 * multiplier);
  };

  const getMatchTime = () => {
    if (urgency === 'Critical') return '24 seconds';
    if (urgency === 'High') return '42 seconds';
    return '1.8 minutes';
  };

  return (
    <WidgetShell className="p-6 h-full flex flex-col justify-between border border-black/05 dark:border-white/05 dark:bg-darksurf overflow-hidden" delay={0.25}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiActivity className="w-4 h-4 text-bloodred" />
            <h3 className="font-extrabold text-slate dark:text-white text-[15px]">AI Dispatch Radar</h3>
          </div>
          <span className="text-[9.5px] font-black text-emerald bg-emerald/08 px-2.5 py-0.5 rounded-lg border border-emerald/10 shadow-sm uppercase tracking-wider animate-pulse">
            Active Scan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-1.5">
          {/* Radar Screen Visual */}
          <div className="sm:col-span-5 flex justify-center relative">
            <div className="w-32 h-32 rounded-full border border-bloodred/10 dark:border-bloodred/25 bg-black/03 dark:bg-white/01 relative overflow-hidden flex items-center justify-center">
              {/* Radar grids */}
              <div className="absolute w-24 h-24 rounded-full border border-dashed border-bloodred/06 dark:border-bloodred/15" />
              <div className="absolute w-16 h-16 rounded-full border border-bloodred/04 dark:border-bloodred/10" />
              <div className="absolute w-8 h-8 rounded-full border border-dashed border-bloodred/04 dark:border-bloodred/08" />
              
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-bloodred/05 dark:bg-bloodred/10" />
              <div className="absolute left-0 right-0 h-[1px] bg-bloodred/05 dark:bg-bloodred/10" />

              {/* Sweeping scan line */}
              <div className="absolute inset-0 rounded-full border-r border-bloodred-light/35 animate-spin" style={{ animationDuration: '4s' }} />

              {/* Pulsing donor nodes */}
              <span className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-bloodred animate-ping" />
              <span className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-bloodred" />
              
              <span className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald" />

              <span className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-bloodred animate-pulse" />
              <span className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-bloodred" />

              {/* Center dispatch node */}
              <div className="w-3.5 h-3.5 rounded-full bg-bloodred border border-white dark:border-darkbg shadow relative z-10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="sm:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-black/02 dark:bg-white/02 border border-black/04 dark:border-white/04 rounded-2xl">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Est. Reach</p>
                <p className="text-[20px] font-black text-slate dark:text-white leading-none">
                  {getDonorCount()} <span className="text-[11px] text-muted font-bold">donors</span>
                </p>
              </div>
              <div className="p-3 bg-black/02 dark:bg-white/02 border border-black/04 dark:border-white/04 rounded-2xl">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Est. Match Time</p>
                <p className="text-[14px] font-black text-slate dark:text-white leading-tight mt-1">
                  {getMatchTime()}
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-muted">Search Radius</span>
                <span className="text-bloodred">{radius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-bloodred"
              />
            </div>

            {/* Urgency Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-muted block">Urgency Level</span>
              <div className="flex gap-2">
                {['Standard', 'High', 'Critical'].map((level) => {
                  const active = urgency === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setUrgency(level)}
                      className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-black border transition-all cursor-pointer select-none ${
                        active
                          ? level === 'Critical'
                            ? 'bg-bloodred/10 border-bloodred text-bloodred font-black shadow-sm'
                            : level === 'High'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-500 font-black shadow-sm'
                            : 'bg-emerald/10 border-emerald text-emerald font-black shadow-sm'
                          : 'bg-transparent border-black/05 dark:border-white/05 text-muted hover:text-slate dark:hover:text-white hover:bg-black/02 dark:hover:bg-white/02'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/05 dark:border-white/05 pt-3 mt-4">
        <p className="text-muted text-[11px] font-medium leading-relaxed">
          AI continuously monitors traffic, donor density, and historic response logs to dynamically optimize dispatch radius.
        </p>
      </div>
    </WidgetShell>
  );
};

// ─── Upcoming Tasks (Operations Tasks) ──────────────────────────────────────────
export const UpcomingTasks = ({ tasks = [], onToggleTask, onNavigate }) => {
  return (
    <div className="p-6 h-full rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center gap-3 mb-5 text-left">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <FiLayers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Operations Tasks</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">Stay on top of critical operations</p>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 3).map((task, i) => {
            let priorityColor = 'border-l-[#10B981]';
            let badgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100/20 dark:bg-emerald-950/20 dark:text-emerald-400';
            if (task.priority === 'critical') {
              priorityColor = 'border-l-[#E11D48]';
              badgeStyle = 'bg-rose-50 text-[#E11D48] border border-rose-100/20 dark:bg-rose-950/20 dark:text-rose-400';
            } else if (task.priority === 'urgent' || task.priority === 'warning') {
              priorityColor = 'border-l-[#F59E0B]';
              badgeStyle = 'bg-amber-50 text-amber-600 border border-amber-100/20 dark:bg-amber-950/20 dark:text-amber-400';
            }

            return (
              <motion.div
                key={task.id}
                onClick={() => onToggleTask?.(task.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 border-l-[4px] ${priorityColor} transition-all duration-200 cursor-pointer shadow-sm`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                whileHover={{ x: 2 }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {task.completed ? (
                    <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-md border-2 border-gray-200 dark:border-slate-700 hover:border-[#E11D48] transition-colors" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <p className={`font-extrabold text-[12.5px] truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black mt-0.5 uppercase tracking-wide">Due {task.due}</p>
                </div>
                
                <div className="flex-shrink-0 pl-1">
                  <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider ${badgeStyle}`}>
                    {task.priority}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button onClick={() => onNavigate?.('tasks')} className="w-full py-3 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-5 tracking-wider uppercase transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>View All Tasks</span>
        <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

// ─── Quick Access Panel (Command Center) ───────────────────────────────────────
export const QuickAccessPanel = ({ onNavigate, onNewRequest, onOpenAI }) => {
  const items = [
    { label: 'New Request', icon: '🚨', action: onNewRequest },
    { label: 'Live Map', icon: '🗺️', action: () => onNavigate('map') },
    { label: 'Donors', icon: '🩸', action: () => onNavigate('donors') },
    { label: 'AI Assistant', icon: '🤖', action: onOpenAI },
    { label: 'Inventory', icon: '💉', action: () => onNavigate('inventory') },
    { label: 'Hospitals', icon: '🏥', action: () => onNavigate('hospitals') },
  ];

  return (
    <div className="p-6 h-full flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center gap-3 mb-5 text-left">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <FiLayers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Command Center</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">Quick access to key tools</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          {items.map((item, i) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800/80 hover:border-indigo-100/50 hover:shadow-sm transition-all group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="w-11 h-11 rounded-full bg-gray-50/50 dark:bg-slate-800/40 flex items-center justify-center text-[22px] filter drop-shadow-sm group-hover:scale-115 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="text-[10.5px] font-black text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-center leading-tight">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <button onClick={() => onNavigate('map')} className="w-full py-3 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-5 tracking-wider uppercase transition-colors">
        <FiZap className="w-4 h-4 fill-current" />
        <span>Smart Actions</span>
        <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

// ─── Team Activity (Eligible Donors) ───────────────────────────────────────────
export const TeamActivity = ({ donors, onNavigate }) => {
  // Static mock online list based on screenshot
  const onlineMock = [
    { id: 1, name: 'Rajesh Kumar', bloodGroup: 'O-', initial: 'R' },
    { id: 2, name: 'Priya Patel', bloodGroup: 'A+', initial: 'P' },
    { id: 3, name: 'Anand Joshi', bloodGroup: 'B+', initial: 'A' },
    { id: 4, name: 'Sanjay Shah', bloodGroup: 'O+', initial: 'S' },
    { id: 5, name: 'Vijay Varma', bloodGroup: 'AB-', initial: 'V' }
  ];

  return (
    <div className="p-6 h-full flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-5 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-tight">Eligible Donors</h3>
          </div>
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-100/20 shadow-sm animate-pulse tracking-wider uppercase leading-none">
            4 Online
          </span>
        </div>

        <div className="flex gap-2.5 my-5 text-left">
          {onlineMock.map((d, i) => (
            <motion.div
              key={d.id}
              className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/25 flex items-center justify-center text-[13px] font-extrabold text-[#E11D48] shadow-sm relative flex-shrink-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -3 }}
              title={d.name}
            >
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
              {d.initial}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-3.5 border-t border-[#F3F4F6] dark:border-slate-800/80 pt-4 text-left">
        {onlineMock.slice(0, 3).map((d) => {
          let badgeColor = 'bg-rose-50 text-[#E11D48] dark:bg-rose-950/20 dark:text-rose-400 border border-[#FFE4E6]/30';
          if (d.bloodGroup === 'A+') {
            badgeColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/20';
          } else if (d.bloodGroup === 'B+') {
            badgeColor = 'bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-100/20';
          }
          
          return (
            <div key={d.id} className="flex items-center justify-between gap-2.5 text-[12px] p-0.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white truncate max-w-[130px]">{d.name}</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border tracking-wider uppercase leading-none ${badgeColor}`}>
                {d.bloodGroup}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={() => onNavigate?.('donors')} className="w-full py-3 bg-[#E8F8F5] hover:bg-[#D1F2EB] text-[#1E8449] rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-5 tracking-wider uppercase transition-colors">
        <FiUsers className="w-4 h-4" />
        <span>View All Donors</span>
        <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

// ─── Donor Network Table ────────────────────────────────────────────────────────
export const DonorNetworkTable = ({ userLocation, onNavigate, onNewRequest, onCallDonor }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const donorsMock = [
    { id: 1, name: 'Rajesh Kumar', age: 29, weight: 74, bloodGroup: 'O-', city: 'Mumbai', lastDonation: '2026-03-15', status: 'Stable' },
    { id: 2, name: 'Priya Patel', age: 25, weight: 58, bloodGroup: 'A+', city: 'Ahmedabad', lastDonation: '2026-04-10', status: 'Stable' },
    { id: 3, name: 'Anand Joshi', age: 34, weight: 81, bloodGroup: 'B+', city: 'Pune', lastDonation: '2026-01-20', status: 'Stable' },
    { id: 4, name: 'Sunita Rao', age: 27, weight: 62, bloodGroup: 'O+', city: 'Mumbai', lastDonation: '2026-05-02', status: 'Stable' },
    { id: 5, name: 'Vikram Singh', age: 31, weight: 79, bloodGroup: 'AB-', city: 'Pune', lastDonation: '2026-06-18', status: 'Low Stock' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-6 text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
            <FiUsers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[16px] leading-tight">
              Donor Registry — {userLocation?.name || 'Ahmedabad'}
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">5 active registered donors</p>
          </div>
        </div>
        
        <button
          onClick={() => onNavigate?.('donors')}
          className="border border-rose-100/50 dark:border-rose-950/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-[#E11D48] text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-all uppercase tracking-wider"
        >
          <span>Registry Details</span>
          <FiChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Table Headers (Desktop Grid) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3.5 text-center">
        <div className="col-span-3 text-left">Donor Profile</div>
        <div className="col-span-2">Blood Type</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-2">Last Active</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1"></div>
      </div>

      {/* Capsule Rows */}
      <div className="space-y-3.5">
        {donorsMock.map((d) => {
          let typeColor = 'bg-rose-50 text-[#E11D48] dark:bg-rose-950/20 dark:text-rose-400 border border-[#FFE4E6]/30';
          if (d.bloodGroup === 'A+') {
            typeColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/20';
          } else if (d.bloodGroup === 'B+') {
            typeColor = 'bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-100/20';
          } else if (d.bloodGroup === 'O+') {
            typeColor = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/20';
          }

          return (
            <div key={d.id} className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800/80 rounded-2xl p-4.5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all text-center">
              {/* Profile */}
              <div className="col-span-3 flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center font-extrabold text-[13px] shadow-sm flex-shrink-0">
                  {d.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-[13.5px] leading-tight">{d.name}</h4>
                  <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold mt-0.5">{d.age} yrs · {d.weight} kg</p>
                </div>
              </div>

              {/* Blood Type */}
              <div className="col-span-2 flex items-center justify-center w-full">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider ${typeColor}`}>
                  {d.bloodGroup}
                </span>
              </div>

              {/* Location */}
              <div className="col-span-2 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-[12.5px] w-full">
                {d.city}
              </div>

              {/* Last Active */}
              <div className="col-span-2 flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-[12px] w-full">
                <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{d.lastDonation}</span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center justify-center w-full">
                {d.status === 'Stable' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stable
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100/20 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-wider uppercase leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Low Stock
                  </span>
                )}
              </div>

              {/* Action Dot */}
              <div className="col-span-1 flex items-center justify-end text-gray-400 dark:text-gray-500 hover:text-gray-600 w-full relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === d.id ? null : d.id);
                  }}
                  className="p-1 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                >
                  <FiMoreVertical className="w-4.5 h-4.5" />
                </button>
                <AnimatePresence>
                  {activeMenuId === d.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-1 text-left"
                      >
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onNavigate?.('donors');
                          }}
                          className="w-full px-3.5 py-2 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          👤 Profile Details
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onCallDonor?.(d);
                          }}
                          className="w-full px-3.5 py-2 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          📞 Voice Call
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            alert(`Emergency AI alert sent to donor ${d.name} (${d.bloodGroup})!`);
                          }}
                          className="w-full px-3.5 py-2 text-[11px] font-bold text-[#E11D48] hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer border-t border-gray-100 dark:border-slate-700/80"
                        >
                          🚨 Dispatch Alert
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer metrics summary & Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-2">
        {/* Metrics Banner */}
        <div className="bg-rose-50/15 dark:bg-rose-950/05 border border-[#FFE4E6]/50 rounded-2xl p-4.5 py-3.5 flex items-center gap-6 text-left max-w-sm w-full">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-6 leading-none">
            <div className="flex flex-col">
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Donors</span>
              <span className="text-[17px] font-black text-gray-900 dark:text-white">5</span>
            </div>
            <div className="w-[1px] h-7 bg-rose-100/40" />
            <div className="flex flex-col">
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider mb-1">Stable</span>
              <span className="text-[17px] font-black text-emerald-500">4</span>
            </div>
            <div className="w-[1px] h-7 bg-rose-100/40" />
            <div className="flex flex-col">
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider mb-1">Low Stock</span>
              <span className="text-[17px] font-black text-amber-500">1</span>
            </div>
          </div>
        </div>

        {/* Buttons group on the right */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button onClick={onNewRequest} className="w-10 h-10 rounded-2xl bg-[#E11D48] hover:bg-rose-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95" title="Add Donor">
            <FiPlus className="w-5 h-5 stroke-[3]" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-[#6366F1] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95" title="Share Registry">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
