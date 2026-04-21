import { motion } from "framer-motion";
import { Clock, CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";

export default function EventCard({ event, onRegister }) {
  // Format the date for display
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -12 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgb(99,102,241,0.15)] transition-all duration-500 border border-gray-100 group flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="h-60 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img 
          src={event.eventImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-5 left-5 z-20">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black tracking-[0.1em] uppercase text-indigo-700 rounded-full shadow-lg border border-white/20">
            {event.category}
          </span>
        </div>

        {/* Info Overlay on Hover */}
        <div className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
          <span className="text-white text-xs font-bold flex items-center bg-indigo-600/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <Users size={14} className="mr-1.5" /> Spotlight
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-6 line-clamp-2 leading-[1.2] group-hover:text-indigo-600 transition-colors duration-300">
          {event.title}
        </h3>
        
        <div className="space-y-4 mb-8 mt-auto">
          {/* Date */}
          <div className="flex items-center text-slate-600">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-600 transition-colors duration-300">
              <CalendarDays size={20} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
              <p className="font-bold text-slate-700 text-sm">{eventDate}</p>
            </div>
          </div>

          {/* Time & Location Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-slate-600">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors duration-300">
                <Clock size={20} className="text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
                <p className="font-bold text-slate-700 text-xs truncate max-w-[80px]">{event.startTime}</p>
              </div>
            </div>
            
            <div className="flex items-center text-slate-600">
              <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mr-4 group-hover:bg-pink-600 transition-colors duration-300">
                <MapPin size={20} className="text-pink-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-bold text-slate-700 text-xs truncate">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Register CTA */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRegister(event._id)}
          className="w-full py-4.5 rounded-2xl font-black text-sm bg-slate-900 text-white shadow-xl hover:bg-indigo-600 hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center group/btn py-4"
        >
          View Details
          <ArrowRight size={18} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
