import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiDollarSign, FiActivity, FiTrendingUp, FiCheck, FiX,
  FiEye, FiShield, FiAlertTriangle, FiZap, FiTag, FiRefreshCw,
  FiBarChart2, FiToggleLeft, FiToggleRight, FiCheckCircle,
  FiSliders, FiGlobe, FiClock
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

// --- Mock Data ---
const MOCK_HOSPITALS = [
  { id: 'H001', name: 'Metro Critical Care Hospital', city: 'Mumbai', plan: 'enterprise', status: 'active', joinDate: '2026-06-01', mrr: 7999, approved: true },
  { id: 'H002', name: 'Apollo Speciality Center', city: 'Pune', plan: 'professional', status: 'active', joinDate: '2026-06-12', mrr: 2999, approved: true },
  { id: 'H003', name: 'Global General Clinic', city: 'Ahmedabad', plan: 'free_trial', status: 'active', joinDate: '2026-07-05', mrr: 0, approved: false },
  { id: 'H004', name: 'St. Jude Heart Institute', city: 'Mumbai', plan: 'free_trial', status: 'active', joinDate: '2026-07-07', mrr: 0, approved: false },
  { id: 'H005', name: 'Lilavati Hospital', city: 'Mumbai', plan: 'professional', status: 'active', joinDate: '2026-05-20', mrr: 2999, approved: true },
  { id: 'H006', name: 'Fortis Hiranandani', city: 'Navi Mumbai', plan: 'enterprise', status: 'cancelled', joinDate: '2026-04-10', mrr: 0, approved: true },
  { id: 'H007', name: 'Kokilaben Hospital', city: 'Mumbai', plan: 'free_trial', status: 'active', joinDate: '2026-07-09', mrr: 0, approved: false },
];

