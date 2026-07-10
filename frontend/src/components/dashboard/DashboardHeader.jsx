import React from 'react';
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

const getNavItems = (user) => {
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
}) => {
  const displayName = user?.name || user?.role || 'Operator';
  const navItems = getNavItems(user);

  return (
    <header className="sticky top-0 z-30 px-4 md:px-6 pt-4 pb-2">
      <div className="max-w-[1440px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-[#F3F4F6] dark:border-slate-800/80 rounded-[28px] shadow-sm px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Context */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              {/* Drop logo with heart inside */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-[#E11D48] flex items-center justify-center shadow-sm">
                <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C12 3 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 3 12 3Z" />
                  <path d="M12 17.5C10.6 17.5 9.5 16.4 9.5 15C9.5 13.9 10.3 13.1 11.2 12.6C11.7 12.3 12.3 12.3 12.8 12.6C13.7 13.1 14.5 13.9 14.5 15C14.5 16.4 13.4 17.5 12 17.5Z" fill="white" opacity="0.3" />
                  <path d="M12 17C11 17 10.2 16.2 10.2 15.2C10.2 14.7 10.4 14.2 10.8 13.9C11.1 13.7 11.4 13.5 11.8 13.4C12 13.3 12.2 13.3 12.4 13.4C12.8 13.5 13.1 13.7 13.4 13.9C13.8 14.2 14 14.7 14 15.2C14 16.2 13.2 17 12 17Z" fill="#E11D48" />
                </svg>
              </div>
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[#0F172A] dark:text-white text-[15px] tracking-tight leading-none block">
                BloodBridge AI
              </span>
              <span className="text-[7.5px] font-black tracking-widest text-[#64748B] uppercase mt-1 block">AI Command Center</span>
            </div>
          </Link>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Center: Desktop Navigation Tabs (Stacked Layout with Vertical Dividers) */}
        <div className="hidden lg:flex items-center gap-0 self-stretch">
          {navItems.map((item, idx) => {
            const active = activeTab === item.id;
            return (
              <React.Fragment key={item.id}>
                {idx > 0 && <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800/60 self-center mx-1" />}
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1.5 px-3.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                    active 
                      ? 'text-[#E11D48] dark:text-rose-400' 
                      : 'text-[#475569] dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-5.5 h-5.5" />
                  <span className={`text-[10px] tracking-tight font-extrabold ${active ? 'font-black' : ''}`}>
                    {tabLabels[item.id]}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="active-dashboard-tab-indicator"
                      className="absolute bottom-[-10px] left-2 right-2 h-[2.5px] bg-[#E11D48] dark:bg-rose-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Side: Global control items */}
        <div className="flex items-center gap-2.5 flex-shrink-0 ml-auto md:ml-0">
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800/40 hover:bg-slate-50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Search network (Ctrl+K)"
          >
            <FiSearch className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Premium AI Assistant Shortcut */}
          <button
            onClick={onOpenAI}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-[#6366F1] hover:bg-slate-50 transition-all items-center justify-center cursor-pointer shadow-sm"
            title="Toggle AI Assistant (Ctrl+J)"
          >
            <FiZap className="w-4.5 h-4.5 text-indigo-500" />
          </button>

          {/* Quick Dispatch request trigger */}
          <button 
            onClick={onNewRequest} 
            className="bg-[#E11D48] hover:bg-rose-600 text-white py-2 px-4 rounded-xl text-[13px] font-black shadow-sm transition-all cursor-pointer flex items-center gap-1"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" />
            <span>Request</span>
          </button>

          {/* Notifications Center with heartbeat */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-white dark:bg-slate-800/40 hover:bg-slate-50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <FiBell className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
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
    </header>
  );
};

export default DashboardHeader;
