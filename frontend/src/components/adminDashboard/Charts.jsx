import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion"; // Import motion

// Custom tooltip for better UX
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] p-3 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-sky-400">📊 Events: {payload[0].value}</p>
        {/* <p className="text-purple-400">📝 Registrations: {payload[1].value}</p> */}
      </div>
    );
  }
  return null;
};

const Charts = ({ categoryCounts, monthCounts }) => {
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={chartVariants}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg font-semibold text-white mb-4"
      >
        Monthly Event Overview
      </motion.h3>
      {(!monthCounts || monthCounts.length === 0) ? (
        <div className="text-center text-xl text-gray-400 h-64 flex items-center justify-center">No monthly event data available.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthCounts} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="events" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              {/* <Bar dataKey="registrations" fill="#a78bfa" radius={[6, 6, 0, 0]} /> */}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Charts;
