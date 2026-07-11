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
  FiPhone, FiShield, FiLock, FiLogOut
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
    bloodGroup: user?.bloodGroup || 'O-'
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
                      
                      {/* Availability & AI Matching Status Panel */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                            <FiActivity className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-[17px] text-gray-900 dark:text-white leading-tight">Availability & Status</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {isAvailable ? 'Available for emergency match alerts.' : 'Temporarily unavailable.'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          {/* Toggle Button */}
                          <button
                            onClick={handleUpdateAvailability}
                            className={`flex-1 md:flex-none py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
                              isAvailable 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10' 
                                : 'bg-gray-600 hover:bg-gray-500 text-white'
                            }`}
                          >
                            {isAvailable ? 'Set Unavailable' : 'Set Available'}
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
                          <div className="bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 rounded-2xl p-4">
                            <span className="text-xs text-gray-400 block font-semibold mb-1">Matching Pool</span>
                            <span className="text-2xl font-black text-gray-900 dark:text-white">128 Donors</span>
                          </div>
                          <div className="bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 rounded-2xl p-4">
                            <span className="text-xs text-gray-400 block font-semibold mb-1">Your Eligibility</span>
                            <span className="text-2xl font-black text-emerald-500">Perfect Match</span>
                          </div>
                          <div className="bg-black/02 dark:bg-white/02 border border-black/05 dark:border-white/05 rounded-2xl p-4">
                            <span className="text-xs text-gray-400 block font-semibold mb-1">Avg Response</span>
                            <span className="text-2xl font-black text-gray-900 dark:text-white">&lt; 45s</span>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Requests / Nearby Requests registry */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-left">
                          <div>
                            <h3 className="font-extrabold text-[18px] text-gray-900 dark:text-white leading-tight">Nearby Emergency Alerts</h3>
                            <p className="text-xs text-gray-400">Match notifications based on your blood type ({profileForm.bloodGroup})</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 font-extrabold text-[11px]">
                            {eligibleRequests.length} ALERTS
                          </span>
                        </div>

                        {eligibleRequests.length === 0 ? (
                          <div className="glass-card rounded-3xl p-10 border border-black/05 dark:border-white/05 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-3">🎉</span>
                            <h4 className="font-bold text-gray-900 dark:text-white">No active match requests</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">All emergency cases in your area have been fulfilled.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eligibleRequests.map((req) => (
                              <motion.div
                                layout
                                key={req.id}
                                className="glass-card rounded-3xl p-5 border border-black/05 dark:border-white/05 text-left flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase">
                                      {req.urgency}
                                    </span>
                                    <span className="text-[11px] text-gray-400 font-bold">{req.time}</span>
                                  </div>
                                  <h4 className="font-bold text-gray-900 dark:text-white text-[15px]">{req.hospitalName}</h4>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><FiUser /> Patient: {req.patientName}</span>
                                    <span className="flex items-center gap-1"><FiMapPin /> {req.city}</span>
                                    <span className="flex items-center gap-1 font-bold text-red-500"><FiDroplet /> Required: {req.bloodGroup}</span>
                                    <span className="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200"><FiActivity /> Units: {req.units}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleDeclineRequest(req.id)}
                                    className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptRequest(req.id, req)}
                                    className="flex-1 md:flex-none py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10"
                                  >
                                    <FiCheck /> Accept
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column: Mini Profile, Donor Badges / Rewards */}
                    <div className="lg:col-span-4 space-y-6 text-left">
                      
                      {/* Donor Verification & Mini Profile */}
                      <div className="glass-card rounded-3xl p-6 border border-black/05 dark:border-white/05 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase flex items-center gap-1">
                            <FiShield /> Verified Donor
                          </span>
                          <span className="text-[10px] text-emerald-500 font-bold">ELIGIBLE</span>
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

                        <div className="grid grid-cols-2 gap-3.5 border-t border-black/05 dark:border-white/05 pt-4">
                          <div className="bg-black/01 dark:bg-white/01 p-3 rounded-2xl border border-black/02 dark:border-white/02">
                            <span className="text-[10px] text-gray-400 font-bold block mb-0.5">BLOOD GROUP</span>
                            <span className="text-lg font-black text-red-500">{profileForm.bloodGroup}</span>
                          </div>
                          <div className="bg-black/01 dark:bg-white/01 p-3 rounded-2xl border border-black/02 dark:border-white/02">
                            <span className="text-[10px] text-gray-400 font-bold block mb-0.5">AGE</span>
                            <span className="text-lg font-black text-gray-900 dark:text-white">{profileForm.age} yrs</span>
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

                    </div>
                  </div>
                )}

                {/* 2. Profile & Health Tab */}
                {activeTab === 'profile' && (
                  <div className="max-w-3xl mx-auto space-y-8 text-left">
                    <div className="glass-card rounded-3xl p-6 md:p-8 border border-black/05 dark:border-white/05 space-y-6">
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
