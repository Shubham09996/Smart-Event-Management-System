import { motion } from "framer-motion";
import EventCard from "./EventCard";

export default function AllEvents({ events, onRegister }) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-6">All Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event, i) => (
          <motion.div
            key={event._id} // Use event._id instead of event.id
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <EventCard event={event} onRegister={onRegister} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
