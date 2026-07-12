import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiActivity } from 'react-icons/fi';
import donorService from '../services/donorService';

const RequestDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    units: 1,
    urgency: 'emergency',
    hospitalName: '',
    notes: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const response = await donorService.getDonorById(id);
        if (response.success) {
          setDonor(response.data);
          setForm(f => ({ ...f, bloodGroup: response.data.bloodGroup }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.hospitalName) return;
    
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FA] dark:bg-[#0F1420]">
        <div className="w-8 h-8 border-2 border-rose-200 border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FA] dark:bg-[#0F1420]">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Donor not found</h2>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F1420] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[28px] p-10 max-w-md w-full text-center shadow-sm border border-slate-200/60 dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Request Sent!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Your blood donation request has been sent to <strong>{donor.name}</strong>. You will be notified once they accept.
          </p>
          <button 
            onClick={() => navigate('/hospital/dashboard', { state: { activeTab: 'donors' } })}
            className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F1420] pt-6 pb-12 px-4 sm:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <button 
          onClick={() => navigate(`/donor/${id}`)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors font-bold text-[11px] uppercase tracking-wider"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[28px] p-8 md:p-10 shadow-sm border border-slate-200/60 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center text-2xl font-black">
              {donor.avatarChar || donor.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Request Donation</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Direct request to <strong className="text-slate-700 dark:text-slate-300">{donor.name}</strong> ({donor.bloodGroup})
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Patient Name *</label>
              <input 
                type="text" 
                required
                value={form.patientName}
                onChange={e => setForm({...form, patientName: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="Enter patient's full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Units Required *</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  required
                  value={form.units}
                  onChange={e => setForm({...form, units: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Urgency *</label>
                <select 
                  value={form.urgency}
                  onChange={e => setForm({...form, urgency: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                >
                  <option value="emergency">🔴 Emergency (Need ASAP)</option>
                  <option value="urgent">🟠 Urgent (Within 24h)</option>
                  <option value="standard">🟢 Standard (Within 72h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Hospital Name & City *</label>
              <input 
                type="text" 
                required
                value={form.hospitalName}
                onChange={e => setForm({...form, hospitalName: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="e.g. Apollo Hospital, Mumbai"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Additional Notes (Optional)</label>
              <textarea 
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors h-24 resize-none"
                placeholder="Any special instructions for the donor..."
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-4 mt-4 bg-[#E11D48] hover:bg-rose-700 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiActivity className="w-5 h-5" /> Submit Direct Request
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestDonation;
