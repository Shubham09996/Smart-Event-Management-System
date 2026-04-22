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
    { 
      title: "Registrations", 
      value: stats.totalRegistrations || "0", 
      icon: Users, // Can reuse Users or something else
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "Total signups"
    },
    { 
      title: "Attendance Marked", 
      value: stats.totalAttendance || "0", 
      icon: CheckCircle, 
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Verified present"
    },
  ] : [];

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * i }}
          whileHover={{ y: -5 }}
          className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 group relative overflow-hidden flex items-center gap-5 transition-all"
        >
          {/* Decorative background element */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} rounded-full blur-2xl -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-150 duration-700`}></div>
          
          <div className={`p-4 ${stat.bg} ${stat.color} rounded-xl shadow-inner relative z-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon size={22} />
          </div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">{stat.title}</h3>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <TrendingUp size={10} className="text-emerald-500" />
                {stat.trend.split(' ')[0]} {/* Shorten the trend text optionally */}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
