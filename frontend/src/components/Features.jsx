import { motion } from "framer-motion";

import { Users, QrCode, Sparkles, BarChart3 } from "lucide-react";

export default function Features() {
  return (
    <section className="py-20 px-4 md:px-10 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-2 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Everything you need</h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Large Box 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute top-8 right-8 text-indigo-200 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-500">
              <QrCode size={120} />
            </div>
            <div className="relative z-10 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6">
                <QrCode size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lightning Fast Registration</h3>
              <p className="text-slate-600 font-medium">Unique QR codes generated instantly for every attendee. Check-ins take milliseconds, not minutes.</p>
            </div>
          </motion.div>

          {/* Small Box 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 mt-auto">Team Collab</h3>
            <p className="text-slate-600 text-sm font-medium">Add co-organizers, assign roles, and manage permissions seamlessly.</p>
          </motion.div>

          {/* Small Box 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 mt-auto">Beautiful Pages</h3>
            <p className="text-slate-600 text-sm font-medium">Event pages that look stunning on every device out of the box.</p>
          </motion.div>

          {/* Large Box 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute top-8 right-8 text-slate-800 group-hover:scale-110 group-hover:text-slate-700 transition-all duration-500">
              <BarChart3 size={120} />
            </div>
            <div className="relative z-10 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm mb-6 border border-white/20">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Analytics Dashboard</h3>
              <p className="text-slate-400 font-medium">Monitor ticket sales, track views, and analyze attendee data in real-time with beautiful charts.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
