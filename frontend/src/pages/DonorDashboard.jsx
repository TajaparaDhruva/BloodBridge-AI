import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import FloatingNav from '../components/FloatingNav';
import CommandPalette from '../components/CommandPalette';
import AIAssistant from '../components/AIAssistant';
import NotificationCenter from '../components/NotificationCenter';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { StatusBadge, ProgressRing, WidgetShell } from '../components/dashboard/shared';
import { 
  FiHeart, FiActivity, FiUser, FiCalendar, FiMapPin, 
  FiDroplet, FiAward, FiClock, FiSettings, FiHelpCircle, 
  FiBell, FiInfo, FiCheck, FiZap, FiChevronRight, FiAlertTriangle,
  FiPhone, FiShield, FiLock, FiLogOut, FiArrowLeft, FiArrowRight, FiUsers, FiTarget, FiHeadphones
} from 'react-icons/fi';

const DonorDashboard = () => {
  const { user, logout, requests, notifications, setNotifications } = useAuth();
  const { userLocation } = useLocation();

  const [activeTab, setActiveTab] = useState('overview');
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Rahul Kumar',
    email: user?.email || 'rahul@donor.com',
    phone: user?.phone || '+91 98765 43210',
    city: user?.city || 'Ahmedabad',
    weight: user?.weight || '74',
    age: user?.age || '29',
    bloodGroup: user?.bloodGroup || 'O-',
    gender: 'Male',
    medicalHistory: 'No major illnesses. No recent surgeries.',
    lastDonationDate: '2026-03-15',
    pincode: '380015'
  });

  const unread = notifications?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((p) => !p);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setShowAIAssistant((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleUpdateAvailability = () => {
    setIsAvailable(!isAvailable);
    
    // Add custom notification
    const newNotif = {
      id: Date.now(),
      title: 'Availability Status Updated',
      message: `You are now marked as ${!isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'} for emergency requests.`,
      type: !isAvailable ? 'success' : 'info',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAcceptRequest = (reqId, reqDetails) => {
    setAcceptedRequests(prev => [...prev, reqId]);
    
    // Add notification
    const newNotif = {
      id: Date.now(),
      title: 'Donation Request Accepted',
      message: `You have accepted to donate blood for ${reqDetails.patientName} at ${reqDetails.hospitalName}. Please proceed to hospital.`,
      type: 'success',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeclineRequest = (reqId) => {
    setDeclinedRequests(prev => [...prev, reqId]);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    
    const newNotif = {
      id: Date.now(),
      title: 'Profile Updated',
      message: 'Your personal and health information has been updated successfully.',
      type: 'success',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mock schedule and history data
  const upcomingSchedule = [
    { id: 'SCH-1', hospital: 'Civil Hospital, Asarwa', date: '2026-07-20', time: '10:00 AM', type: 'Voluntary Donation Camp' }
  ];

  const donationHistory = [
    { id: 'HIS-1', date: '2026-03-15', hospital: 'SVP Hospital', units: '1 Unit', type: 'Whole Blood', status: 'Completed' },
    { id: 'HIS-2', date: '2025-11-10', hospital: 'Zydus Hospitals', units: '1 Unit', type: 'Whole Blood', status: 'Completed' }
  ];

  // Helper matching blood types for emergency feed
  const eligibleRequests = requests.filter(req => {
    // Only match corresponding blood group (simple logic: O- can donate to anyone, but let's filter requests that need donor's bloodGroup or requests that match)
    if (declinedRequests.includes(req.id) || acceptedRequests.includes(req.id)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FCFBFA] dark:bg-[#070B13] custom-bg-grid transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Custom Header for Donor Dashboard to match exact DashboardHeader layout but donor tabs */}
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={{ ...user, name: profileForm.name }}
          userLocation={userLocation}
          unread={unread}
          onOpenSearch={() => setShowCommandPalette(true)}
          onNewRequest={() => {}} // Disabled for donors
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenAI={() => setShowAIAssistant((p) => !p)}
          onLogout={logout}
          isDonor={true}
        />

        <main className="flex-1 p-6 md:p-10 pt-24 md:pt-28 overflow-auto dashboard-main pb-24 lg:pb-10 relative">
          <div className="h-full max-w-[1440px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* Left Column: Real-time Status, AI Match, Availability Toggle, Badges */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Availability & Status Panel */}
                      <div className="glass-card rounded-3xl p-6 border border-slate-100/40 dark:border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all ${
                            isAvailable 
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/10 text-emerald-500' 
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-400'
                          }`}>
                            <FiActivity className="w-7 h-7 stroke-[2.5]" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-[17px] text-gray-900 dark:text-white leading-tight">Availability & Status</h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {isAvailable ? 'Available for emergency match alerts.' : 'Temporarily unavailable.'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          {/* Toggle Status Dropdown Button */}
                          <button
                            onClick={handleUpdateAvailability}
                            className={`flex-1 md:flex-none flex items-center justify-between md:justify-center gap-2.5 px-4.5 py-2.5 rounded-full border font-extrabold text-[12px] uppercase tracking-wider cursor-pointer transition-all shadow-sm ${
                              isAvailable
                                ? 'border-emerald-500/30 bg-emerald-50/15 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/05'
                                : 'border-gray-300 dark:border-gray-800 bg-gray-50/10 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                            <span>You Are {isAvailable ? 'Available' : 'Unavailable'}</span>
                            <svg className="w-4 h-4 text-slate-450 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* AI Matching Realtime Visualizer */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/05 rounded-full blur-3xl" />
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[11px] font-black text-red-500 tracking-wider uppercase">AI Matching Engine Live</span>
                        </div>
                        <h4 className="text-[20px] font-black text-gray-900 dark:text-white leading-tight">Real-Time Matching Queue</h4>
                        <p className="text-sm text-gray-400 mt-1.5 mb-6">Scanning hospitals within 15km of Ahmedabad for O- critical demand.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 rounded-2xl p-4.5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center border border-rose-100/10 shrink-0">
                              <FiUsers className="w-5.5 h-5.5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Matching Pool</span>
                              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">128 Donors</span>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 rounded-2xl p-4.5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center border border-emerald-100/10 shrink-0">
                              <FiTarget className="w-5.5 h-5.5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Your Eligibility</span>
                              <span className="text-lg font-black text-emerald-500 leading-none">Perfect Match</span>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 rounded-2xl p-4.5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-100/10 shrink-0">
                              <FiZap className="w-5.5 h-5.5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Avg Response</span>
                              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">&lt; 45s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Requests / Nearby Requests registry */}
                      <div className="space-y-4 font-poppins">
                        <div className="flex items-center justify-between text-left">
                          <div>
                            <h3 className="font-extrabold text-[18px] text-gray-900 dark:text-white leading-tight">Nearby Emergency Alerts</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Match notifications based on your blood type ({profileForm.bloodGroup})</p>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] font-black text-[11px] tracking-wider border border-rose-100/10">
                            {eligibleRequests.length} ALERTS
                          </span>
                        </div>

                        {eligibleRequests.length === 0 ? (
                          <div className="glass-card rounded-3xl p-10 border border-slate-100/40 dark:border-slate-850 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-3">🎉</span>
                            <h4 className="font-bold text-gray-900 dark:text-white">No active match requests</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">All emergency cases in your area have been fulfilled.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eligibleRequests.slice(0, 4).map((req, idx) => {
                              const urgencyUpper = req.urgency?.toUpperCase();
                              // Custom Icon Badge for hospital based on urgency
                              const badgeBgColor = urgencyUpper === 'URGENT' 
                                ? 'bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] border-rose-100/10' 
                                : urgencyUpper === 'EMERGENCY'
                                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border-amber-100/10'
                                : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500 border-blue-100/10';

                              const badgeIcon = urgencyUpper === 'URGENT'
                                ? (req.hospitalName.includes('Heart') || req.hospitalName.includes('Jude') ? <FiHeart className="w-6.5 h-6.5 fill-current" /> : <FiDroplet className="w-6.5 h-6.5 fill-current" />)
                                : urgencyUpper === 'EMERGENCY'
                                ? (
                                  <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="4" y="9" width="16" height="11" rx="2" ry="2" />
                                    <path d="M9 22V9M15 22V9M9 5h6M12 2v3M12 13h2M12 16h2" />
                                  </svg>
                                )
                                : (
                                  <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M3 21h18M3 7V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4M4 7h16M4 21V7M20 21V7M9 11h2M9 15h2M13 11h2M13 15h2" />
                                  </svg>
                                );

                              return (
                                <motion.div
                                  layout
                                  key={req.id}
                                  className="bg-white dark:bg-[#0F1420] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/35 dark:border-slate-850 rounded-3xl p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
                                >
                                  <div className="flex items-start gap-4">
                                    {/* Left Custom Badge */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 shadow-sm ${badgeBgColor}`}>
                                      {badgeIcon}
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                                          urgencyUpper === 'URGENT' ? 'bg-[#E11D48]' : urgencyUpper === 'EMERGENCY' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`}>
                                          {req.urgency}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-bold">{req.time}</span>
                                      </div>
                                      <h4 className="font-extrabold text-slate-800 dark:text-white text-[15px] leading-tight">{req.hospitalName}</h4>
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-450">
                                        <span className="flex items-center gap-1"><FiUser className="w-3.5 h-3.5"/> Patient: {req.patientName}</span>
                                        <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5"/> {req.city}</span>
                                        <span className="flex items-center gap-0.5 font-bold text-[#E11D48]">🩸 Required: {req.bloodGroup}</span>
                                        <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-350"><FiActivity className="w-3.5 h-3.5"/> Units: {req.units}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2.5 mt-2 md:mt-0 ml-auto md:ml-0">
                                    <button
                                      onClick={() => handleDeclineRequest(req.id)}
                                      className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-355 bg-white dark:bg-slate-950 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                                    >
                                      Decline
                                    </button>
                                    <button
                                      onClick={() => handleAcceptRequest(req.id, req)}
                                      className="py-2 px-5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/10"
                                    >
                                      <FiCheck className="w-3.5 h-3.5 stroke-[3px]"/> Accept
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })}
                            {eligibleRequests.length > 4 && (
                              <div className="flex justify-center mt-4">
                                <button 
                                  onClick={() => setActiveTab('alerts')}
                                  className="py-3 px-6 rounded-2xl border border-rose-100 text-[#E11D48] hover:bg-rose-50/50 bg-white dark:bg-[#0F1420] dark:border-rose-950/20 text-[12px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                >
                                  VIEW ALL ALERTS <FiArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column: Mini Profile, Donor Badges / Rewards */}
                    <div className="lg:col-span-4 space-y-6 text-left">
                      
                      {/* Donor Verification & Mini Profile */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white">Your Profile</h4>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                              <FiShield className="w-3 h-3"/> VERIFIED DONOR
                            </span>
                            <span className="text-[10px] text-emerald-500 font-bold">ELIGIBLE</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 text-white font-bold text-xl flex items-center justify-center">
                            {profileForm.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white leading-tight">{profileForm.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{profileForm.email}</p>
                            <p className="text-xs text-gray-400">{profileForm.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5 pt-2 font-poppins">
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Blood Group</span>
                            <span className="text-[22px] font-black text-[#E11D48] leading-none block mt-1">{profileForm.bloodGroup}</span>
                          </div>
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Age</span>
                            <span className="text-[22px] font-black text-slate-855 dark:text-slate-100 leading-none block mt-1">{profileForm.age} yrs</span>
                          </div>
                        </div>
                      </div>

                      {/* Gamification / Rewards & Badges Section */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white">Your Achievements</h4>
                          <FiAward className="w-5 h-5 text-amber-500" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-500/05 border border-amber-500/10">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 font-bold text-lg">🥇</div>
                            <div>
                              <h5 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-tight">Bronze LifeSaver</h5>
                              <p className="text-[11px] text-gray-400 mt-0.5">Completed 2 donations successfully.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-rose-500/05 border border-rose-500/10">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0 font-bold text-lg">🩸</div>
                            <div>
                              <h5 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-tight">Universal Hero</h5>
                              <p className="text-[11px] text-gray-400 mt-0.5">You hold the rare O- negative blood.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Overview */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 space-y-4">
                        <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white">Quick Overview</h4>
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center border border-rose-100/10 shrink-0">
                              <FiCalendar className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-lg font-black text-slate-800 dark:text-white leading-none block">16</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Total Requests</span>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center border border-amber-100/10 shrink-0">
                              <FiBell className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-lg font-black text-slate-800 dark:text-white leading-none block">7</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Urgent</span>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center border border-blue-100/10 shrink-0">
                              <FiActivity className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-lg font-black text-slate-800 dark:text-white leading-none block">8</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Normal</span>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#0F1420] shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-slate-100/50 dark:border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center border border-blue-100/10 shrink-0">
                              <FiInfo className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-lg font-black text-slate-800 dark:text-white leading-none block">1</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Information</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Need Help */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 flex flex-col items-start gap-4">
                        <div className="flex gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
                             <FiHelpCircle className="w-5 h-5" />
                           </div>
                           <div>
                             <h4 className="font-extrabold text-[14px] text-gray-900 dark:text-white">Need Help?</h4>
                             <p className="text-[11px] text-gray-400 mt-0.5">Our team is available 24/7 to assist you.</p>
                           </div>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] tracking-wider transition-colors flex items-center justify-center gap-2">
                          <FiHeadphones className="w-4 h-4" /> CONTACT SUPPORT
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* 1.5 Alerts Tab */}
                {activeTab === 'alerts' && (
                  <div className="max-w-4xl mx-auto space-y-6 text-left pb-10">
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-black/05 dark:border-white/05 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-[22px] text-gray-900 dark:text-white leading-tight">Emergency Alerts</h2>
                        <p className="text-xs text-gray-400 mt-1">All nearby match requests based on your blood group.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {eligibleRequests.length === 0 ? (
                         <div className="glass-card rounded-3xl p-10 border border-black/05 dark:border-white/05 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-3">🎉</span>
                            <h4 className="font-bold text-gray-900 dark:text-white">No active match requests</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">All emergency cases in your area have been fulfilled.</p>
                          </div>
                      ) : eligibleRequests.map((req) => {
                        const urgencyUpper = req.urgency?.toUpperCase();
                        const badgeBgColor = urgencyUpper === 'URGENT' 
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] border-rose-100/10' 
                          : urgencyUpper === 'EMERGENCY'
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border-amber-100/10'
                          : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500 border-blue-100/10';

                        const badgeIcon = urgencyUpper === 'URGENT'
                          ? (req.hospitalName.includes('Heart') || req.hospitalName.includes('Jude') ? <FiHeart className="w-6.5 h-6.5 fill-current" /> : <FiDroplet className="w-6.5 h-6.5 fill-current" />)
                          : urgencyUpper === 'EMERGENCY'
                          ? (
                            <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="4" y="9" width="16" height="11" rx="2" ry="2" />
                              <path d="M9 22V9M15 22V9M9 5h6M12 2v3M12 13h2M12 16h2" />
                            </svg>
                          )
                          : (
                            <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M3 21h18M3 7V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4M4 7h16M4 21V7M20 21V7M9 11h2M9 15h2M13 11h2M13 15h2" />
                            </svg>
                          );

                        return (
                          <motion.div
                            layout
                            key={req.id}
                            className="bg-white dark:bg-[#0F1420] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/35 dark:border-slate-850 rounded-3xl p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden font-poppins"
                          >
                            <div className="flex items-start gap-4">
                              {/* Left Custom Badge */}
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 shadow-sm ${badgeBgColor}`}>
                                {badgeIcon}
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                                    urgencyUpper === 'URGENT' ? 'bg-[#E11D48]' : urgencyUpper === 'EMERGENCY' ? 'bg-amber-500' : 'bg-blue-500'
                                  }`}>
                                    {req.urgency}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-bold">{req.time}</span>
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-[15px] leading-tight">{req.hospitalName}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-450">
                                  <span className="flex items-center gap-1"><FiUser className="w-3.5 h-3.5"/> Patient: {req.patientName}</span>
                                  <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5"/> {req.city}</span>
                                  <span className="flex items-center gap-0.5 font-bold text-[#E11D48]">🩸 Required: {req.bloodGroup}</span>
                                  <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-355"><FiActivity className="w-3.5 h-3.5"/> Units: {req.units}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5 mt-2 md:mt-0 ml-auto md:ml-0">
                              <button
                                onClick={() => handleDeclineRequest(req.id)}
                                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-950 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptRequest(req.id, req)}
                                className="py-2 px-5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/10"
                              >
                                <FiCheck className="w-3.5 h-3.5 stroke-[3px]"/> Accept
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Profile & Health Tab */}
                {activeTab === 'profile' && (
                  <div className="max-w-3xl mx-auto space-y-8 text-left">
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-black/05 dark:border-white/05 space-y-6">
                      
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="mb-2 flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-[13px] font-bold uppercase tracking-wider"
                      >
                        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                      </button>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-[20px] text-gray-900 dark:text-white leading-tight">Personal & Medical Profile</h3>
                          <p className="text-sm text-gray-400">Keep your health info updated for active AI matching.</p>
                        </div>
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="py-2 px-4 rounded-xl border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-xs uppercase tracking-wider hover:bg-black/05 dark:hover:bg-white/05 transition-colors cursor-pointer"
                        >
                          {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                        </button>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</label>
                            <input
                              type="text"
                              disabled={!isEditingProfile}
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</label>
                            <input
                              type="email"
                              disabled={!isEditingProfile}
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Mobile Number</label>
                            <input
                              type="text"
                              disabled={!isEditingProfile}
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">City</label>
                            <input
                              type="text"
                              disabled={!isEditingProfile}
                              value={profileForm.city}
                              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Age (Years)</label>
                            <input
                              type="number"
                              disabled={!isEditingProfile}
                              value={profileForm.age}
                              onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Weight (kg)</label>
                            <input
                              type="number"
                              disabled={!isEditingProfile}
                              value={profileForm.weight}
                              onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Gender</label>
                            <select
                              disabled={!isEditingProfile}
                              value={profileForm.gender}
                              onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65 appearance-none"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Blood Group</label>
                            <select
                              disabled={!isEditingProfile}
                              value={profileForm.bloodGroup}
                              onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65 appearance-none"
                            >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Zip / Pincode</label>
                            <input
                              type="text"
                              disabled={!isEditingProfile}
                              value={profileForm.pincode}
                              onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Last Donation Date</label>
                            <input
                              type="date"
                              disabled={!isEditingProfile}
                              value={profileForm.lastDonationDate}
                              onChange={(e) => setProfileForm({ ...profileForm, lastDonationDate: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2 pt-2">
                            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Medical History / Conditions</label>
                            <textarea
                              disabled={!isEditingProfile}
                              value={profileForm.medicalHistory}
                              onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })}
                              className="w-full py-3 px-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 focus:border-red-500 focus:outline-none transition-colors text-sm text-gray-900 dark:text-white disabled:opacity-65 resize-none h-24"
                              placeholder="Any recent surgeries, medications, or chronic conditions..."
                            />
                          </div>
                        </div>

                        {isEditingProfile && (
                          <div className="pt-4 flex justify-end">
                            <button
                              type="submit"
                              className="py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-red-500/10"
                            >
                              Save Settings
                            </button>
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Eligibility details */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-black/05 dark:border-white/05 space-y-4">
                      <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white">Health & Eligibility Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/05 border border-emerald-500/10 rounded-2xl">
                          <FiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <div>
                            <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">Age & Weight Limit</h5>
                            <p className="text-[11px] text-gray-400 mt-0.5">Complies with safety standard rules.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/05 border border-emerald-500/10 rounded-2xl">
                          <FiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <div>
                            <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">Last Donation Date</h5>
                            <p className="text-[11px] text-gray-400 mt-0.5">Passed the 90-day cooling period limit.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 3. History & Schedule Tab */}
                {activeTab === 'history' && (
                  <div className="max-w-4xl mx-auto space-y-8 text-left">
                    
                    {/* Donation Schedule */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-[18px] text-gray-900 dark:text-white">Upcoming Donation Schedule</h3>
                      {upcomingSchedule.map((s) => (
                        <div key={s.id} className="glass-card rounded-3xl p-5 border border-black/05 dark:border-white/05 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center flex-shrink-0">
                              <FiCalendar className="w-5.5 h-5.5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-[15px]">{s.hospital}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{s.type}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><FiClock /> {s.date} @ {s.time}</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 font-extrabold uppercase text-[10px]">SCHEDULED</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Donation History */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-[18px] text-gray-900 dark:text-white">Donation Logs</h3>
                      <div className="space-y-3">
                        {donationHistory.map((h) => (
                          <div key={h.id} className="glass-card rounded-3xl p-5 border border-black/05 dark:border-white/05 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                <FiDroplet className="w-5.5 h-5.5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-[15px]">{h.hospital}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{h.type} · {h.units}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-gray-400">{h.date}</span>
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-extrabold uppercase text-[10px]">{h.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. Settings & Help Tab */}
                {activeTab === 'settings' && (
                  <div className="max-w-3xl mx-auto space-y-8 text-left">
                    
                    {/* General Settings */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-black/05 dark:border-white/05 space-y-6">
                      <h3 className="font-extrabold text-[20px] text-gray-900 dark:text-white">Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/01 dark:bg-white/01">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Push Notifications</h4>
                            <p className="text-xs text-gray-400">Receive match alerts directly on your device.</p>
                          </div>
                          <div className="w-10 h-6 bg-red-600 rounded-full p-1 cursor-pointer flex items-center justify-end">
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/01 dark:bg-white/01">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Location Services</h4>
                            <p className="text-xs text-gray-400">Allows AI match to locate closest hospitals.</p>
                          </div>
                          <div className="w-10 h-6 bg-red-600 rounded-full p-1 cursor-pointer flex items-center justify-end">
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Help & Support */}
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-black/05 dark:border-white/05 space-y-4">
                      <h3 className="font-extrabold text-[18px] text-gray-900 dark:text-white flex items-center gap-2"><FiHelpCircle className="text-red-500" /> Help & Support</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Having issues with booking donation appointments, mismatch coordinates, or badges updates? Get in touch with our Support Desk.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05">
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white">Emergency Support</h5>
                          <p className="text-xs text-gray-400 mt-1">support@bloodbridge.ai</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05">
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white font-sans">Helpline</h5>
                          <p className="text-xs text-gray-400 mt-1">+91 1800 1200 3400</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} isDonor={true} />
        
        {/* Global Components */}
        <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
        <AIAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
        <NotificationCenter 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
          notifications={notifications}
          setNotifications={setNotifications}
        />

      </div>
    </div>
  );
};

export default DonorDashboard;
