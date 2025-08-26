import { motion } from "framer-motion";

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative px-4 sm:px-6 md:px-10 py-20 flex flex-wrap gap-4 sm:gap-6 justify-center rounded-2xl"
    >
      {/* Buttons */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(99,102,241,0.6)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="relative z-10 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-[#1a1a24] rounded-xl border border-white/10 text-white hover:bg-indigo-500/20 transition"
      >
        📅 Smart Event Management
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(168,85,247,0.6)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="relative z-10 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-[#1a1a24] rounded-xl border border-white/10 text-white hover:bg-purple-500/20 transition"
      >
        👥 Team Collaboration
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(34,211,238,0.6)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="relative z-10 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-[#1a1a24] rounded-xl border border-white/10 text-white hover:bg-cyan-500/20 transition"
      >
        🔗 Digital QR Registration
      </motion.button>
    </motion.div>
  );
}
