import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  FiAlertCircle, FiUsers, FiZap, FiDatabase, FiTrendingUp,
  FiChevronRight, FiCalendar, FiTarget, FiActivity, FiArrowUpRight, FiArrowDownRight, FiCheckCircle,
  FiLayers
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
      color: '#C62A47',
      delta: '+2 today',
      trend: 'up',
    },
    {
      label: 'Donors Online',
      value: donors.filter((d) => d.eligibility === 'eligible').length,
      icon: FiUsers,
      color: '#059669',
      delta: '+12 this week',
      trend: 'up',
    },
    {
      label: 'Avg Match Time',
      value: '38s',
      icon: FiZap,
      color: '#6366F1',
      delta: '↓8s faster',
      trend: 'down',
    },
    {
      label: 'Blood Units',
      value: inventory.reduce((a, b) => a + b.units, 0),
      icon: FiDatabase,
      color: '#0EA5E9',
      delta: 'Stable',
      trend: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const trendData = sparklineData[s.label] || [{ val: 1 }, { val: 2 }];
        const isUp = s.trend === 'up';
        const isDown = s.trend === 'down';
        
        return (
          <WidgetShell key={s.label} delay={i * 0.05} className="p-5 flex flex-col justify-between overflow-hidden relative group border border-black/05 dark:border-white/05 dark:bg-darksurf">
            {/* Soft decorative glow behind the icon */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[30px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: s.color }} />
            
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ background: `${s.color}14` }}
                >
                  <s.icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                </div>
                
                <div className="flex items-center gap-1">
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5"
                    style={{ background: `${s.color}10`, color: s.color }}
                  >
                    {isUp && <FiArrowUpRight className="w-3 h-3" />}
                    {isDown && <FiArrowDownRight className="w-3 h-3" />}
                    {s.delta}
                  </span>
                </div>
              </div>

              <p className="text-[28px] md:text-[34px] font-black text-slate dark:text-white leading-none tracking-tight mb-1">
                <AnimatedCounter value={s.value} duration={1200 + i * 150} />
              </p>
              <p className="text-muted text-[12px] font-bold tracking-wide uppercase">{s.label}</p>
            </div>

            {/* Sparkline visualization instead of regular progress bar */}
            <div className="h-10 mt-4 -mx-5 -mb-5 rounded-b-2xl overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 15, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`sparkGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={s.color}
                    strokeWidth={1.8}
                    fill={`url(#sparkGrad-${i})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </WidgetShell>
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
    <WidgetShell className="p-6 h-full flex flex-col justify-between border border-black/05 dark:border-white/05 dark:bg-darksurf relative overflow-hidden" delay={0.1}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[50px] opacity-10 bg-aiblue pointer-events-none" />
      
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-aiblue/10 flex items-center justify-center glow-blue">
              <FiZap className="w-5 h-5 text-aiblue animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate dark:text-white text-[15px]">AI Insights</h3>
              <p className="text-[11px] text-muted font-bold tracking-wide uppercase">Real-time optimization</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-aiblue bg-aiblue/08 px-2.5 py-1 rounded-xl border border-aiblue/12 shadow-sm animate-pulse">
            3 Live Alerts
          </span>
        </div>

        <div className="space-y-3.5">
          {aiRecommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              className={`dashboard-insight-item border border-black/05 dark:border-white/05 ${rec.type}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ x: 4 }}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0 filter drop-shadow-sm">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-slate dark:text-white text-[13px] leading-snug">{rec.title}</p>
                  {rec.type === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-bloodred animate-ping" />}
                </div>
                <p className="text-muted text-[12px] leading-relaxed mt-1">{rec.desc}</p>
              </div>
              <button
                onClick={() => handleAction(rec.action)}
                className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate/05 dark:bg-white/05 text-slate dark:text-white hover:bg-bloodred hover:text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                {rec.action}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
};

