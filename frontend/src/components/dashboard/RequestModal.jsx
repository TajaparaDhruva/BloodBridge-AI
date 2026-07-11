import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 command-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md glass-floating rounded-2xl p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-slate dark:text-white text-[18px]">New Blood Request</h3>
            <p className="text-muted text-[12px] mt-0.5">AI matching activates immediately upon submission</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/05 dark:bg-white/05 flex items-center justify-center text-muted hover:text-slate transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Patient Name *"
            value={form.patientName}
            onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
            className="w-full px-4 py-3.5 bg-canvas dark:bg-darksurf2 border border-black/08 dark:border-white/08 rounded-xl text-[14px] text-slate dark:text-white placeholder-muted focus:outline-none focus:border-bloodred transition-all"
          />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-muted mb-2 block">
              Blood Group Needed
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, bloodGroup: bg }))}
                  className={`py-2 rounded-xl text-[12px] font-black border-2 transition-all ${
                    form.bloodGroup === bg
                      ? 'bg-bloodred border-bloodred text-white'
                      : 'bg-canvas dark:bg-darksurf2 border-black/08 dark:border-white/08 text-slate dark:text-white'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-muted mb-1.5 block">
                Units Required
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.units}
                onChange={(e) => setForm((f) => ({ ...f, units: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-canvas dark:bg-darksurf2 border border-black/08 dark:border-white/08 rounded-xl text-[14px] text-slate dark:text-white focus:outline-none focus:border-bloodred transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-muted mb-1.5 block">
                Urgency
              </label>
              <select
                value={form.urgency}
                onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))}
                className="w-full px-4 py-3 bg-canvas dark:bg-darksurf2 border border-black/08 dark:border-white/08 rounded-xl text-[14px] text-slate dark:text-white focus:outline-none focus:border-bloodred transition-all"
              >
                <option value="emergency">🔴 Emergency</option>
                <option value="urgent">🟡 Urgent</option>
                <option value="normal">🟢 Normal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center py-3">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.patientName}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 dashboard-ripple"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Matching...
                </span>
              ) : (
                <>
                  <FiZap className="w-4 h-4" /> Launch AI Match
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestModal;
