import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation as useUserLocation } from '../context/LocationContext';
import {
  FiGrid, FiAlertCircle, FiHeart, FiMapPin, FiDatabase,
  FiActivity, FiSettings
} from 'react-icons/fi';

const navItems = [
  { id: 'overview', icon: FiGrid, label: 'Overview' },
  { id: 'requests', icon: FiAlertCircle, label: 'Requests' },
  { id: 'donors', icon: FiHeart, label: 'Donors' },
  { id: 'hospitals', icon: FiMapPin, label: 'Hospitals' },
  { id: 'inventory', icon: FiDatabase, label: 'Inventory' },
];

const donorNavItems = [
  { id: 'overview', icon: FiGrid, label: 'Overview' },
  { id: 'profile', icon: FiHeart, label: 'Profile' },
  { id: 'history', icon: FiActivity, label: 'History' },
  { id: 'settings', icon: FiSettings, label: 'Settings' }
];

const FloatingNav = ({ 
  activeTab, 
  setActiveTab, 
  isDonor = false
}) => {
  const { user } = useAuth();
  const itemsToRender = isDonor ? donorNavItems : navItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-black/05 dark:border-white/05 px-3 py-2 flex justify-between items-center safe-area-inset-bottom shadow-lg">
      {itemsToRender.map(item => {
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition-all cursor-pointer text-center relative ${
              active ? 'text-[#E11D48]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="text-[9.5px] font-extrabold tracking-wide block">{item.label}</span>
            {active && (
              <motion.div
                layoutId="active-floating-tab-dot"
                className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#E11D48]"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default FloatingNav;
