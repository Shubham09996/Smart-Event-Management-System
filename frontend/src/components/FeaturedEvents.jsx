import { motion } from "framer-motion";
import EventCard from "./EventCard";

export default function FeaturedEvents({ events, onRegister }) {
  return (
    <section className="mb-12 md:mb-20 px-4 sm:px-6 md:px-10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center md:text-left text-white">
        Featured Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((event, i) => (
          <motion.div
            key={event._id} // Use event._id instead of event.id
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <EventCard event={event} onRegister={onRegister} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
