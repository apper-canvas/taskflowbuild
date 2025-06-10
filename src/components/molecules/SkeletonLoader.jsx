import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  if (type === 'sidebar') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 bg-surface-200 rounded w-20"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-surface-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-surface-200 rounded w-16"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-surface-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
        >
          <div className="animate-pulse space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-surface-200 rounded border-2"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-surface-200 rounded-full w-16"></div>
              <div className="h-6 bg-surface-200 rounded w-20"></div>
              <div className="h-6 bg-surface-200 rounded w-14"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;