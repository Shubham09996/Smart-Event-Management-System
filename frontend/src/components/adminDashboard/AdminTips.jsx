import React from 'react';
import { motion } from 'framer-motion';

const AdminTips = () => {
  const tips = [
    { id: 1, title: 'Review Pending Events Regularly', description: 'Keep an eye on events awaiting approval to ensure timely publishing.' },
    { id: 2, title: 'Monitor User Activity', description: 'Regularly check user registrations and profiles for any unusual activity.' },
    { id: 3, title: 'Update Event Categories', description: 'Ensure event categories are up-to-date and relevant to improve user experience.' },
    { id: 4, title: 'Check System Settings', description: 'Periodically review system configurations for optimal performance and security.' },
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
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl font-semibold text-white mb-4"
      >
        Admin Tips & Resources
      </motion.h2>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            className="p-4 bg-gray-700 rounded-md shadow-sm"
          >
            <motion.h3
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="text-white font-medium text-lg mb-1"
            >
              {tip.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              className="text-gray-400 text-sm"
            >
              {tip.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminTips;
