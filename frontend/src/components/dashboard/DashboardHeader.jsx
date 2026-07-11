import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiPlus, FiBell, FiZap, FiMapPin,
  FiGrid, FiAlertCircle, FiHeart, FiDatabase, FiActivity,
  FiLayers, FiCreditCard, FiShield
} from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';

const tabLabels = {
  overview: 'Overview',
  requests: 'Requests',
  donors: 'Donors',
  hospitals: 'Hospitals',
  inventory: 'Inventory',
  map: 'Live Map',
  tasks: 'Tasks',
  billing: 'Billing',
  adminPanel: 'Admin',
  profile: 'Profile & Health',
  history: 'History & Schedule',
  settings: 'Settings'
};

const BASE_NAV_ITEMS = [
  { id: 'overview', icon: FiGrid, label: 'Overview' },
  { id: 'requests', icon: FiAlertCircle, label: 'Requests' },
  { id: 'donors', icon: FiHeart, label: 'Donors' },
  { id: 'hospitals', icon: FiMapPin, label: 'Hospitals' },
  { id: 'inventory', icon: FiDatabase, label: 'Inventory' },
  { id: 'map', icon: FiActivity, label: 'Live Map' },
  { id: 'tasks', icon: FiLayers, label: 'Tasks' },
];

const DONOR_NAV_ITEMS = [
  { id: 'overview', icon: FiGrid, label: 'Overview' },
  { id: 'profile', icon: FiHeart, label: 'Profile & Health' },
  { id: 'history', icon: FiActivity, label: 'History & Schedule' },
  { id: 'settings', icon: FiLayers, label: 'Settings' }
];

const getNavItems = (user, isDonor) => {
  if (isDonor || user?.role === 'donor') {
    return DONOR_NAV_ITEMS;
  }
  const items = [...BASE_NAV_ITEMS];
  if (user?.role === 'hospital') {
    items.push({ id: 'billing', icon: FiCreditCard, label: 'Billing' });
  }
  if (user?.role === 'admin' || user?.email?.includes('admin')) {
    items.push({ id: 'adminPanel', icon: FiShield, label: 'Admin' });
  }
  return items;
};

const DashboardHeader = ({
  activeTab,
  setActiveTab,
  user,
  userLocation,
  unread,
  onOpenSearch,
  onNewRequest,
  onOpenNotifications,
  onOpenAI,
  onLogout,
  isDonor = false
}) => {
  const displayName = user?.name || user?.role || 'Operator';
  const navItems = getNavItems(user, isDonor);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 px-6 md:px-10' : 'py-5 px-6 md:px-10 bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Context */}
        <Link to="/" className="flex items-center gap-2.5 group font-poppins">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-[#E11D48] flex items-center justify-center shadow-premium transition-all duration-300 group-hover:scale-105 group-hover:shadow-premium-hover text-white">
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
              </svg>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-darkbg animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-[16px] tracking-tight leading-none block">
              BloodBridge <span className="text-[#E11D48] ml-0.5">AI</span>
            </span>
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5 block">AI Platform</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                  active 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-dashboard-tab"
                    className="absolute inset-0 bg-[#E11D48] rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tabLabels[item.id]}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Global control items */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-black/10 transition-all cursor-pointer"
            title="Search network (Ctrl+K)"
          >
            <FiSearch className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Premium AI Assistant Shortcut */}
          <button
            onClick={onOpenAI}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 transition-all items-center justify-center cursor-pointer shadow-sm"
            title="Toggle AI Assistant (Ctrl+J)"
          >
            <FiZap className="w-4 h-4" />
          </button>

          {/* Quick Dispatch request trigger */}
          {!isDonor && (
            <button 
              onClick={onNewRequest} 
              className="btn-primary py-2 px-4 text-[13px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <FiPlus className="w-4 h-4" />
              <span>Request</span>
            </button>
          )}

          {/* Notifications Center with heartbeat */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-black/10 transition-all cursor-pointer"
          >
            <FiBell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-sm animate-pulse">
                {unread}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <LanguageSwitcher />

          {/* User profile dropdown logout */}
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm border border-rose-100/50"
            title={`Sign Out (${displayName})`}
          >
            <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardHeader;
