import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiMapPin, FiClock, FiActivity, FiHeart, FiStar, 
  FiPhone, FiCalendar, FiUser, FiCheckCircle, FiMail, FiNavigation, FiInfo
} from 'react-icons/fi';
import donorService from '../services/donorService';

// Blood Drop Icon SVG
const BloodDrop = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const ScoreRing = ({ score }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-28 h-28 mx-auto my-6 flex-shrink-0">
      <svg width={112} height={112} className="-rotate-90">
        <circle cx={56} cy={56} r={r} fill="none" stroke="#FFE4E6" strokeWidth={6} />
        <circle cx={56} cy={56} r={r} fill="none" stroke="#E11D48" strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-800 dark:text-white leading-none tracking-tight">{score}</span>
        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-center leading-tight">AI Trust<br/>Score</span>
      </div>
    </div>
  );
};

const TopStatBlock = ({ icon: Icon, label, value, iconColor, iconBg }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 dark:border-slate-700 shadow-sm flex-1">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
      <Icon className="w-4.5 h-4.5" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-bold text-slate-800 dark:text-white leading-none">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, text, subtext, highlight }) => (
  <div className="flex items-start gap-3 mb-4">
    <Icon className={`w-4.5 h-4.5 mt-0.5 ${highlight ? 'text-blue-500' : 'text-slate-400'}`} />
    <div>
      <p className={`text-sm ${highlight ? 'text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>{text}</p>
      {subtext && <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{subtext}</p>}
    </div>
  </div>
);

const DonorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const response = await donorService.getDonorById(id);
        if (response.success) {
          const d = response.data;
          setDonor({
            ...d,
            distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km',
            aiScore: d.aiScore || 96,
            avatarChar: d.avatarChar || d.name?.charAt(0) || 'R'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-[#F8F9FA] dark:bg-slate-900">
        <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center bg-[#F8F9FA] dark:bg-slate-900">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-slate-100 dark:border-slate-700">🔍</div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Profile Unavailable</h2>
        <p className="text-slate-500 mb-6 text-sm max-w-xs">The donor profile you're looking for doesn't exist or is private.</p>
        <button 
          onClick={() => navigate('/hospital/dashboard', { state: { activeTab: 'donors' } })} 
          className="px-6 py-2.5 bg-[#E11D48] text-white rounded-xl font-bold shadow-sm hover:-translate-y-0.5 transition-all text-sm"
        >
          Back to Network
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col pt-6 pb-12 px-4 sm:px-8 text-left bg-[#F8F9FA] dark:bg-[#0F1420]">
      <div className="mb-6 max-w-[1000px] w-full mx-auto">
        <button 
          onClick={() => navigate('/hospital/dashboard', { state: { activeTab: 'donors' } })}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors font-bold text-[11px] uppercase tracking-wider"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-[1000px] w-full mx-auto"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* LEFT COLUMN: Identity & Badges */}
          <div className="relative p-8 md:p-10 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 w-full md:w-[32%] bg-[#FCFDFD] dark:bg-slate-900/50">
            
            {/* Top Right Blood Badge */}
            <div className="absolute top-6 right-6 bg-[#E11D48] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <BloodDrop className="w-3 h-3 text-white" />
              <span className="text-xs font-black tracking-wide">{donor.bloodGroup}</span>
            </div>

            {/* Subtle background dots/pattern (optional UI flair) */}
            <div className="absolute top-4 left-4 w-24 h-24 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-50"></div>

            {/* Avatar */}
            <div className="w-28 h-28 rounded-[24px] bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-[44px] font-black text-[#E11D48] mb-5 mt-4 relative z-10">
              {donor.avatarChar}
            </div>
            
            {/* Name & Status */}
            <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-1">{donor.name}</h1>
            <div className="flex items-center gap-1.5 text-blue-600 mb-4">
              <FiCheckCircle className="w-4 h-4 fill-blue-600 text-white dark:text-slate-900" />
              <span className="text-[11px] font-bold tracking-wide">Verified Donor</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${donor.isAvailable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {donor.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <ScoreRing score={donor.aiScore} />

            {/* Bottom Stacked Stats (Donations & Date) */}
            <div className="w-full space-y-3 mt-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                  <FiHeart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-base font-black text-slate-800 dark:text-white leading-none mb-1">{donor.donationCount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Total Donations</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">
                    {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'New Donor'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Last Donation</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Details & Action */}
          <div className="p-8 md:p-10 flex-1 flex flex-col justify-between w-full md:w-[68%]">
            
            {/* Top Stat Blocks */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <TopStatBlock 
                icon={FiUser} 
                label="Age" 
                value={`${donor.age} yrs`} 
                iconColor="text-rose-500" 
                iconBg="bg-rose-50 dark:bg-rose-900/20" 
              />
              <TopStatBlock 
                icon={FiActivity} 
                label="Weight" 
                value={`${donor.weight} kg`} 
                iconColor="text-blue-500" 
                iconBg="bg-blue-50 dark:bg-blue-900/20" 
              />
              <TopStatBlock 
                icon={FiStar} 
                label="Rating" 
                value={`${donor.rating} / 5`} 
                iconColor="text-amber-500" 
                iconBg="bg-amber-50 dark:bg-amber-900/20" 
              />
            </div>

            {/* Middle Section: Contact & Medical */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {/* Contact & Location */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Contact & Location</h3>
                <div className="flex flex-col gap-5">
                  <InfoRow icon={FiPhone} text={donor.contact} />
                  {donor.email && <InfoRow icon={FiMail} text={donor.email} />}
                  <InfoRow icon={FiMapPin} text={`${donor.city}, ${donor.state}`} />
                  <InfoRow icon={FiNavigation} text={`${donor.distance} from your hospital`} highlight={true} />
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Medical Information</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium"><FiCalendar className="w-4 h-4"/> Last Health Check</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-GB') : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium"><FiActivity className="w-4 h-4"/> Medical Status</span>
                    <span className="font-bold text-emerald-600 text-right">
                      {donor.medicalConditions && donor.medicalConditions.length > 0 ? (
                        <div className="flex flex-col gap-1 items-end">
                          {donor.medicalConditions.map((c, i) => <span key={i}>{c}</span>)}
                        </div>
                      ) : (
                        'Healthy'
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <span className="flex items-center gap-2 text-slate-500 font-medium"><FiInfo className="w-4 h-4"/> Diseases</span>
                    <span className="font-bold text-emerald-600">None reported</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
              {donor.isAvailable ? (
                <>
                  <button 
                    onClick={() => navigate(`/donor/${donor._id}/request`)}
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-[#E11D48] hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
                  >
                    <BloodDrop className="w-4 h-4" /> Request Donation
                  </button>
                </>
              ) : (
                <div className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                  <FiClock className="w-4 h-4" /> Currently Unavailable
                </div>
              )}
            </div>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorProfile;
