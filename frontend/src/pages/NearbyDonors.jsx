import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { FiMapPin, FiClock, FiStar, FiSearch, FiZap, FiUsers, FiClock as FiClockIcon, FiShield, FiHeart, FiActivity, FiArrowRight } from 'react-icons/fi';
import donorService from '../services/donorService';

const BLOOD_GROUPS = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const colors = [
  { group: 'O+', border: 'border-t-indigo-500', wave: 'text-indigo-500', badge: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-600', fill: '#6366F1' },
  { group: 'O-', border: 'border-t-rose-500', wave: 'text-rose-500', badge: 'bg-rose-50 text-rose-700', text: 'text-rose-600', fill: '#F43F5E' },
  { group: 'A+', border: 'border-t-rose-500', wave: 'text-rose-500', badge: 'bg-rose-50 text-rose-700', text: 'text-rose-600', fill: '#F43F5E' },
  { group: 'A-', border: 'border-t-emerald-500', wave: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-600', fill: '#10B981' },
  { group: 'B+', border: 'border-t-emerald-500', wave: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-600', fill: '#10B981' },
  { group: 'B-', border: 'border-t-violet-500', wave: 'text-violet-500', badge: 'bg-violet-50 text-violet-700', text: 'text-violet-600', fill: '#8B5CF6' },
  { group: 'AB+', border: 'border-t-pink-500', wave: 'text-pink-500', badge: 'bg-pink-50 text-pink-700', text: 'text-pink-600', fill: '#EC4899' },
  { group: 'AB-', border: 'border-t-purple-400', wave: 'text-purple-400', badge: 'bg-purple-50 text-purple-700', text: 'text-purple-600', fill: '#A78BFA' },
];

const NearbyDonors = () => {
  const { userLocation } = useLocation();
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  
  const [donorsList, setDonorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch donors from database
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await donorService.getDonors({ limit: 50 });
        // Fixed: response.data.data instead of response.data.docs
        if (response.success && response.data && response.data.data) {
          const fetched = response.data.data.map((d, index) => {
            const style = colors.find(c => c.group === d.bloodGroup) || colors[0];
            return {
              ...d,
              id: d._id,
              distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km away',
              eta: Math.floor(Math.random() * 30 + 2) + ' MINS AGO',
              style: style,
              aiScore: d.aiScore || 90,
              avatarChar: d.avatarChar || d.name?.charAt(0) || 'A',
            };
          });
          setDonorsList(fetched);
        }
      } catch (err) {
        console.error('Failed to fetch donors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  // Dynamic AI Score Simulation
  useEffect(() => {
    if (donorsList.length === 0) return;
    const interval = setInterval(() => {
      setDonorsList(prev => prev.map(d => {
        if (Math.random() > 0.7) {
          const change = Math.floor(Math.random() * 4) - 1; 
          let newScore = (d.aiScore || 90) + change;
          if (newScore > 99) newScore = 99;
          if (newScore < 85) newScore = 85;
          return { ...d, aiScore: newScore };
        }
        return d;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [donorsList.length]);

  const donors = useMemo(() => {
    let list = [...donorsList];

    if (search) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.bloodGroup.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (bloodFilter !== 'All') {
      list = list.filter(d => d.bloodGroup === bloodFilter);
    }

    if (onlyEligible) {
      list = list.filter(d => d.isAvailable);
    }

    if (sortBy === 'score') list.sort((a, b) => b.aiScore - a.aiScore);
    else if (sortBy === 'distance') list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, bloodFilter, onlyEligible, sortBy, donorsList]);

  return (
    <div className="space-y-6 pb-24 lg:pb-6 text-left">
      {/* Title block & Indicators row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-extrabold text-gray-950 dark:text-white text-[24px] tracking-tight leading-none flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" /></svg>
            </span>
            Donor Network
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-[13px] font-semibold mt-1">
            AI-ranked donors near <span className="text-[#E11D48] font-bold">{userLocation?.name || 'Ahmedabad'}</span>
          </p>
        </div>

        {/* Indicators pills */}
        <div className="flex flex-wrap items-center gap-3.5 my-1 lg:my-0">
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left hover:shadow-md transition-shadow">
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{donorsList.length}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Total Donors</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left hover:shadow-md transition-shadow">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{donorsList.filter(d => d.isAvailable).length}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or blood group..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-rose-100/50 dark:border-rose-950/30 rounded-2xl text-[13px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-left"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Blood groups outline capsules */}
          <div className="flex gap-1.5 flex-wrap">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg}
                onClick={() => setBloodFilter(bg)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                  bloodFilter === bg
                    ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-sm'
                    : 'bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 text-gray-500 hover:border-rose-200'
                }`}
              >{bg}</button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <label className="flex items-center gap-2 text-[12px] font-bold text-gray-500 cursor-pointer">
              <input type="checkbox" checked={onlyEligible} onChange={e => setOnlyEligible(e.target.checked)} className="accent-[#E11D48] w-4 h-4 rounded border-gray-300" />
              <span>Available only</span>
            </label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-[12px] font-bold text-gray-550 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="score">Sort by: AI Score</option>
              <option value="distance">Sort by: Distance</option>
              <option value="name">Sort by: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Ranked List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-1">
          <FiZap className="w-4 h-4 text-indigo-500" />
          <span className="text-gray-900 dark:text-white">Active Donors Registry</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl h-64"></div>
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-10 text-center text-gray-400 font-bold">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-700 dark:text-white text-base">No donors match your search filters</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {donors.map((d, i) => {
                const isAvailable = d.isAvailable;
                
                return (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className={`bg-white dark:bg-slate-900 border-t-4 ${d.style.border} border-x border-b border-gray-100 dark:border-slate-800 rounded-[24px] rounded-t-lg shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col`}
                  >
                    {/* Wavy SVG Background at bottom */}
                    <svg viewBox="0 0 1440 320" className={`absolute bottom-0 w-full h-32 opacity-15 pointer-events-none ${d.style.wave}`} preserveAspectRatio="none">
                      <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,181.3C384,160,480,96,576,101.3C672,107,768,181,864,192C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <div className="p-6 pb-20 relative z-10 flex-1">
                      {/* Top Header Row */}
                      <div className="flex justify-between items-start mb-6">
                        {/* Blood Group Circle */}
                        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-xl shadow-sm ${d.style.badge}`}>
                          {d.bloodGroup}
                          <svg className="w-3 h-3 mt-0.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" /></svg>
                        </div>
                        
                        {/* Time & Status info */}
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                            <FiClock className="w-3 h-3" /> {d.eta}
                          </div>
                          <div className="font-black text-gray-900 dark:text-white tracking-wide text-[13px] mb-1.5 uppercase">
                            DONOR-{d.id.slice(-4)}
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                          </span>
                        </div>
                      </div>

                      {/* Name & Badges */}
                      <div className="mb-4">
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">{d.name}</h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${d.style.badge}`}>
                            {d.bloodGroup}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider">
                            MATCHING
                          </span>
                        </div>
                      </div>

                      {/* Location & Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                          <FiMapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{d.city}, {d.state} ({d.distance})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#E11D48] text-[13px] font-bold">
                          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" /></svg>
                          <span>{d.donationCount} past donations</span>
                        </div>
                      </div>

                      {/* Boxes */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3">
                          <FiZap className="w-5 h-5 text-rose-500 flex-shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">AI Score</p>
                            <p className="text-xs font-black text-gray-900 dark:text-white leading-tight">{d.aiScore}/100</p>
                          </div>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-100 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3">
                          <FiActivity className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Response</p>
                            <p className="text-xs font-black text-gray-900 dark:text-white leading-tight">{d.responseRate || 95}% rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Action Button */}
                    <div className="absolute bottom-5 right-5 z-20">
                      <Link 
                        to={`/donor/${d.id}`}
                        className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 text-gray-600 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer group/btn`}
                      >
                        <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NearbyDonors;
