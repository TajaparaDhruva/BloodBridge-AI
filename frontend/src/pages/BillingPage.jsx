import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  FiCreditCard, FiCheck, FiAlertTriangle, FiDownload, FiRefreshCw,
  FiZap, FiShield, FiX, FiTrendingUp, FiArrowRight, FiCalendar,
  FiClock, FiCheckCircle, FiXCircle, FiStar, FiActivity, FiFileText
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

const PLAN_META = {
  free_trial: {
    label: 'Free Trial',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    icon: '🚀',
    price: '₹0',
    period: '7 days'
  },
  professional: {
    label: 'Professional',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/40',
    icon: '⚡',
    price: '₹2,999',
    period: '/month'
  },
  enterprise: {
    label: 'Enterprise',
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800/40',
    icon: '🏆',
    price: '₹7,999',
    period: '/month'
  }
};

const UPGRADE_PLANS = [
  {
    id: 'professional',
    name: 'Professional',
    price: '₹2,999',
    period: '/month',
    features: ['Unlimited AI Matching', 'Verified Partner Badge', 'Advanced Analytics', 'Hospital Collaboration', 'Monthly Reports', 'API Access', 'Email Support'],
    cta: 'Upgrade to Professional',
    style: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹7,999',
    period: '/month',
    badge: 'Best Value',
    features: ['AI Priority Matching', 'Predictive Analytics', 'Disaster Response Mode', 'Unlimited Staff', 'Dedicated Support', 'Custom API', 'Government Integration'],
    cta: 'Upgrade to Enterprise',
    style: 'bg-violet-600 hover:bg-violet-700',
  }
];

