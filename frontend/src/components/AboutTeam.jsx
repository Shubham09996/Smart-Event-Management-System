import { motion } from "framer-motion";

export default function AboutTeam() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-dark/80 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        👥 Our Team
      </h3>
      <p className="text-gray-300">
        A passionate group of students, designers, and developers who are
        committed to making event management smarter, simpler, and more
        exciting.
      </p>
    </motion.div>
  );
}
