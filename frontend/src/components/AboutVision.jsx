import { motion } from "framer-motion";

export default function AboutVision() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-dark/80 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
        🚀 Our Vision
      </h3>
      <p className="text-gray-300">
        To become the leading platform that bridges the gap between students and
        opportunities, fostering innovation, creativity, and collaboration on
        every campus.
      </p>
    </motion.div>
  );
}
