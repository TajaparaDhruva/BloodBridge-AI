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
import RequestDetailsModal from '../components/dashboard/RequestDetailsModal';
import InventoryAnalyticsModal from '../components/dashboard/InventoryAnalyticsModal';
import AddDepotModal from '../components/dashboard/AddDepotModal';
import HospitalSelectorModal from '../components/dashboard/HospitalSelectorModal';
import VoiceCallModal from '../components/dashboard/VoiceCallModal';
import BillingPage from './BillingPage';
import AdminPanel from './AdminPanel';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { StatusBadge, ProgressRing, WidgetShell, upcomingTasks } from '../components/dashboard/shared';
import { FiPlus, FiAlertTriangle, FiTrendingUp, FiCheck, FiZap, FiUsers, FiCalendar, FiActivity, FiBell, FiInfo, FiArrowRight, FiChevronRight, FiMapPin, FiDroplet, FiClipboard, FiClock, FiLock, FiCreditCard, FiArrowLeft, FiGrid } from 'react-icons/fi';
import TasksPage from './TasksPage';
import NotificationsPage from './NotificationsPage';

import { useLocation as useRouterLocation } from 'react-router-dom';

const Dashboard = () => {
  const {
    user, logout, requests, donors, inventory, notifications, createRequest, setNotifications, setInventory,
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

  const [requestFilter, setRequestFilter] = useState('all');
  const [requestSort, setRequestSort] = useState('latest');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [showInventoryAnalytics, setShowInventoryAnalytics] = useState(false);
  const [showAddDepotModal, setShowAddDepotModal] = useState(false);
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

  const handleAddDepot = (group, unitsToAdd) => {
    console.log("Adding depot stock:", group, unitsToAdd);
    setInventory(prev => {
      if (!prev) return [];
      return prev.map(item => {
        if (item.group === group) {
          const currentUnits = Number(item.units) || 0;
          const parsedAdd = Number(unitsToAdd) || 0;
          const newUnits = Math.min(60, currentUnits + parsedAdd);
          let newStatus = 'stable';
          if (newUnits < 6) newStatus = 'critical';
          else if (newUnits < 15) newStatus = 'warning';
          
          console.log(`Inventory updated for ${group}: ${currentUnits} -> ${newUnits} (status: ${newStatus})`);
          return {
            ...item,
            units: newUnits,
            status: newStatus
          };
        }
        return item;
      });
    });
    setShowAddDepotModal(false);

    // Add success notification
    const newNotif = {
      id: Date.now(),
      title: 'Depot Stock Added',
      message: `Successfully replenished ${unitsToAdd} units of ${group} blood.`,
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
                      const baseTime = Date.now();
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
                          time: 'JUST NOW',
                          matchTime: 'Calculating...',
                          donorsContacted: 10,
                          badgeText: 'NEW',
                          type: 'urgent',
                          timestamp: baseTime
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
                          time: '2 MINS AGO',
                          matchTime: 'Calculating...',
                          donorsContacted: 18,
                          badgeText: 'IN PROGRESS',
                          type: 'normal',
                          timestamp: baseTime - 2 * 60 * 1000
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
                          time: '3 MINS AGO',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'CRITICAL',
                          type: 'emergency',
                          timestamp: baseTime - 3 * 60 * 1000
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
                          time: '3 MINS AGO',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'ATTENTION',
                          type: 'attention',
                          timestamp: baseTime - 3.5 * 60 * 1000
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
                          time: '4 MINS AGO',
                          matchTime: 'Calculating...',
                          donorsContacted: 17,
                          badgeText: 'IN PROGRESS',
                          type: 'normal',
                          timestamp: baseTime - 4 * 60 * 1000
                        },
                        {
                          id: 'REQ-104',
                          hospitalName: 'KEM Hospital',
                          patientName: 'Siddharth Malhotra',
                          bloodGroup: 'O+',
                          units: 1,
                          urgency: 'info',
                          status: 'matching',
                          city: 'Mumbai',
                          time: '5 MINS AGO',
                          matchTime: 'Calculating...',
                          donorsContacted: 5,
                          badgeText: 'INFORMATION',
                          type: 'info',
                          timestamp: baseTime - 5 * 60 * 1000
                        }
                      ];

                      // Custom droplet SVG components
                      const FilledDropletIcon = ({ colorClass }) => (
                        <svg className={`w-3.5 h-3.5 mt-1.5 ${colorClass}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      );

                      const OutlineDropletIcon = ({ colorClass }) => (
                        <svg className={`w-3.5 h-3.5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      );

                      // Merge requests from context (simulated + manual) and static mock requests
                      const mergedMap = new Map();
                      staticMockRequests.forEach(r => mergedMap.set(r.id, r));

                      requests.forEach(r => {
                        mergedMap.set(r.id, {
                          ...r,
                          type: r.type || (r.urgency === 'normal' ? 'normal' : (r.urgency === 'info' || r.urgency === 'information' ? 'info' : 'urgent')),
                          badgeText: r.badgeText || (r.status === 'matching' ? 'NEW' : r.status === 'dispatched' ? 'IN PROGRESS' : 'COMPLETED')
                        });
                      });

                      const allRequestsList = Array.from(mergedMap.values());

                      // Dynamic counts based on all requests
                      const totalCount = allRequestsList.length;
                      const urgentCount = allRequestsList.filter(r => r.urgency === 'urgent' || r.urgency === 'emergency').length;
                      const normalCount = allRequestsList.filter(r => r.urgency === 'normal').length;
                      const infoCount = allRequestsList.filter(r => r.urgency === 'info' || r.urgency === 'information').length;

                      // Filter requests
                      const filteredRequests = allRequestsList.filter(req => {
                        if (requestFilter === 'all') return true;
                        if (requestFilter === 'urgent') return req.urgency === 'urgent' || req.urgency === 'emergency';
                        if (requestFilter === 'normal') return req.urgency === 'normal';
                        if (requestFilter === 'info') return req.urgency === 'info' || req.urgency === 'information';
                        return true;
                      });

                      // Sort requests: Latest first (highest timestamp to lowest)
                      const sortedRequests = [...filteredRequests].sort((a, b) => {
                        if (requestSort === 'latest') {
                          return b.timestamp - a.timestamp;
                        } else if (requestSort === 'units') {
                          return b.units - a.units;
                        } else if (requestSort === 'urgency') {
                          const priority = { emergency: 3, urgent: 2, normal: 1, info: 0, information: 0 };
                          const prioA = priority[a.urgency] || 0;
                          const prioB = priority[b.urgency] || 0;
                          return prioB - prioA;
                        }
                        return 0;
                      });

                      return (
                        <div className="space-y-6">
                          {/* Title and Top Stats Row */}
                          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 flex-wrap">
                            <div className="flex items-center gap-3.5 text-left">
                              <div className="w-14 h-14 rounded-full bg-[#FFF1F2] dark:bg-rose-950/20 flex items-center justify-center text-[24px] flex-shrink-0 shadow-sm">
                                🩸
                              </div>
                              <div>
                                <h2 className="font-black text-gray-900 dark:text-white text-[22px] tracking-tight leading-tight">Active Request Registry</h2>
                                <p className="text-gray-400 dark:text-gray-500 text-[13px] font-semibold mt-0.5">{totalCount} operations dispatch records</p>
                              </div>
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
                                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium mt-1 block leading-none">Total Requests</span>
                                </div>
                              </div>

                              {/* Urgent */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                                  <FiBell className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{urgentCount}</span>
                                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-medium mt-1 block leading-none">Urgent</span>
                                </div>
                              </div>

                              {/* Normal */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] flex items-center justify-center flex-shrink-0">
                                  <FiActivity className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{normalCount}</span>
                                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-medium mt-1 block leading-none">Normal</span>
                                </div>
                              </div>

                              {/* Information */}
                              <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
                                <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center flex-shrink-0">
                                  <FiInfo className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{infoCount}</span>
                                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-medium mt-1 block leading-none">Information</span>
                                </div>
                              </div>

                              {/* Create Emergency Request Button */}
                              <button
                                onClick={() => setShowRequestModal(true)}
                                className="bg-gradient-to-r from-[#D72638] to-[#E11D48] hover:from-[#C1121F] hover:to-[#D72638] text-white text-[13px] py-2 px-5 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 text-left leading-tight shrink-0 min-w-[170px]"
                              >
                                <FiPlus className="w-5 h-5 stroke-[3] shrink-0" />
                                <div>
                                  <span className="block font-bold">Create</span>
                                  <span className="block text-[11px] opacity-90">Emergency Request</span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Filter and Sort Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-b border-slate-100 dark:border-slate-800">
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => setRequestFilter('all')}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
                                  requestFilter === 'all'
                                    ? 'bg-[#E11D48] text-white shadow-md shadow-rose-500/10'
                                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <FiGrid className="w-4 h-4" />
                                <span>All Requests</span>
                              </button>

                              <button
                                onClick={() => setRequestFilter('urgent')}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
                                  requestFilter === 'urgent'
                                    ? 'bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48]'
                                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                                Urgent
                              </button>

                              <button
                                onClick={() => setRequestFilter('normal')}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
                                  requestFilter === 'normal'
                                    ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]'
                                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                                Normal
                              </button>

                              <button
                                onClick={() => setRequestFilter('info')}
                                className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all cursor-pointer select-none flex items-center gap-2 ${
                                  requestFilter === 'info'
                                    ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6]'
                                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                Information
                              </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-4 py-2.5 shadow-sm text-[13px] text-slate-700 dark:text-slate-305 font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors self-start sm:self-auto select-none">
                              <span className="text-slate-400 font-bold">⇅</span>
                              <span className="text-slate-500 font-semibold">Sort by:</span>
                              <span className="text-slate-900 dark:text-white font-extrabold pr-4 text-[12px] tracking-wide uppercase">
                                {requestSort === 'latest' ? 'Latest' : requestSort === 'urgency' ? 'Urgency' : 'Units'}
                              </span>
                              <span className="absolute right-4 text-[9px] text-slate-400">▼</span>
                              <select
                                value={requestSort}
                                onChange={(e) => setRequestSort(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              >
                                <option value="latest">Latest</option>
                                <option value="urgency">Urgency</option>
                                <option value="units">Units Needed</option>
                              </select>
                            </div>
                          </div>

                          {/* Card Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 max-w-6xl mx-auto w-full">
                            {sortedRequests.map((req, i) => {
                              // Dynamic theme variables
                              let topBarColor = 'bg-[#8B5CF6]';
                              let circleBg = 'bg-[#F5F3FF] text-[#6D28D9]';
                              let dropletColorClass = 'text-[#6D28D9]';
                              let badgeColor = 'bg-purple-55 text-purple-650 border border-purple-100/50 dark:bg-purple-950/20 dark:text-purple-400';
                              let statusBadgeColor = 'bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE]';
                              let unitColorText = 'text-[#6D28D9]';
                              let matchBoxBg = 'bg-[#F5F3FF]/60 dark:bg-purple-950/10';
                              let arrowBtnClass = 'text-[#8B5CF6] border-[#EDE9FE] hover:bg-[#F5F3FF]';
                              let waveColor = '#8B5CF6';
                              let clockColor = 'text-[#8B5CF6]';

                              if (req.urgency === 'normal') {
                                topBarColor = 'bg-[#10B981]';
                                circleBg = 'bg-[#F0FDF4] text-[#15803D]';
                                dropletColorClass = 'text-[#15803D]';
                                badgeColor = 'bg-emerald-50 text-emerald-650 border border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400';
                                statusBadgeColor = 'bg-[#F0FDF4] text-emerald-650 border border-[#DCFCE7]';
                                unitColorText = 'text-[#15803D]';
                                matchBoxBg = 'bg-[#F0FDF4]/60 dark:bg-emerald-950/10';
                                arrowBtnClass = 'text-[#15803D] border-[#DCFCE7] hover:bg-[#F0FDF4]';
                                waveColor = '#10B981';
                                clockColor = 'text-[#10B981]';
                              } else if (req.urgency === 'urgent' || req.urgency === 'emergency') {
                                topBarColor = 'bg-[#E11D48]';
                                circleBg = 'bg-[#FFF1F2] text-[#E11D48]';
                                dropletColorClass = 'text-[#E11D48]';
                                badgeColor = 'bg-rose-50 text-[#E11D48] border border-rose-100/50 dark:bg-rose-950/20 dark:text-rose-450';
                                statusBadgeColor = 'bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]';
                                unitColorText = 'text-[#E11D48]';
                                matchBoxBg = 'bg-[#FFF1F2]/60 dark:bg-rose-950/10';
                                arrowBtnClass = 'text-[#E11D48] border-[#FFE4E6] hover:bg-[#FFF1F2]';
                                waveColor = '#E11D48';
                                clockColor = 'text-[#E11D48]';
                              } else if (req.urgency === 'info' || req.urgency === 'information') {
                                topBarColor = 'bg-[#3B82F6]';
                                circleBg = 'bg-[#EFF6FF] text-[#1D4ED8]';
                                dropletColorClass = 'text-[#1D4ED8]';
                                badgeColor = 'bg-blue-50 text-blue-655 border border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400';
                                statusBadgeColor = 'bg-[#EFF6FF] text-blue-655 border border-[#DBEAFE]';
                                unitColorText = 'text-blue-600';
                                matchBoxBg = 'bg-[#EFF6FF]/60 dark:bg-blue-950/10';
                                arrowBtnClass = 'text-blue-550 border-[#DBEAFE] hover:bg-[#EFF6FF]';
                                waveColor = '#3B82F6';
                                clockColor = 'text-[#3B82F6]';
                              }

                              return (
                                <motion.div
                                  key={req.id}
                                  className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-[24px] p-6 pb-16 flex flex-col justify-between relative shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left group overflow-hidden max-w-[380px] w-full mx-auto"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  {/* Curved Top Theme Bar */}
                                  <div className={`absolute top-0 left-0 right-0 h-[6px] ${topBarColor} rounded-t-[24px]`} />

                                  <div>
                                    {/* Card Header section: Avatar & Details */}
                                    <div className="flex items-start justify-between w-full gap-3 pt-1.5">
                                      {/* Blood Group Circle */}
                                      <div className={`w-16 h-16 rounded-full flex-shrink-0 flex flex-col items-center justify-center font-extrabold text-[18px] shadow-sm relative z-10 ${circleBg}`}>
                                        <span className="leading-none">{req.bloodGroup}</span>
                                        <FilledDropletIcon colorClass={dropletColorClass} />
                                      </div>

                                      {/* Top Right Information Stack */}
                                      <div className="text-right flex flex-col items-end relative z-10">
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                          <FiClock className={`w-3.5 h-3.5 ${clockColor}`} />
                                          <span>{req.time}</span>
                                        </span>
                                        <span className="text-[15px] font-black text-gray-900 dark:text-white mt-1.5 leading-none block">{req.id}</span>
                                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black mt-2 inline-block uppercase tracking-wider ${statusBadgeColor}`}>
                                          {req.badgeText || 'NEW'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Patient Name */}
                                    <h3 className="font-extrabold text-gray-900 dark:text-white text-[19px] mt-4.5 mb-1 relative z-10 leading-snug">
                                      {req.patientName}
                                    </h3>

                                    {/* Badges Row */}
                                    <div className="flex items-center gap-1.5 flex-wrap mt-2 relative z-10">
                                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${badgeColor}`}>
                                        {req.urgency}
                                      </span>
                                      <span className="bg-indigo-50/70 dark:bg-indigo-950/20 text-[#6366F1] dark:text-indigo-400 px-2.5 py-0.5 rounded-md text-[9px] font-black border border-indigo-100/25 uppercase tracking-widest">
                                        Matching
                                      </span>
                                    </div>

                                    {/* Hospital and Location Marker */}
                                    <p className="text-slate-455 dark:text-slate-500 text-[12px] font-semibold mt-3.5 flex items-center gap-1.5 relative z-10 leading-snug">
                                      <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>{req.hospitalName}, {req.city}</span>
                                    </p>

                                    {/* Units Required */}
                                    <p className={`text-[12.5px] ${unitColorText} font-bold mt-2.5 flex items-center gap-1.5 relative z-10`}>
                                      <OutlineDropletIcon colorClass={unitColorText} />
                                      <span>{req.units} unit{req.units > 1 ? 's' : ''} required</span>
                                    </p>
                                  </div>

                                  {/* Bottom Status Blocks Grid */}
                                  <div className="grid grid-cols-2 gap-2 mt-5.5 relative z-10">
                                    {/* Match Time Box */}
                                    <div className={`${matchBoxBg} border border-black/[0.03] dark:border-white/[0.03] rounded-xl p-2.5 px-3 flex items-center gap-2`}>
                                      <FiZap className={`w-4 h-4 shrink-0 ${unitColorText} animate-pulse`} />
                                      <div>
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block leading-none mb-1">AI Match Time</span>
                                        <span className="text-[12px] font-bold text-gray-800 dark:text-slate-200 block leading-none">{req.matchTime || 'Calculating...'}</span>
                                      </div>
                                    </div>

                                    {/* Contacted Box */}
                                    <div className="bg-slate-50/65 dark:bg-slate-800/40 border border-black/[0.03] dark:border-white/[0.03] rounded-xl p-2.5 px-3 flex items-center gap-2">
                                      <FiUsers className="w-4 h-4 shrink-0 text-slate-400" />
                                      <div>
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block leading-none mb-1">Contacted</span>
                                        <span className="text-[12px] font-bold text-gray-800 dark:text-slate-200 block leading-none">{req.donorsContacted || 10} eligible donors</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Wave Graphic at bottom */}
                                  <svg className="absolute bottom-0 left-0 right-0 w-full h-14 pointer-events-none rounded-b-[24px] select-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
                                    <path
                                      fill={waveColor}
                                      fillOpacity="0.12"
                                      d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,176C840,160,960,160,1080,181.3C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                                    />
                                  </svg>

                                  {/* Floating Action Button */}
                                  <button
                                    onClick={() => setSelectedRequestDetails(req)}
                                    className={`absolute bottom-4 right-4 w-11 h-11 rounded-full border bg-white flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-md z-20 ${arrowBtnClass}`}
                                  >
                                    <FiArrowRight className="w-5 h-5 stroke-[2.5]" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Monitor Info banner */}
                           <div className="flex items-center justify-center gap-2 py-4 text-slate-550 dark:text-slate-500 text-[13px] font-semibold border-t border-slate-100 dark:border-slate-800/60 mt-4">
                            <span className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center text-[12px] shadow-sm">
                              🛡️
                            </span>
                            <span>All requests are monitored 24/7. We'll notify you when donors are matched.</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Detailed Inventory tab */}
                    {activeTab === 'inventory' && (
                      <div className="space-y-6">
                        {/* Title and Top Actions Row */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 flex-wrap mb-4">
                          <div className="flex items-center gap-3.5 text-left">
                            <div className="w-14 h-14 rounded-full bg-[#FFF1F2] dark:bg-rose-950/20 flex items-center justify-center text-[24px] flex-shrink-0 shadow-sm">
                              🩸
                            </div>
                            <div>
                              <h2 className="font-black text-gray-900 dark:text-white text-[22px] tracking-tight leading-tight">Blood Depots Inventory</h2>
                              <p className="text-gray-405 dark:text-gray-500 text-[13px] font-semibold mt-0.5">Real-time depletion indicators</p>
                            </div>
                          </div>

                          {/* Right action badges */}
                          <div className="flex items-center gap-3.5 flex-wrap">
                            <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-full py-2 px-4.5 flex items-center gap-2 shadow-sm text-slate-500 dark:text-slate-400 text-[12.5px] font-bold">
                              <FiClock className="w-4 h-4 text-slate-400" />
                              <span>Updated: Just now</span>
                            </div>
                            <button
                              onClick={() => setShowAddDepotModal(true)}
                              className="bg-[#E11D48] hover:bg-rose-600 text-white text-[13.5px] py-2.5 px-5 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                            >
                              <FiPlus className="w-4.5 h-4.5 stroke-[3]" />
                              <span>Add Depot</span>
                            </button>
                          </div>
                        </div>

                        {/* 4x2 Grid of Depot Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 max-w-6xl mx-auto w-full">
                          {inventory.map((b, i) => {
                            const max = 60;
                            const pct = Math.min(100, Math.round((b.units / max) * 100));
                            
                            // Dynamic variables based on status
                            let ringColor = '#059669'; // default stable
                            let ringTextColorClass = 'text-[#059669]';
                            let squareBadgeBg = 'bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981]';
                            let waveColor = '#10B981';
                            let isCritical = b.status === 'critical';
                            let statusBadge;

                            if (b.status === 'critical') {
                              ringColor = '#E11D48';
                              ringTextColorClass = 'text-[#E11D48]';
                              squareBadgeBg = 'bg-rose-50 dark:bg-rose-950/20 text-[#E11D48]';
                              waveColor = '#E11D48';
                              statusBadge = (
                                <div className="border border-rose-100 dark:border-rose-900/35 bg-[#FFF1F2] dark:bg-rose-950/20 text-[#E11D48] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit uppercase tracking-wider">
                                  <span className="w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-[8px] font-black">!</span>
                                  <span>Critical</span>
                                </div>
                              );
                            } else if (b.status === 'warning') {
                              ringColor = '#D97706';
                              ringTextColorClass = 'text-[#D97706]';
                              squareBadgeBg = 'bg-amber-50 dark:bg-amber-950/20 text-amber-500';
                              waveColor = '#D97706';
                              statusBadge = (
                                <div className="border border-amber-100 dark:border-amber-900/35 bg-[#FFF7ED] dark:bg-amber-950/20 text-[#D97706] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 w-fit uppercase tracking-wider">
                                  <span className="text-[#D97706] text-[10px] font-black">⚠</span>
                                  <span>Low Stock</span>
                                </div>
                              );
                            } else {
                              // Stable
                              statusBadge = (
                                <div className="border border-emerald-100 dark:border-emerald-900/35 bg-[#F0FDF4] dark:bg-emerald-950/20 text-[#10B981] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit uppercase tracking-wider">
                                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[8px] font-black">✓</span>
                                  <span>Stable</span>
                                </div>
                              );
                            }

                            return (
                              <motion.div
                                key={b.group}
                                className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-[24px] p-5 pb-7 flex flex-col justify-between relative shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left overflow-hidden h-[185px] group cursor-default"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                {/* Top corner square badge */}
                                <div className={`w-8.5 h-8.5 rounded-xl ${squareBadgeBg} flex items-center justify-center text-[18px] relative z-10 font-bold`}>
                                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                  </svg>
                                </div>

                                {/* Progress Ring & Details Row */}
                                <div className="flex items-center gap-5.5 mt-2 z-10 relative">
                                  {/* Progress Ring container */}
                                  <div className="relative w-[76px] h-[76px] flex items-center justify-center flex-shrink-0">
                                    {isCritical && (
                                      <span className="absolute w-[60px] h-[60px] rounded-full bg-rose-500/10 animate-ping" />
                                    )}
                                    <ProgressRing pct={pct} color={ringColor} size={76} stroke={5} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className={`text-[15px] font-black tracking-tight ${ringTextColorClass}`}>
                                        {b.group}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Available Details block */}
                                  <div>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-[28px] font-black text-slate-900 dark:text-white leading-none">{b.units}</span>
                                    </div>
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block mt-1 leading-none">Units Available</span>
                                    
                                    {/* Status Pill Badge */}
                                    <div className="mt-3">
                                      {statusBadge}
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom Wave Graphic decoration */}
                                <svg className="absolute bottom-0 left-0 right-0 w-full h-8 pointer-events-none rounded-b-[24px] select-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
                                  <path
                                    fill={waveColor}
                                    fillOpacity="0.07"
                                    d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,176C840,160,960,160,1080,181.3C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                                  />
                                </svg>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Critical & Optimal Warning Banners */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-6xl mx-auto w-full">
                          {/* Critical restock needed */}
                          <div className="bg-[#FFF1F2]/85 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-900/20 p-5 px-6 rounded-[28px] flex items-center justify-between text-left relative overflow-hidden shadow-sm">
                            <div className="flex items-center">
                              {/* Warning Icon Badge */}
                              <div className="w-13 h-13 rounded-full bg-rose-100 dark:bg-rose-950/30 text-[#E11D48] flex items-center justify-center text-[22px] flex-shrink-0 shadow-sm mr-4.5">
                                <FiAlertTriangle className="w-5.5 h-5.5 stroke-[2.5]" />
                              </div>
                              <div>
                                <h4 className="text-[#E11D48] font-black text-[15px] tracking-tight uppercase tracking-wide">Critical Restock Needed</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-[12.5px] leading-relaxed mt-1 font-semibold">
                                  Depots for <strong className="text-slate-800 dark:text-white font-bold">O-, A-, and AB-</strong> are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.
                                </p>
                              </div>
                            </div>
                            
                            {/* Ringing bell background line art decoration */}
                            <div className="absolute right-3 -bottom-1.5 opacity-8 pointer-events-none text-rose-500 select-none">
                              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                              </svg>
                            </div>
                          </div>

                          {/* Inventory stability optimal */}
                          <div className="bg-[#F0FDF4]/85 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 p-5 px-6 rounded-[28px] flex items-center justify-between text-left relative overflow-hidden shadow-sm">
                            <div className="flex items-center">
                              {/* Shield Check Icon Badge */}
                              <div className="w-13 h-13 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-[#10B981] flex items-center justify-center text-[22px] flex-shrink-0 shadow-sm mr-4.5">
                                <FiCheck className="w-6 h-6 stroke-[3] border-2 border-[#10B981] rounded-full" />
                              </div>
                              <div>
                                <h4 className="text-[#10B981] font-black text-[15px] tracking-tight uppercase tracking-wide">Inventory Stability Optimal</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-[12.5px] leading-relaxed mt-1 font-semibold">
                                  Positive groups (<strong className="text-slate-800 dark:text-white font-bold">O+, A+, B+</strong>) remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.
                                </p>
                              </div>
                            </div>

                            {/* Line chart background line art decoration */}
                            <div className="absolute right-3 -bottom-1 opacity-8 pointer-events-none text-emerald-500 select-none">
                              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Full-Width prediction warning and analytics links */}
                        <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 px-5 rounded-[22px] flex flex-col sm:flex-row items-center justify-between gap-4 text-left relative overflow-hidden mt-6 max-w-6xl mx-auto w-full shadow-sm">
                          <div className="flex items-center gap-3">
                            {/* Calendar Icon Badge */}
                            <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100/10">
                              <FiCalendar className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 text-[12.5px] font-semibold">
                              All inventory levels are monitored 24/7. AI predictions updated every 15 minutes.
                            </span>
                          </div>

                          {/* View Analytics Button link */}
                          {/* View Analytics Button link */}
                          <button
                            onClick={() => setShowInventoryAnalytics(true)}
                            className="bg-[#1E293B] hover:bg-slate-800 text-white text-[12.5px] font-extrabold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap animate-pulse"
                          >
                            <FiTrendingUp className="w-4.5 h-4.5" />
                            <span>View Analytics</span>
                            <span className="text-[14px]">→</span>
                          </button>
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
        {selectedRequestDetails && (
          <RequestDetailsModal
            request={selectedRequestDetails}
            onClose={() => setSelectedRequestDetails(null)}
            onCallDispatch={(hName, phoneNum) => {
              setSelectedRequestDetails(null);
              setActiveCall({ hospitalName: hName, number: phoneNum });
            }}
            donors={donors}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddDepotModal && (
          <AddDepotModal
            onClose={() => setShowAddDepotModal(false)}
            onAdd={handleAddDepot}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInventoryAnalytics && (
          <InventoryAnalyticsModal
            inventory={inventory}
            setNotifications={setNotifications}
            onClose={() => setShowInventoryAnalytics(false)}
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
