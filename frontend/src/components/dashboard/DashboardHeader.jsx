import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiPlus, FiBell, FiZap, FiMapPin, FiCommand,
  FiGrid, FiAlertCircle, FiHeart, FiDatabase, FiActivity,
} from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle';

const tabLabels = {
  overview: 'Operations Control',
  requests: 'Emergency Dispatches',
  donors: 'Donor Registry',
  hospitals: 'Network Hospitals',
  inventory: 'System Inventory',
  map: 'Live Emergency Map',
};

const navItems = [
  { id: 'overview', icon: FiGrid, label: 'Overview' },
  { id: 'requests', icon: FiAlertCircle, label: 'Requests' },
  { id: 'donors', icon: FiHeart, label: 'Donors' },
  { id: 'hospitals', icon: FiMapPin, label: 'Hospitals' },
  { id: 'inventory', icon: FiDatabase, label: 'Inventory' },
  { id: 'map', icon: FiActivity, label: 'Live Map' },
];

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
  const roleIcon = user?.role === 'hospital' ? '🏥' : user?.role === 'admin' ? '⚡' : '🩸';
  const displayName = user?.name || user?.role || 'Operator';

  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-black/05 dark:border-white/05 relative shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Context */}
        <div className="flex-shrink-0 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-premium transition-all duration-300 group-hover:scale-105 group-hover:shadow-premium-hover">
                <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate dark:text-white text-[15px] tracking-tight leading-none block">
                Blood<span className="text-bloodred">Bridge</span>
              </span>
              <span className="text-[8px] font-bold tracking-widest text-muted uppercase">AI Command</span>
            </div>
          </Link>

        </div>

        {/* Center: Desktop Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                  active 
                    ? 'text-white' 
                    : 'text-muted hover:text-slate dark:hover:text-white hover:bg-black/04 dark:hover:bg-white/04'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-dashboard-tab"
                    className="absolute inset-0 bg-bloodred rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Global control items */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto md:ml-0">
          
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl bg-black/04 dark:bg-white/05 border border-black/06 dark:border-white/06 flex items-center justify-center hover:bg-black/07 hover:border-black/10 transition-all cursor-pointer"
            title="Search network (Ctrl+K)"
          >
            <FiSearch className="w-4 h-4 text-muted" />
          </button>

          {/* Premium AI Assistant Shortcut */}
          <button
            onClick={onOpenAI}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-aiblue/08 border border-aiblue/12 text-aiblue hover:bg-aiblue/12 transition-all items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
            title="Toggle AI Assistant (Ctrl+J)"
          >
            <FiZap className="w-4 h-4" />
          </button>

          {/* Quick Dispatch request trigger */}
          <button 
            onClick={onNewRequest} 
            className="btn-primary py-1.5 px-3.5 text-[12.5px] font-bold shadow-sm cursor-pointer flex items-center gap-1"
          >
            <FiPlus className="w-4 h-4" />
            <span>Request</span>
          </button>

          {/* Notifications Center with heartbeat */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-black/04 dark:bg-white/05 border border-black/06 dark:border-white/06 flex items-center justify-center hover:bg-black/07 transition-all cursor-pointer hover:border-black/10"
          >
            <FiBell className="w-4 h-4 text-muted" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-bloodred text-white text-[9px] font-black flex items-center justify-center animate-heartbeat shadow-sm">
                {unread}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <ThemeToggle />

          {/* User profile dropdown logout */}
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-black/03 dark:bg-white/03 border border-black/06 dark:border-white/06 hover:bg-bloodred/08 hover:border-bloodred/15 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title={`Sign Out (${displayName})`}
          >
            <div className="text-[14px]">
              {roleIcon}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
