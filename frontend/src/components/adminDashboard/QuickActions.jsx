import React from 'react';
import { motion } from 'framer-motion';

const QuickActions = ({ adminStats }) => {
  const actions = [
    { id: 1, name: 'Approve Events', icon: '🚀' , link: '/admin?page=events', count: adminStats?.pendingEvents },
    { id: 2, name: 'Add Category', icon: '➕' , link: '/admin?page=categories' },
    { id: 3, name: 'Manage Users', icon: '👥' , link: '/admin?page=users', count: adminStats?.totalUsers },
    { id: 4, name: 'System Settings', icon: '⚙️' , link: '/admin?page=settings' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <motion.a
            key={action.id}
            href={action.link} // Use href for navigation
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: action.id * 0.1 }}
            whileHover={{ scale: 1.05, backgroundColor: '#4a5568' }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-md shadow-sm text-white hover:bg-gray-600 transition-all duration-200"
          >
            <span className="text-3xl mb-2">{action.icon}</span>
            <p className="text-sm font-medium text-center">{action.name}</p>
            {action.count !== undefined && action.count !== null && (
              <span className="mt-1 text-xs font-semibold px-2 py-1 bg-blue-500 text-white rounded-full">
                {action.count}
              </span>
            )}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
