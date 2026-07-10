import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { StatusBadge, ProgressRing, WidgetShell } from '../components/dashboard/shared';
import { FiPlus, FiAlertTriangle, FiTrendingUp, FiCheck } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout, requests, donors, inventory, notifications, createRequest, setNotifications } = useAuth();
  const { userLocation } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && !token) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [activeCall, setActiveCall] = useState(null);

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
    <div className="flex min-h-screen bg-canvas dark:bg-darkbg transition-colors duration-300">
      <FloatingNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewRequest={() => setShowRequestModal(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        unreadCount={unread}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          userLocation={userLocation}
          unread={unread}
          onOpenSearch={() => setShowCommandPalette(true)}
          onNewRequest={() => setShowRequestModal(true)}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenAI={() => setShowAIAssistant((p) => !p)}
          onLogout={logout}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto dashboard-main pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full max-w-[1440px] mx-auto"
            >
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
                />
              )}

              {/* Requests registry tab */}
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="font-black text-slate dark:text-white text-[20px] tracking-tight">Active Request Registry</h2>
                      <p className="text-muted text-[13px] font-semibold uppercase mt-0.5">{requests.length} operations dispatch records</p>
                    </div>
                    <button 
                      onClick={() => setShowRequestModal(true)} 
                      className="btn-primary text-[13px] py-2.5 px-5 font-bold shadow-md hover:shadow-lg dashboard-ripple cursor-pointer flex items-center gap-1.5"
                    >
                      <FiPlus className="w-4.5 h-4.5" />
                      <span>Create Emergency request</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {requests.map((req, i) => (
                      <motion.div
                        key={req.id}
                        className="dashboard-widget p-5 flex items-center gap-4 border border-black/05 dark:border-white/05 dark:bg-darksurf hover:border-bloodred/25 relative overflow-hidden group cursor-default"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                      >
                        {/* Status accent side bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          req.urgency === 'emergency' ? 'bg-bloodred' : req.urgency === 'urgent' ? 'bg-amber' : 'bg-emerald'
                        }`} />

                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[14px] flex-shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                            req.urgency === 'emergency'
                              ? 'bg-bloodred/10 text-bloodred border-bloodred/15'
                              : req.urgency === 'urgent'
                                ? 'bg-amber/10 text-amber border-amber/15'
                                : 'bg-emerald/10 text-emerald border-emerald/15'
                          }`}
                        >
                          {req.bloodGroup}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate dark:text-white text-[15px] leading-snug">{req.patientName}</span>
                            <StatusBadge status={req.urgency} />
                            <StatusBadge status={req.status} />
                          </div>
                          <p className="text-muted text-[12px] font-semibold mt-1">
                            {req.hospitalName} · {req.city} · <span className="text-slate dark:text-white font-bold">{req.units} units required</span>
                          </p>
                          <p className="text-muted text-[11px] font-medium mt-1 bg-black/02 dark:bg-white/03 p-1.5 px-2 rounded-xl inline-block border border-black/03 dark:border-white/05">
                            AI Match time: <strong className="text-slate dark:text-white">{req.matchTime}</strong> · contacted {req.donorsContacted} eligible donors
                          </p>
                        </div>

                        <div className="text-right text-[11px] text-muted font-bold hidden sm:block">
                          <p>{req.time}</p>
                          <p className="text-[10px] text-muted/50 font-mono mt-1 tracking-wider">{req.id}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

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
                  onCall={(hospital) => { window.location.href = `tel:${hospital.contact}`; }} 
                />
              )}
              {activeTab === 'donors' && <NearbyDonors />}
              {activeTab === 'map' && (
                <div className="h-[calc(100vh-160px)] rounded-3xl overflow-hidden border border-black/05 dark:border-white/05 shadow-md">
                  <EmergencyMap />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showRequestModal && (
          <RequestModal onClose={() => setShowRequestModal(false)} onSubmit={handleNewRequest} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <NotificationCenter
            isOpen={showNotifications}
            notifications={notifications}
            setNotifications={setNotifications}
            onClose={() => setShowNotifications(false)}
            onMarkRead={(id) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)))}
          />
        )}
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
              window.location.href = `tel:${h.contact}`;
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
