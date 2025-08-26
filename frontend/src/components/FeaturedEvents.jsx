import { motion } from "framer-motion";
import EventCard from "./EventCard";

export default function FeaturedEvents({ events, onRegister }) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event, i) => (
          <motion.div
            key={event._id} // Use event._id instead of event.id
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <EventCard event={event} onRegister={onRegister} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
