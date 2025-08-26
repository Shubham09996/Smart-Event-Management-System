import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import React, { useState } from 'react'; // Import useState
import HackathonRegistrationForm from './HackathonRegistrationForm'; // Import the new component

const AvailableEvents = ({ events, onRegister }) => {
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [selectedHackathonEvent, setSelectedHackathonEvent] = useState(null);

  const handleRegisterClick = (event) => {
    if (event.category === 'Hackathon') {
      setSelectedHackathonEvent(event);
      setShowHackathonModal(true);
    } else {
      onRegister(event._id);
    }
  };

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">Available Events</h3>
      {events.length === 0 ? (
        <p className="text-gray-400">No available events to show.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <motion.div
              key={ev._id}
              className="bg-[#111827] rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
            >
              {ev.eventImage && (
                <img
                  src={ev.eventImage}
                  alt={ev.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${ev.category === 'Workshop' ? 'bg-green-600/20' : ev.category === 'Seminar' ? 'bg-yellow-600/20' : 'bg-blue-600/20'}`}
                >
                  {ev.category}
                </span>
                {/* <span className="text-sm text-gray-400"><Clock size={14} /> {ev.time}</span> */}
              </div>
              <h4 className="text-white font-bold text-xl mb-2">{ev.title}</h4>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">{ev.description}</p>
              <div className="flex flex-col gap-2 text-slate-300 text-sm mb-4">
                <div className="flex gap-2 items-center">
                  <Calendar size={16} className="text-indigo-400" /> {new Date(ev.date).toLocaleDateString()} at {ev.startTime} - {ev.endTime}
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} className="text-indigo-400" /> {ev.location}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRegisterClick(ev)}
                className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200"
              >
                Register Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {showHackathonModal && selectedHackathonEvent && (
        <HackathonRegistrationForm
          event={selectedHackathonEvent}
          onClose={() => setShowHackathonModal(false)}
          onRegister={onRegister} // Pass the original onRegister for actual registration after form submission
        />
      )}
    </motion.div>
  );
};

export default AvailableEvents;
