import { motion } from "framer-motion";
import { User, Mail, FileText, MessageSquare, Send } from "lucide-react";

export default function ContactForm() {
  return (
    <motion.div
      className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group"
    >
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3.7rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
      
      <div className="relative">
        <h3 className="text-3xl font-[950] text-slate-900 mb-2 tracking-tight">Send a Message</h3>
        <p className="text-slate-500 font-medium mb-10">We usually respond within 2-4 hours.</p>

        <form className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group/field">
              <User className="absolute left-4 top-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="First Name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold"
              />
            </div>
            <div className="relative group/field">
              <User className="absolute left-4 top-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative group/field">
            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={20} />
            <input
              type="email"
              placeholder="Your Email Identity"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold"
            />
          </div>

          {/* Subject Field */}
          <div className="relative group/field">
            <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Topic of Interest"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold"
            />
          </div>

          {/* Message Field */}
          <div className="relative group/field">
            <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors" size={20} />
            <textarea
              placeholder="Deep dive into your query..."
              rows="5"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-semibold resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Dispatch Message <Send size={18} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
