import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiUser, FiBell, FiClipboard, FiShield, FiX, FiXCircle } from 'react-icons/fi';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const RequestModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: 2,
    urgency: 'emergency',
    city: 'Mumbai',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.patientName) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSubmit(form);
    setLoading(false);
    onClose();
  };

  const OutlineDropletIcon = ({ colorClass }) => (
    <svg className={`w-4 h-4 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6.5 shadow-2xl relative"
      >
        {/* Top Header section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] dark:bg-rose-950/20 flex items-center justify-center text-[24px] flex-shrink-0 shadow-sm border border-rose-100/10">
              🩸
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-[22px] leading-tight">New Blood Request</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[12px] font-semibold mt-0.5">AI matching activates immediately upon submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Patient Name input */}
          <div className="relative text-left">
            <FiUser className="w-5 h-5 text-rose-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Patient Name *"
              value={form.patientName}
              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48]/10 rounded-[20px] text-[14px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-sm font-semibold"
            />
          </div>

          {/* Blood Group section */}
          <div className="bg-[#FFF8F8] dark:bg-slate-900/30 p-5 rounded-[24px] border border-rose-100/15 text-left">
            <label className="flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900 dark:text-white mb-4">
              <OutlineDropletIcon colorClass="text-[#E11D48]" />
              <span>Blood Group Needed</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = form.bloodGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, bloodGroup: bg }))}
                    className={`py-3 rounded-2xl text-[14px] font-extrabold border relative transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-md shadow-rose-500/20'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    {bg}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-[#E11D48] flex items-center justify-center text-[9px] font-black shadow-sm">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Units and Urgency grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Units spinner */}
            <div className="bg-slate-50/65 dark:bg-slate-900/30 p-4.5 rounded-[24px] border border-slate-100 dark:border-slate-800/40 text-left">
              <label className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-slate-900 dark:text-white mb-2.5">
                <FiClipboard className="w-4 h-4 text-[#E11D48]" />
                <span>Units Required</span>
              </label>
              <div className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 px-3.5 shadow-sm">
                <span className="text-[14px] font-extrabold text-slate-900 dark:text-white pl-1">{form.units}</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] text-slate-400 font-bold">Units</span>
                  <div className="flex flex-col border-l border-slate-150 dark:border-slate-850 pl-2.5">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, units: Math.min(10, f.units + 1) }))}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-[10px] p-0.5 leading-none cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, units: Math.max(1, f.units - 1) }))}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-[10px] p-0.5 leading-none mt-1 cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency select */}
            <div className="bg-slate-50/65 dark:bg-slate-900/30 p-4.5 rounded-[24px] border border-slate-100 dark:border-slate-800/40 text-left">
              <label className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-slate-900 dark:text-white mb-2.5">
                <FiBell className="w-4 h-4 text-[#E11D48]" />
                <span>Urgency</span>
              </label>
              <div className="relative">
                <div className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2 shadow-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    form.urgency === 'emergency' ? 'bg-[#E11D48]' : form.urgency === 'urgent' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="capitalize">{form.urgency}</span>
                  <span className="absolute right-4 text-[10px] text-slate-400">▼</span>
                </div>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="emergency">Emergency</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 justify-center py-3.5 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <FiXCircle className="w-4.5 h-4.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.patientName}
              className="flex-1 justify-center py-3.5 px-6 bg-[#E11D48] text-white hover:bg-rose-600 rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-rose-500/10 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Matching...</span>
                </span>
              ) : (
                <>
                  <FiZap className="w-4.5 h-4.5" />
                  <span>Launch AI Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info alert */}
        <div className="bg-[#FFF5F6] dark:bg-rose-950/10 p-3.5 rounded-2xl border border-rose-100/15 flex items-center justify-between text-left relative overflow-hidden mt-5">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400 text-[12px] font-semibold relative z-10">
            <span className="w-5.5 h-5.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center text-[11px] shadow-sm">
              🛡️
            </span>
            <span>AI will analyze eligible donors and notify instantly.</span>
          </div>
          {/* Sparkles decoration */}
          <div className="absolute right-4 text-[#E11D48]/30 font-bold select-none text-[16px] pointer-events-none z-0">
            ✦ +
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestModal;
