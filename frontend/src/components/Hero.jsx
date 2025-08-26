import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 pt-24 md:pt-40 pb-20 rounded-2xl"
    >
      {/* Left Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight sm:leading-snug space-y-2">
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Campus,
          </span>
          <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            Your Events,
          </span>
          <span className="block bg-gradient-to-r from-fuchsia-400 to-pink-500 text-transparent bg-clip-text">
            <span className="inline">
              <Typewriter
                words={[
                  "One Smart Platform",
                  "AI-Powered Events",
                  "Seamless Collaboration",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-gray-300 text-base sm:text-lg md:text-xl"
        >
          Revolutionize college event management with AI-powered registration,
          real-time analytics, and seamless QR code integration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="px-5 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-base sm:text-lg text-white transition"
          >
            Smart Event Management
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(236,72,153,0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="px-5 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl font-bold text-base sm:text-lg text-white transition"
          >
            Team Collaboration
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 mt-12 md:mt-0 w-full max-w-sm sm:max-w-md md:max-w-[700px] mx-auto"
      >
        <img
          src="/hero.png"
          alt="Smart Events"
          className="rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.7)] w-full"
        />
      </motion.div>
    </motion.section>
  );
}
