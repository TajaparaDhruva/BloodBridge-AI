import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiCalendar,
  FiCheck, FiArrowRight, FiArrowLeft, FiEye, FiEyeOff,
  FiHeart, FiShield, FiActivity, FiAlertCircle
} from 'react-icons/fi';

const STEPS = ['Role', 'Profile', 'Details', 'Confirm'];

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Surat'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-black border-2 transition-all duration-300 ${done ? 'bg-bloodred border-bloodred text-white' :
                  active ? 'bg-white dark:bg-darksurf border-bloodred text-bloodred' :
                    'bg-white dark:bg-darksurf border-black/10 dark:border-white/10 text-muted'
                }`}
              animate={{ scale: active ? 1.1 : 1 }}
            >
              {done ? <FiCheck className="w-4 h-4" /> : i + 1}
            </motion.div>
            <p className={`text-[10px] font-bold mt-1.5 ${active ? 'text-bloodred' : 'text-muted'}`}>{step}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${done ? 'bg-bloodred' : 'bg-black/08 dark:bg-white/08'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    city: 'Mumbai', bloodGroup: 'O+', age: '', weight: '',
    lastDonation: '', gender: 'Male',
    // Hospital fields
    hospitalName: '', license: '', coordinator: '',
    capacity: '', address: '', emergencyReady: true,
    // Agreements
    agreeTerms: false, agreeHealth: false, agreeNotify: true,
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleNext = () => {
    setError('');
    if (step === 0 && !role) { setError('Please select your role.'); return; }
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }
    if (step === 2 && role === 'donor') {
      if (!form.bloodGroup || !form.age || !form.weight) {
        setError('Please fill all medical details.'); return;
      }
    }
    if (step === 2 && role === 'hospital') {
      if (!form.hospitalName || !form.license) {
        setError('Please fill all hospital details.'); return;
      }
    }
    if (step < 3) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.agreeTerms) { setError('Please accept the terms to continue.'); return; }
    setError('');
    setSyncing(true);
    try {
      const payload = { ...form, role };
      await signup(payload);
      setLoading(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setSyncing(false);
      const serverError = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message;
      setError(serverError || 'Registration failed. Please try again.');
    }
  };

  // ── Step 0: Role Selection ────────────────────────────────────────────────
  const renderRoleStep = () => (
    <div className="space-y-4">
      <h2 className="text-[22px] font-extrabold text-slate dark:text-white">Who are you?</h2>
      <p className="text-muted text-[14px] mb-6">Select your role to personalize your BloodBridge experience.</p>

      {[
        { id: 'donor', icon: '🩸', title: 'Blood Donor', desc: 'I want to donate blood and save lives.', color: 'border-bloodred bg-bloodred/04' },
        { id: 'hospital', icon: '🏥', title: 'Hospital / Blood Bank', desc: 'I want to request blood and manage inventory.', color: 'border-aiblue bg-aiblue/04' },
        { id: 'admin', icon: '⚡', title: 'Platform Admin', desc: 'I manage the BloodBridge network.', color: 'border-aipurple bg-aipurple/04' },
      ].map(r => (
        <motion.button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${role === r.id ? r.color : 'border-black/08 dark:border-white/08 bg-white dark:bg-darksurf hover:border-black/15 dark:hover:border-white/15'
            }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-darksurf2 border border-black/06 dark:border-white/06 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            {r.icon}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate dark:text-white text-[15px]">{r.title}</p>
            <p className="text-muted text-[13px]">{r.desc}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${role === r.id ? 'bg-bloodred border-bloodred' : 'border-muted'
            }`}>
            {role === r.id && <FiCheck className="w-3 h-3 text-white" />}
          </div>
        </motion.button>
      ))}
    </div>
  );

  // ── Step 1: Basic Credentials ─────────────────────────────────────────────
  const renderCredentialsStep = () => (
    <div className="space-y-4">
      <h2 className="text-[22px] font-extrabold text-slate dark:text-white">Create Your Account</h2>
      <p className="text-muted text-[14px] mb-6">Set up your login credentials.</p>

      <div className="grid grid-cols-1 gap-4">
        <FloatInput icon={FiUser} label="Full Name" type="text" value={form.name} onChange={v => set('name', v)} />
        <FloatInput icon={FiMail} label="Email Address" type="email" value={form.email} onChange={v => set('email', v)} />
        <FloatInput icon={FiPhone} label="Mobile Number" type="tel" value={form.phone} onChange={v => set('phone', v)} />
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
          <input
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder="Password (min. 6 characters)"
            className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-darksurf border border-black/08 dark:border-white/08 rounded-xl text-[14px] font-medium text-slate dark:text-white placeholder-muted focus:outline-none focus:border-bloodred focus:ring-2 focus:ring-bloodred/10 transition-all"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
            {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>

        <div>
          <label className="text-[12px] font-bold text-muted uppercase tracking-wide mb-1.5 block">City</label>
          <select value={form.city} onChange={e => set('city', e.target.value)}
            className="w-full py-3.5 px-4 bg-white dark:bg-darksurf border border-black/08 dark:border-white/08 rounded-xl text-[14px] font-medium text-slate dark:text-white focus:outline-none focus:border-bloodred focus:ring-2 focus:ring-bloodred/10 transition-all">
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Role-specific Details ─────────────────────────────────────────
  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h2 className="text-[22px] font-extrabold text-slate dark:text-white">
        {role === 'donor' ? 'Medical Profile' : 'Hospital Details'}
      </h2>
      <p className="text-muted text-[14px] mb-6">
        {role === 'donor'
          ? 'This helps our AI match you accurately with emergency requests.'
          : 'Help hospitals in your network identify and trust your organization.'}
      </p>

      {role === 'donor' && (
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-muted uppercase tracking-wide mb-2 block">Blood Group</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} type="button"
                  onClick={() => set('bloodGroup', bg)}
                  className={`py-2.5 rounded-xl text-[13px] font-black border-2 transition-all ${form.bloodGroup === bg
                      ? 'bg-bloodred border-bloodred text-white'
                      : 'bg-white dark:bg-darksurf border-black/08 dark:border-white/08 text-slate dark:text-white hover:border-bloodred/30'
                    }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-bold text-muted uppercase tracking-wide mb-1.5 block">Gender</label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} type="button" onClick={() => set('gender', g)}
                    className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold border transition-all ${form.gender === g ? 'bg-bloodred border-bloodred text-white' : 'bg-white dark:bg-darksurf border-black/08 dark:border-white/08 text-slate dark:text-white'
                      }`}
                  >{g}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FloatInput label="Age (years)" type="number" value={form.age} onChange={v => set('age', v)} min={18} />
            <FloatInput label="Weight (kg)" type="number" value={form.weight} onChange={v => set('weight', v)} min={50} />
          </div>
          <FloatInput icon={FiCalendar} label="Last Donation Date (optional)" type="date" value={form.lastDonation} onChange={v => set('lastDonation', v)} />
        </div>
      )}

      {role === 'hospital' && (
        <div className="space-y-4">
          <FloatInput label="Hospital / Blood Bank Name" type="text" value={form.hospitalName} onChange={v => set('hospitalName', v)} />
          <FloatInput label="Registration / License Number" type="text" value={form.license} onChange={v => set('license', v)} />
          <FloatInput label="Authorized Coordinator Name" type="text" value={form.coordinator} onChange={v => set('coordinator', v)} />
          <FloatInput label="Street Address" type="text" value={form.address} onChange={v => set('address', v)} />
          <FloatInput label="Blood Storage Capacity (units)" type="number" value={form.capacity} onChange={v => set('capacity', v)} />
          <label className="flex items-center gap-3 p-4 rounded-xl bg-emerald/05 border border-emerald/15 cursor-pointer">
            <input type="checkbox" checked={form.emergencyReady} onChange={e => set('emergencyReady', e.target.checked)} className="accent-emerald w-4.5 h-4.5" />
            <div>
              <p className="font-bold text-slate dark:text-white text-[13px]">Emergency Availability Mode</p>
              <p className="text-muted text-[11px] mt-0.5">Enable 24/7 emergency dispatch routing for this facility</p>
            </div>
          </label>
        </div>
      )}

      {role === 'admin' && (
        <div className="space-y-4">
          <FloatInput label="Organization Name" type="text" value={form.hospitalName} onChange={v => set('hospitalName', v)} />
          <FloatInput label="Admin Access Code" type="password" value={form.license} onChange={v => set('license', v)} />
        </div>
      )}
    </div>
  );

  // ── Step 3: Review & Agreements ───────────────────────────────────────────
  const renderConfirmStep = () => (
    <div className="space-y-5">
      <h2 className="text-[22px] font-extrabold text-slate dark:text-white">Review & Confirm</h2>

      {/* Summary card */}
      <div className="bg-white dark:bg-darksurf rounded-2xl border border-black/06 dark:border-white/06 p-5 space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-black/05 dark:border-white/05">
          <div className="w-10 h-10 rounded-xl bg-bloodred/10 flex items-center justify-center text-xl">
            {role === 'donor' ? '🩸' : role === 'hospital' ? '🏥' : '⚡'}
          </div>
          <div>
            <p className="font-bold text-slate dark:text-white">{form.name || form.hospitalName}</p>
            <p className="text-muted text-[12px]">{role} · {form.city}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          {[
            { label: 'Email', value: form.email },
            { label: 'Phone', value: form.phone || '—' },
            role === 'donor' && { label: 'Blood Group', value: form.bloodGroup },
            role === 'donor' && { label: 'Age / Weight', value: `${form.age}y / ${form.weight}kg` },
            role === 'hospital' && { label: 'License', value: form.license },
            role === 'hospital' && { label: 'Capacity', value: `${form.capacity || '—'} units` },
          ].filter(Boolean).map(f => (
            <div key={f.label}>
              <p className="text-muted font-semibold">{f.label}</p>
              <p className="font-bold text-slate dark:text-white truncate">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-3">
        {[
          { key: 'agreeTerms', label: 'I agree to the Terms of Service and Privacy Policy', required: true },
          { key: 'agreeHealth', label: 'I confirm all health information is accurate to the best of my knowledge', required: role === 'donor' },
          { key: 'agreeNotify', label: 'I consent to receive emergency blood request notifications', required: false },
        ].filter(a => a.required !== false || true).map(a => (
          <label key={a.key} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form[a.key]}
              onChange={e => set(a.key, e.target.checked)}
              className="accent-bloodred w-4.5 h-4.5 mt-0.5 flex-shrink-0"
            />
            <span className="text-[13px] font-medium text-slate dark:text-slate-300 leading-snug">
              {a.label}
              {a.required && <span className="text-bloodred ml-1">*</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // ── Syncing Animation ─────────────────────────────────────────────────────
  const renderSyncAnimation = () => (
    <div className="text-center py-8">
      <motion.div
        className="w-20 h-20 rounded-full bg-bloodred/10 flex items-center justify-center mx-auto mb-5 text-bloodred"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
            fill="currentColor"
          />
          <path
            d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h3 className="font-extrabold text-slate dark:text-white text-xl mb-2">Syncing to Network...</h3>
      <p className="text-muted text-[14px]">Verifying credentials & joining the BloodBridge AI grid</p>
      <div className="flex gap-1.5 justify-center mt-6">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-bloodred"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case 0: return renderRoleStep();
      case 1: return renderCredentialsStep();
      case 2: return renderDetailsStep();
      case 3: return renderConfirmStep();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-slate dark:bg-darksurf2 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-bloodred/07 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-aiblue/07 blur-3xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                fill="currentColor"
              />
              <path
                d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">Blood<span className="text-bloodred-light">Bridge</span></span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-extrabold text-white text-4xl leading-tight mb-4">
              Join 50,000+<br />
              <span className="text-gradient-red">Heroes Saving Lives</span>
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Every donor registered is a potential life saved. Every hospital connected means faster emergency response.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '🤖', text: 'AI-powered matching in under 45 seconds' },
              { icon: '🔒', text: 'Medical data protected by AES-256 encryption' },
              { icon: '📱', text: 'Smart notifications — only when you\'re needed' },
              { icon: '🏅', text: 'Track your impact and earn donor badges' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <p className="text-white/60 text-[13px] font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/25 text-[11px] font-semibold">
          © 2026 BloodBridge AI · Trusted by 1,200+ hospitals
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center bg-canvas dark:bg-darkbg px-6 py-12 sm:px-10 lg:px-14 xl:px-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-md">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                  fill="currentColor"
                />
                <path
                  d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-extrabold text-slate dark:text-white">Blood<span className="text-bloodred">Bridge</span></span>
          </Link>

          <div className="mb-2 text-right">
            <span className="text-[13px] text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-bloodred font-bold hover:underline">Sign In</Link>
            </span>
          </div>

          <StepIndicator current={step} />

          <AnimatePresence mode="wait">
            {syncing ? (
              <motion.div key="sync" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {renderSyncAnimation()}
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {getStepContent()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && !syncing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl"
              >
                <FiAlertCircle className="w-4 h-4 text-bloodred flex-shrink-0" />
                <p className="text-bloodred text-[12px] font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!syncing && (
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  onClick={() => { setStep(s => s - 1); setError(''); }}
                  className="btn-secondary flex-1 justify-center py-3.5"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="btn-primary flex-1 justify-center py-3.5">
                  Continue <FiArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <><FiHeart className="w-4 h-4" /> Join BloodBridge AI</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Reusable float input ──────────────────────────────────────────────────────
const FloatInput = ({ icon: Icon, label, type = 'text', value, onChange, ...rest }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={label}
      {...rest}
      className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-white dark:bg-darksurf border border-black/08 dark:border-white/08 rounded-xl text-[14px] font-medium text-slate dark:text-white placeholder-muted focus:outline-none focus:border-bloodred focus:ring-2 focus:ring-bloodred/10 transition-all`}
    />
  </div>
);

export default Signup;
