import { motion } from "framer-motion";

export default function AboutMission() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-dark/80 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
        🎯 Our Mission
      </h3>
      <p className="text-gray-300">
        To provide a seamless and engaging platform for students to discover,
        register, and participate in campus events that enrich their academic
        and social journey.
      </p>
    </motion.div>
  );
}
