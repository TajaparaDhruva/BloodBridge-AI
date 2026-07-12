import React, { createContext, useContext, useState, useEffect } from 'react';
import { activityTimeline } from '../components/dashboard/shared';
import authService from '../services/authService';

const AuthContext = createContext();

const initialRequests = [
  {
    id: 'REQ-101',
    hospitalName: 'Metro Critical Care Hospital',
    patientName: 'Anil Deshmukh',
    bloodGroup: 'O-',
    units: 3,
    urgency: 'emergency',
    status: 'matching', // matching, dispatched, completed
    city: 'Mumbai',
    time: '10 mins ago',
    matchTime: '2 mins',
    donorsContacted: 24,
    donorName: null
  },
  {
    id: 'REQ-102',
    hospitalName: 'Apollo Speciality Center',
    patientName: 'Kirti Sharma',
    bloodGroup: 'AB-',
    units: 2,
    urgency: 'emergency',
    status: 'dispatched',
    city: 'Pune',
    time: '25 mins ago',
    matchTime: '4 mins',
    donorsContacted: 8,
    donorName: 'Vikram Singh'
  },
  {
    id: 'REQ-103',
    hospitalName: 'Global General Clinic',
    patientName: 'Jayesh Patel',
    bloodGroup: 'A+',
    units: 5,
    urgency: 'urgent',
    status: 'completed',
    city: 'Ahmedabad',
    time: '3 hours ago',
    matchTime: '12 mins',
    donorsContacted: 45,
    donorName: 'Priya Patel'
  },
  {
    id: 'REQ-104',
    hospitalName: 'St. Jude Heart Institute',
    patientName: 'Maria D\'Souza',
    bloodGroup: 'B-',
    units: 2,
    urgency: 'normal',
    status: 'completed',
    city: 'Mumbai',
    time: '1 day ago',
    matchTime: '8 mins',
    donorsContacted: 18,
    donorName: 'Rahul Mehta'
  },
  {
    id: 'REQ-105',
    hospitalName: 'Lilavati Hospital',
    patientName: 'Kareena Kapoor',
    bloodGroup: 'B+',
    units: 3,
    urgency: 'urgent',
    status: 'matching',
    city: 'Mumbai',
    time: '2 hours ago',
    matchTime: '15 mins',
    donorsContacted: 32,
    donorName: null
  },
  {
    id: 'REQ-106',
    hospitalName: 'Nanavati Super Speciality',
    patientName: 'Salman Khan',
    bloodGroup: 'AB+',
    units: 1,
    urgency: 'emergency',
    status: 'matching',
    city: 'Mumbai',
    time: '15 mins ago',
    matchTime: '5 mins',
    donorsContacted: 12,
    donorName: null
  },
  { id: 'REQ-107', hospitalName: 'Fortis Hospital', patientName: 'Rahul Dravid', bloodGroup: 'O+', units: 4, urgency: 'emergency', status: 'matching', city: 'Bangalore', time: '5 mins ago', matchTime: '1 min', donorsContacted: 50, donorName: null },
  { id: 'REQ-108', hospitalName: 'Max Super Speciality', patientName: 'Sania Mirza', bloodGroup: 'A-', units: 2, urgency: 'urgent', status: 'matching', city: 'Delhi', time: '1 hour ago', matchTime: '20 mins', donorsContacted: 15, donorName: null },
  { id: 'REQ-109', hospitalName: 'Manipal Hospital', patientName: 'Sunil Chhetri', bloodGroup: 'B+', units: 3, urgency: 'normal', status: 'matching', city: 'Bangalore', time: '4 hours ago', matchTime: '45 mins', donorsContacted: 10, donorName: null },
  { id: 'REQ-110', hospitalName: 'Medanta The Medicity', patientName: 'Mary Kom', bloodGroup: 'O-', units: 2, urgency: 'emergency', status: 'matching', city: 'Gurugram', time: '10 mins ago', matchTime: '3 mins', donorsContacted: 60, donorName: null },
  { id: 'REQ-111', hospitalName: 'Christian Medical College', patientName: 'P. V. Sindhu', bloodGroup: 'AB+', units: 1, urgency: 'urgent', status: 'matching', city: 'Vellore', time: '2 hours ago', matchTime: '15 mins', donorsContacted: 22, donorName: null },
  { id: 'REQ-112', hospitalName: 'Tata Memorial Hospital', patientName: 'Neeraj Chopra', bloodGroup: 'A+', units: 5, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '2 mins ago', matchTime: '30 secs', donorsContacted: 100, donorName: null },
  { id: 'REQ-113', hospitalName: 'Narayana Health', patientName: 'Saina Nehwal', bloodGroup: 'B-', units: 2, urgency: 'normal', status: 'matching', city: 'Bangalore', time: '6 hours ago', matchTime: '1 hour', donorsContacted: 5, donorName: null },
  { id: 'REQ-114', hospitalName: 'Artemis Hospital', patientName: 'Virender Sehwag', bloodGroup: 'O+', units: 3, urgency: 'urgent', status: 'matching', city: 'Gurugram', time: '45 mins ago', matchTime: '10 mins', donorsContacted: 35, donorName: null },
  { id: 'REQ-115', hospitalName: 'Care Hospitals', patientName: 'Mithali Raj', bloodGroup: 'AB-', units: 1, urgency: 'emergency', status: 'matching', city: 'Hyderabad', time: '20 mins ago', matchTime: '5 mins', donorsContacted: 18, donorName: null },
  { id: 'REQ-116', hospitalName: 'KIMS Hospitals', patientName: 'Kapil Dev', bloodGroup: 'A-', units: 4, urgency: 'urgent', status: 'matching', city: 'Secunderabad', time: '1.5 hours ago', matchTime: '12 mins', donorsContacted: 28, donorName: null },
  { id: 'REQ-117', hospitalName: 'Ruby Hall Clinic', patientName: 'Ravi Shastri', bloodGroup: 'B+', units: 2, urgency: 'normal', status: 'matching', city: 'Pune', time: '8 hours ago', matchTime: '2 hours', donorsContacted: 8, donorName: null },
  { id: 'REQ-118', hospitalName: 'Sir H. N. Reliance', patientName: 'Anushka Sharma', bloodGroup: 'O-', units: 3, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '12 mins ago', matchTime: '4 mins', donorsContacted: 55, donorName: null },
  { id: 'REQ-119', hospitalName: 'PD Hinduja Hospital', patientName: 'Aamir Khan', bloodGroup: 'AB+', units: 2, urgency: 'urgent', status: 'matching', city: 'Mumbai', time: '2.5 hours ago', matchTime: '18 mins', donorsContacted: 20, donorName: null },
  { id: 'REQ-120', hospitalName: 'Breach Candy Hospital', patientName: 'Shah Rukh Khan', bloodGroup: 'A+', units: 4, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '1 min ago', matchTime: '10 secs', donorsContacted: 120, donorName: null },
  { id: 'REQ-121', hospitalName: 'Bombay Hospital', patientName: 'Amitabh Bachchan', bloodGroup: 'B-', units: 1, urgency: 'normal', status: 'matching', city: 'Mumbai', time: '10 hours ago', matchTime: '3 hours', donorsContacted: 12, donorName: null },
  { id: 'REQ-122', hospitalName: 'AIIMS', patientName: 'Sushmita Sen', bloodGroup: 'O+', units: 2, urgency: 'emergency', status: 'matching', city: 'Delhi', time: '5 mins ago', matchTime: '2 mins', donorsContacted: 45, donorName: null },
  { id: 'REQ-123', hospitalName: 'KEM Hospital', patientName: 'John Abraham', bloodGroup: 'A-', units: 3, urgency: 'urgent', status: 'matching', city: 'Mumbai', time: '20 mins ago', matchTime: '5 mins', donorsContacted: 22, donorName: null },
  { id: 'REQ-124', hospitalName: 'Sion Hospital', patientName: 'Hrithik Roshan', bloodGroup: 'B+', units: 1, urgency: 'normal', status: 'matching', city: 'Mumbai', time: '4 hours ago', matchTime: '1 hour', donorsContacted: 8, donorName: null },
  { id: 'REQ-125', hospitalName: 'Cooper Hospital', patientName: 'Shraddha Kapoor', bloodGroup: 'AB-', units: 4, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '10 mins ago', matchTime: '3 mins', donorsContacted: 55, donorName: null },
  { id: 'REQ-126', hospitalName: 'Sanjeevani Hospital', patientName: 'Ayushmann Khurrana', bloodGroup: 'O-', units: 2, urgency: 'urgent', status: 'matching', city: 'Pune', time: '1.5 hours ago', matchTime: '12 mins', donorsContacted: 30, donorName: null },
  { id: 'REQ-127', hospitalName: 'City Care Hospital', patientName: 'Rajkummar Rao', bloodGroup: 'A+', units: 5, urgency: 'emergency', status: 'matching', city: 'Ahmedabad', time: '1 min ago', matchTime: '10 secs', donorsContacted: 150, donorName: null },
  { id: 'REQ-128', hospitalName: 'Apex Hospital', patientName: 'Vicky Kaushal', bloodGroup: 'B-', units: 1, urgency: 'normal', status: 'matching', city: 'Jaipur', time: '6 hours ago', matchTime: '45 mins', donorsContacted: 15, donorName: null },
  { id: 'REQ-129', hospitalName: 'Sahyadri Hospital', patientName: 'Madhuri Dixit', bloodGroup: 'AB+', units: 3, urgency: 'urgent', status: 'matching', city: 'Pune', time: '3 hours ago', matchTime: '20 mins', donorsContacted: 40, donorName: null },
  { id: 'REQ-130', hospitalName: 'Aster CMI', patientName: 'Yami Gautam', bloodGroup: 'O+', units: 2, urgency: 'emergency', status: 'matching', city: 'Bangalore', time: '8 mins ago', matchTime: '2 mins', donorsContacted: 38, donorName: null },
  { id: 'REQ-131', hospitalName: 'Columbia Asia', patientName: 'Kiara Advani', bloodGroup: 'A-', units: 4, urgency: 'normal', status: 'matching', city: 'Kolkata', time: '12 hours ago', matchTime: '2 hours', donorsContacted: 10, donorName: null },
  { id: 'REQ-132', hospitalName: 'Deenanath Mangeshkar', patientName: 'Tiger Shroff', bloodGroup: 'B+', units: 2, urgency: 'urgent', status: 'matching', city: 'Pune', time: '50 mins ago', matchTime: '15 mins', donorsContacted: 25, donorName: null },
  { id: 'REQ-133', hospitalName: 'Bhatia Hospital', patientName: 'Vidya Balan', bloodGroup: 'O-', units: 1, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '3 mins ago', matchTime: '1 min', donorsContacted: 70, donorName: null },
  { id: 'REQ-134', hospitalName: 'Wockhardt Hospital', patientName: 'Ajay Devgn', bloodGroup: 'AB-', units: 3, urgency: 'urgent', status: 'matching', city: 'Mumbai', time: '40 mins ago', matchTime: '8 mins', donorsContacted: 33, donorName: null },
  { id: 'REQ-135', hospitalName: 'Jaslok Hospital', patientName: 'Kajol', bloodGroup: 'A+', units: 2, urgency: 'emergency', status: 'matching', city: 'Mumbai', time: '7 mins ago', matchTime: '2 mins', donorsContacted: 48, donorName: null },
  { id: 'REQ-136', hospitalName: 'Cumballa Hill', patientName: 'Sonu Sood', bloodGroup: 'B-', units: 5, urgency: 'normal', status: 'matching', city: 'Mumbai', time: '1 day ago', matchTime: '5 hours', donorsContacted: 5, donorName: null }
];

