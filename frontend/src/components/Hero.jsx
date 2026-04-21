import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import EventsVideo from '../assets/Events_video.mp4';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden flex items-center min-h-[90vh]"
    >
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-sm font-semibold text-indigo-700">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              #1 Platform for Campus Events
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm mb-6">
            <span className="block mb-2">Your Campus</span>
            <span className="block mb-2">Events,</span>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Elevated.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-600 font-medium max-w-xl mb-10"
          >
            Revolutionize the way you discover, register, and manage college events with our lightning-fast platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(99,102,241,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-indigo-600 rounded-full font-bold text-lg text-white transition-all shadow-md w-full sm:w-auto"
            >
              Start Exploring
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(241,245,249,1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white rounded-full font-bold text-lg text-slate-700 border-2 border-slate-200 transition-all shadow-sm w-full sm:w-auto"
            >
              Host an Event
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Video Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative mt-8 lg:mt-0"
        >
          {/* Subtle glow behind video */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-2xl transform scale-105"></div>
          
          <div className="relative rounded-[2rem] p-2 bg-gradient-to-b from-slate-200 to-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-200/50 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Fake Browser/App Bar */}
            <div className="h-8 flex items-center px-4 gap-2 bg-slate-200/50 rounded-t-[1.5rem]">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="rounded-b-[1.5rem] overflow-hidden bg-slate-900 aspect-[4/3] sm:aspect-video relative">
              <video
                src={EventsVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-b-[1.5rem] pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </motion.section>
  );
}