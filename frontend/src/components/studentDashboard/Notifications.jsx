import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const Notifications = () => {
  const items = [
    {
      id: 1,
      title: "AI Workshop starts in 2 hours",
      subtitle: "Computer Lab A",
      color: "bg-purple-600/40",
    },
    {
      id: 2,
      title: "New event: Spring Festival 2024",
      subtitle: "Registration now open",
      color: "bg-blue-600/40",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-[2.5rem] p-8 mt-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Daily Notifications</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">2 New</span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100 cursor-pointer relative group overflow-hidden transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:shadow-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ x: 5 }}
          >
            <div className={`w-3 h-3 rounded-full ${n.id === 1 ? 'bg-purple-500' : 'bg-blue-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)] relative z-10`} />
            <div className="relative z-10">
              <p className="text-slate-900 text-sm font-black mb-0.5">{n.title}</p>
              <p className="text-slate-500 text-xs font-medium">{n.subtitle}</p>
            </div>
            
            <div className="ml-auto relative z-10">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Just Now</span>
            </div>
            
            {/* Hover decorative element */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
      >
        Mark All as Read
      </motion.button>
    </motion.div>
  );
};

export default Notifications;