const initialDonors = [
  { id: 'DON-01', name: 'Rajesh Kumar', bloodGroup: 'O-', age: 29, weight: 74, lastDonation: '2026-03-15', city: 'Mumbai', contact: '+91 98765 43210', verified: true, eligibility: 'eligible' },
  { id: 'DON-02', name: 'Priya Patel', bloodGroup: 'A+', age: 25, weight: 58, lastDonation: '2026-04-10', city: 'Ahmedabad', contact: '+91 91234 56789', verified: true, eligibility: 'eligible' },
  { id: 'DON-03', name: 'Anand Joshi', bloodGroup: 'B+', age: 34, weight: 81, lastDonation: '2026-01-20', city: 'Pune', contact: '+91 94567 12345', verified: true, eligibility: 'eligible' },
  { id: 'DON-04', name: 'Sunita Rao', bloodGroup: 'O+', age: 27, weight: 62, lastDonation: '2026-05-02', city: 'Mumbai', contact: '+91 99887 76655', verified: true, eligibility: 'eligible' },
  { id: 'DON-05', name: 'Vikram Singh', bloodGroup: 'AB-', age: 31, weight: 79, lastDonation: '2026-06-18', city: 'Pune', contact: '+91 98989 89898', verified: true, eligibility: 'temporary_ineligible' },
];

