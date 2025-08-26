import { motion } from "framer-motion";
import { BarChart3, Users, ClipboardList, Activity, CheckCircle } from "lucide-react";

const StatsCards = ({ stats }) => {
  const displayStats = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={28} />, color: "purple" },
    { label: "Total Events", value: stats.totalEvents, icon: <BarChart3 size={28} />, color: "blue" },
    { label: "Approved Events", value: stats.approvedEvents, icon: <CheckCircle size={28} />, color: "green" },
    { label: "Pending Events", value: stats.pendingEvents, icon: <ClipboardList size={28} />, color: "yellow" },
  ] : [];

  // Using CheckCircle from lucide-react, so import it
  // We also removed `isPositive` and `change` as those are not in our current backend stats

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      {stats ? (
        displayStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              duration: 0.4,
              delay: i * 0.1
            }}
            whileHover={{ scale: 1.05 }}
            className="relative bg-[#1e293b]/80 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-lg text-center hover:shadow-purple-500/20 transition"
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-full bg-${s.color}-500/20 text-${s.color}-400`}>
                {s.icon}
              </div>
            </div>

            {/* Value */}
            <h3 className="text-3xl font-bold text-white">{s.value}</h3>
            <p className="text-gray-400 text-sm">{s.label}</p>

            {/* Change Badge - Removed as per current backend data */}
          </motion.div>
        ))
      ) : (
        <div className="col-span-4 text-center text-xl text-gray-400">Loading stats...</div>
      )}
    </motion.div>
  );
};

export default StatsCards;
