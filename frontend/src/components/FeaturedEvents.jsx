import { motion } from "framer-motion";
import EventCard from "./EventCard";

export default function FeaturedEvents({ events, onRegister }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="mb-20 px-4 sm:px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="max-w-2xl">
          <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-3 block">Editor's Choice</span>
          <h2 className="text-4xl md:text-5xl font-[950] text-slate-900 tracking-tight leading-none">
            Featured Experiences
          </h2>
        </div>
        <p className="text-slate-500 font-medium md:max-w-xs text-sm">
          Handpicked events that are currently trending in the campus community.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {events.map((event, i) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <EventCard event={event} onRegister={onRegister} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
