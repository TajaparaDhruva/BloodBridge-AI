import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiAlertTriangle, FiPhone, FiSearch, FiMapPin, FiMessageSquare } from 'react-icons/fi';

const EmergencyFAB = ({ onCreateRequest, onNavigateTab, onOpenAIAssistant, onOpenHospitalSelector }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const actions = [
    {
      icon: <FiAlertTriangle className="w-5 h-5" />,
      label: 'Create Request',
      color: 'bg-bloodred hover:bg-bloodred-dark text-white',
      onClick: () => {
        onCreateRequest();
        setIsOpen(false);
      }
    },
    {
      icon: <FiMapPin className="w-5 h-5" />,
      label: 'Nearby Hospitals',
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      onClick: () => {
        onNavigateTab('hospitals');
        setIsOpen(false);
      }
    },
    {
      icon: <FiPhone className="w-5 h-5" />,
      label: 'Emergency Contacts',
      color: 'bg-amber-500 hover:bg-amber-600 text-white',
      onClick: () => {
        onOpenHospitalSelector();
        setIsOpen(false);
      }
    },
    {
      icon: <FiMessageSquare className="w-5 h-5" />,
      label: 'AI Assistant',
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      onClick: () => {
        onOpenAIAssistant();
        setIsOpen(false);
      }
    },
    {
      icon: <FiSearch className="w-5 h-5" />,
      label: 'Donor Search',
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      onClick: () => {
        onNavigateTab('donors');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-6 lg:right-24 z-50 flex flex-col items-end">
      {/* Action Buttons Stack */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 mb-4 items-end">
            {actions.map((action, idx) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex items-center gap-2 group cursor-pointer"
                onClick={action.onClick}
              >
                {/* Tooltip */}
                <span className="bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {action.label}
                </span>
                {/* Circular Button */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 transform group-hover:scale-110 ${action.color}`}>
                  {action.icon}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={toggleMenu}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-bloodred to-crimson shadow-xl glow-red flex items-center justify-center text-white relative z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 135 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FiPlus className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bloodred opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-bloodred"></span>
        </span>
      </motion.button>
    </div>
  );
};

export default EmergencyFAB;
