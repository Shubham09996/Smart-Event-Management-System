import { motion } from "framer-motion";
import { Clock } from "lucide-react"; // Import Clock icon

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
      whileHover={{ scale: 1.02 }}
      className="bg-dark/80 p-4 sm:p-6 rounded-2xl shadow-lg border border-white/10"
    >
      {/* Image */}
      <img
        src={event.eventImage || "https://source.unsplash.com/800x600/?event,conference"} // Use event.eventImage
        alt={event.title}
        className="w-full h-32 sm:h-40 object-cover rounded-xl mb-3 sm:mb-4"
      />

      {/* Category */}
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <span className="px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-full bg-primary/20 text-primary">
          {event.category}
        </span>
        {/* Attendees removed as it's not in the current backend model */}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{event.title}</h3>

      {/* Details */}
      <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">📅 {eventDate}</p>
      <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">🕒 {event.startTime} - {event.endTime}</p>
      <p className="text-xs sm:text-sm mb-3 sm:mb-4">📍 {event.location}</p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRegister(event._id)}
        className="mt-3 sm:mt-4 bg-gradient-to-r from-primary to-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm hover:opacity-90"
      >
        Learn More
      </motion.button>
    </motion.div>
  );
}
