import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, Tag, XCircle, History, Clock } from 'lucide-react';

const RecentActivity = () => {
  // Dummy data for recent activities
  const activities = [
    { id: 1, type: 'User Registered', description: 'New organizer "Tech Society" joined the platform.', time: '2 hours ago', icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: 2, type: 'Event Approved', description: 'Annual Hackathon 2024 has been verified.', time: '5 hours ago', icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 3, type: 'Category Added', description: 'New category "E-Sports" has been live.', time: '1 day ago', icon: Tag, color: "text-amber-600", bg: "bg-amber-50" },
    { id: 4, type: 'Event Rejected', description: 'Flash Mob event failed security guidelines.', time: '2 days ago', icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 col-span-1 md:col-span-2"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">System Activity</h3>
          <p className="text-sm text-slate-500 font-medium italic">Latest updates from across the platform</p>
        </div>
        <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl">
          <History size={20} />
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="flex items-start gap-4 relative z-10"
          >
            <div className={`shrink-0 w-12 h-12 rounded-2xl ${activity.bg} ${activity.color} flex items-center justify-center border-4 border-white shadow-sm`}>
              <activity.icon size={20} />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-slate-900 font-black text-base leading-none">{activity.type}</p>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={12} className="text-slate-300" />
                  {activity.time}
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {activity.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-8 w-full py-4 text-slate-600 font-black text-sm uppercase tracking-widest hover:text-indigo-600 transition-colors">
        View All History
      </button>
    </motion.div>
  );
};
export default RecentActivity;
