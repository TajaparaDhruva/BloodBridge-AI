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

const STEP_ICONS = [
  (props) => <FiUser {...props} />,
  (props) => <FiUser {...props} />,
  (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 13h6" /></svg>,
  (props) => <FiCheck {...props} />
];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-between gap-1 mb-8 font-poppins relative">
    {/* Dashed line background */}
    <div className="absolute top-4.5 left-8 right-8 h-[1px] border-t border-dashed border-gray-200 dark:border-white/10 z-0" />
    
    {STEPS.map((step, i) => {
      const done = i < current;
      const active = i === current;
      const Icon = STEP_ICONS[i];
      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center relative z-10 bg-white dark:bg-[#0F1420] px-3.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                done || active
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white dark:bg-[#0F1420] border-gray-200 dark:border-white/10 text-gray-400'
              }`}
            >
              <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <p className={`text-[11.5px] font-bold mt-2 ${active || done ? 'text-red-600 dark:text-red-500 font-extrabold' : 'text-gray-400 font-medium'}`}>{step}</p>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

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
      await register(payload);
      setLoading(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setSyncing(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // ── Step 0: Role Selection ────────────────────────────────────────────────
  const RoleStep = () => {
    const roles = [
      {
        id: 'hospital',
        title: 'Hospital / Blood Bank',
        desc: 'I want to request blood and manage inventory.',
        icon: (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 flex-shrink-0">
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="4" y="9" width="16" height="11" rx="2" ry="2" />
              <path d="M9 22V9M15 22V9M9 5h6M12 2v3M12 13h2M12 16h2" />
            </svg>
          </div>
        )
      },
      {
        id: 'donor',
        title: 'Blood Donor',
        desc: 'I want to donate blood and save lives.',
        icon: (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-red-600 flex-shrink-0">
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
            </svg>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-4 font-poppins">
        <div className="space-y-1 mb-6">
          <h2 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Who are you?</h2>
          <p className="text-muted dark:text-slate-400 text-[13.5px]">Select your role to personalize your BloodBridge experience.</p>
        </div>

        {roles.map(r => {
          const isSelected = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                isSelected
                  ? 'border-red-500 bg-rose-50/10 dark:bg-rose-950/05 shadow-[0_4px_20px_rgba(225,29,72,0.02)]'
                  : 'border-gray-100 dark:border-white/05 bg-white dark:bg-[#0F1420] hover:border-gray-200 dark:hover:border-white/10'
              }`}
            >
              {r.icon}
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white text-[15px]">{r.title}</p>
                <p className="text-muted dark:text-slate-400 text-[13px] mt-0.5 leading-snug">{r.desc}</p>
              </div>
              <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? 'bg-red-600 border-transparent text-white' : 'border-gray-300 dark:border-white/10'
              }`}>
                {isSelected && <FiCheck className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // ── Step 1: Basic Credentials ─────────────────────────────────────────────
  const CredentialsStep = () => (
    <div className="space-y-4 font-poppins">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight">Create Your Account</h2>
        <p className="text-muted dark:text-slate-400 text-[14px]">Set up your secure login credentials.</p>
      </div>

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
            className="w-full pl-11 pr-12 py-4 bg-white dark:bg-[#0F1420] border border-black/08 dark:border-white/08 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted cursor-pointer">
            {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>

        <div>
          <label className="text-[12px] font-black text-muted uppercase tracking-wider mb-2 block">City</label>
          <select value={form.city} onChange={e => set('city', e.target.value)}
            className="w-full py-4 px-4 bg-white dark:bg-[#0F1420] border border-black/08 dark:border-white/08 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all">
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  // ── Step 2: Role-specific Details ─────────────────────────────────────────
  const DetailsStep = () => (
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
  const ConfirmStep = () => (
    <div className="space-y-5 font-poppins">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight">Review & Confirm</h2>
        <p className="text-muted dark:text-slate-400 text-[14px]">Ensure all operational credentials are correct.</p>
      </div>

      {/* Summary card */}
      <div className="bg-white/80 dark:bg-[#0F1420]/80 border border-black/06 dark:border-white/06 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3.5 pb-4 border-b border-black/05 dark:border-white/05">
          <div className="w-11 h-11 rounded-xl bg-[#E11D48]/10 flex items-center justify-center text-xl shadow-inner">
            {role === 'donor' ? '🩸' : role === 'hospital' ? '🏥' : '⚡'}
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white text-[15px]">{form.name || form.hospitalName}</p>
            <p className="text-muted dark:text-slate-400 text-[12px] font-bold uppercase tracking-wider">{role} · {form.city}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[13px] font-sans">
          {[
            { label: 'Email Address', value: form.email },
            { label: 'Phone Number', value: form.phone || '—' },
            role === 'donor' && { label: 'Blood Group', value: form.bloodGroup },
            role === 'donor' && { label: 'Age / Weight', value: `${form.age} yrs / ${form.weight} kg` },
            role === 'hospital' && { label: 'License Code', value: form.license },
            role === 'hospital' && { label: 'Bank Capacity', value: `${form.capacity || '—'} units` },
          ].filter(Boolean).map(f => (
            <div key={f.label} className="space-y-0.5">
              <p className="text-muted dark:text-slate-500 font-semibold text-[11px] uppercase tracking-wider">{f.label}</p>
              <p className="font-bold text-slate-800 dark:text-white truncate">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-3.5 pt-2">
        {[
          { key: 'agreeTerms', label: 'I agree to the Terms of Service and Privacy Policy', required: true },
          { key: 'agreeHealth', label: 'I confirm all health information is accurate to the best of my knowledge', required: role === 'donor' },
          { key: 'agreeNotify', label: 'I consent to receive emergency blood request notifications', required: false },
        ].filter(a => a.required !== false || true).map(a => (
          <label key={a.key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form[a.key]}
              onChange={e => set(a.key, e.target.checked)}
              className="accent-[#E11D48] w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer"
            />
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {a.label}
              {a.required && <span className="text-[#E11D48] ml-1">*</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // ── Syncing Animation ─────────────────────────────────────────────────────
  const SyncAnimation = () => (
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

  const steps = [RoleStep, CredentialsStep, DetailsStep, ConfirmStep];

  return (
    <div className="h-screen lg:overflow-hidden grid lg:grid-cols-2 bg-[#FAF9F6] dark:bg-[#070B13] relative font-sans">
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#0F1420]/95 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 hover:border-red-600/30 transition-all duration-200 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>
      
      {/* Left Brand Panel (Studio Background with Flowers and Blood Drop) */}
      <div 
        style={{ 
          backgroundImage: "url('/bloodbridge_bg_studio.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center right" 
        }}
        className="hidden lg:flex flex-col justify-between p-8 relative border-r border-gray-100 dark:border-white/05 h-full overflow-hidden"
      >
        
        {/* Soft dark-gradient overlay on the text area to improve readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent pointer-events-none" />

        {/* Logo and Subtitle */}
        <div className="relative z-10 font-poppins flex items-center gap-3">
          {/* Logo heart drop outline */}
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#E11D48] flex-shrink-0">
            <svg className="w-5.5 h-5.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-[16px] tracking-tight">BloodBridge <span className="text-red-500">AI</span></span>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Smarter Connections. Stronger Lives.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6 my-auto font-poppins max-w-md">
          
          {/* Header Typography */}
          <div className="space-y-3">
            <h1 className="font-black text-slate-900 text-[34px] leading-[1.1] tracking-tight">
              Real Connections.<br />
              <span className="text-[#E11D48]">Real Impact.</span>
            </h1>
            <p className="text-slate-600 text-[14px] leading-relaxed max-w-sm font-sans font-semibold">
              BloodBridge AI connects the right donors with the right hospitals at the right time.
            </p>
          </div>

          {/* Metric Badges Card (Single Horizontal Container) */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 p-3 rounded-2xl shadow-sm flex items-center justify-between gap-1 max-w-lg">
            {/* Stat 1 */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                <span className="text-red-500 text-[12px]">👥</span>
                <span>50,000+</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-wide">Active Donors</p>
            </div>
            <div className="h-5 w-[1px] bg-gray-100" />

            {/* Stat 2 */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                <span className="text-purple-500 text-[12px]">🏥</span>
                <span>1,200+</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-wide">Hospitals</p>
            </div>
            <div className="h-5 w-[1px] bg-gray-100" />

            {/* Stat 3 */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                <span className="text-cyan-500 text-[12px]">🛡️</span>
                <span>98%</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-wide">Match Accuracy</p>
            </div>
            <div className="h-5 w-[1px] bg-gray-100" />

            {/* Stat 4 */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[13px] font-black text-slate-800">
                <span className="text-amber-500 text-[12px]">⚡</span>
                <span>45s</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-wide">Avg. Time</p>
            </div>
          </div>

          {/* Interactive Bullet Lists */}
          <div className="space-y-2.5 pt-0.5 font-sans">
            {[
              { text: 'AI matching in under 45 seconds', icon: '🧠', color: 'bg-rose-50 text-rose-500' },
              { text: 'AES-256 encrypted & secure', icon: '🛡️', color: 'bg-blue-50 text-blue-500' },
              { text: 'Real-time alerts & smart notifications', icon: '🔔', color: 'bg-emerald-50 text-emerald-500' },
              { text: 'Track impact & earn donor badges', icon: '📈', color: 'bg-purple-50 text-purple-500' }
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${bullet.color} flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>
                  {bullet.icon}
                </div>
                <p className="text-[13px] font-semibold text-slate-700">{bullet.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 space-y-0.5 font-poppins">
          <div className="flex items-center gap-1 text-slate-500 text-[11.5px] font-bold">
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 11l3 3 5-5" />
            </svg>
            <span>Trusted by 1,200+ hospitals across India</span>
          </div>
          <div className="text-slate-400 text-[10px] font-medium leading-tight">
            © 2026 BloodBridge AI. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="flex flex-col justify-center px-6 py-6 lg:px-12 xl:px-14 h-full overflow-y-auto relative z-10">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Registration Card Box */}
          <div className="bg-white dark:bg-[#0F1420] border border-gray-100 dark:border-white/05 rounded-3xl p-6 sm:p-7 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.03)]">
            
            {/* Mobile Header Logo */}
            <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8 font-poppins">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
                </svg>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white">BloodBridge <span className="text-red-500">AI</span></span>
            </Link>

            <div className="mb-4 text-right font-poppins">
              <span className="text-[13px] text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
              </span>
            </div>

            <StepIndicator current={step} />

            <AnimatePresence mode="wait">
              {syncing ? (
                <motion.div key="sync" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <SyncAnimation />
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {steps[step]()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error alerts */}
            <AnimatePresence>
              {error && !syncing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl"
                >
                  <FiAlertCircle className="w-4 h-4 text-[#E11D48] flex-shrink-0" />
                  <p className="text-[#E11D48] text-[12px] font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Actions */}
            {!syncing && (
              <div className="flex gap-4 mt-5 font-poppins">
                {step > 0 && (
                  <button
                    onClick={() => { setStep(s => s - 1); setError(''); }}
                    className="px-5 py-3.5 bg-white dark:bg-[#0F1420] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center hover:bg-black/02 dark:hover:bg-white/02 transition-all hover:-translate-y-0.5 gap-2 cursor-pointer text-[14px]"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    onClick={handleNext} 
                    className="flex-1 bg-[#E11D48] hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-[14px]"
                  >
                    <span>Continue</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="flex-1 bg-[#E11D48] hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer text-[14px]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        <FiHeart className="w-4 h-4" /> 
                        <span>Join BloodBridge AI</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Bottom Secure Banner */}
            <div className="mt-5 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/20 p-3.5 rounded-2xl flex items-start gap-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 11l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 space-y-0.5 z-10">
                <p className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200">Your data is safe with us</p>
                <p className="text-[10.5px] font-semibold text-gray-500 dark:text-slate-400 leading-relaxed">
                  We use AES-256 encryption and follow HIPAA guidelines to keep your information secure.
                </p>
              </div>
              {/* Padlock sketch graphic illustration on right */}
              <div className="absolute right-2 bottom-0 w-14 h-14 opacity-[0.06] pointer-events-none text-emerald-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable float input ──────────────────────────────────────────────────────
const FloatInput = ({ icon: Icon, label, type = 'text', value, onChange, ...rest }) => (
  <div className="relative font-poppins">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={label}
      {...rest}
      className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-white dark:bg-[#0F1420] border border-black/08 dark:border-white/08 rounded-2xl text-[14px] font-semibold text-slate-800 dark:text-white placeholder-muted focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10 transition-all`}
    />
  </div>
);

export default Signup;
