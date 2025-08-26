import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

const Topbar = () => {
  return (
    <motion.div
      className="sticky top-0 z-40 backdrop-blur bg-[#0b1220]/80 border-b border-white/5"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block"
        >
          <h1 className="text-lg font-semibold text-white">Student Dashboard</h1>
          <p className="text-sm text-slate-400">Discover and register for exciting campus events</p>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-white/5 text-sm text-slate-200 px-4 py-2 rounded-xl focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
          </div>
          <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
            <Bell className="text-slate-300" size={20} />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-xs text-white rounded-full px-1">
              3
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              AJ
            </div>
            <div>
              <p className="text-sm text-white font-medium">Alex Johnson</p>
              <p className="text-xs text-slate-400">alex@university.edu</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
