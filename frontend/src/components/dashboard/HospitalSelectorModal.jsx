import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPhone, FiMapPin } from 'react-icons/fi';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';

const HospitalSelectorModal = ({ onClose, onSelectCall }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="glass-floating w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 dark:border-white/5 z-10 bg-white dark:bg-slate-900"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/05 dark:border-white/05">
          <div>
            <h3 className="font-extrabold text-slate dark:text-white text-[16px]">Select Emergency Hospital</h3>
            <p className="text-[11px] text-muted font-bold tracking-wide uppercase mt-0.5">Nearby networks</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/05 hover:bg-black/10 dark:bg-white/05 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4 text-slate dark:text-white" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
          {MOCK_HOSPITALS.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 hover:bg-black/04 dark:hover:bg-white/04 transition-colors"
            >
              <div className="min-w-0 pr-3">
                <h4 className="font-bold text-slate dark:text-white text-[13.5px] truncate">{h.name}</h4>
                <div className="flex items-center gap-1.5 text-muted text-[11px] mt-1 font-semibold">
                  <FiMapPin className="w-3 h-3 text-bloodred" />
                  <span className="truncate">{h.address}</span>
                </div>
                <p className="text-[10px] text-muted/65 font-bold mt-0.5 tracking-wider">{h.contact}</p>
              </div>
              

            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalSelectorModal;
