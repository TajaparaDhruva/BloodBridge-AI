import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonBox = ({ className = '', style = {} }) => (
  <div
    className={`skeleton-shimmer rounded-2xl ${className}`}
    style={style}
  />
);

export const SkeletonText = ({ width = '100%', height = '1rem', className = '' }) => (
  <div
    className={`skeleton-shimmer rounded-md ${className}`}
    style={{ width, height }}
  />
);

export const DashboardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Hero Skeleton */}
      <div className="glass-card rounded-2xl p-7 md:p-9 border border-gray-200/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex-1 space-y-5">
            <div className="flex gap-3">
              <SkeletonBox className="w-32 h-6 rounded-full" />
              <SkeletonBox className="w-24 h-6 rounded-full" />
            </div>
            <SkeletonText width="60%" height="2.5rem" className="rounded-xl" />
            <div className="space-y-2 mt-4">
              <SkeletonText width="80%" height="1rem" />
              <SkeletonText width="75%" height="1rem" />
              <SkeletonText width="40%" height="1rem" />
            </div>
            <div className="flex gap-3 mt-8">
              <SkeletonBox className="w-36 h-12 rounded-xl" />
              <SkeletonBox className="w-40 h-12 rounded-xl" />
              <SkeletonBox className="w-32 h-12 rounded-xl" />
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <SkeletonBox className="w-44 h-44 rounded-full" />
          </div>
        </div>
      </div>

      {/* KPI Overview Skeleton */}
      <div>
        <SkeletonText width="180px" height="0.75rem" className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-gray-200/50 dark:border-slate-700/50 h-32 flex flex-col items-center justify-center gap-3">
              <SkeletonBox className="w-10 h-10 rounded-full" />
              <SkeletonText width="60%" height="0.75rem" />
              <SkeletonText width="40%" height="1.5rem" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Intelligence Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 h-64 border border-gray-200/50 dark:border-slate-700/50" />
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 h-64 border border-gray-200/50 dark:border-slate-700/50" />
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 h-64 border border-gray-200/50 dark:border-slate-700/50" />
      </div>
    </motion.div>
  );
};
