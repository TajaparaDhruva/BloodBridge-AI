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

const OverviewTab = ({
  user,
  requests,
  inventory,
  donors,
  userLocation,
  onNewRequest,
  onNavigate,
  onOpenAI,
}) => (
  <motion.div
    className="space-y-6"
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.04 } },
    }}
  >
    {/* Hero */}
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

    {/* Stat widgets */}
    <StatWidgets requests={requests} donors={donors} inventory={inventory} />

    {/* Bento row 1: AI + Performance + Live Feed */}
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <AIInsightsCard onNavigate={onNavigate} />
      </div>
      <div className="lg:col-span-3">
        <PerformanceScore />
      </div>
      <div className="lg:col-span-4">
        <LiveActivityFeed requests={requests} />
      </div>
    </div>

    {/* Bento row 2: Inventory + Weekly Chart */}
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-4">
        <InventoryWidget inventory={inventory} />
      </div>
      <div className="lg:col-span-8">
        <WeeklyChart />
      </div>
    </div>

    {/* Bento row 3: Timeline + AI Dispatch Radar */}
    <div className="grid md:grid-cols-2 gap-5">
      <ActivityTimeline />
      <AIDispatchRadar />
    </div>

    {/* Bento row 4: Tasks + Quick Access + Team */}
    <div className="grid md:grid-cols-3 gap-5">
      <UpcomingTasks />
      <QuickAccessPanel
        onNavigate={onNavigate}
        onNewRequest={onNewRequest}
        onOpenAI={onOpenAI}
      />
      <TeamActivity donors={donors} />
    </div>

    {/* Donor table */}
    <DonorNetworkTable donors={donors} userLocation={userLocation} onNavigate={onNavigate} />
  </motion.div>
);

export default OverviewTab;
