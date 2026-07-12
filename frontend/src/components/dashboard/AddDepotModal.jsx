import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiGrid, FiDatabase } from 'react-icons/fi';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const AddDepotModal = ({ onClose, onAdd }) => {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [units, setUnits] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(selectedGroup, units);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-2xl relative text-left"
      >
        {/* Curved top theme bar */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-emerald-500 to-[#E11D48] rounded-t-[28px]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pr-8">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
            <FiDatabase className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[19px]">Add Depot Inventory</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[12.5px] font-semibold">Replenish units for specific blood types</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Blood Group Grid Selector */}
          <div>
            <label className="text-[12px] font-black text-slate-900 dark:text-slate-350 uppercase tracking-wider block mb-3.5 flex items-center gap-1.5">
              <FiGrid className="w-4 h-4 text-emerald-500" />
              <span>Select Blood Type</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {BLOOD_GROUPS.map((group) => {
                const isSelected = selectedGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedGroup(group)}
                    className={`py-3.5 rounded-2xl text-[14px] font-black tracking-wide border transition-all cursor-pointer select-none text-center ${
                      isSelected
                        ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-md shadow-rose-500/10 scale-[1.03]'
                        : 'bg-slate-55/40 dark:bg-slate-950/30 border-slate-100 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-950/50'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Units Required Slider/Spinner */}
          <div>
            <label className="text-[12px] font-black text-slate-900 dark:text-slate-350 uppercase tracking-wider block mb-2.5">
              Units Count to Add
            </label>
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl">
              <button
                type="button"
                onClick={() => setUnits((u) => Math.max(1, u - 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center font-black text-[16px] text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm active:scale-95 transition-all select-none"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-[22px] font-black text-slate-900 dark:text-white leading-none">{units}</span>
                <span className="text-[9.5px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wide block leading-none mt-1">Units</span>
              </div>
              <button
                type="button"
                onClick={() => setUnits((u) => Math.min(30, u + 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center font-black text-[16px] text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm active:scale-95 transition-all select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer flex items-center gap-1.5 justify-center shadow-md shadow-emerald-500/10"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add to Depot</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDepotModal;
