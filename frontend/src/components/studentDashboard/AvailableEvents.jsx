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
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Available Events</h3>
        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-100 to-transparent ml-6 rounded-full hidden sm:block"></div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center">
          <p className="text-slate-500 font-medium">No available events to show right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev, i) => (
            <motion.div
              key={ev._id}
              className="bg-white rounded-[2.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between overflow-hidden group hover:border-indigo-100 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative mb-6 overflow-hidden rounded-[1.8rem]">
                {ev.eventImage ? (
                  <img
                    src={ev.eventImage}
                    alt={ev.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                    <Calendar size={48} className="text-slate-300" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 backdrop-blur-md text-white ${
                      ev.category === 'Workshop' ? 'bg-emerald-500' : 
                      ev.category === 'Seminar' ? 'bg-amber-500' : 
                      'bg-indigo-600'
                    }`}
                  >
                    {ev.category}
                  </span>
                </div>
              </div>

              <div className="px-1">
                <h4 className="text-slate-900 font-black text-xl mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{ev.title}</h4>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{ev.description}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3 items-center text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Calendar size={16} />
                    </div>
                    <span className="text-xs font-bold">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <MapPin size={16} />
                    </div>
                    <span className="text-xs font-bold line-clamp-1">{ev.location}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRegisterClick(ev)}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-sm tracking-wider transition-all duration-300 uppercase"
                >
                  Register Now
                </motion.button>
              </div>
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
