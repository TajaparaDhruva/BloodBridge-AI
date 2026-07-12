import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPhone, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';

const HospitalSelectorModal = ({ onClose, onSelectCall }) => {
  // Slicing to the first 4 primary networks to match the design photo exactly
  const primaryHospitals = MOCK_HOSPITALS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-2xl relative text-left z-10"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        {/* Top curved banner accent */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-[#E11D48] to-[#8B5CF6] rounded-t-[28px]" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 pt-1.5 border-b border-slate-100 dark:border-slate-850 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF1F2] dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center text-[22px] flex-shrink-0 shadow-sm border border-rose-100/10">
              <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-[20px] leading-tight">Select Emergency Hospital</h3>
              <p className="text-slate-450 dark:text-slate-500 text-[12.5px] font-semibold mt-0.5">Nearby healthcare networks ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
          >
            <FiX className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Section title */}
        <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2.5">
          <FiMapPin className="w-4 h-4 text-[#E11D48]" />
          <span className="text-[12px] font-black uppercase tracking-widest text-[#E11D48] dark:text-rose-400">
            Nearby Networks
          </span>
        </div>

        {/* List of Hospital Cards */}
        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {primaryHospitals.map((h, index) => {
            const isNearest = index === 0;

            // Custom brand color schemes for cards
            let badgeBgClass = 'bg-rose-50 dark:bg-rose-950/20 text-[#E11D48]';
            let cardBorderClass = 'border border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-950 bg-white dark:bg-slate-950/30';

            if (isNearest) {
              cardBorderClass = 'border border-rose-200 dark:border-rose-900/60 bg-[#FFF1F2]/10 dark:bg-rose-950/5';
            } else if (h.id === 'H002') {
              // Apollo
              badgeBgClass = 'bg-blue-50 dark:bg-blue-950/20 text-blue-500';
              cardBorderClass = 'border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 bg-white dark:bg-slate-950/30';
            } else if (h.id === 'H003') {
              // Zydus
              badgeBgClass = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500';
              cardBorderClass = 'border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 bg-white dark:bg-slate-950/30';
            } else if (h.id === 'H004') {
              // GMERS
              badgeBgClass = 'bg-violet-50 dark:bg-violet-950/20 text-violet-500';
              cardBorderClass = 'border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-900 bg-white dark:bg-slate-950/30';
            }

            return (
              <div
                key={h.id}
                className={`w-full flex items-center justify-between p-4 rounded-2xl ${cardBorderClass}`}
              >
                <div className="flex items-center gap-4 min-w-0 pr-3">
                  {/* Left building badge */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${badgeBgClass}`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-[15px] leading-snug">{h.name}</h4>

                    {/* Address details */}
                    <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-[12px] mt-1 font-semibold leading-none">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{h.address}</span>
                    </div>

                    {/* Contact details */}
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[12px] mt-1.5 font-semibold leading-none">
                      <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{h.contact}</span>
                    </div>
                  </div>
                </div>

                {isNearest && (
                  <div className="shrink-0">
                    <span className="bg-rose-100 dark:bg-rose-950/40 text-[#E11D48] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-rose-100/10">
                      Nearest
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer verified banner */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-450 text-[12.5px] font-semibold">
          <div className="w-5.5 h-5.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center shadow-sm text-[11px] border border-rose-100/10">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span>All hospitals are verified and updated recently</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalSelectorModal;
