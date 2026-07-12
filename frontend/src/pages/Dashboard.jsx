import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import FloatingNav from '../components/FloatingNav';
import CommandPalette from '../components/CommandPalette';
import AIAssistant from '../components/AIAssistant';
import EmergencyFAB from '../components/EmergencyFAB';
import NotificationCenter from '../components/NotificationCenter';
import NearbyHospitals from './NearbyHospitals';
import NearbyDonors from './NearbyDonors';
import EmergencyMap from './EmergencyMap';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import OverviewTab from '../components/dashboard/OverviewTab';
import RequestModal from '../components/dashboard/RequestModal';
import HospitalSelectorModal from '../components/dashboard/HospitalSelectorModal';
import VoiceCallModal from '../components/dashboard/VoiceCallModal';
import BillingPage from './BillingPage';
import AdminPanel from './AdminPanel';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { StatusBadge, ProgressRing, WidgetShell, upcomingTasks } from '../components/dashboard/shared';
import { FiPlus, FiAlertTriangle, FiTrendingUp, FiCheck, FiZap, FiUsers, FiCalendar, FiActivity, FiBell, FiInfo, FiArrowRight, FiChevronRight, FiMapPin, FiDroplet, FiClipboard, FiClock, FiLock, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import TasksPage from './TasksPage';
import NotificationsPage from './NotificationsPage';

import { useLocation as useRouterLocation } from 'react-router-dom';

const Dashboard = () => {
  const {
    user, logout, requests, donors, inventory, notifications, createRequest, setNotifications,
    subscription, isTrialExpired, daysRemaining, upgradePlan, simulateTrialExpiry
  } = useAuth();
  const { userLocation } = useLocation();
  const routerLocation = useRouterLocation();

  const [activeTab, setActiveTab] = useState(routerLocation.state?.activeTab || 'overview');

  useEffect(() => {
    if (routerLocation.state?.activeTab) {
      setActiveTab(routerLocation.state.activeTab);
    }
  }, [routerLocation.state?.activeTab]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Hospital Profile Form State
  const [profileForm, setProfileForm] = useState({
    hospitalName: user?.hospitalName || user?.name || 'Lilavati Hospital',
    email: user?.email || 'admin@lilavati.com',
    phone: user?.phone || '+91 9876543210',
    city: user?.city || 'Mumbai, Maharashtra',
    address: 'A-791, Bandra Reclamation, Bandra West',
    pincode: '400050',
    registrationNumber: user?.registrationNumber || 'HOSP-MUM-8923471A',
    cmoName: 'Dr. Ramesh Kumar',
    beds: '350',
    bloodBank24x7: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    // Add success notification
    const newNotif = {
      id: Date.now(),
      title: 'Profile Updated',
      message: 'Hospital details and credentials have been updated successfully.',
      type: 'success',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Simulate network loading for skeleton aesthetic
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);


  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('bloodbridge_tasks');
    return saved ? JSON.parse(saved) : upcomingTasks;
  });

  useEffect(() => {
    localStorage.setItem('bloodbridge_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      priority: taskData.priority,
      due: taskData.due,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

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

  const handleNewRequest = (form) => {
    createRequest(form);
  };

  return (
    <div className="min-h-screen mesh-bg transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          userLocation={userLocation}
          unread={unread}
          onOpenSearch={() => setShowCommandPalette(true)}
          onNewRequest={() => setShowRequestModal(true)}
          onOpenNotifications={() => setActiveTab('notifications')}
          onOpenAI={() => setShowAIAssistant((p) => !p)}
          onLogout={logout}
        />

        <main className="flex-1 px-6 md:px-10 pt-24 md:pt-28 pb-24 lg:pb-12 overflow-auto dashboard-main relative">
          <div className="max-w-[1440px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full max-w-[1440px] mx-auto"
              >
                {isLoading ? (
                  <DashboardSkeleton />
                ) : (
                  <>
                    {/* Overview Bento tab */}
                    {activeTab === 'overview' && (
                      <OverviewTab
                        user={user}
                        requests={requests}
                        inventory={inventory}
                        donors={donors}
                        userLocation={userLocation}
                        onNewRequest={() => setShowRequestModal(true)}
                        onNavigate={setActiveTab}
                        onOpenAI={() => setShowAIAssistant((p) => !p)}
                        tasks={tasks}
                        onToggleTask={handleToggleTask}
                        onCallDonor={(donor) => setActiveCall({ hospitalName: donor.name, number: donor.contact })}
                      />
                    )}

                    {/* Tasks tab */}
                    {activeTab === 'tasks' && (
                      <TasksPage
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    )}

                    {/* Billing tab — hospital users only */}
                    {activeTab === 'billing' && <BillingPage />}

                    {/* Admin Panel tab — admin users only */}
                    {activeTab === 'adminPanel' && <AdminPanel />}

                    {/* Notifications tab */}
                    {activeTab === 'notifications' && <NotificationsPage goBack={() => setActiveTab('overview')} />}

                    {/* Profile tab */}
                    {activeTab === 'profile' && (
                      <div className="max-w-4xl mx-auto space-y-8 text-left">
                        <div className="bg-white dark:bg-[#0F1420] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                          
                          <button
                            onClick={() => setActiveTab('overview')}
                            className="mb-2 flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-[13px] font-bold uppercase tracking-wider"
                          >
                            <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                          </button>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-extrabold text-[20px] text-gray-900 dark:text-white leading-tight">Hospital & Admin Profile</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your registration details, facilities, and credentials.</p>
                            </div>
                            <button
                              onClick={() => setIsEditingProfile(!isEditingProfile)}
                              className="py-2 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                          </div>

                          <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* Core Details */}
                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Hospital / Admin Name</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.hospitalName}
                                  onChange={(e) => setProfileForm({ ...profileForm, hospitalName: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</label>
                                <input
                                  type="email"
                                  disabled={!isEditingProfile}
                                  value={profileForm.email}
                                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Contact Number</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.phone}
                                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Chief Medical Officer (CMO)</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.cmoName}
                                  onChange={(e) => setProfileForm({ ...profileForm, cmoName: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1 md:col-span-2">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Registration / License No.</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.registrationNumber}
                                  onChange={(e) => setProfileForm({ ...profileForm, registrationNumber: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] font-mono text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              {/* Location */}
                              <div className="space-y-1 md:col-span-2 pt-2">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Complete Address</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.address}
                                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">City & State</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.city}
                                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Zip / Pincode</label>
                                <input
                                  type="text"
                                  disabled={!isEditingProfile}
                                  value={profileForm.pincode}
                                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              {/* Facilities */}
                              <div className="space-y-1 pt-2">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Total Ward Beds</label>
                                <input
                                  type="number"
                                  disabled={!isEditingProfile}
                                  value={profileForm.beds}
                                  onChange={(e) => setProfileForm({ ...profileForm, beds: e.target.value })}
                                  className="w-full py-3 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[13px] text-gray-900 dark:text-white disabled:opacity-70 focus:border-[#E11D48] focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="space-y-1 pt-2 flex flex-col justify-center">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-2">24/7 Blood Bank Support</label>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    disabled={!isEditingProfile}
                                    onClick={() => setProfileForm({ ...profileForm, bloodBank24x7: !profileForm.bloodBank24x7 })}
                                    className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${profileForm.bloodBank24x7 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} ${!isEditingProfile && 'opacity-60 cursor-not-allowed'}`}
                                  >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${profileForm.bloodBank24x7 ? 'translate-x-6' : 'translate-x-0'}`} />
                                  </button>
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{profileForm.bloodBank24x7 ? 'Active' : 'Inactive'}</span>
                                </div>
                              </div>
                            </div>

                            {isEditingProfile && (
                              <div className="pt-4 flex justify-end">
                                <button
                                  type="submit"
                                  className="py-3.5 px-8 rounded-2xl bg-[#E11D48] hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-rose-500/20"
                                >
                                  Save Hospital Profile
                                </button>
                              </div>
                            )}
                          </form>
                        </div>

                        {/* Hospital Verification Status */}
                        <div className="bg-white dark:bg-[#0F1420] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                          <h4 className="font-extrabold text-[16px] text-gray-900 dark:text-white">Verification & API Access</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
                              <FiCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                              <div>
                                <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">Verified Government Hospital</h5>
                                <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">License {profileForm.registrationNumber} is actively verified against standard medical registries. All dispatch privileges are active.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
                              <FiZap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                              <div>
                                <h5 className="text-[13px] font-bold text-gray-900 dark:text-white">AI Endpoint Connection</h5>
                                <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Connected to BloodBridge AI routing nodes. Ping: 24ms. Smart-matching systems fully operational.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Requests registry tab */}
                    {activeTab === 'requests' && (() => {
                      const staticMockRequests = [
                        {
                          id: 'REQ-409',
                          hospitalName: 'Lilavati Hospital',
                          patientName: 'Ranveer Singh',
                          bloodGroup: 'AB+',
                          units: 1,
                          urgency: 'urgent',
                          status: 'matching',
                          city: 'Mumbai',
                          time: 'Just now',
                          matchTime: 'Calculating...',
                          donorsContacted: 10,
                          badgeText: 'NEW',
                          badgeStyle: 'bg-rose-50 text-[#E11D48] border border-rose-100/20',
                          sideBorderColor: 'bg-[#E11D48]',
                          circleStyle: 'bg-rose-50 text-[#E11D48] border border-rose-100/20',
                          reqBadgeStyle: 'bg-rose-50 text-[#E11D48] border border-rose-150/30',
                          arrowStyle: 'text-[#E11D48] border-rose-100 hover:bg-rose-50/50',
                          unitColor: 'text-[#E11D48]'
                        },
                        {
                          id: 'REQ-231',
                          hospitalName: 'Fortis Hiranandani Hospital',
                          patientName: 'Alia Bhatt',
                          bloodGroup: 'A-',
                          units: 3,
                          urgency: 'normal',
                          status: 'matching',
                          city: 'Mumbai',
                          time: '2 mins ago',
                          matchTime: 'Calculating...',
                          donorsContacted: 18,
                          badgeText: 'IN PROGRESS',
                          badgeStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/20',
                          sideBorderColor: 'bg-[#10B981]',
                          circleStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/20',
                          reqBadgeStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-150/30',
                          arrowStyle: 'text-emerald-500 border-emerald-100 hover:bg-emerald-50/50',
                          unitColor: 'text-emerald-500'
                        },
                        {
                          id: 'REQ-361',
                          hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
                          patientName: 'Preeti Zinta',
                          bloodGroup: 'AB-',
                          units: 2,
                          urgency: 'emergency',
                          status: 'matching',
                          city: 'Mumbai',
                          time: '3 mins ago',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'CRITICAL',
                          badgeStyle: 'bg-rose-50 text-[#E11D48] border border-rose-100/20',
                          sideBorderColor: 'bg-[#E11D48]',
                          circleStyle: 'bg-rose-50 text-[#E11D48] border border-rose-100/20',
                          reqBadgeStyle: 'bg-rose-50 text-[#E11D48] border border-rose-150/30',
                          arrowStyle: 'text-[#E11D48] border-rose-100 hover:bg-rose-50/50',
                          unitColor: 'text-[#E11D48]'
                        },
                        {
                          id: 'REQ-579',
                          hospitalName: 'Metro Critical Care Hospital',
                          patientName: 'Deepika Padukone',
                          bloodGroup: 'A-',
                          units: 1,
                          urgency: 'urgent',
                          status: 'matching',
                          city: 'Mumbai',
                          time: '3 mins ago',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'ATTENTION',
                          badgeStyle: 'bg-amber-50 text-amber-600 border border-amber-100/20',
                          sideBorderColor: 'bg-[#F59E0B]',
                          circleStyle: 'bg-amber-50 text-amber-600 border border-amber-100/20',
                          reqBadgeStyle: 'bg-amber-50 text-amber-600 border border-amber-150/30',
                          arrowStyle: 'text-amber-500 border-amber-100 hover:bg-amber-50/50',
                          unitColor: 'text-[#E11D48]'
                        },
                        {
                          id: 'REQ-507',
                          hospitalName: 'Apollo Speciality Center',
                          patientName: 'Rohan Joshi',
                          bloodGroup: 'A-',
                          units: 1,
                          urgency: 'normal',
                          status: 'matching',
                          city: 'Mumbai',
                          time: '4 mins ago',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'IN PROGRESS',
                          badgeStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/20',
                          sideBorderColor: 'bg-[#10B981]',
                          circleStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/20',
                          reqBadgeStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-150/30',
                          arrowStyle: 'text-emerald-500 border-emerald-100 hover:bg-emerald-50/50',
                          unitColor: 'text-emerald-500'
                        }
                      ];

                      const userAddedRequests = requests.filter(r => r.isManual);
                      const displayedRequests = [...userAddedRequests, ...staticMockRequests];

                      const totalCount = 16 + userAddedRequests.length;
                      const urgentCount = 7 + userAddedRequests.filter(r => r.urgency === 'urgent' || r.urgency === 'emergency').length;
                      const normalCount = 8 + userAddedRequests.filter(r => r.urgency === 'normal').length;
                      const infoCount = 1;

                      return (
                        <div className="space-y-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
                            <div className="text-left">
                              <h2 className="font-black text-gray-900 dark:text-white text-[20px] tracking-tight">Active Request Registry</h2>
                              <p className="text-gray-400 dark:text-gray-500 text-[13px] font-semibold uppercase mt-0.5">{totalCount} operations dispatch records</p>
                            </div>

                            {/* Header indicators row */}
                            <div className="flex flex-wrap items-center gap-3.5 my-1 lg:my-0">
                              {/* Total Requests */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                                  <FiClipboard className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{totalCount}</span>
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Total Requests</span>
                                </div>
                              </div>

                              {/* Urgent */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                                  <FiBell className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{urgentCount}</span>
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Urgent</span>
                                </div>
                              </div>

                              {/* Normal */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] flex items-center justify-center flex-shrink-0">
                                  <FiActivity className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{normalCount}</span>
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Normal</span>
                                </div>
                              </div>

                              {/* Information */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center flex-shrink-0">
                                  <FiInfo className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{infoCount}</span>
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Information</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowRequestModal(true)}
                              className="bg-[#E11D48] hover:bg-rose-600 text-white text-[13px] py-3.5 px-6 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <FiPlus className="w-4.5 h-4.5 stroke-[3]" />
                              <span>Create Emergency Request</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {displayedRequests.map((req, i) => {
                              const sideBorder = req.sideBorderColor || (req.urgency === 'normal' ? 'bg-[#10B981]' : req.urgency === 'urgent' ? 'bg-[#F59E0B]' : 'bg-[#E11D48]');
                              const typeColor = req.circleStyle || 'bg-rose-50 text-[#E11D48] border border-rose-100/20 dark:bg-rose-950/20 dark:text-rose-400';
                              const reqBadge = req.reqBadgeStyle || 'bg-rose-50 text-[#E11D48] border border-rose-150/30';
                              const arrowColor = req.arrowStyle || 'text-[#E11D48] border-rose-100 hover:bg-rose-50/50';
                              const unitColor = req.unitColor || (req.urgency === 'normal' ? 'text-emerald-500' : 'text-[#E11D48]');
                              const clockColor = req.urgency === 'normal' ? 'text-emerald-500' : req.urgency === 'urgent' ? 'text-amber-500' : 'text-[#E11D48]';

                              return (
                                <motion.div
                                  key={req.id}
                                  className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left"
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  {/* Accent left border */}
                                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${sideBorder}`} />

                                  <div className="flex items-center gap-4 flex-1 w-full">
                                    {/* Blood Group Circle */}
                                    <div className={`w-14 h-14 rounded-full flex-shrink-0 flex flex-col items-center justify-center text-[15px] font-black shadow-sm ${typeColor}`}>
                                      {req.bloodGroup}
                                      <span className="text-[10px] text-[#E11D48] mt-0.5 leading-none">🩸</span>
                                    </div>

                                    {/* Center content details */}
                                    <div className="flex-1 min-w-0 text-left">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-gray-900 dark:text-white text-[15px] leading-snug">{req.patientName}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider ${reqBadge}`}>
                                          {req.urgency}
                                        </span>
                                        <span className="bg-indigo-50/60 dark:bg-indigo-950/20 text-[#4F46E5] dark:text-indigo-400 px-2 py-0.5 rounded-md text-[8.5px] font-black border border-indigo-100/25 uppercase tracking-wider">
                                          Matching
                                        </span>
                                      </div>

                                      <p className="text-gray-400 dark:text-gray-500 text-[11.5px] font-bold mt-2 flex items-center gap-1.5 flex-wrap">
                                        <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{req.hospitalName}, {req.city}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className={`${unitColor} font-black`}>{req.units} unit{req.units > 1 ? 's' : ''} required</span>
                                      </p>

                                      {/* Two action status boxes */}
                                      <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <div className="bg-rose-50/20 dark:bg-rose-950/05 border border-rose-100/20 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                          <FiZap className="w-3.5 h-3.5 text-[#E11D48] animate-pulse" />
                                          <div>
                                            <span className="text-[9px] text-gray-400 block font-bold leading-none mb-0.5">AI Match time</span>
                                            <span className="font-extrabold text-gray-800 dark:text-gray-250">Calculating...</span>
                                          </div>
                                        </div>
                                        <div className="bg-gray-50/30 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-850 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                          <FiUsers className="w-3.5 h-3.5 text-gray-400" />
                                          <div>
                                            <span className="text-[9px] text-gray-400 block font-bold leading-none mb-0.5">Contacted</span>
                                            <span className="font-extrabold text-gray-800 dark:text-gray-250">{req.donorsContacted || 10} eligible donors</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Rightmost info capsule & Action arrow */}
                                  <div className="flex items-center gap-4.5 w-full lg:w-auto justify-between lg:justify-end border-t border-gray-100 dark:border-slate-800 lg:border-t-0 pt-4 lg:pt-0">
                                    <div className="bg-rose-50/35 dark:bg-rose-950/10 border border-[#FFE4E6]/25 rounded-2xl p-4.5 py-3 flex flex-col justify-center items-start text-left min-w-[130px] shadow-sm">
                                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                                        <FiClock className={`w-3.5 h-3.5 ${clockColor}`} />
                                        <span>{req.time}</span>
                                      </span>
                                      <span className="text-[12px] font-bold text-gray-900 dark:text-white mt-1">{req.id}</span>
                                      <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black mt-1.5 ${req.badgeStyle || 'bg-rose-50 text-[#E11D48] border border-rose-100/20'}`}>
                                        {req.badgeText || 'NEW'}
                                      </span>
                                    </div>

                                    <button className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${arrowColor}`}>
                                      <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Detailed Inventory tab */}
                    {activeTab === 'inventory' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="font-black text-slate dark:text-white text-[20px] tracking-tight">Blood Depots Inventory</h2>
                            <p className="text-muted text-[13px] font-semibold uppercase mt-0.5">Real-time depletion indicators</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {inventory.map((b, i) => {
                            const max = 60;
                            const pct = Math.min(100, Math.round((b.units / max) * 100));
                            const color = b.status === 'critical' ? '#C62A47' : b.status === 'warning' ? '#D97706' : '#059669';
                            const isCritical = b.status === 'critical';

                            return (
                              <motion.div
                                key={b.group}
                                className="dashboard-widget p-5 text-center border border-black/05 dark:border-white/05 dark:bg-darksurf relative overflow-hidden flex flex-col justify-between h-48 group cursor-default"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -3 }}
                              >
                                {/* Radial indicator */}
                                <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                  {isCritical && (
                                    <span className="absolute w-12 h-12 rounded-full bg-bloodred/10 animate-ping" />
                                  )}
                                  <ProgressRing pct={pct} color={color} size={64} stroke={4.5} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[12px] font-black" style={{ color }}>
                                      {b.group}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-black text-slate dark:text-white text-2xl leading-none">{b.units}</p>
                                  <p className="text-muted text-[11px] font-bold mt-1 uppercase tracking-wide">units available</p>
                                </div>

                                <div className="mt-2.5">
                                  <StatusBadge status={b.status} />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Warning Callouts section */}
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                          <WidgetShell className="p-5 border border-bloodred/15 bg-bloodred/03 dark:bg-bloodred/06" hover={false}>
                            <h4 className="text-bloodred font-black text-[14px] flex items-center gap-1.5 uppercase tracking-wider">
                              <FiAlertTriangle className="w-4.5 h-4.5" />
                              Critical Restock Needed
                            </h4>
                            <p className="text-[12px] text-muted leading-relaxed mt-2 font-medium">
                              Depots for <strong className="text-slate dark:text-white font-bold">O-, A-, and AB-</strong> are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.
                            </p>
                          </WidgetShell>

                          <WidgetShell className="p-5 border border-emerald/15 bg-emerald/03 dark:bg-emerald/06" hover={false}>
                            <h4 className="text-emerald font-black text-[14px] flex items-center gap-1.5 uppercase tracking-wider">
                              <FiCheck className="w-4.5 h-4.5 border-2 border-emerald rounded-full" />
                              Inventory Stability Optimal
                            </h4>
                            <p className="text-[12px] text-muted leading-relaxed mt-2 font-medium">
                              Positive groups (<strong className="text-slate dark:text-white font-bold">O+, A+, B+</strong>) remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.
                            </p>
                          </WidgetShell>
                        </div>
                      </div>
                    )}

                    {activeTab === 'hospitals' && (
                      <NearbyHospitals
                        onCall={(hospital) => setActiveCall({ hospitalName: hospital.name, number: hospital.contact })}
                      />
                    )}
                    {activeTab === 'donors' && <NearbyDonors />}
                    {activeTab === 'map' && (
                      <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden glass shadow-md">
                        <EmergencyMap />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      <AnimatePresence>
        {showRequestModal && (
          <RequestModal onClose={() => setShowRequestModal(false)} onSubmit={handleNewRequest} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* We moved notifications to a dedicated page */}
      </AnimatePresence>

      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        setActiveTab={setActiveTab}
      />

      <AIAssistant open={showAIAssistant} setOpen={setShowAIAssistant} />

      <EmergencyFAB
        onCreateRequest={() => setShowRequestModal(true)}
        onNavigateTab={setActiveTab}
        onOpenAIAssistant={() => setShowAIAssistant((p) => !p)}
        onOpenHospitalSelector={() => setShowHospitalSelector(true)}
      />

      <AnimatePresence>
        {showHospitalSelector && (
          <HospitalSelectorModal
            onClose={() => setShowHospitalSelector(false)}
            onSelectCall={(h) => {
              setShowHospitalSelector(false);
              setActiveCall({ hospitalName: h.name, number: h.contact });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCall && (
          <VoiceCallModal
            hospitalName={activeCall.hospitalName}
            number={activeCall.number}
            onClose={() => setActiveCall(null)}
          />
        )}
      </AnimatePresence>
    </div >
  );
};

export default Dashboard;
