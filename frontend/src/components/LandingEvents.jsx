import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingEvents() {
  const events = [
    {
      title: "Tech Innovation Summit 2026",
      category: "Technology",
      date: "May 15, 2026",
      location: "Main Auditorium",
      attendees: "450+",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Annual Cultural Fest",
      category: "Culture",
      date: "June 02, 2026",
      location: "Open Air Theatre",
      attendees: "1200+",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Startup Pitch Night",
      category: "Business",
      date: "April 28, 2026",
      location: "Seminar Hall A",
      attendees: "200+",
      image: "https://images.unsplash.com/photo-1556761175-5973e46c76ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-cyan-500 to-indigo-500"
    }
  ];

  return (
    <section className="py-24 px-4 md:px-10 bg-slate-50 relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold text-purple-600 tracking-wider uppercase mb-2 block">Trending</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Featured Events</h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-6 md:mt-0"
          >
            <Link to="/events" className="inline-block px-8 py-3.5 bg-white text-slate-800 font-bold rounded-full border border-gray-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(93,93,93,0.1)] hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
              Explore All Events &rarr;
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -12 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.1)] transition-all border border-gray-100 group flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-t ${event.color} opacity-40 group-hover:opacity-20 transition-opacity z-10`}></div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-black tracking-wide uppercase text-slate-800 rounded-full shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-5 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                
                <div className="space-y-4 mb-8 mt-auto">
                  <div className="flex items-center text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4">
                      <Calendar size={18} className="text-indigo-600" />
                    </div>
                    <span className="font-semibold">{event.date}</span>
                  </div>
                  <div className="flex items-center text-slate-600 line-clamp-1">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-4 shrink-0">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mr-4">
                      <Users size={18} className="text-pink-600" />
                    </div>
                    <span>{event.attendees} Attending</span>
                  </div>
                </div>
                
                <Link to="/signup" className="block text-center w-full py-4 rounded-2xl font-bold text-sm bg-slate-50 text-slate-700 border border-gray-100 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:shadow-md">
                  Register Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
