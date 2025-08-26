import React from 'react';
import { motion } from 'framer-motion';

const RecentActivity = () => {
  // Dummy data for recent activities
  const activities = [
    { id: 1, type: 'User Registered', description: 'New user John Doe registered.', time: '2 hours ago' },
    { id: 2, type: 'Event Approved', description: 'Concert event "Summer Fest" approved.', time: '5 hours ago' },
    { id: 3, type: 'Category Added', description: 'New category "Workshops" added.', time: '1 day ago' },
    { id: 4, type: 'Event Rejected', description: 'Meeting event "Team Sync" rejected.', time: '2 days ago' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl font-semibold text-white mb-4"
      >
        Recent Activity
      </motion.h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.5 + activity.id * 0.1 }}
            className="flex items-center p-4 bg-gray-700 rounded-md shadow-sm"
          >
            <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
            <div>
              <p className="text-white font-medium">{activity.type}</p>
              <p className="text-gray-400 text-sm">{activity.description} - <span className="text-xs">{activity.time}</span></p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
