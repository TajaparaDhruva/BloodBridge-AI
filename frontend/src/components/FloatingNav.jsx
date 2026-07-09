import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation as useUserLocation } from '../context/LocationContext';
import {
  FiGrid, FiAlertCircle, FiHeart, FiMapPin, FiDatabase,
  FiActivity, FiPlus, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { id: 'overview', icon: FiGrid, label: 'Overview', emoji: '📊' },
  { id: 'requests', icon: FiAlertCircle, label: 'Requests', emoji: '🚨' },
  { id: 'donors', icon: FiHeart, label: 'Donors', emoji: '🩸' },
  { id: 'hospitals', icon: FiMapPin, label: 'Hospitals', emoji: '🏥' },
  { id: 'inventory', icon: FiDatabase, label: 'Inventory', emoji: '💉' },
  { id: 'map', icon: FiActivity, label: 'Live Map', emoji: '🗺️' },
];

const FloatingNav = ({ 
  activeTab, 
  setActiveTab, 
  onNewRequest, 
  onOpenNotifications, 
  unreadCount = 0,
  collapsed = false,
  setCollapsed
}) => {
  const { user } = useAuth();
  const { userLocation } = useUserLocation();

  const roleIcon = user?.role === 'hospital' ? '🏥' : user?.role === 'admin' ? '⚡' : '🩸';
  const roleName = user?.name || user?.role || 'User';

  return (
    <>
      {/* ── Mobile Bottom Navigation Bar ────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-black/05 dark:border-white/05 px-2 py-2 flex justify-around items-center safe-area-inset-bottom shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                active ? 'bg-bloodred text-white shadow-sm' : 'text-muted hover:text-slate dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onNewRequest}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-bloodred cursor-pointer"
        >
          <FiPlus className="w-5 h-5 animate-pulse" />
          <span className="text-[9px] font-bold tracking-wide">Request</span>
        </button>
      </nav>
    </>
  );
};

export default FloatingNav;