const BillingPage = () => {
  const {
    user, subscription, isTrialExpired, daysRemaining,
    upgradePlan, cancelSubscription, reactivateSubscription,
    simulateTrialExpiry
  } = useAuth();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [upgrading, setUpgrading] = useState(null);
  const [toast, setToast] = useState(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState('card');

  const expired = isTrialExpired();
  const days = daysRemaining();
  const meta = PLAN_META[subscription?.plan] || PLAN_META.free_trial;
  const trialPercent = subscription?.plan === 'free_trial'
    ? Math.max(0, Math.round((days / 7) * 100))
    : 100;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpgrade = async (planId) => {
    setUpgrading(planId);
    await new Promise(r => setTimeout(r, 1200));
    upgradePlan(planId);
    setUpgrading(null);
    setShowUpgradeModal(false);
    showToast(`Upgraded to ${PLAN_META[planId].label} plan!`);
  };

  const handleCancel = () => {
    cancelSubscription();
    setShowCancelModal(false);
    showToast('Subscription cancelled. Access continues until renewal date.', 'warning');
  };

  const handleReactivate = () => {
    reactivateSubscription();
    showToast('Subscription reactivated successfully!');
  };

  const handlePaymentMethodSelect = (method) => {
    setActivePaymentMethod(method);
    showToast(`Default payment method updated to ${method.toUpperCase()}`);
  };

  const handleDownloadInvoice = (inv) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor('#E11D48');
    doc.text('BloodBridge AI', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor('#64748b');
    doc.text('Emergency Blood Supply Network', 20, 28);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor('#0f172a');
    doc.text('INVOICE / RECEIPT', 130, 20);
    
    // Details
    doc.setFontSize(11);
    doc.text(`Invoice ID: ${inv.id}`, 130, 30);
    doc.text(`Date: ${fmt(inv.date)}`, 130, 36);
    doc.text(`Status: PAID`, 130, 42);
    
    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 50, 190, 50);
    
    // Body
    doc.setFontSize(12);
    doc.setTextColor('#0f172a');
    doc.text('Billed To:', 20, 65);
    doc.setFontSize(10);
    doc.setTextColor('#475569');
    doc.text(`${user?.name || user?.hospitalName || 'Hospital Admin'}`, 20, 72);
    doc.text(`Partner Hospital`, 20, 78);
    
    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 90, 170, 12, 'F');
    doc.setFontSize(10);
    doc.setTextColor('#0f172a');
    doc.text('Description', 25, 98);
    doc.text('Amount', 160, 98);
    
    // Table Body
    doc.setTextColor('#475569');
    doc.text(`${PLAN_META[inv.plan]?.label || inv.plan} Plan Subscription`, 25, 112);
    doc.text(`Rs ${inv.amount.toLocaleString('en-IN')}`, 160, 112);
    
    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 120, 190, 120);
    
    // Total
    doc.setFontSize(12);
    doc.setTextColor('#0f172a');
    doc.text('Total Paid:', 130, 130);
    doc.text(`Rs ${inv.amount.toLocaleString('en-IN')}`, 160, 130);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor('#94a3b8');
    doc.text('Thank you for partnering with BloodBridge AI to save lives.', 20, 280);
    
    doc.save(`Invoice_${inv.id}.pdf`);
    showToast(`Invoice ${inv.id} downloaded`);
  };

  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-[13px] font-bold ${
              toast.type === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {toast.type === 'warning' ? <FiAlertTriangle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Billing & Subscription</h1>
            <p className="text-muted text-[13px] mt-0.5">Manage your plan, invoices, and payment settings</p>
          </div>
          {subscription?.plan === 'free_trial' && !expired && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E11D48] hover:bg-red-600 text-white font-bold text-[13px] transition-all hover:-translate-y-0.5 shadow-md shadow-red-500/20"
            >
              <FiZap className="w-4 h-4" />
              Upgrade Plan
            </button>
          )}
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          variants={fadeUp}
          className={`bg-white dark:bg-[#0F1420] border ${meta.border} rounded-3xl p-7 shadow-sm`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl ${meta.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
              {meta.icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{meta.label} Plan</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  subscription?.status === 'active' && !expired
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                    : subscription?.status === 'cancelled'
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-600'
                }`}>
                  {subscription?.status === 'active' && !expired ? 'Active' : expired ? 'Trial Expired' : subscription?.status}
                </span>
              </div>
              <p className="text-[13.5px] text-muted mb-4">
                {subscription?.plan === 'free_trial'
                  ? expired
                    ? 'Your 7-day free trial has ended. Upgrade to restore access.'
                    : `Your free trial ends on ${fmt(subscription?.trialEnd)} · ${days} day${days !== 1 ? 's' : ''} remaining`
                  : `Renews on ${fmt(subscription?.renewalDate)} · ${meta.price}${meta.period}`
                }
              </p>

              {/* Trial progress bar */}
              {subscription?.plan === 'free_trial' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-muted">Trial Progress</span>
                    <span className="text-[11px] font-bold text-muted">{days}/7 days left</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trialPercent}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${expired ? 'bg-red-400' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {subscription?.plan === 'free_trial' && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-red-600 text-white font-bold text-[12px] transition-all"
                  >
                    <FiArrowRight className="w-3.5 h-3.5" />
                    Upgrade Now
                  </button>
                )}
                {subscription?.status === 'active' && subscription?.plan !== 'free_trial' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-muted hover:text-red-600 hover:border-red-200 font-bold text-[12px] transition-all"
                  >
                    Cancel Subscription
                  </button>
                )}
                {subscription?.status === 'cancelled' && (
                  <button
                    onClick={handleReactivate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[12px] transition-all"
                  >
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    Reactivate
                  </button>
                )}
                {/* Dev tool */}
                {subscription?.plan === 'free_trial' && !expired && (
                  <button
                    onClick={simulateTrialExpiry}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-muted hover:text-amber-600 hover:border-amber-200 font-bold text-[11px] transition-all"
                    title="Developer: Simulate trial expiry"
                  >
                    <FiClock className="w-3 h-3" />
                    Simulate Expiry
                  </button>
                )}
              </div>
            </div>

            {/* Price display */}
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 dark:text-white">{meta.price}</p>
              <p className="text-[12px] font-bold text-muted">{meta.period}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Current Plan', value: meta.label, icon: FiStar, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20' },
            { label: 'Status', value: expired ? 'Expired' : subscription?.status === 'cancelled' ? 'Cancelled' : 'Active', icon: FiActivity, color: expired || subscription?.status === 'cancelled' ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
            { label: 'Days Remaining', value: subscription?.plan === 'free_trial' ? `${days} days` : '∞', icon: FiCalendar, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
            { label: 'Auto Renewal', value: subscription?.autoRenew ? 'On' : 'Off', icon: FiRefreshCw, color: subscription?.autoRenew ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'text-gray-400 bg-gray-100 dark:bg-white/05' }
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-[15px] font-extrabold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment Method */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-rose-600 flex items-center justify-center">
                <FiCreditCard className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px]">Payment Methods</h3>
                <p className="text-[11px] text-muted font-medium">Manage your billing payment options</p>
              </div>
            </div>
          </div>

          {/* Saved Card */}
          <div className="mb-5">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">Saved Card</p>
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-2xl p-5 overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Card chip and wireless icon */}
              <div className="absolute top-5 right-5 flex items-center gap-1.5 opacity-70">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.5"/><path d="M14 11h4M14 14h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
              </div>
              {/* Decorative circles */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-white/5 rounded-full" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

              <div className="relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6">BloodBridge AI Partner</p>
                <p className="text-[20px] font-bold text-white tracking-[0.15em] mb-5 font-mono">
                  •••• &nbsp; •••• &nbsp; •••• &nbsp; 4 2 8 9
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
                    <p className="text-[12px] font-bold text-white/90 tracking-wide">{user?.name || user?.hospitalName || 'Hospital Admin'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Valid Thru</p>
                    <p className="text-[12px] font-bold text-white/90">09/28</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-7 h-7 rounded-full bg-red-500 opacity-80" />
                    <div className="w-7 h-7 rounded-full bg-amber-400 -ml-3 opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options Grid */}
          <div className="mb-5">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">Available Methods</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Credit / Debit Card */}
              <div 
                onClick={() => handlePaymentMethodSelect('card')}
                className={`rounded-2xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'card' ? 'bg-gray-50 dark:bg-white/03 border-2 border-[#E11D48]/20 dark:border-[#E11D48]/30 shadow-sm' : 'bg-transparent border border-gray-100 dark:border-white/06 hover:border-gray-300 dark:hover:border-white/15'}`}
              >
                {activePaymentMethod === 'card' && (
                  <div className="absolute top-3 right-3">
                    <span className="w-4 h-4 rounded-full bg-[#E11D48] flex items-center justify-center">
                      <FiCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  </div>
                )}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3">
                  <FiCreditCard className="w-4.5 h-4.5 text-white" />
                </div>
                <p className="text-[13px] font-extrabold text-slate-900 dark:text-white mb-0.5">Credit / Debit Card</p>
                <p className="text-[10px] text-muted font-medium mb-3">Visa, Mastercard, RuPay</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-blue-600">VISA</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-orange-500">MC</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-green-600">RuPay</span>
                  </div>
                </div>
              </div>

              {/* UPI */}
              <div 
                onClick={() => handlePaymentMethodSelect('upi')}
                className={`rounded-2xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'upi' ? 'bg-gray-50 dark:bg-white/03 border-2 border-[#E11D48]/20 dark:border-[#E11D48]/30 shadow-sm' : 'bg-transparent border border-gray-100 dark:border-white/06 hover:border-gray-300 dark:hover:border-white/15'}`}
              >
                {activePaymentMethod === 'upi' && (
                  <div className="absolute top-3 right-3">
                    <span className="w-4 h-4 rounded-full bg-[#E11D48] flex items-center justify-center">
                      <FiCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  </div>
                )}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3">
                  <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>
                </div>
                <p className="text-[13px] font-extrabold text-slate-900 dark:text-white mb-0.5">UPI Payment</p>
                <p className="text-[10px] text-muted font-medium mb-3">Instant bank transfer</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-blue-700">GPay</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-violet-600">PhonePe</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-sky-600">Paytm</span>
                  </div>
                </div>
              </div>

              {/* Net Banking */}
              <div 
                onClick={() => handlePaymentMethodSelect('netbanking')}
                className={`rounded-2xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'netbanking' ? 'bg-gray-50 dark:bg-white/03 border-2 border-[#E11D48]/20 dark:border-[#E11D48]/30 shadow-sm' : 'bg-transparent border border-gray-100 dark:border-white/06 hover:border-gray-300 dark:hover:border-white/15'}`}
              >
                {activePaymentMethod === 'netbanking' && (
                  <div className="absolute top-3 right-3">
                    <span className="w-4 h-4 rounded-full bg-[#E11D48] flex items-center justify-center">
                      <FiCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  </div>
                )}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3">
                  <FiShield className="w-4.5 h-4.5 text-white" />
                </div>
                <p className="text-[13px] font-extrabold text-slate-900 dark:text-white mb-0.5">Net Banking</p>
                <p className="text-[10px] text-muted font-medium mb-3">All major Indian banks</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-blue-800">SBI</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-red-600">HDFC</span>
                  </div>
                  <div className="h-5 px-1.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center">
                    <span className="text-[8px] font-black text-blue-600">ICICI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="flex items-center gap-3 bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">256-bit SSL Encrypted · PCI-DSS Compliant</p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/60 font-medium">All transactions are processed through RBI-certified payment gateways</p>
            </div>
          </div>
        </motion.div>

        {/* Invoice History */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px]">Payment History</h3>
            <span className="text-[11px] font-bold text-muted">{subscription?.invoices?.length || 0} invoice{(subscription?.invoices?.length || 0) !== 1 ? 's' : ''}</span>
          </div>

          {(!subscription?.invoices || subscription.invoices.length === 0) ? (
            <div className="text-center py-10 text-muted">
              <FiFileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-[13px] font-semibold">No invoices yet</p>
              <p className="text-[11px] mt-1">Invoices appear here after upgrading to a paid plan</p>
            </div>
          ) : (
            <div className="space-y-2">
              {subscription.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between bg-gray-50 dark:bg-white/03 border border-gray-100 dark:border-white/05 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-white">{inv.id}</p>
                      <p className="text-[11px] text-muted">{fmt(inv.date)} · {PLAN_META[inv.plan]?.label || inv.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-slate-900 dark:text-white text-[14px]">₹{inv.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg uppercase">Paid</span>
                    <button onClick={() => handleDownloadInvoice(inv)} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-muted hover:text-[#E11D48] hover:border-red-200 transition-colors">
                      <FiDownload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Plan History */}
        {subscription?.planHistory && subscription.planHistory.length > 0 && (
          <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/08 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] mb-4">Plan History</h3>
            <div className="space-y-2">
              {subscription.planHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/05 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px]">{PLAN_META[h.plan]?.icon || '📋'}</span>
                    <span className="text-[13px] font-bold text-slate-800 dark:text-white">{PLAN_META[h.plan]?.label || h.plan}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{h.amount === 0 ? 'Free' : `₹${h.amount.toLocaleString('en-IN')}`}</p>
                    <p className="text-[10px] text-muted">{fmt(h.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Upgrade Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 mb-3">
                  <span className="text-[9px] font-black text-[#E11D48] uppercase tracking-widest">Revenue Model</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Partnership <span className="text-[#E11D48]">Plans</span>
                </h3>
                <p className="text-muted text-[13px] mt-2 max-w-md mx-auto leading-relaxed">
                  AI-powered emergency blood supply network for clinics, hospitals, and healthcare systems.
                </p>
              </div>

              <div className="grid md:grid-cols-2 max-w-3xl mx-auto gap-6 items-stretch">
                {UPGRADE_PLANS.map((plan) => (
                  <div key={plan.id} className={`border-2 ${plan.id === 'professional' ? 'border-[#E11D48] bg-white dark:bg-[#070B13]/60' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070B13]/30'} rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all relative`}>
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {plan.badge}
                      </div>
                    )}
                    {plan.id === 'professional' && !plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-extrabold ${plan.id === 'professional' ? 'text-[#E11D48]' : 'text-slate-900 dark:text-white'} mb-4`}>{plan.name}</p>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="text-muted font-bold text-[13px]">{plan.period}</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feat) => (
                          <li key={feat} className={`flex items-start gap-3 text-[13px] ${plan.id === 'professional' ? 'text-slate-800 dark:text-slate-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.id === 'professional' ? 'bg-rose-500/10 border border-[#E11D48]/30' : 'border border-slate-300 dark:border-slate-700'}`}>
                              <FiCheck className={`w-3 h-3 ${plan.id === 'professional' ? 'text-[#E11D48] stroke-[3]' : 'text-slate-400'}`} />
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={!!upgrading}
                      className={`w-full py-4 rounded-2xl font-bold text-[14px] transition-all ${plan.id === 'professional' ? 'bg-[#E11D48] hover:bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/05 text-slate-700 dark:text-slate-300'}`}
                    >
                      {upgrading === plan.id ? 'Upgrading...' : plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cancel Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5 mx-auto">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white text-center mb-2">Cancel Subscription?</h3>
              <p className="text-[13px] text-muted text-center mb-6 leading-relaxed">
                You'll lose access to premium AI matching features at the end of your billing period. This action can be reversed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-[13px] text-muted hover:text-slate-900 dark:hover:text-white transition-colors">
                  Keep Plan
                </button>
                <button onClick={handleCancel} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors">
                  Cancel Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default BillingPage;
