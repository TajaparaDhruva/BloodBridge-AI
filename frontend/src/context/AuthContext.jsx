import React, { createContext, useContext, useState, useEffect } from 'react';
import { activityTimeline } from '../components/dashboard/shared';

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
  }
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('requests');
    return saved ? JSON.parse(saved) : initialRequests;
  });

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

  const login = (email, password, role) => {
    // Simulated auth check
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

  const signup = (name, email, password, role) => {
    let userDetails = {
      email,
      name,
      role: role || 'donor',
      token: 'mock-jwt-token-12345'
    };
    setUser(userDetails);
    localStorage.setItem('auth_user', JSON.stringify(userDetails));
    
    // Add default donor representation if signup as donor
    if (role === 'donor') {
      const newDonor = {
        id: `DON-${donors.length + 1}`,
        name,
        bloodGroup: 'O+',
        age: 26,
        weight: 65,
        lastDonation: '',
        city: 'Mumbai',
        contact: '+91 99999 99999',
        verified: false,
        eligibility: 'eligible'
      };
      setDonors(prev => [newDonor, ...prev]);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
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
      donorName: null
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
      signup,
      logout,
      createRequest,
      registerDonor,
      updateRequestStatus,
      setNotifications
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
