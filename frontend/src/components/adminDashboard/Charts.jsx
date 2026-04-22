import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3, Activity } from "lucide-react";

// Custom tooltip for better UX
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.08)] backdrop-blur-md">
        <p className="text-slate-900 font-black mb-1">{label}</p>
        <div className="space-y-1">
          <p className="text-indigo-600 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Events: {payload[0]?.value}
          </p>
          <p className="text-emerald-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Regs: {payload[1]?.value || 0}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Charts = ({ categoryCounts, monthCounts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Monthly Performance</h3>
          <p className="text-sm text-slate-500 font-medium">Event distribution across the platform</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <BarChart3 size={20} />
        </div>
      </div>

      {(!monthCounts || monthCounts.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
            <Activity size={24} className="opacity-20" />
          </div>
          <p className="font-bold uppercase text-[10px] tracking-widest">No data available yet</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthCounts} barGap={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                fontSize={12} 
                fontWeight={700}
                axisLine={false}
                tickLine={false}
                tick={{ dy: 10 }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                fontWeight={700}
                axisLine={false}
                tickLine={false}
                tick={{ dx: -10 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 12 }} />
              <Bar 
                dataKey="events" 
                fill="#4f46e5" 
                radius={[10, 10, 10, 10]} 
                barSize={32}
              />
              <Bar 
                dataKey="registrations" 
                fill="#10b981" 
                radius={[10, 10, 10, 10]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default Charts;
