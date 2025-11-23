import { motion } from "framer-motion";

export default function AboutValues() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-dark/80 p-4 sm:p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
        💡 Our Values
      </h3>
      <ul className="list-disc pl-6 text-gray-300 space-y-1 sm:space-y-2 text-sm sm:text-base">
        <li>Innovation in event discovery</li>
        <li>Inclusivity and collaboration</li>
        <li>Student empowerment</li>
        <li>Commitment to growth and learning</li>
      </ul>
    </motion.div>
  );
}
