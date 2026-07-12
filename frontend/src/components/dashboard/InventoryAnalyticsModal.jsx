import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiTrendingUp, FiActivity, FiDownload, FiZap, FiCheck } from 'react-icons/fi';

const InventoryAnalyticsModal = ({ inventory, setNotifications, onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState('idle'); // idle | sending | completed

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      // Build CSV Data Content
      const headers = 'Blood Group,Units Available,Status,Depletion Forecast\n';
      const rows = inventory.map(item => {
        const forecast = item.status === 'critical' 
          ? 'Depletes in 8 hours' 
          : item.status === 'warning' 
            ? 'Depletes in 24 hours' 
            : 'Stable (margins optimal)';
        return `${item.group},${item.units},${item.status.toUpperCase()},${forecast}`;
      }).join('\n');
      
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
      
      // Trigger a native browser file download
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', `blood_depots_analytics_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExporting(false);

      // Add a visual success notification in the header
      if (setNotifications) {
        setNotifications(prev => [
          {
            id: Date.now(),
            title: 'Report Downloaded',
            message: 'Blood depot forecasting CSV report exported successfully.',
            type: 'info',
            time: 'Just now',
            read: false
          },
          ...prev
        ]);
      }
    }, 1000);
  };

  const handleOutreach = () => {
    setOutreachStatus('sending');
    setTimeout(() => {
      setOutreachStatus('completed');
      
      const criticalGroups = inventory.filter(item => item.status === 'critical').map(item => item.group);
      
      // Inject actual notifications in the dashboard hub
      if (setNotifications) {
        const timestamp = Date.now();
        
        // Critical alerts
        if (criticalGroups.length > 0) {
          setNotifications(prev => [
            {
              id: timestamp,
              title: 'Automated Dispatch Active',
              message: `AI broadcast matched notifications sent to active O-, A-, and AB- donors.`,
              type: 'warning',
              time: 'Just now',
              read: false
            },
            ...prev
          ]);
        } else {
          setNotifications(prev => [
            {
              id: timestamp,
              title: 'Restock Action Logged',
              message: `Inventory replenishment signals dispatched to nearby blood banks.`,
              type: 'info',
              time: 'Just now',
              read: false
            },
            ...prev
          ]);
        }
      }
    }, 1200);
  };

  // Find critical groups
  const criticalGroups = inventory.filter(item => item.status === 'critical').map(item => item.group);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-2xl relative text-left"
      >
        {/* Curved top theme bar */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-[#D72638] to-[#8B5CF6] rounded-t-[28px]" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 pt-1.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-[#8B5CF6] flex items-center justify-center">
              <FiTrendingUp className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-[20px]">Inventory Forecasts & Analytics</h3>
              <p className="text-slate-450 dark:text-slate-500 text-[12.5px] font-semibold">AI depletion prediction forecasting models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 2 Column Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5 mb-6">
          {/* Left Column: Visual Supply Levels Chart */}
          <div className="bg-slate-50/65 dark:bg-slate-950/30 p-4.5 rounded-[22px] border border-slate-100 dark:border-slate-800/40">
            <h4 className="text-[12.5px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <FiActivity className="w-4 h-4 text-violet-500" />
              <span>Current Supply Levels</span>
            </h4>
            
            {/* SVG supply bar chart */}
            <div className="space-y-3.5">
              {inventory.map(item => {
                const maxUnits = 60;
                const percent = Math.min(100, (item.units / maxUnits) * 100);
                const barColor = item.status === 'critical' ? 'bg-[#E11D48]' : item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
                
                return (
                  <div key={item.group} className="flex items-center justify-between text-[12px] font-bold">
                    <span className="w-7 text-slate-700 dark:text-slate-350">{item.group}</span>
                    <div className="flex-1 mx-3 h-2 bg-slate-200/60 dark:bg-slate-800/60 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-800 dark:text-white">{item.units}U</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: AI Depletion Risks & Forecast Alerts */}
          <div className="space-y-4">
            <div className="bg-slate-50/65 dark:bg-slate-950/30 p-4.5 rounded-[22px] border border-slate-100 dark:border-slate-800/40">
              <h4 className="text-[12.5px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <FiZap className="w-4 h-4 text-[#E11D48] animate-pulse" />
                <span>Depletion Risks</span>
              </h4>
              
              {/* Alert lines */}
              <div className="space-y-2.5">
                {inventory.map(item => {
                  if (item.status === 'critical') {
                    return (
                      <div key={item.group} className="flex items-start gap-2 text-[12px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-[#E11D48] mt-1.5 flex-shrink-0" />
                        <span><strong>{item.group}</strong> is critical (<strong className="text-rose-500">{item.units} units</strong>). Expected depletion: 8 hours.</span>
                      </div>
                    );
                  }
                  if (item.status === 'warning') {
                    return (
                      <div key={item.group} className="flex items-start gap-2 text-[12px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span><strong>{item.group}</strong> is low. Estimated safety margin: 24 hours.</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Smart Dispatch Recommendations */}
            <div className="bg-[#F0FDF4]/50 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-900/10 p-4 px-4.5 rounded-[22px]">
              <h4 className="text-[12.5px] font-black text-[#10B981] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiCheck className="w-4 h-4 border-2 border-[#10B981] rounded-full" />
                <span>Forecasting Action</span>
              </h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Positive groups are stable. Recommend initiating targeted restock outreach coordinates for {criticalGroups.join(', ')} depots.
              </p>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Outreach action */}
          <button
            onClick={handleOutreach}
            disabled={outreachStatus !== 'idle'}
            className="flex-grow justify-center py-3.5 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-extrabold text-[13.5px] transition-all cursor-pointer flex items-center gap-2 justify-center shadow-sm disabled:opacity-50"
          >
            {outreachStatus === 'idle' ? (
              <>
                <FiZap className="w-4 h-4 text-[#E11D48]" />
                <span>Trigger Automated Restock Outreach</span>
              </>
            ) : outreachStatus === 'sending' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-300 border-t-[#E11D48] rounded-full animate-spin" />
                <span>Dispatching Notifications...</span>
              </span>
            ) : (
              <span className="text-[#10B981] flex items-center gap-1.5 font-bold">
                ✓ Outreach Dispatched Successfully
              </span>
            )}
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="sm:w-fit py-3.5 px-6 bg-[#1E293B] hover:bg-slate-800 text-white rounded-2xl font-extrabold text-[13.5px] transition-all cursor-pointer flex items-center gap-2 justify-center shadow-sm"
          >
            {exporting ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <FiDownload className="w-4 h-4" />
            )}
            <span>Export Forecast Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryAnalyticsModal;
