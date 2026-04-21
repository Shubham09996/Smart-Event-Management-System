import { motion } from "framer-motion";
import { Clock, Moon } from "lucide-react";

export default function OfficeHours() {
  const schedule = [
    { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM", status: "Open" },
    { days: "Saturday", hours: "10:00 AM - 4:00 PM", status: "Open" },
    { days: "Sunday", hours: "Closed", status: "Closed" }
  ];

  return (
    <motion.div
      className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-center gap-8"
    >
      <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
        <Clock size={32} className="text-white" />
      </div>

      <div className="flex-1 w-full">
        <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight text-center md:text-left">Availability</h3>
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div key={item.days} className="flex justify-between items-center group">
              <div className="flex flex-col">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.days}</span>
                 <span className={`font-bold ${item.status === 'Closed' ? 'text-red-500' : 'text-slate-700'}`}>
                   {item.hours}
                 </span>
              </div>
              <div className={`h-2 w-2 rounded-full ${item.status === 'Closed' ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
