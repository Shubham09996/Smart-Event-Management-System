import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    "New user registered",
    "TechFest event approved",
    "Server backup completed",
  ];

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#111827]/90 backdrop-blur-lg border-b border-gray-700">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="text-xl font-semibold text-white"
      >
        Admin Dashboard
      </motion.h2>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative">
        {/* Search Bar */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative hidden md:block"
        >
          <input
            type="text"
            placeholder="Search events..."
            className="bg-[#1e293b] text-white px-4 py-2 rounded-lg focus:outline-none w-64"
          />
          <Search className="w-4 h-4 text-gray-400 absolute top-2.5 right-3" />
        </motion.div>

        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        </motion.div>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-12 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg w-64 z-50"
            >
              <ul className="divide-y divide-gray-700">
                {notifications.map((note, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] cursor-pointer"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <User className="w-6 h-6 text-white" />
        </motion.div>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-0 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg w-48 z-50"
            >
              <ul className="text-gray-300">
                <li className="px-4 py-2 hover:bg-[#2d3748] cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </li>
                <li className="px-4 py-2 hover:bg-[#2d3748] cursor-pointer flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </li>
                <li className="px-4 py-2 hover:bg-[#2d3748] cursor-pointer flex items-center gap-2 text-red-400">
                  <LogOut className="w-4 h-4" /> Logout
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Topbar;
