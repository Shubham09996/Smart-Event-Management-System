import { motion } from "framer-motion";
import { BarChart3, Users, ClipboardList, Activity, CheckCircle, TrendingUp } from "lucide-react";

const StatsCards = ({ stats }) => {
  const statsConfig = stats ? [
    { 
      title: "Total Users", 
      value: stats.totalUsers || "0", 
      icon: Users, 
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "Platform reach"
    },
    { 
      title: "Total Events", 
      value: stats.totalEvents || "0", 
      icon: BarChart3, 
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Event richness"
    },
    { 
      title: "Approved Events", 
      value: stats.approvedEvents || "0", 
      icon: CheckCircle, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Live on platform"
    },
    { 
      title: "Pending Approvals", 
      value: stats.pendingEvents || "0", 
      icon: ClipboardList, 
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Needs attention"
    },
  ] : [];

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-[2rem] border border-slate-100 animate-pulse flex items-center justify-center">
            <div className="text-slate-200 font-bold">Loading Stats...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * i }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 group relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700"></div>
          
          <div className="relative z-10 flex items-start justify-between mb-4">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={24} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <TrendingUp size={12} className="text-emerald-500" />
              {stat.trend}
            </div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{stat.title}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