const PLAN_META = {
  free_trial: { label: 'Trial', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
  professional: { label: 'Pro', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
  enterprise: { label: 'Enterprise', color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/30' }
};

const AdminPanel = () => {
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(20);
  const [toast, setToast] = useState(null);
  const [coupons, setCoupons] = useState([
    { code: 'LAUNCH2026', discount: 30, uses: 12, active: true },
    { code: 'HOSPITAL50', discount: 50, uses: 3, active: true },
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleApproval = (id) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, approved: !h.approved } : h));
    const h = hospitals.find(h => h.id === id);
    showToast(`${h.name} ${!h.approved ? 'approved' : 'deactivated'} successfully`);
  };

  const toggleStatus = (id) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, status: h.status === 'active' ? 'deactivated' : 'active' } : h));
    const h = hospitals.find(h => h.id === id);
    showToast(`${h.name} account ${h.status === 'active' ? 'deactivated' : 'reactivated'}`);
  };

  const createCoupon = () => {
    if (!couponCode.trim()) return;
    setCoupons(prev => [{ code: couponCode.toUpperCase(), discount: couponDiscount, uses: 0, active: true }, ...prev]);
    showToast(`Coupon ${couponCode.toUpperCase()} created with ${couponDiscount}% discount!`);
    setCouponCode('');
    setShowCouponModal(false);
  };

  const toggleCoupon = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const filtered = activeFilter === 'all' ? hospitals
    : activeFilter === 'pending' ? hospitals.filter(h => !h.approved)
    : activeFilter === 'trial' ? hospitals.filter(h => h.plan === 'free_trial')
    : hospitals.filter(h => h.status === activeFilter);

  const totalMRR = hospitals.filter(h => h.status === 'active').reduce((s, h) => s + h.mrr, 0);
  const activeCount = hospitals.filter(h => h.status === 'active').length;
  const trialCount = hospitals.filter(h => h.plan === 'free_trial').length;
  const pendingCount = hospitals.filter(h => !h.approved).length;
  const paidCount = hospitals.filter(h => h.plan !== 'free_trial' && h.status === 'active').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-[13px] font-bold bg-emerald-500 text-white"
          >
            <FiCheckCircle className="w-4 h-4" />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-[#E11D48] uppercase tracking-widest">Admin Only</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Control Panel</h1>
            <p className="text-muted text-[13px] mt-0.5">Manage hospital partnerships, subscriptions, and platform analytics</p>
          </div>
          <button
            onClick={() => setShowCouponModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[13px] transition-all hover:-translate-y-0.5 shadow-md shadow-violet-500/20"
          >
            <FiTag className="w-4 h-4" />
            Issue Coupon
          </button>
        </motion.div>

        {/* KPI cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Revenue', value: `₹${totalMRR.toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', sub: `${paidCount} paid accounts` },
            { label: 'Active Hospitals', value: activeCount, icon: FiActivity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', sub: 'Total network nodes' },
            { label: 'Active Trials', value: trialCount, icon: FiClock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', sub: 'Conversion opportunities' },
            { label: 'Pending Approval', value: pendingCount, icon: FiAlertTriangle, color: pendingCount > 0 ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : 'text-gray-400 bg-gray-100 dark:bg-white/05', sub: 'Awaiting review' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-2xl p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-[22px] font-black text-slate-900 dark:text-white leading-tight">{s.value}</p>
              <p className="text-[10px] text-muted mt-1 font-medium">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Revenue breakdown */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] mb-5">Revenue Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { plan: 'Enterprise', count: hospitals.filter(h => h.plan === 'enterprise' && h.status === 'active').length, rate: 7999, color: 'bg-violet-500' },
              { plan: 'Professional', count: hospitals.filter(h => h.plan === 'professional' && h.status === 'active').length, rate: 2999, color: 'bg-blue-500' },
              { plan: 'Free Trial', count: trialCount, rate: 0, color: 'bg-emerald-500' },
            ].map((r) => (
              <div key={r.plan} className="bg-gray-50 dark:bg-white/03 rounded-2xl p-4 border border-gray-100 dark:border-white/05">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{r.plan}</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(r.count * r.rate).toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-muted mt-1">{r.count} hospitals · ₹{r.rate.toLocaleString('en-IN')}/mo</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hospital Management */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px]">Hospital Management</h3>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'trial', 'active', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all capitalize ${
                    activeFilter === f
                      ? 'bg-[#E11D48] text-white'
                      : 'bg-gray-100 dark:bg-white/05 text-muted hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'pending' ? `Pending (${pendingCount})` : f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-[10px] font-black text-muted uppercase tracking-wider">
                  <th className="text-left pb-3 pr-4">Hospital</th>
                  <th className="text-left pb-3 pr-4">City</th>
                  <th className="text-left pb-3 pr-4">Plan</th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3 pr-4">MRR</th>
                  <th className="text-left pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/05">
                {filtered.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-white/02 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-xs">🏥</div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-800 dark:text-white truncate max-w-[140px]">{h.name}</p>
                          <p className="text-[10px] text-muted">{h.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-medium text-muted">{h.city}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${PLAN_META[h.plan]?.color}`}>
                        {PLAN_META[h.plan]?.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${h.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span className="text-[11px] font-bold text-muted capitalize">{h.status}</span>
                        {!h.approved && (
                          <span className="text-[9px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded uppercase">Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[13px] font-extrabold ${h.mrr > 0 ? 'text-emerald-600' : 'text-muted'}`}>
                        {h.mrr > 0 ? `₹${h.mrr.toLocaleString('en-IN')}` : '—'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {!h.approved && (
                          <button
                            onClick={() => toggleApproval(h.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100 font-bold text-[10px] transition-colors flex items-center gap-1"
                          >
                            <FiCheck className="w-3 h-3" />
                            Approve
                          </button>
                        )}
                        {h.approved && (
                          <button
                            onClick={() => toggleStatus(h.id)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 ${
                              h.status === 'active'
                                ? 'bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100'
                                : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {h.status === 'active' ? (
                              <><FiX className="w-3 h-3" />Deactivate</>
                            ) : (
                              <><FiRefreshCw className="w-3 h-3" />Reactivate</>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Coupon Management */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px]">Discount Coupons</h3>
            <button
              onClick={() => setShowCouponModal(true)}
              className="text-[12px] font-bold text-[#E11D48] hover:underline flex items-center gap-1"
            >
              <FiTag className="w-3.5 h-3.5" />
              Create New
            </button>
          </div>
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.code} className="flex items-center justify-between bg-gray-50 dark:bg-white/03 border border-gray-100 dark:border-white/05 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                    <FiTag className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-slate-800 dark:text-white font-mono">{c.code}</p>
                    <p className="text-[10px] text-muted">{c.uses} uses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-black text-violet-600">{c.discount}% OFF</span>
                  <button
                    onClick={() => toggleCoupon(c.code)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-colors ${
                      c.active
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-gray-100 dark:bg-white/05 text-muted hover:bg-gray-200'
                    }`}
                  >
                    {c.active ? <FiToggleRight className="w-3.5 h-3.5" /> : <FiToggleLeft className="w-3.5 h-3.5" />}
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Coupon Creation Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCouponModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCouponModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-500">
                  <FiTag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-[17px]">Issue Coupon</h3>
                  <p className="text-muted text-[12px]">Create a discount code for hospitals</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="E.g. SAVE20"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/05 border border-gray-200 dark:border-white/10 rounded-2xl text-[14px] font-extrabold font-mono text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Discount: {couponDiscount}%</label>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-[10px] text-muted font-semibold mt-1">
                    <span>5%</span><span>100%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCouponModal(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-[13px] text-muted hover:text-slate-900 dark:hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={createCoupon} className="flex-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[13px] transition-colors">
                  Create Coupon
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
