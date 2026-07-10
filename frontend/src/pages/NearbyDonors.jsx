import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { FiMapPin, FiClock, FiStar, FiSearch, FiZap, FiUsers, FiClock as FiClockIcon, FiShield } from 'react-icons/fi';

const BLOOD_GROUPS = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const ScoreRing = ({ score }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg width={48} height={48} className="-rotate-90">
        <circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3.5} className="text-gray-100 dark:text-slate-800" />
        <circle cx={24} cy={24} r={r} fill="none" stroke="#10B981" strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-black text-gray-800 dark:text-white">{score}</span>
      </div>
    </div>
  );
};

const NearbyDonors = () => {
  const { userLocation } = useLocation();
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [selected, setSelected] = useState(null);

  const staticMockDonors = [
    {
      id: 'DON-01',
      name: 'Rajesh Kumar',
      bloodGroup: 'O-',
      available: false,
      distance: '0.8 km away',
      eta: '3 min ago',
      aiScore: 97,
      avatarChar: 'R',
      sideBorderColor: 'bg-[#E11D48]',
      avatarStyle: 'bg-rose-50 text-[#E11D48] border border-rose-100/20',
      rankStyle: 'bg-rose-50/50 text-[#E11D48]',
      age: 29,
      weight: 74,
      donationCount: 5,
      lastDonation: '3 months ago'
    },
    {
      id: 'DON-02',
      name: 'Deepak Nair',
      bloodGroup: 'O+',
      available: false,
      distance: '5 km away',
      eta: '18 min ago',
      aiScore: 96,
      avatarChar: 'D',
      sideBorderColor: 'bg-[#6366F1]',
      avatarStyle: 'bg-indigo-50 text-[#6366F1] border border-indigo-100/20',
      rankStyle: 'bg-indigo-50/50 text-[#6366F1]',
      age: 32,
      weight: 78,
      donationCount: 6,
      lastDonation: '2 months ago'
    },
    {
      id: 'DON-03',
      name: 'Sunita Rao',
      bloodGroup: 'O+',
      available: false,
      distance: '2.8 km away',
      eta: '10 min ago',
      aiScore: 93,
      avatarChar: 'S',
      sideBorderColor: 'bg-[#3B82F6]',
      avatarStyle: 'bg-sky-50 text-sky-600 border border-sky-100/20',
      rankStyle: 'bg-sky-50/50 text-sky-650',
      age: 27,
      weight: 62,
      donationCount: 4,
      lastDonation: '1 month ago'
    },
    {
      id: 'DON-04',
      name: 'Priya Patel',
      bloodGroup: 'A+',
      available: false,
      distance: '4.1 km away',
      eta: '7 min ago',
      aiScore: 91,
      avatarChar: 'P',
      sideBorderColor: 'bg-[#E11D48]',
      avatarStyle: 'bg-rose-50 text-[#E11D48] border border-[#FFE4E6]/25',
      rankStyle: 'bg-rose-50/50 text-[#E11D48]',
      age: 25,
      weight: 58,
      donationCount: 3,
      lastDonation: '4 months ago'
    }
  ];

  const donors = useMemo(() => {
    let list = [...staticMockDonors];

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
      list = list.filter(d => d.available);
    }

    if (sortBy === 'score') list.sort((a, b) => b.aiScore - a.aiScore);
    else if (sortBy === 'distance') list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, bloodFilter, onlyEligible, sortBy]);

  return (
    <div className="space-y-6 pb-24 lg:pb-6 text-left">
      {/* Title block & Indicators row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-extrabold text-gray-950 dark:text-white text-[24px] tracking-tight leading-none">
            Donor <span className="text-[#E11D48]">Network</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-[13px] font-semibold mt-1">
            AI-ranked donors near <span className="text-[#E11D48] font-bold">{userLocation?.name || 'Ahmedabad'}</span>
          </p>
        </div>

        {/* Indicators pills */}
        <div className="flex flex-wrap items-center gap-3.5 my-1 lg:my-0">
          {/* Total Donors */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">128</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Total Donors</span>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
              </svg>
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">25</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Available</span>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">42</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Active</span>
            </div>
          </div>

          {/* Recently Online */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px] text-left">
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0">
              <FiClockIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">6</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Recently Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* White container filter card */}
      <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
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
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-505 dark:text-gray-400 hover:border-rose-200'
                }`}
              >{bg}</button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <label className="flex items-center gap-2 text-[12px] font-bold text-gray-500 cursor-pointer">
              <input type="checkbox" checked={onlyEligible} onChange={e => setOnlyEligible(e.target.checked)} className="accent-[#E11D48] w-4 h-4 rounded border-gray-300" />
              <span>Eligible only</span>
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
        {/* Results title */}
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-1">
          <FiZap className="w-4 h-4 text-indigo-500" />
          <span className="text-gray-900 dark:text-white">AI Ranked Results</span>
          <span className="bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-md text-[9px] font-black border border-indigo-100/25 tracking-wider uppercase ml-1">
            {donors.length} DONORS FOUND
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {donors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-10 text-center text-gray-400 font-bold">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-700 dark:text-white text-base">No donors match your search filters</p>
              <p className="text-xs mt-1 font-semibold">Try adjusting the filter checkboxes above</p>
            </div>
          ) : donors.map((d, i) => {
            let bgBadgeStyle = 'bg-rose-50 text-[#E11D48] border border-rose-100/20';
            if (d.bloodGroup === 'O+') {
              bgBadgeStyle = 'bg-amber-50 text-amber-600 border border-amber-100/20';
            } else if (d.bloodGroup === 'A+') {
              bgBadgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100/20';
            }

            return (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelected(selected?.id === d.id ? null : d)}
                className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left cursor-pointer"
                whileHover={{ y: -2 }}
              >
                {/* Colored Left stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl ${d.sideBorderColor}`} />

                <div className="flex items-center gap-4 flex-1 w-full">
                  {/* Rounded square avatar */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black ${d.avatarStyle} flex-shrink-0 shadow-sm`}>
                    {d.avatarChar}
                  </div>

                  {/* Rank indicator box */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${d.rankStyle} flex-shrink-0 shadow-inner`}>
                    {i + 1}
                  </div>

                  {/* Details block */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-[14.5px] leading-snug">{d.name}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider ${bgBadgeStyle}`}>
                        {d.bloodGroup}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100/20 text-[9.5px] font-black uppercase rounded-lg tracking-wider">
                        Unavailable
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-[11px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-gray-400" />{d.distance}</span>
                      <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5 text-gray-400" />{d.eta}</span>
                      <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5 text-amber-500" /></span>
                    </div>
                  </div>
                </div>

                {/* Rightmost AI score ring and view profile button */}
                <div className="flex items-center gap-4.5 w-full lg:w-auto justify-between lg:justify-end border-t border-gray-100 dark:border-slate-800 lg:border-t-0 pt-4 lg:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">AI Score</span>
                    <ScoreRing score={d.aiScore} />
                  </div>

                  <button className="border border-rose-100/80 dark:border-rose-950/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-[#E11D48] text-xs font-black px-4.5 py-2 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-all uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Profile</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyDonors;
