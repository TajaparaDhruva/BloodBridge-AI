import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import {
  StatWidgets,
  AIInsightsCard,
  PerformanceScore,
  LiveActivityFeed,
  InventoryWidget,
  WeeklyChart,
  ActivityTimeline,
  AIDispatchRadar,
  UpcomingTasks,
  QuickAccessPanel,
  TeamActivity,
  DonorNetworkTable,
} from './widgets';

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
    {children}
  </p>
);

const fadeChild = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const staggerParent = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const Section = ({ children, className = '' }) => (
  <motion.div variants={fadeChild} className={className}>
    {children}
  </motion.div>
);

const OverviewTab = ({
  user,
  requests,
  inventory,
  donors,
  userLocation,
  onNewRequest,
  onNavigate,
  onOpenAI,
  tasks,
  onToggleTask,
  onCallDonor,
}) => (
  <motion.div
    className="space-y-8"
    initial="hidden"
    animate="show"
    variants={staggerParent}
  >
    {/* ── Welcome Hero ─────────────────────────────────────────────────────────── */}
    <Section>
      <HeroSection
        user={user}
        userLocation={userLocation}
        requests={requests}
        inventory={inventory}
        donors={donors}
        onNewRequest={onNewRequest}
        onOpenMap={() => onNavigate('map')}
        onOpenAI={onOpenAI}
      />
    </Section>

    {/* ── KPI Overview ─────────────────────────────────────────────────────────── */}
    <Section>
      <SectionLabel>Key Performance Indicators</SectionLabel>
      <StatWidgets requests={requests} donors={donors} inventory={inventory} />
    </Section>

    {/* ── Operational Intelligence: AI + Performance + Stream ──────────────────── */}
    <Section>
      <SectionLabel>Operational Intelligence</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <AIInsightsCard onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-3">
          <PerformanceScore />
        </div>
        <div className="lg:col-span-4">
          <LiveActivityFeed requests={requests} onNavigate={onNavigate} />
        </div>
      </div>
    </Section>

    {/* ── Inventory & Analytics ─────────────────────────────────────────────────── */}
    <Section>
      <SectionLabel>Blood Inventory & Analytics</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <InventoryWidget inventory={inventory} onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-8">
          <WeeklyChart />
        </div>
      </div>
    </Section>

    {/* ── Dispatch Radar & Activity Timeline ───────────────────────────────────── */}
    <Section>
      <SectionLabel>Dispatch & Activity</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityTimeline />
        <AIDispatchRadar />
      </div>
    </Section>

    {/* ── Operations Workbench ─────────────────────────────────────────────────── */}
    <Section>
      <SectionLabel>Operations Workbench</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UpcomingTasks tasks={tasks} onToggleTask={onToggleTask} onNavigate={onNavigate} />
        <QuickAccessPanel
          onNavigate={onNavigate}
          onNewRequest={onNewRequest}
          onOpenAI={onOpenAI}
        />
        <TeamActivity donors={donors} onNavigate={onNavigate} />
      </div>
    </Section>

    {/* ── Donor Network Table ───────────────────────────────────────────────────── */}
    <Section>
      <SectionLabel>Donor Network Registry</SectionLabel>
      <DonorNetworkTable
        donors={donors}
        userLocation={userLocation}
        onNavigate={onNavigate}
        onNewRequest={onNewRequest}
        onCallDonor={onCallDonor}
      />
    </Section>
  </motion.div>
);

export default OverviewTab;
