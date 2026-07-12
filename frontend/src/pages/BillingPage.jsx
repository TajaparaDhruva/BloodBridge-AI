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
    <div className="max-w-[1100px] mx-auto p-2 sm:p-6 space-y-6 font-sans">
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
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Billing & Subscription</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your plan, invoices, and payment settings</p>
          </div>
          {subscription?.plan === 'free_trial' && !expired && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E11D48] hover:bg-rose-600 text-white font-semibold text-sm transition-all shadow-md shadow-rose-500/20"
            >
              <FiZap className="w-4 h-4" />
              Upgrade Plan
            </button>
          )}
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          variants={fadeUp}
          className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden"
        >
          {/* Decorative background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/50 dark:bg-rose-900/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

          {/* Left side */}
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center">
              <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-[#E11D48] text-[10px] font-bold rounded uppercase tracking-widest">
                Active Plan
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{meta.label} Plan</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                subscription?.status === 'active' && !expired
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                  : subscription?.status === 'cancelled'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-600'
              }`}>
                {subscription?.status === 'active' && !expired ? 'Active' : expired ? 'Trial Expired' : subscription?.status}
              </span>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subscription?.plan === 'free_trial'
                ? expired
                  ? 'Your 7-day free trial has ended. Upgrade to restore access.'
                  : `Your free trial ends on ${fmt(subscription?.trialEnd)}`
                : `Renews on ${fmt(subscription?.renewalDate)}`}
            </p>
            
            {subscription?.plan === 'free_trial' && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <FiClock className="w-4 h-4 text-slate-400" /> {days} days remaining
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {subscription?.plan === 'free_trial' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E11D48] hover:bg-rose-600 text-white font-semibold text-sm transition-all"
                >
                  <FiZap className="w-4 h-4" /> Upgrade Now
                </button>
              )}
              {subscription?.plan === 'free_trial' && !expired && (
                <button
                  onClick={simulateTrialExpiry}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold text-sm transition-all"
                >
                  <FiClock className="w-4 h-4" /> Simulate Expiry
                </button>
              )}
              {subscription?.status === 'active' && subscription?.plan !== 'free_trial' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold text-sm transition-all"
                >
                  Cancel Subscription
                </button>
              )}
              {subscription?.status === 'cancelled' && (
                <button
                  onClick={handleReactivate}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
                >
                  <FiRefreshCw className="w-4 h-4" /> Reactivate
                </button>
              )}
            </div>
          </div>

          {/* Middle side (Trial Progress) */}
          {subscription?.plan === 'free_trial' && (
            <div className="flex-1 space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 md:pl-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Trial Progress</span>
                <span className="text-xs text-slate-500">{days} of 7 days left</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trialPercent}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${expired ? 'bg-red-500' : 'bg-[#E11D48]'}`}
                />
              </div>
              <div className="flex justify-end text-xs font-bold text-slate-900 dark:text-white">{trialPercent}%</div>
              
              <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm p-3.5 rounded-xl flex items-start gap-3 mt-4">
                <div className="mt-0.5"><FiShield className="w-4 h-4" /></div>
                <span className="leading-tight">Enjoy all premium features during your trial period</span>
              </div>
            </div>
          )}

          {/* Right side (Current Amount) */}
          <div className="w-full md:w-56 flex flex-col items-center justify-center pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 md:pl-8">
            <div className="w-36 h-36 bg-rose-50/50 dark:bg-rose-950/20 rounded-full flex flex-col items-center justify-center border border-rose-50 dark:border-rose-900/10">
              <FiCalendar className="w-6 h-6 text-[#E11D48] mb-2" />
              <div className="text-4xl font-black text-slate-900 dark:text-white">{meta.price}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Current Amount</div>
            </div>
          </div>
        </motion.div>

        {/* 5 Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Current Plan', value: meta.label, icon: FiShield, iconColor: 'text-rose-500', iconBg: 'bg-rose-50 dark:bg-rose-950/30' },
            { label: 'Status', value: expired ? 'Expired' : subscription?.status === 'cancelled' ? 'Cancelled' : 'Active', icon: FiActivity, iconColor: expired || subscription?.status === 'cancelled' ? 'text-red-500' : 'text-emerald-500', iconBg: expired || subscription?.status === 'cancelled' ? 'bg-red-50 dark:bg-red-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30' },
            { label: 'Days Remaining', value: subscription?.plan === 'free_trial' ? `${days} days` : '∞', icon: FiCalendar, iconColor: 'text-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-950/30' },
            { label: 'Auto Renewal', value: subscription?.autoRenew ? 'On' : 'Off', icon: FiRefreshCw, iconColor: 'text-orange-500', iconBg: 'bg-orange-50 dark:bg-orange-950/30' },
            { label: 'Next Billing', value: subscription?.plan === 'free_trial' ? fmt(subscription?.trialEnd) : fmt(subscription?.renewalDate), icon: FiCalendar, iconColor: 'text-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-950/30' }
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
              <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
              <p className="text-[15px] font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment Section */}
        <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-6">
          {/* Payment Methods (Saved Card) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-1">Payment Methods</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your billing payment options</p>

            <div className="bg-[#1C212E] dark:bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg border border-slate-800">
              {/* Card Decor */}
              <div className="absolute top-5 right-5 flex gap-1.5 opacity-60">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-6">Saved Card</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-widest mb-3">BloodBridge AI Partner</div>
              <div className="text-xl sm:text-2xl font-mono tracking-[0.1em] sm:tracking-[0.2em] mb-8 flex items-center gap-2 sm:gap-4 font-bold text-slate-100">
                <span>••••</span> <span>••••</span> <span>••••</span> <span>4289</span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Card Holder</div>
                  <div className="font-semibold text-[13px] tracking-wide">{user?.name || user?.hospitalName || 'Dharmi Patel'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Valid Thru</div>
                  <div className="font-semibold text-[13px] tracking-wide">09/28</div>
                </div>
                <div className="flex items-center -space-x-3 opacity-90">
                  <div className="w-8 h-8 rounded-full bg-rose-500 mix-blend-screen"></div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 mix-blend-screen"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Payment Methods */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-1">Available Payment Methods</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred payment method</p>
              </div>
              <button className="border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <span className="text-[16px] font-light leading-none">+</span> Add New Method
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-auto">
              {/* Card Option */}
              <div 
                onClick={() => handlePaymentMethodSelect('card')}
                className={`border-2 rounded-xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'card' ? 'border-rose-200 bg-rose-50/30 dark:bg-rose-950/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
              >
                {activePaymentMethod === 'card' && (
                  <div className="absolute -top-2 -right-2 bg-[#E11D48] text-white rounded-full p-1 shadow-sm">
                    <FiCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-rose-50 dark:bg-rose-950/30 rounded-lg flex items-center justify-center">
                    <FiCreditCard className="w-4.5 h-4.5 text-[#E11D48]"/>
                  </div>
                </div>
                <div className="font-bold text-[13px] text-slate-900 dark:text-white mb-0.5">Card / Debit Card</div>
                <div className="text-[11px] text-slate-500 mb-3">Visa, Mastercard, RuPay</div>
                <div className="flex gap-1.5">
                  <span className="text-[8px] font-black text-blue-700 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">VISA</span>
                  <span className="text-[8px] font-black text-orange-600 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">MC</span>
                  <span className="text-[8px] font-black text-emerald-600 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">RuPay</span>
                </div>
              </div>
              
              {/* UPI Option */}
              <div 
                onClick={() => handlePaymentMethodSelect('upi')}
                className={`border-2 rounded-xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'upi' ? 'border-rose-200 bg-rose-50/30 dark:bg-rose-950/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
              >
                {activePaymentMethod === 'upi' && (
                  <div className="absolute -top-2 -right-2 bg-[#E11D48] text-white rounded-full p-1 shadow-sm">
                    <FiCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center">
                    <FiZap className="w-4.5 h-4.5 text-emerald-600"/>
                  </div>
                </div>
                <div className="font-bold text-[13px] text-slate-900 dark:text-white mb-0.5">UPI Payment</div>
                <div className="text-[11px] text-slate-500 mb-3">Instant bank transfer</div>
                <div className="flex gap-1.5">
                  <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">GPay</span>
                  <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">PhonePe</span>
                  <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">Paytm</span>
                </div>
              </div>

              {/* Net Banking Option */}
              <div 
                onClick={() => handlePaymentMethodSelect('netbanking')}
                className={`border-2 rounded-xl p-4 relative cursor-pointer transition-colors ${activePaymentMethod === 'netbanking' ? 'border-rose-200 bg-rose-50/30 dark:bg-rose-950/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
              >
                {activePaymentMethod === 'netbanking' && (
                  <div className="absolute -top-2 -right-2 bg-[#E11D48] text-white rounded-full p-1 shadow-sm">
                    <FiCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                    <FiShield className="w-4.5 h-4.5 text-purple-600"/>
                  </div>
                </div>
                <div className="font-bold text-[13px] text-slate-900 dark:text-white mb-0.5">Net Banking</div>
                <div className="text-[11px] text-slate-500 mb-3">All major Indian banks</div>
                <div className="flex gap-1.5">
                  <span className="text-[8px] font-black text-blue-800 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">SBI</span>
                  <span className="text-[8px] font-black text-red-600 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">HDFC</span>
                  <span className="text-[8px] font-black text-orange-600 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm">ICICI</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center shrink-0">
                <FiShield className="w-4 h-4 text-emerald-600"/>
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-bold text-emerald-800 dark:text-emerald-400">256-bit SSL Encrypted • PCI-DSS Compliant</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-500/70 mt-0.5">All transactions are processed through RBI-certified payment gateways</div>
              </div>
              <div className="hidden sm:block">
                <FiCheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-1">Payment History</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">View your payment history and invoices</p>
            </div>
            <div className="text-xs font-bold text-[#E11D48] bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-full">
              {subscription?.invoices?.length || 0} invoices
            </div>
          </div>
          
          {(!subscription?.invoices || subscription.invoices.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <FiFileText className="w-5 h-5 text-slate-400" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-[14px]">No invoices yet</div>
              <div className="text-[13px] text-slate-500 mt-1">Invoices appear here after upgrading to a paid plan</div>
            </div>
          ) : (
            <div className="space-y-3">
              {subscription.invoices.map((inv) => (
                <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white mb-0.5">{inv.id}</p>
                      <p className="text-[12px] text-slate-500">{fmt(inv.date)} • {PLAN_META[inv.plan]?.label || inv.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:ml-auto pl-14 sm:pl-0">
                    <span className="font-black text-slate-900 dark:text-white text-[15px]">₹{inv.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md uppercase tracking-wider">Paid</span>
                    <button onClick={() => handleDownloadInvoice(inv)} className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-[#E11D48] hover:border-rose-200 hover:bg-rose-50 transition-colors">
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ── Upgrade Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 mb-3">
                    <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-widest">Revenue Model</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Partnership <span className="text-[#E11D48]">Plans</span>
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-md leading-relaxed">
                    AI-powered emergency blood supply network for clinics, hospitals, and healthcare systems.
                  </p>
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {UPGRADE_PLANS.map((plan) => (
                  <div key={plan.id} className={`border-2 ${plan.id === 'professional' ? 'border-[#E11D48] bg-rose-50/10 dark:bg-rose-900/5' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5'} rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all relative`}>
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {plan.badge}
                      </div>
                    )}
                    {plan.id === 'professional' && !plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <p className={`text-[15px] font-bold ${plan.id === 'professional' ? 'text-[#E11D48]' : 'text-slate-900 dark:text-white'} mb-4`}>{plan.name}</p>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="text-slate-500 font-semibold text-[14px]">{plan.period}</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feat) => (
                          <li key={feat} className={`flex items-start gap-3 text-[14px] ${plan.id === 'professional' ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.id === 'professional' ? 'bg-rose-100 dark:bg-rose-900/30 text-[#E11D48]' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                              <FiCheck className="w-3 h-3 stroke-[3]" />
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={!!upgrading}
                      className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all ${plan.id === 'professional' ? 'bg-[#E11D48] hover:bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white'}`}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 mx-auto">
                <FiAlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Cancel Subscription?</h3>
              <p className="text-[14px] text-slate-500 text-center mb-8 leading-relaxed">
                You'll lose access to premium AI matching features at the end of your billing period. This action can be reversed.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleCancel} className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[14px] transition-colors">
                  Yes, Cancel Plan
                </button>
                <button onClick={() => setShowCancelModal(false)} className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-[14px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Keep My Plan
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
