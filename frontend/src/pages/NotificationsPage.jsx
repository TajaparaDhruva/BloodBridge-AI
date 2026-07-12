import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiInfo, FiAlertTriangle, FiCheckCircle, FiClock, FiSettings, FiTrash2, FiSearch, FiActivity, FiMapPin, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const NotificationsPage = ({ goBack }) => {
  const { notifications, setNotifications } = useAuth();
  const [filter, setFilter] = useState('all'); // all, unread, emergency, system
  const [search, setSearch] = useState('');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Ensure we have some default notifications if empty for demo purposes of the "best and unique" design
  const displayNotifs = (notifications && notifications.length > 0) ? notifications : [
    { id: 1, type: 'emergency', title: 'Critical Request Match', message: 'AB- Blood match found for Kokilaben Hospital. Dispatch required immediately.', time: '2 mins ago', read: false },
    { id: 2, type: 'success', title: 'Delivery Confirmed', message: '2 Units of O+ successfully delivered to Fortis Hospital.', time: '1 hour ago', read: false },
    { id: 3, type: 'info', title: 'Inventory Update', message: 'Daily inventory sync completed. A+ levels are running low.', time: '3 hours ago', read: true },
    { id: 4, type: 'emergency', title: 'Emergency Nearby', message: 'Multiple casualties reported at Bandra. High demand for O- blood types expected.', time: '5 hours ago', read: true },
    { id: 5, type: 'info', title: 'System Maintenance', message: 'Scheduled AI model update at 02:00 AM IST. Matching might be delayed by 5 mins.', time: '1 day ago', read: true }
  ];

  const filteredNotifs = displayNotifs.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'unread') return !n.read;
    if (filter === 'emergency') return n.type === 'emergency';
    if (filter === 'system') return n.type === 'info' || n.type === 'success';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'emergency': return <FiAlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'success': return <FiCheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'info': default: return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyle = (type, read) => {
    const base = read ? 'opacity-70 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5' : 'bg-white dark:bg-slate-900 border-l-4 shadow-sm';
    switch (type) {
      case 'emergency': return `${base} ${!read ? 'border-l-rose-500 border-y-slate-100 border-r-slate-100 dark:border-y-white/5 dark:border-r-white/5' : ''}`;
      case 'success': return `${base} ${!read ? 'border-l-emerald-500 border-y-slate-100 border-r-slate-100 dark:border-y-white/5 dark:border-r-white/5' : ''}`;
      case 'info': default: return `${base} ${!read ? 'border-l-blue-500 border-y-slate-100 border-r-slate-100 dark:border-y-white/5 dark:border-r-white/5' : ''}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Section */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="flex flex-col items-start">
            {goBack && (
              <button
                onClick={goBack}
                className="mb-4 flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-[13px] font-bold uppercase tracking-wider"
              >
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600">
                <FiBell className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Notification Center</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg">
              Manage your AI dispatch alerts, emergency requests, and system updates in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={markAllRead} className="px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-[13px] font-semibold transition-colors flex items-center gap-2 border border-slate-200 dark:border-white/10">
              <FiCheck className="w-4 h-4" /> Mark all read
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition-colors border border-slate-200 dark:border-white/10">
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex bg-white dark:bg-[#0F1420] p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-x-auto hide-scrollbar">
            {['all', 'unread', 'emergency', 'system'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-[13px] font-bold capitalize whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl text-[13px] font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div variants={fadeUp} className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <FiBell className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">All caught up!</h3>
              <p className="text-[13px] text-slate-500 mt-1">No notifications match your current filters.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifs.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-4 transition-all hover:shadow-md ${getStyle(notif.type, notif.read)}`}
                >
                  {!notif.read && (
                    <span className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.6)]" />
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    notif.type === 'emergency' ? 'bg-rose-50 dark:bg-rose-950/30' : 
                    notif.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 
                    'bg-blue-50 dark:bg-blue-950/30'
                  }`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`text-[15px] font-bold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                        {notif.title}
                      </h4>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        <FiClock className="w-3 h-3" /> {notif.time}
                      </span>
                    </div>
                    
                    <p className={`text-[13.5px] leading-relaxed ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                      {notif.message}
                    </p>

                    {/* Action buttons (only for emergency or unread) */}
                    {!notif.read && notif.type === 'emergency' && (
                      <div className="flex items-center gap-3 mt-4">
                        <button className="px-4 py-2 bg-[#E11D48] hover:bg-rose-600 text-white rounded-xl text-[12px] font-bold transition-colors shadow-sm">
                          View Details
                        </button>
                        <button onClick={() => markRead(notif.id)} className="px-4 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-[12px] font-bold transition-colors">
                          Acknowledge
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 sm:top-6 sm:bottom-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-500 rounded-xl shadow-sm transition-all" title="Mark as read">
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 text-slate-500 rounded-xl shadow-sm transition-all" title="Delete">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
