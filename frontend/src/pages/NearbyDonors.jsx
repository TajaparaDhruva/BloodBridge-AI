import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { NEARBY_DONORS } from '../data/mockDonors';
import { FiFilter, FiZap, FiMapPin, FiClock, FiStar, FiPhone, FiSearch } from 'react-icons/fi';

const BLOOD_GROUPS = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const ScoreRing = ({ score }) => {
  const color = score >= 90 ? '#059669' : score >= 75 ? '#D97706' : '#C62A47';
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg width={48} height={48} className="-rotate-90">
        <circle cx={24} cy={24} r={r} fill="none" stroke="currentColor" strokeWidth={3.5} className="text-black/05 dark:text-white/05" />
        <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
};

const NearbyDonors = () => {
  const { userLocation } = useLocation();
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sortBy, setSortBy] = useState('score'); // score | distance | name
  const [selected, setSelected] = useState(null);

  const donors = useMemo(() => {
    let list = [...NEARBY_DONORS];

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

  const handleContact = (d) => {
    alert(`Dispatching AI-coordinated request to ${d.name}...\nPhone: ${d.phone}\nBlood Group: ${d.bloodGroup}\nAI Match Score: ${d.aiScore}%`);
  };

  return (
    <div className="space-y-5 pb-24 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="font-extrabold text-slate dark:text-white text-[22px] flex items-center gap-2">
          🩸 Donor Network
        </h1>
        <p className="text-muted text-[13px] mt-0.5">
          AI-ranked donors near <span className="font-bold text-bloodred">{userLocation?.name || 'Mumbai'}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="card-premium p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or blood group..."
            className="w-full pl-10 pr-4 py-3 bg-canvas dark:bg-darkbg border border-black/06 dark:border-white/06 rounded-xl text-[13px] text-slate dark:text-white placeholder-muted focus:outline-none focus:border-bloodred transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Blood group filter */}
          <div className="flex gap-1 flex-wrap">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg}
                onClick={() => setBloodFilter(bg)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border-2 transition-all ${
                  bloodFilter === bg
                    ? 'bg-bloodred border-bloodred text-white'
                    : 'border-black/08 dark:border-white/08 text-muted hover:border-bloodred/30'
                }`}
              >{bg}</button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto items-center">
            <label className="flex items-center gap-2 text-[12px] font-semibold text-muted cursor-pointer">
              <input type="checkbox" checked={onlyEligible} onChange={e => setOnlyEligible(e.target.checked)} className="accent-bloodred" />
              Eligible only
            </label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-[12px] font-semibold text-muted bg-black/04 dark:bg-white/04 border border-black/06 dark:border-white/06 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="score">Sort: AI Score</option>
              <option value="distance">Sort: Distance</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donor list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-widest px-1">
          <FiZap className="w-3.5 h-3.5 text-aiblue" />
          AI Ranked Results — {donors.length} donors
        </div>

        <AnimatePresence mode="popLayout">
          {donors.length === 0 ? (
            <div className="card-premium p-10 text-center text-muted">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-slate dark:text-white">No donors match your criteria</p>
              <p className="text-[13px] mt-1">Try adjusting the filters above</p>
            </div>
          ) : donors.map((d, i) => (
            <motion.div
              key={d.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelected(selected?.id === d.id ? null : d)}
              className={`card-premium p-5 cursor-pointer transition-all ${
                selected?.id === d.id ? 'ring-2 ring-bloodred/30 border-bloodred/20' : ''
              }`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black flex-shrink-0 ${
                  i === 0 ? 'bg-bloodred text-white' : i === 1 ? 'bg-slate dark:bg-darksurf2 text-white' : 'bg-black/06 dark:bg-white/06 text-muted'
                }`}>
                  {i + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-2xl bg-bloodred/08 flex items-center justify-center text-lg font-bold text-bloodred flex-shrink-0">
                  {d.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-slate dark:text-white text-[14px]">{d.name}</p>
                    <span className="px-2 py-0.5 bg-bloodred/08 border border-bloodred/12 text-bloodred text-[10px] font-black rounded-lg">
                      {d.bloodGroup}
                    </span>
                    {d.available ? (
                      <span className="badge badge-stable">Available</span>
                    ) : (
                      <span className="badge badge-urgent">Unavailable</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted font-semibold">
                    <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" />{d.distance}</span>
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{d.eta}</span>
                    <span className="flex items-center gap-1"><FiStar className="w-3 h-3 text-amber-500" />{d.rating}</span>
                  </div>
                </div>

                {/* Score ring */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wide">AI Score</p>
                    <ScoreRing score={d.aiScore} />
                  </div>
                  {d.available && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleContact(d); }}
                      className="p-2.5 rounded-xl bg-bloodred hover:bg-bloodred-dark text-white transition-colors shadow-sm"
                      title="Contact Donor"
                    >
                      <FiPhone className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {selected?.id === d.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-black/05 dark:border-white/05 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                      {[
                        { label: 'Age', value: `${d.age || 28} years` },
                        { label: 'Weight', value: `${d.weight || 70} kg` },
                        { label: 'Donations', value: `${d.donationCount || 3} total` },
                        { label: 'Last Donated', value: d.lastDonation || '3 months ago' },
                      ].map(f => (
                        <div key={f.label} className="bg-black/02 dark:bg-white/02 rounded-xl p-3">
                          <p className="text-muted font-semibold">{f.label}</p>
                          <p className="font-bold text-slate dark:text-white mt-0.5">{f.value}</p>
                        </div>
                      ))}
                    </div>
                    {d.available && (
                      <button
                        onClick={() => handleContact(d)}
                        className="btn-primary w-full justify-center py-3 mt-3 text-[13px]"
                      >
                        <FiZap className="w-4 h-4" />
                        Dispatch AI Request to {d.name.split(' ')[0]}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyDonors;
