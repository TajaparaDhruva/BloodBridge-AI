import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StatusBadge = ({ status }) => {
  const map = {
    matching: { label: 'Matching', cls: 'badge-info' },
    dispatched: { label: 'Dispatched', cls: 'badge-urgent' },
    completed: { label: 'Completed', cls: 'badge-stable' },
    emergency: { label: 'Emergency', cls: 'badge-emergency' },
    urgent: { label: 'Urgent', cls: 'badge-urgent' },
    normal: { label: 'Normal', cls: 'badge-stable' },
    critical: { label: 'Critical', cls: 'badge-critical' },
    warning: { label: 'Low Stock', cls: 'badge-urgent' },
    stable: { label: 'Stable', cls: 'badge-stable' },
  };
  const s = map[status] || { label: status, cls: 'badge-info' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

export const ProgressRing = ({ pct, color, size = 56, stroke = 4, animated = true }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-black/06 dark:text-white/06"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke + 0.5}
        strokeDasharray={circ}
        strokeLinecap="round"
        initial={animated ? { strokeDashoffset: circ } : false}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

export const AnimatedCounter = ({ value, duration = 1200, className = '' }) => {
  const [count, setCount] = useState(0);
  const isNumeric = typeof value === 'number' || (!isNaN(parseFloat(value)) && isFinite(value));
  const target = isNumeric ? Number(value) : 0;

  useEffect(() => {
    if (!isNumeric) return;
    let frame;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, isNumeric]);

  if (!isNumeric) return <span className={className}>{value}</span>;
  return <span className={className}>{count}</span>;
};

export const WidgetShell = ({ children, className = '', delay = 0, hover = true }) => (
  <motion.div
    className={`glass-card border border-white/20 dark:border-white/10 ${className}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
  >
    {children}
  </motion.div>
);

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export const weeklyData = [
  { day: 'Mon', requests: 4, fulfilled: 4 },
  { day: 'Tue', requests: 7, fulfilled: 6 },
  { day: 'Wed', requests: 5, fulfilled: 5 },
  { day: 'Thu', requests: 12, fulfilled: 10 },
  { day: 'Fri', requests: 9, fulfilled: 9 },
  { day: 'Sat', requests: 6, fulfilled: 5 },
  { day: 'Sun', requests: 3, fulfilled: 3 },
];

export const aiRecommendations = [
  {
    id: 1,
    type: 'critical',
    icon: '⚠️',
    title: 'O- inventory critically low',
    desc: 'Only 5 units remaining. AI projects depletion in 14 hours based on request trends.',
    action: 'Find Donors',
  },
  {
    id: 2,
    type: 'info',
    icon: '🤖',
    title: '3 donors within 2 km match active request REQ-201',
    desc: 'Rajesh Kumar (97%), Anita D. (91%), Vivek N. (85%) — all eligible and available.',
    action: 'Dispatch Now',
  },
  {
    id: 3,
    type: 'warning',
    icon: '📊',
    title: 'AB- stock expiring in 48 hours',
    desc: '3 units of AB- blood flagged for expiry. Proactive allocation recommended.',
    action: 'View Inventory',
  },
];

export const activityTimeline = [
  { id: 1, time: '2m ago', title: 'Donor dispatched', desc: 'Vikram Singh → Apollo Speciality Center', type: 'success' },
  { id: 2, time: '8m ago', title: 'AI match initiated', desc: 'REQ-101 · O- · 24 donors contacted', type: 'info' },
  { id: 3, time: '15m ago', title: 'Emergency alert', desc: 'Critical O- demand at Metro Critical Care', type: 'critical' },
  { id: 4, time: '32m ago', title: 'Inventory updated', desc: 'AB- stock flagged for expiry review', type: 'warning' },
  { id: 5, time: '1h ago', title: 'Request completed', desc: 'REQ-103 fulfilled · A+ · 5 units', type: 'success' },
];

export const upcomingTasks = [
  { id: 1, title: 'Restock O- inventory', priority: 'critical', due: 'Today', icon: '🩸' },
  { id: 2, title: 'Verify donor eligibility batch', priority: 'normal', due: 'Tomorrow', icon: '✓' },
  { id: 3, title: 'Review AB- expiry allocation', priority: 'urgent', due: '48h', icon: '📋' },
];

export const heatmapData = Array.from({ length: 28 }, (_, i) => ({
  day: i,
  value: [2, 4, 1, 6, 8, 3, 5, 7, 2, 9, 4, 6, 3, 8, 5, 2, 7, 4, 6, 3, 9, 5, 4, 7, 2, 6, 8, 5][i],
}));

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
