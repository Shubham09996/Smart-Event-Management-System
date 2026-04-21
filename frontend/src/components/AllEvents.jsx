import { motion } from "framer-motion";
import EventCard from "./EventCard";
import { Sparkles } from "lucide-react";

export default function AllEvents({ events, onRegister }) {
  if (!events || events.length === 0) {
    return (
      <section className="mb-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto text-center py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-50 p-12 rounded-[3rem] border border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles size={24} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Events Matches</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            We couldn't find any events matching your current filters. Try broadening your search!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mb-32 px-4 sm:px-6 md:px-10">
      <div className="flex flex-col mb-12">
        <span className="text-purple-600 font-black text-xs uppercase tracking-[0.2em] mb-3 block">Full Catalog</span>
        <h2 className="text-4xl md:text-5xl font-[950] text-slate-900 tracking-tight leading-none mb-4">
          All Events
        </h2>
        <div className="h-1.5 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {events.map((event, i) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 12) * 0.05, duration: 0.6 }}
            className="h-full"
          >
            <EventCard event={event} onRegister={onRegister} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