const initialInventory = [
  { group: 'O+', units: 45, status: 'stable' },
  { group: 'A+', units: 32, status: 'stable' },
  { group: 'B+', units: 58, status: 'stable' },
  { group: 'AB+', units: 19, status: 'warning' },
  { group: 'O-', units: 5, status: 'critical' },
  { group: 'A-', units: 8, status: 'critical' },
  { group: 'B-', units: 12, status: 'warning' },
  { group: 'AB-', units: 3, status: 'critical' }
];

// ── Subscription helpers ─────────────────────────────────────────────────────
const getSubKey = (email) => `bb_subscription_${email}`;

const createInitialSubscription = () => {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 7);
  return {
    plan: 'free_trial',
    status: 'active',
    trialStart: now.toISOString(),
    trialEnd: trialEnd.toISOString(),
    renewalDate: trialEnd.toISOString(),
    paymentMethod: null,
    autoRenew: true,
    invoices: [],
    coupons: [],
    planHistory: [{ plan: 'free_trial', date: now.toISOString(), amount: 0 }]
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user') || localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Subscription State ──────────────────────────────────────────────────────
  const [subscription, setSubscription] = useState(() => {
    const savedUser = localStorage.getItem('auth_user') || localStorage.getItem('user');
    if (!savedUser) return null;
    const u = JSON.parse(savedUser);
    if (u?.role !== 'hospital') return null;
    const key = getSubKey(u.email);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    const fresh = createInitialSubscription();
    localStorage.setItem(key, JSON.stringify(fresh));
    return fresh;
  });

  // Persist subscription whenever it changes
  useEffect(() => {
    if (subscription && user?.email) {
      localStorage.setItem(getSubKey(user.email), JSON.stringify(subscription));
    }
  }, [subscription, user?.email]);

  // Initialise / load subscription when user changes
  useEffect(() => {
    if (user?.role === 'hospital') {
      const key = getSubKey(user.email);
      const saved = localStorage.getItem(key);
      if (saved) {
        setSubscription(JSON.parse(saved));
      } else {
        const fresh = createInitialSubscription();
        localStorage.setItem(key, JSON.stringify(fresh));
        setSubscription(fresh);
      }
    } else {
      setSubscription(null);
    }
  }, [user?.email, user?.role]);

  // Computed helpers
  const isTrialExpired = () => {
    if (!subscription) return false;
    if (subscription.plan !== 'free_trial') return false;
    return new Date() > new Date(subscription.trialEnd);
  };

  const daysRemaining = () => {
    if (!subscription) return 0;
    const end = new Date(subscription.trialEnd);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const upgradePlan = (newPlan) => {
    const now = new Date();
    const renewal = new Date(now);
    renewal.setMonth(renewal.getMonth() + 1);
    const amount = newPlan === 'enterprise' ? 7999 : 2999;
    const invoice = {
      id: `INV-${Date.now()}`,
      date: now.toISOString(),
      plan: newPlan,
      amount,
      status: 'paid',
      currency: 'INR'
    };
    setSubscription(prev => ({
      ...prev,
      plan: newPlan,
      status: 'active',
      renewalDate: renewal.toISOString(),
      invoices: [invoice, ...(prev?.invoices || [])],
      planHistory: [
        { plan: newPlan, date: now.toISOString(), amount },
        ...(prev?.planHistory || [])
      ]
    }));
  };

  const cancelSubscription = () => {
    setSubscription(prev => ({ ...prev, status: 'cancelled', autoRenew: false }));
  };

  const reactivateSubscription = () => {
    setSubscription(prev => ({ ...prev, status: 'active', autoRenew: true }));
  };

  const simulateTrialExpiry = () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    setSubscription(prev => ({ ...prev, plan: 'free_trial', trialEnd: past.toISOString(), status: 'expired' }));
  };

  const addPaymentMethod = (method) => {
    setSubscription(prev => ({ ...prev, paymentMethod: method }));
  };

  const [requests, setRequests] = useState(initialRequests);

  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem('donors');
    return saved ? JSON.parse(saved) : initialDonors;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Match Completed', message: 'Donor Vikram Singh dispatched for Apollo Speciality Center.', type: 'info', time: '5m ago', read: false },
    { id: 2, title: 'Emergency Alert', message: 'Critical demand for O- Negative blood at Metro Critical Care Hospital.', type: 'emergency', time: '10m ago', read: false },
    { id: 3, title: 'Rare Blood Match', message: 'AB- blood request resolved successfully.', type: 'success', time: '1h ago', read: true }
  ]);

  const [timeline, setTimeline] = useState(() => {
    // Populate with default items with base timestamps
    return [
      { id: 1, time: '2m ago', title: 'Donor dispatched', desc: 'Vikram Singh → Apollo Speciality Center', type: 'success', timestamp: Date.now() - 2 * 60 * 1000 },
      { id: 2, time: '8m ago', title: 'AI match initiated', desc: 'REQ-101 · O- · 24 donors contacted', type: 'info', timestamp: Date.now() - 8 * 60 * 1000 },
      { id: 3, time: '15m ago', title: 'Emergency alert', desc: 'Critical O- demand at Metro Critical Care', type: 'critical', timestamp: Date.now() - 15 * 60 * 1000 },
      { id: 4, time: '32m ago', title: 'Inventory updated', desc: 'AB- stock flagged for expiry review', type: 'warning', timestamp: Date.now() - 32 * 60 * 1000 },
      { id: 5, time: '1h ago', title: 'Request completed', desc: 'REQ-103 fulfilled · A+ · 5 units', type: 'success', timestamp: Date.now() - 60 * 60 * 1000 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    // Ensure all requests have a valid timestamp property
    setRequests(prev => prev.map(req => {
      if (req.timestamp) return req;
      let msAgo = 0;
      if (req.time.includes('10 mins')) msAgo = 10 * 60 * 1000;
      else if (req.time.includes('25 mins')) msAgo = 25 * 60 * 1000;
      else if (req.time.includes('3 hour')) msAgo = 3 * 60 * 60 * 1000;
      else if (req.time.includes('1 day')) msAgo = 24 * 60 * 60 * 1000;
      return { ...req, timestamp: Date.now() - msAgo };
    }));

    // Ensure all notifications have a valid timestamp property
    setNotifications(prev => prev.map(notif => {
      if (notif.timestamp) return notif;
      let msAgo = 0;
      if (notif.time.includes('5m')) msAgo = 5 * 60 * 1000;
      else if (notif.time.includes('10m')) msAgo = 10 * 60 * 1000;
      else if (notif.time.includes('1h')) msAgo = 60 * 60 * 1000;
      return { ...notif, timestamp: Date.now() - msAgo };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update requests relative time
      setRequests(prev => prev.map(req => {
        if (!req.timestamp) return req;
        const diffMins = Math.floor((Date.now() - req.timestamp) / 60000);
        let timeStr = 'Just now';
        if (diffMins >= 1 && diffMins < 60) {
          timeStr = `${diffMins} mins ago`;
        } else if (diffMins >= 60 && diffMins < 1440) {
          const hours = Math.floor(diffMins / 60);
          timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffMins >= 1440) {
          const days = Math.floor(diffMins / 1440);
          timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
        }
        return { ...req, time: timeStr };
      }));

      // Update notifications relative time
      setNotifications(prev => prev.map(notif => {
        if (!notif.timestamp) return notif;
        const diffMins = Math.floor((Date.now() - notif.timestamp) / 60000);
        let timeStr = 'just now';
        if (diffMins >= 1 && diffMins < 60) {
          timeStr = `${diffMins}m ago`;
        } else if (diffMins >= 60 && diffMins < 1440) {
          const hours = Math.floor(diffMins / 60);
          timeStr = `${hours}h ago`;
        } else if (diffMins >= 1440) {
          const days = Math.floor(diffMins / 1440);
          timeStr = `${days}d ago`;
        }
        return { ...notif, time: timeStr };
      }));

      // Update timeline relative time
      setTimeline(prev => prev.map(item => {
        if (!item.timestamp) return item;
        const diffMins = Math.floor((Date.now() - item.timestamp) / 60000);
        let timeStr = 'just now';
        if (diffMins >= 1 && diffMins < 60) {
          timeStr = `${diffMins}m ago`;
        } else if (diffMins >= 60 && diffMins < 1440) {
          const hours = Math.floor(diffMins / 60);
          timeStr = `${hours}h ago`;
        } else if (diffMins >= 1440) {
          const days = Math.floor(diffMins / 1440);
          timeStr = `${days}d ago`;
        }
        return { ...item, time: timeStr };
      }));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated Live Data Stream Generator
  useEffect(() => {
    const hospitals = [
      'Metro Critical Care Hospital',
      'Apollo Speciality Center',
      'Global General Clinic',
      'St. Jude Heart Institute',
      'Lilavati Hospital',
      'Kokilaben Dhirubhai Ambani Hospital',
      'Fortis Hiranandani Hospital'
    ];

    const patients = [
      'Rahul Roy',
      'Siddharth Malhotra',
      'Neha Kakkar',
      'Aishwarya Sen',
      'Amitabh Sen',
      'Rohan Joshi',
      'Preeti Zinta',
      'Deepika Padukone',
      'Ranveer Singh',
      'Alia Bhatt'
    ];

    const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    const urgencies = ['emergency', 'urgent', 'normal'];

    const interval = setInterval(() => {
      const rand = Math.random();

      if (rand < 0.4) {
        // Create a new simulated emergency request
        const group = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
        const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
        const units = Math.floor(Math.random() * 4) + 1;
        const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const reqId = `REQ-${Math.floor(200 + Math.random() * 800)}`;
        const contacts = Math.floor(Math.random() * 15) + 5;

        const newReq = {
          id: reqId,
          hospitalName: hospital,
          patientName: patient,
          bloodGroup: group,
          units: units,
          urgency: urgency,
          status: 'matching',
          city: 'Mumbai',
          time: 'Just now',
          timestamp: Date.now(),
          matchTime: 'AI Calculating...',
          donorsContacted: contacts,
          donorName: null
        };

        setRequests(prev => {
          const updated = [newReq, ...prev.slice(0, 15)];
          localStorage.setItem('requests', JSON.stringify(updated));
          return updated;
        });

        // Add corresponding notification
        const newNotif = {
          id: Date.now(),
          title: urgency === 'emergency' ? '🚨 CRITICAL MATCH REQUEST' : '🩸 New Dispatch Match',
          message: `${patient} requests ${units} units of ${group} at ${hospital}.`,
          type: urgency === 'emergency' ? 'emergency' : 'info',
          time: 'just now',
          timestamp: Date.now(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev.slice(0, 15)]);

        // Add corresponding timeline entry
        const newLog = {
          id: Date.now() + 2,
          time: 'just now',
          title: 'AI match initiated',
          desc: `${reqId} · ${group} · ${contacts} donors contacted`,
          type: 'info',
          timestamp: Date.now()
        };
        setTimeline(prev => [newLog, ...prev.slice(0, 10)]);

      } else if (rand < 0.7) {
        // Adjust inventory level slightly to simulate live consumption
        setInventory(prev => prev.map(inv => {
          if (Math.random() < 0.3) {
            const change = Math.random() < 0.6 ? -1 : 1; 
            const newUnits = Math.max(2, inv.units + change);
            const newStatus = newUnits < 6 ? 'critical' : newUnits < 15 ? 'warning' : 'stable';
            return { ...inv, units: newUnits, status: newStatus };
          }
          return inv;
        }));
      } else {
        // Toggle a random donor online/offline status
        setDonors(prev => prev.map(donor => {
          if (Math.random() < 0.2) {
            const currentElig = donor.eligibility;
            const newElig = currentElig === 'eligible' ? 'temporary_ineligible' : 'eligible';
            return { ...donor, eligibility: newElig };
          }
          return donor;
        }));
      }
    }, 20 * 1000);

    return () => clearInterval(interval);
  }, []);

  // --- DEPRECATED MOCK AUTH LOGIC ---
  /*
  const loginMock = (email, password, role) => {
    let userDetails = {
      email,
      name: role === 'hospital' ? 'Metro Critical Care' : role === 'donor' ? 'Rajesh Kumar' : 'System Admin Office',
      role: role || 'donor',
      token: 'mock-jwt-token-12345'
    };
    setUser(userDetails);
    localStorage.setItem('auth_user', JSON.stringify(userDetails));
    return true;
  };

  const signupMock = (name, email, password, role) => {
    let userDetails = {
      email,
      name,
      role: role || 'donor',
      token: 'mock-jwt-token-12345'
    };
    setUser(userDetails);
    localStorage.setItem('auth_user', JSON.stringify(userDetails));
    return true;
  };

  const logoutMock = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };
  */
  // ----------------------------------

  // Live session check on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            const userObj = res.data.user || res.data;
            setUser(userObj);
            localStorage.setItem('auth_user', JSON.stringify(userObj));
            localStorage.setItem('user', JSON.stringify(userObj));
          }
        } catch (err) {
          console.error('Session validation error:', err);
          if (err.response && err.response.status === 401) {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth_user');
          }
        }
      }
    };
    checkSession();
  }, []);

  const login = async (emailOrCredentials, password, role) => {
    try {
      let credentials;
      if (typeof emailOrCredentials === 'object' && emailOrCredentials !== null) {
        credentials = emailOrCredentials;
      } else {
        credentials = { email: emailOrCredentials, password, role };
      }

      const res = await authService.login(credentials);
      if (res.success && res.data) {
        const userObj = res.data.user;
        setUser(userObj);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        localStorage.setItem('user', JSON.stringify(userObj));
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return true;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      console.error('Login request failed:', err);
      throw err;
    }
  };

  const googleLogin = async (token, role = 'donor') => {
    try {
      const res = await authService.googleLogin(token, role);
      if (res.success && res.data) {
        const userObj = res.data.user;
        setUser(userObj);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        localStorage.setItem('user', JSON.stringify(userObj));
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return true;
      }
      throw new Error(res.message || 'Google Login failed');
    } catch (err) {
      console.error('Google Login request failed:', err);
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      const res = await authService.signup(payload);
      if (res.success && res.data) {
        const userObj = res.data.user;
        setUser(userObj);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        localStorage.setItem('user', JSON.stringify(userObj));
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return true;
      }
      throw new Error(res.message || 'Signup failed');
    } catch (err) {
      console.error('Signup request failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const createRequest = (requestData) => {
    const newReq = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      hospitalName: requestData.hospitalName || user.name || 'General Hospital',
      patientName: requestData.patientName,
      bloodGroup: requestData.bloodGroup,
      units: parseInt(requestData.units),
      urgency: requestData.urgency || 'emergency',
      status: 'matching',
      city: requestData.city,
      time: 'Just now',
      timestamp: Date.now(),
      matchTime: 'AI Calculating...',
      donorsContacted: Math.floor(Math.random() * 30) + 10,
      donorName: null,
      isManual: true
    };

    setRequests(prev => [newReq, ...prev]);

    // Create Notification
    const newNotif = {
      id: Date.now(),
      title: 'New Request Created',
      message: `Emergency request for ${requestData.units} units of ${requestData.bloodGroup} in ${requestData.city} is active.`,
      type: 'emergency',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Deduct blood or adjust inventory warning
    setInventory(prev => 
      prev.map(item => {
        if (item.group === requestData.bloodGroup) {
          const updatedUnits = Math.max(0, item.units - requestData.units);
          return {
            ...item,
            units: updatedUnits,
            status: updatedUnits < 5 ? 'critical' : updatedUnits < 15 ? 'warning' : 'stable'
          };
        }
        return item;
      })
    );

    // Simulate AI donor match after 5 seconds
    setTimeout(() => {
      setRequests(currentReqs => 
        currentReqs.map(r => {
          if (r.id === newReq.id) {
            return {
              ...r,
              status: 'dispatched',
              matchTime: '45 seconds',
              donorName: donors[Math.floor(Math.random() * donors.length)].name
            };
          }
          return r;
        })
      );
      
      setNotifications(prev => [
        {
          id: Date.now() + 1,
          title: 'AI Donor Dispatched',
          message: `Matched donor has accepted the dispatch for ${newReq.hospitalName}.`,
          type: 'success',
          time: 'Just now',
          read: false
        },
        ...prev
      ]);
    }, 5000);

    return newReq;
  };

  const registerDonor = (donorData) => {
    const newDonor = {
      id: `DON-${Math.floor(100 + Math.random() * 900)}`,
      name: donorData.name,
      bloodGroup: donorData.bloodGroup,
      age: parseInt(donorData.age),
      weight: parseInt(donorData.weight),
      lastDonation: donorData.lastDonation || '',
      city: donorData.city,
      contact: donorData.contact,
      verified: true,
      eligibility: parseInt(donorData.age) >= 18 && parseInt(donorData.weight) >= 45 ? 'eligible' : 'ineligible'
    };
    setDonors(prev => [newDonor, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'New Donor Registered',
        message: `${donorData.name} (${donorData.bloodGroup}) registered and verified successfully.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newDonor;
  };

  const updateRequestStatus = (id, newStatus) => {
    setRequests(prev => 
      prev.map(r => {
        if (r.id === id) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      requests,
      donors,
      inventory,
      notifications,
      timeline,
      login,
      googleLogin,
      signup,
      register: signup,
      logout,
      createRequest,
      registerDonor,
      updateRequestStatus,
      setNotifications,
      // Subscription
      subscription,
      isTrialExpired,
      daysRemaining,
      upgradePlan,
      cancelSubscription,
      reactivateSubscription,
      simulateTrialExpiry,
      addPaymentMethod
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
