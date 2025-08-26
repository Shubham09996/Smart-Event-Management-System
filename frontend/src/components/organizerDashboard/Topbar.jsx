import { Bell, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Topbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between bg-[#0b1220] px-6 py-4 border-b border-gray-700"
    >
      {/* Search Bar */}
      <motion.input
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        type="text"
        placeholder="Search events..."
        className="px-4 py-2 rounded-lg bg-[#1e293b] text-gray-300 outline-none w-1/3"
      />

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
          className="relative"
        >
          <Bell className="text-gray-300 w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
          className="relative"
        >
          <MessageSquare className="text-gray-300 w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            2
          </span>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="text-white font-semibold"
            >
              Sarah Chen
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="text-sm text-gray-400"
            >
              sarah@university.edu
            </motion.p>
          </div>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.8 }}
            src="/profile.jpg"
            className="w-10 h-10 rounded-full border-2 border-purple-500"
            alt="profile"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
