import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBell, FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';

const NotificationCenter = ({ isOpen, onClose, notifications, setNotifications }) => {
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <FiAlertCircle className="w-5 h-5 text-rose-500" />;
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'info':
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type, read) => {
    if (read) return 'bg-white/50 dark:bg-slate-800/40 opacity-70';
    switch (type) {
      case 'emergency':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Tray */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-gray-200/80 dark:border-white/5 shadow-2xl z-[151] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-bloodred/10 flex items-center justify-center text-bloodred">
                  <FiBell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Alert Operations Center</h3>
                  <p className="text-xs text-gray-400">Live AI Emergency dispatch and matching updates</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Panel */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-b border-gray-50 dark:border-white/5 flex justify-between bg-gray-50/50 dark:bg-slate-800/20">
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-bloodred hover:underline"
                >
                  Mark all as read
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center mb-4">
                    <FiBell className="w-6 h-6 opacity-30" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">Clear Horizon</h4>
                  <p className="text-xs text-gray-400 max-w-[200px]">No active dispatch messages or matching requests pending.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: 20 }}
                      className={`p-4 rounded-2xl border flex gap-3.5 transition-all relative group overflow-hidden ${getBgColor(notif.type, notif.read)}`}
                    >
                      {/* Read status dot */}
                      {!notif.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-bloodred animate-pulse" />
                      )}

                      {/* Icon */}
                      <div className="shrink-0 pt-0.5">
                        {getIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-6">
                        <h5 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                          {notif.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2 font-medium">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {notif.time}
                        </span>
                      </div>

                      {/* Delete on hover */}
                      <button
                        onClick={() => deleteNotif(notif.id)}
                        className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
