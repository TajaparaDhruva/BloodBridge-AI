import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiUsers, FiActivity, FiDatabase, FiArrowRight, FiCommand } from 'react-icons/fi';
import { MOCK_HOSPITALS } from '../data/mockHospitals';
import { NEARBY_DONORS } from '../data/mockDonors';
import { INDIAN_CITIES } from '../data/mockLocations';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const QUICK_ACTIONS = [
  { label: 'View Command Center', icon: '⚡', action: 'overview', category: 'Navigation' },
  { label: 'Emergency Requests', icon: '🚨', action: 'requests', category: 'Navigation' },
  { label: 'Blood Inventory', icon: '🩸', action: 'inventory', category: 'Navigation' },
  { label: 'Donor Network', icon: '👥', action: 'donors', category: 'Navigation' },
  { label: 'AI Emergency Map', icon: '🗺️', action: 'map', category: 'Navigation' },
  { label: 'AI Insights', icon: '🤖', action: 'ai', category: 'Navigation' },
];

const CommandPalette = ({ open, onClose, setActiveTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Build search results
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items = [];

    // Hospitals
    MOCK_HOSPITALS.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(h => items.push({
        id: h.id, type: 'hospital', icon: '🏥',
        title: h.name, subtitle: `${h.distance} km · ${h.emergencyAvailable ? '🔴 Emergency' : 'Standard'}`,
        category: 'Hospitals',
      }));

    // Donors
    NEARBY_DONORS.filter(d => d.name.toLowerCase().includes(q) || d.bloodGroup.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(d => items.push({
        id: d.id, type: 'donor', icon: '🫀',
        title: d.name, subtitle: `${d.bloodGroup} · ${d.distance} km · AI ${d.aiScore}%`,
        category: 'Donors',
      }));

    // Blood groups
    BLOOD_GROUPS.filter(bg => bg.toLowerCase().includes(q))
      .forEach(bg => items.push({
        id: bg, type: 'blood', icon: '🩸',
        title: `${bg} Blood Group`, subtitle: 'Search donors & inventory',
        category: 'Blood Groups',
      }));

    // Cities
    INDIAN_CITIES.filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => items.push({
        id: c.id, type: 'city', icon: '📍',
        title: c.name, subtitle: c.state,
        category: 'Cities',
      }));

    // Actions
    QUICK_ACTIONS.filter(a => a.label.toLowerCase().includes(q))
      .forEach(a => items.push({
        id: a.action, type: 'action', icon: a.icon,
        title: a.label, subtitle: 'Quick Navigation',
        category: 'Actions',
        action: a.action,
      }));

    return items;
  }, [query]);

  const displayItems = query.trim() ? results : QUICK_ACTIONS.map(a => ({
    id: a.action, type: 'action', icon: a.icon,
    title: a.label, subtitle: a.category,
    category: 'Quick Actions', action: a.action,
  }));

  const groupedItems = displayItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSelect = (item) => {
    if (item.action && setActiveTab) setActiveTab(item.action);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 command-overlay z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] px-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="glass-floating rounded-3xl overflow-hidden shadow-2xl">
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100/50 dark:border-white/5">
                <FiSearch className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && onClose()}
                  placeholder="Search hospitals, donors, blood groups, cities..."
                  className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 text-sm outline-none font-medium"
                />
                <kbd className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto py-2">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {category}
                      </span>
                    </div>
                    {items.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bloodred/5 dark:hover:bg-bloodred/10 text-left transition-colors group"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-xl w-8 text-center shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                        </div>
                        <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-bloodred transition-colors shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                ))}

                {query && results.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No results for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100/50 dark:border-white/5">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><kbd className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500">↵</kbd> Select</span>
                  <span className="flex items-center gap-1"><kbd className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500">↑↓</kbd> Navigate</span>
                </div>
                <span className="text-[10px] text-gray-300 flex items-center gap-1">
                  <FiCommand className="w-3 h-3" /> K to open
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
