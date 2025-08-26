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
      className="bg-dark/80 p-6 rounded-2xl shadow-lg border border-white/10"
    >
      {/* Image */}
      <img
        src={event.eventImage || "https://source.unsplash.com/800x600/?event,conference"} // Use event.eventImage
        alt={event.title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      {/* Category */}
      <div className="flex justify-between items-center mb-2">
        <span className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary">
          {event.category}
        </span>
        {/* Attendees removed as it's not in the current backend model */}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>

      {/* Details */}
      <p className="text-sm mb-1">📅 {eventDate}</p>
      <p className="text-sm mb-1">🕒 {event.startTime} - {event.endTime}</p>
      <p className="text-sm mb-4">📍 {event.location}</p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRegister(event._id)}
        className="mt-4 bg-gradient-to-r from-primary to-indigo-500 text-white px-4 py-2 rounded-xl hover:opacity-90"
      >
        Learn More
      </motion.button>
    </motion.div>
  );
}
