import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPhone, FiUser, FiZap, FiMapPin, FiClock } from 'react-icons/fi';

const RequestDetailsModal = ({ request, onClose, onCallDispatch, donors }) => {
  // Simple check for compatible donors
  const getCompatibleDonors = (bloodGroup) => {
    return donors.filter(donor => {
      // Direct group match
      if (donor.bloodGroup === bloodGroup) return true;
      // Universal donor O- is compatible with all groups
      if (donor.bloodGroup === 'O-') return true;
      return false;
    }).slice(0, 3);
  };

  const compDonors = getCompatibleDonors(request.bloodGroup);

  // Dynamic theme variables matching the card's urgency
  let themeColor = 'bg-[#8B5CF6]';
  let badgeColor = 'bg-purple-50 text-[#8B5CF6] border border-purple-100/50 dark:bg-purple-950/20 dark:text-purple-400';
  let bannerColor = 'bg-[#F5F3FF] dark:bg-purple-950/10 text-[#6D28D9]';
  
  if (request.urgency === 'normal') {
    themeColor = 'bg-[#10B981]';
    badgeColor = 'bg-emerald-50 text-[#10B981] border border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400';
    bannerColor = 'bg-[#F0FDF4] dark:bg-emerald-950/10 text-[#15803D]';
  } else if (request.urgency === 'urgent' || request.urgency === 'emergency') {
    themeColor = 'bg-[#E11D48]';
    badgeColor = 'bg-rose-50 text-[#E11D48] border border-rose-100/50 dark:bg-rose-950/20 dark:text-rose-450';
    bannerColor = 'bg-[#FFF1F2] dark:bg-rose-950/10 text-[#E11D48]';
  } else if (request.urgency === 'info' || request.urgency === 'information') {
    themeColor = 'bg-[#3B82F6]';
    badgeColor = 'bg-blue-50 text-[#3B82F6] border border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-400';
    bannerColor = 'bg-[#EFF6FF] dark:bg-blue-950/10 text-blue-600';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6.5 shadow-2xl relative text-left"
      >
        {/* Curving banner accent */}
        <div className={`absolute top-0 left-0 right-0 h-[6px] ${themeColor} rounded-t-[28px]`} />

        {/* Top Header */}
        <div className="flex items-start justify-between mb-5 pt-1.5">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <FiClock className="w-3.5 h-3.5 text-slate-400" />
              <span>{request.time}</span>
            </span>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-[20px] leading-tight">Request Dispatch Details</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[12px] font-semibold mt-0.5">Real-time AI matching tracker</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Card Summary Panel */}
        <div className="bg-slate-50/65 dark:bg-slate-950/40 p-4.5 rounded-[22px] border border-slate-100 dark:border-slate-800/40 mb-5 flex items-start gap-4">
          {/* Blood group indicator circle */}
          <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-[17px] shadow-sm ${bannerColor}`}>
            {request.bloodGroup}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-[16px]">{request.patientName}</h4>
            <p className="text-slate-400 dark:text-slate-500 text-[12px] font-semibold mt-1 flex items-center gap-1">
              <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{request.hospitalName}, {request.city}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                {request.urgency}
              </span>
              <span className="bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] px-2.5 py-0.5 rounded-md text-[9px] font-black border border-indigo-100/30 uppercase tracking-wider">
                {request.units} Unit{request.units > 1 ? 's' : ''} Needed
              </span>
            </div>
          </div>
        </div>

        {/* AI Match Timeline logs */}
        <div className="mb-5">
          <h5 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">AI Matching Logs</h5>
          <div className="space-y-3.5 pl-1.5 border-l-2 border-slate-100 dark:border-slate-800 ml-2.5">
            {/* Step 1 */}
            <div className="relative pl-6">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-sm" />
              <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Request Logged successfully</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">ID: {request.id} · Match coordinates established</div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-6">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-sm" />
              <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">AI analysis completed</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{request.donorsContacted || 10} eligible donors matched within 15 km</div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-6">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] border-4 border-white dark:border-slate-900 animate-pulse shadow-sm" />
              <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">AI voice dispatcher call standby</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Estimated donor travel time: {request.matchTime || 'Calculating...'}</div>
            </div>
          </div>
        </div>

        {/* Matched Donors */}
        <div className="mb-6">
          <h5 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3.5">Eligible Matched Donors</h5>
          {compDonors.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-[12px] font-semibold italic">No active donors found in close proximity.</p>
          ) : (
            <div className="space-y-2.5">
              {compDonors.map(donor => (
                <div key={donor.id} className="flex items-center justify-between p-3 px-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/50 dark:border-slate-850/60 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center font-bold text-[13px] shadow-sm">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-800 dark:text-white">{donor.name}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                        {donor.bloodGroup} · Age {donor.age} · {donor.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border border-emerald-100/30">
                      Eligible
                    </span>
                    <a
                      href={`tel:${donor.contact}`}
                      className="text-[13px] font-extrabold text-[#E11D48] dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/10 px-3 py-1.5 rounded-xl border border-rose-100/50 dark:border-rose-950/20 hover:bg-[#FFF1F2] dark:hover:bg-rose-950/20 transition-all shadow-sm"
                    >
                      {donor.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3.5 pt-2">
          <button
            onClick={onClose}
            className="flex-grow justify-center py-3.5 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer shadow-sm text-center"
          >
            Close Tracker
          </button>
          <a
            href="tel:+919988776655"
            className="flex-grow justify-center py-3.5 px-6 bg-[#E11D48] hover:bg-rose-600 text-white rounded-2xl font-extrabold text-[14px] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-rose-500/10 text-center justify-center"
          >
            <FiPhone className="w-4.5 h-4.5" />
            <span>Call Dispatch: +91 99887 76655</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestDetailsModal;