// ─── Performance Score ────────────────────────────────────────────────────────
export const PerformanceScore = ({ score = 94 }) => {
  const size = 124;
  const stroke = 8;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <WidgetShell className="p-6 flex flex-col items-center justify-between text-center h-full border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.15}>
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="w-7 h-7 rounded-lg bg-emerald/10 flex items-center justify-center">
          <FiTarget className="w-4 h-4 text-emerald" />
        </div>
        <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Performance Score</h3>
      </div>

      <div className="relative my-3 flex items-center justify-center">
        {/* Glow behind the ring */}
        <div className="absolute w-24 h-24 rounded-full bg-emerald/10 filter blur-[15px]" />
        
        <svg width={size} height={size} className="-rotate-90 relative z-10">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-black/06 dark:text-white/06" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="#059669" strokeWidth={stroke}
            strokeDasharray={circ} strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-[34px] font-black text-slate dark:text-white leading-none tracking-tight">
            <AnimatedCounter value={score} />%
          </span>
          <span className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Excellent</span>
        </div>
      </div>

      <div className="w-full space-y-3 mt-4 pt-3 border-t border-black/05 dark:border-white/05">
        {[
          { label: 'Match Rate', value: 97, color: '#059669' },
          { label: 'Response Time', value: 88, color: '#6366F1' },
          { label: 'Inventory Health', value: 72, color: '#D97706' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted font-bold">{item.label}</span>
              <span className="font-extrabold text-slate dark:text-white">{item.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/04 dark:bg-white/04 overflow-hidden">
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
    </WidgetShell>
  );
};

// ─── Live Activity Feed ─────────────────────────────────────────────────────────
export const LiveActivityFeed = ({ requests }) => (
  <WidgetShell className="p-6 h-full border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.2}>
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Live Requests Stream</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald"></span>
        </span>
      </div>
      <button className="text-[11px] font-bold text-bloodred hover:underline flex items-center gap-0.5">
        Live Monitor <FiChevronRight className="w-3 h-3" />
      </button>
    </div>

    <div className="space-y-2">
      {requests.slice(0, 5).map((req, i) => (
        <motion.div
          key={req.id}
          className="flex items-center gap-3 p-3 rounded-2xl bg-black/02 dark:bg-white/02 hover:bg-black/04 dark:hover:bg-white/04 border border-black/03 dark:border-white/03 hover:border-black/06 dark:hover:border-white/06 transition-all duration-200 group cursor-default"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + i * 0.06 }}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
            req.urgency === 'emergency' ? 'bg-bloodred/12 text-bloodred border border-bloodred/15' :
            req.urgency === 'urgent' ? 'bg-amber/12 text-amber border border-amber/15' : 'bg-emerald/12 text-emerald border border-emerald/15'
          }`}>
            {req.bloodGroup}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-[13px] text-slate dark:text-white truncate">{req.patientName}</p>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider whitespace-nowrap">{req.time}</span>
            </div>
            <p className="text-muted text-[11px] truncate mt-0.5 font-medium">{req.hospitalName}</p>
          </div>
          
          <div className="flex-shrink-0 pl-1">
            <StatusBadge status={req.status} />
          </div>
        </motion.div>
      ))}
    </div>
  </WidgetShell>
);

// ─── Inventory Widget ───────────────────────────────────────────────────────────
export const InventoryWidget = ({ inventory }) => {
  const criticalGroups = inventory.filter((i) => i.status === 'critical' || i.status === 'warning');
  const donutData = inventory.map((b) => ({ name: b.group, value: b.units }));

  return (
    <WidgetShell className="p-6 h-full flex flex-col justify-between border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.12}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Blood Inventory System</h3>
          <FiDatabase className="w-4 h-4 text-muted" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          {/* Centered Pie Chart with clean style */}
          <div className="w-[110px] h-[110px] flex-shrink-0 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-[20px] font-black text-slate dark:text-white leading-none">
                {inventory.reduce((a, b) => a + b.units, 0)}
              </span>
              <span className="text-[8px] text-muted font-bold uppercase mt-0.5">Total Units</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
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
          <div className="grid grid-cols-4 gap-3 flex-1 w-full">
            {inventory.map((b) => {
              const max = 60;
              const pct = Math.min(100, Math.round((b.units / max) * 100));
              const color = b.status === 'critical' ? '#C62A47' : b.status === 'warning' ? '#D97706' : '#059669';
              const isCritical = b.status === 'critical';
              return (
                <div key={b.group} className="flex flex-col items-center justify-center p-1 rounded-xl bg-black/02 dark:bg-white/01 border border-transparent hover:border-black/05 dark:hover:border-white/05 hover:bg-black/04 transition-all">
                  <div className="relative">
                    {isCritical && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-bloodred animate-ping" />
                    )}
                    <ProgressRing pct={pct} color={color} size={42} stroke={3.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-black" style={{ color }}>{b.group}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-extrabold text-slate dark:text-white mt-1">{b.units}u</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {criticalGroups.length > 0 && (
        <div className="mt-4 pt-3 border-t border-black/05 dark:border-white/05">
          <p className="text-[11px] font-bold text-bloodred flex items-center gap-1.5 animate-pulse">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            {criticalGroups.length} groups critically low. Immediate replenishment required.
          </p>
        </div>
      )}
    </WidgetShell>
  );
};

// ─── Weekly Chart ───────────────────────────────────────────────────────────────
export const WeeklyChart = () => {
  const [hoveredData, setHoveredData] = useState(null);

  return (
    <WidgetShell className="p-6 h-full flex flex-col justify-between border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.18}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Weekly System Load</h3>
            <p className="text-[11px] text-muted font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <FiTrendingUp className="w-3.5 h-3.5 text-emerald" /> +18% operations efficiency
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-bloodred shadow-sm" />Requests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky shadow-sm" />Fulfilled
            </span>
          </div>
        </div>

        <div className="relative mt-2">
          <ResponsiveContainer width="100%" height={165}>
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
                  <stop offset="5%" stopColor="#C62A47" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C62A47" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(26, 34, 54, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  fontSize: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                }}
                itemStyle={{ color: '#F1F5F9', fontWeight: 600 }}
                labelStyle={{ color: '#94A3B8', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="requests" stroke="#C62A47" strokeWidth={2.5} fill="url(#gradRed)" activeDot={{ r: 5, strokeWidth: 1.5 }} />
              <Area type="monotone" dataKey="fulfilled" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#gradSky)" activeDot={{ r: 5, strokeWidth: 1.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-6 flex items-center justify-between text-[11px] text-muted border-t border-black/05 dark:border-white/05 pt-2.5 mt-2">
        <span>Operational Cycle: Active</span>
        {hoveredData ? (
          <span className="font-bold text-slate dark:text-white">
            {hoveredData.day}: {hoveredData.requests} reqs · {hoveredData.fulfilled} fulf
          </span>
        ) : (
          <span>Hover chart for values</span>
        )}
      </div>
    </WidgetShell>
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

// ─── Upcoming Tasks ─────────────────────────────────────────────────────────────
export const UpcomingTasks = () => {
  const [tasks, setTasks] = useState(upcomingTasks);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <WidgetShell className="p-6 h-full border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.28}>
      <h3 className="font-extrabold text-slate dark:text-white text-[15px] mb-4">Operations Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
              task.completed 
                ? 'bg-black/01 dark:bg-white/01 border-transparent opacity-60' 
                : 'bg-black/02 dark:bg-white/02 border-black/03 dark:border-white/03 hover:border-black/06 dark:hover:border-white/06'
            }`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            whileHover={{ x: 2 }}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {task.completed ? (
                <FiCheckCircle className="w-5 h-5 text-emerald" />
              ) : (
                <div className="w-4 h-4 rounded-md border-2 border-muted/40 hover:border-bloodred transition-colors" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-[12px] truncate ${task.completed ? 'line-through text-muted' : 'text-slate dark:text-white'}`}>
                {task.title}
              </p>
              <p className="text-[10px] text-muted font-bold mt-0.5 uppercase tracking-wide">Due {task.due}</p>
            </div>
            
            <div className="flex-shrink-0">
              <StatusBadge status={task.priority} />
            </div>
          </motion.div>
        ))}
      </div>
    </WidgetShell>
  );
};

// ─── Quick Access Panel ─────────────────────────────────────────────────────────
export const QuickAccessPanel = ({ onNavigate, onNewRequest, onOpenAI }) => {
  const items = [
    { label: 'New Request', icon: '🚨', action: onNewRequest, color: '#C62A47' },
    { label: 'Live Map', icon: '🗺️', action: () => onNavigate('map'), color: '#0EA5E9' },
    { label: 'Donors', icon: '🩸', action: () => onNavigate('donors'), color: '#059669' },
    { label: 'AI Assistant', icon: '🤖', action: onOpenAI, color: '#6366F1' },
    { label: 'Inventory', icon: '💉', action: () => onNavigate('inventory'), color: '#D97706' },
    { label: 'Hospitals', icon: '🏥', action: () => onNavigate('hospitals'), color: '#991B33' },
  ];

  return (
    <WidgetShell className="p-6 h-full border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.3}>
      <h3 className="font-extrabold text-slate dark:text-white text-[15px] mb-4">Command Center</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item, i) => (
          <motion.button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/03 dark:border-white/03 hover:border-bloodred/25 hover:bg-black/04 dark:hover:bg-white/04 transition-all group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.04 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="text-[22px] filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </span>
            <span className="text-[10px] font-bold text-muted group-hover:text-slate dark:group-hover:text-white transition-colors text-center leading-tight">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </WidgetShell>
  );
};

// ─── Team Activity ──────────────────────────────────────────────────────────────
export const TeamActivity = ({ donors }) => (
  <WidgetShell className="p-6 h-full flex flex-col justify-between border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.32}>
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-slate dark:text-white text-[15px]">Eligible Donors</h3>
        <span className="text-[10px] font-extrabold text-emerald bg-emerald/08 px-2 py-0.5 rounded-lg border border-emerald/10 shadow-sm animate-pulse">
          {donors.filter((d) => d.eligibility === 'eligible').length} Online
        </span>
      </div>

      <div className="flex -space-x-2 my-4">
        {donors.slice(0, 5).map((d, i) => (
          <motion.div
            key={d.id}
            className="w-9 h-9 rounded-xl bg-bloodred/10 border-2 border-surface dark:border-darksurf flex items-center justify-center text-[12px] font-black text-bloodred shadow-sm group cursor-pointer relative flex-shrink-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            style={{ zIndex: 5 - i }}
            whileHover={{ y: -4, zIndex: 10 }}
            title={d.name}
          >
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald border-2 border-surface dark:border-darksurf" />
            {d.name.charAt(0)}
          </motion.div>
        ))}
        {donors.length > 5 && (
          <div className="w-9 h-9 rounded-xl bg-black/04 dark:bg-white/04 border-2 border-surface dark:border-darksurf flex items-center justify-center text-[10px] font-bold text-muted z-0">
            +{donors.length - 5}
          </div>
        )}
      </div>
    </div>

    <div className="space-y-2 border-t border-black/05 dark:border-white/05 pt-3">
      {donors.slice(0, 3).map((d) => (
        <div key={d.id} className="flex items-center gap-2.5 text-[12px] p-1.5 rounded-xl hover:bg-black/02 dark:hover:bg-white/02 transition-colors">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald"></span>
          </span>
          <span className="font-bold text-slate dark:text-white truncate max-w-[100px]">{d.name}</span>
          <span className="text-muted text-[10px] font-bold ml-auto bg-bloodred/08 text-bloodred px-1.5 py-0.5 rounded-md border border-bloodred/10">
            {d.bloodGroup}
          </span>
        </div>
      ))}
    </div>
  </WidgetShell>
);

// ─── Donor Network Table ────────────────────────────────────────────────────────
export const DonorNetworkTable = ({ donors, userLocation, onNavigate }) => (
  <WidgetShell className="p-6 border border-black/05 dark:border-white/05 dark:bg-darksurf" delay={0.35} hover={false}>
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="font-extrabold text-slate dark:text-white text-[16px]">
          Donor Registry — {userLocation?.name || 'Mumbai HQ'}
        </h3>
        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mt-0.5">{donors.length} active registered donors</p>
      </div>
      <button
        onClick={() => onNavigate?.('donors')}
        className="text-[12px] text-bloodred font-bold hover:underline flex items-center gap-1"
      >
        Registry Details <FiChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="text-muted text-[10px] font-bold uppercase tracking-widest border-b border-black/05 dark:border-white/05">
            <th className="text-left pb-3.5 px-3">Donor Profile</th>
            <th className="text-left pb-3.5 px-3">Blood Type</th>
            <th className="text-left pb-3.5 px-3 hidden sm:table-cell">Location</th>
            <th className="text-left pb-3.5 px-3 hidden md:table-cell">Last Active</th>
            <th className="text-left pb-3.5 px-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/03 dark:divide-white/03">
          {donors.map((d) => (
            <motion.tr
              key={d.id}
              className="hover:bg-black/02 dark:hover:bg-white/01 transition-colors"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.015)' }}
            >
              <td className="py-3 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-bloodred/08 border border-bloodred/10 flex items-center justify-center text-xs font-black text-bloodred shadow-sm flex-shrink-0">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate dark:text-white leading-snug">{d.name}</p>
                    <p className="text-muted text-[10px] font-medium mt-0.5">{d.age} yrs · {d.weight} kg</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center px-2 py-0.5 bg-bloodred/08 text-bloodred border border-bloodred/12 rounded-lg text-[11px] font-black">
                  {d.bloodGroup}
                </span>
              </td>
              <td className="py-3 px-3 text-muted font-semibold hidden sm:table-cell">{d.city}</td>
              <td className="py-3 px-3 text-muted font-semibold hidden md:table-cell">{d.lastDonation || 'Available now'}</td>
              <td className="py-3 px-3">
                <StatusBadge status={d.eligibility === 'eligible' ? 'stable' : 'warning'} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </WidgetShell>
);
