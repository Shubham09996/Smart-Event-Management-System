import { motion } from "framer-motion";
import { Calendar, Users, Clock, BarChart2 } from "lucide-react";

const stats = [
  { title: "Total Events", value: "2", icon: Calendar, color: "bg-purple-600" },
  { title: "Total Registrations", value: "245", icon: Users, color: "bg-blue-600" },
  { title: "Published Events", value: "1", icon: Clock, color: "bg-pink-600" },
  { title: "Avg Attendance", value: "78%", icon: BarChart2, color: "bg-teal-600" },
];

const StatsCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 10,
            duration: 0.4,
            delay: 0.4 + i * 0.1
          }}
          whileHover={{ scale: 1.05 }}
          className="bg-[#1e293b] p-6 rounded-xl flex items-center gap-4 shadow-lg"
        >
          <div className={`${stat.color} p-3 rounded-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <motion.h3
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              className="text-gray-300 text-sm"
            >
              {stat.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
              className="text-xl font-bold text-white"
            >
              {stat.value}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
