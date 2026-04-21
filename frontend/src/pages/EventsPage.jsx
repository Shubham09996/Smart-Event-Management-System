import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import FeaturedEvents from "../components/FeaturedEvents";
import AllEvents from "../components/AllEvents";
import Footer from "../components/Footer";
import api from "../utils/api"; 
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { Search, Filter, Calendar, Tag, ArrowUpDown, ChevronRight, Sparkles } from "lucide-react";

export default function EventsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]); 
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const filterRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const { data } = await api.get("/categories");
      // Add a default "All" category at the start
      setCategories(data);
      setCategoriesLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setCategories([]);
      } else {
        setCategoriesError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchKeyword) queryParams.append("keyword", searchKeyword);
      if (selectedCategory) queryParams.append("category", selectedCategory);
      if (selectedDateRange) queryParams.append("dateRange", selectedDateRange);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("order", sortOrder);

      const { data } = await api.get(`/events?${queryParams.toString()}`);
      setEvents(data);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedCategory, selectedDateRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  const handleRegisterClick = (eventId) => {
    if (!isAuthenticated) {
      toast.error("Please login to register for this event.");
      navigate("/login");
    } else {
      // Navigate to event details or handle registration
    }
  };

  const featuredEvents = events.filter(event => event.isFeatured);

  if (loading && events.length === 0) {
    return (
      <div className="pt-32 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full mb-4" 
        />
        <p className="text-slate-500 font-bold tracking-tight animate-pulse text-lg">EXPERIENCES ARE LOADING...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen text-slate-900"
    >
      {/* 🚀 NEXT LEVEL HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-4 overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-[#f8fafc] z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-pink-100/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <Sparkles size={14} className="animate-spin-slow" />
              Pulse of the Campus
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[950] tracking-[-0.04em] leading-[0.95] text-slate-900 mb-8 max-w-5xl mx-auto">
              Campus Events, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 italic">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Don't just attend. Experience the most iconic moments at your university. 
              Search, explore, and secure your spot in seconds.
            </p>

            {/* Premium Floating Search Box */}
            <motion.div 
               whileHover={{ scale: 1.01 }}
               className="max-w-3xl mx-auto relative group mt-4"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
              <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center p-2 group-focus-within:ring-2 ring-indigo-500/20">
                <div className="flex-1 flex items-center px-4 md:px-6">
                  <Search className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
                  <input
                    type="text"
                    placeholder="Search by event name, society, or speaker..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 py-4 md:py-6 px-4 text-slate-900 font-bold placeholder:text-slate-400 text-lg"
                  />
                </div>
                <button className="hidden md:flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.5rem] font-black tracking-tight transition-all shadow-lg active:scale-95">
                  Explore <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🧭 PREMIUM NAVIGATION & FILTER PILLS */}
      <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Category Bar */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory("")}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                selectedCategory === "" 
                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                : "bg-white border-gray-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              All Events
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                  selectedCategory === cat.name 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "bg-white border-gray-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Filters Row */}
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-gray-100">
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 px-4 py-1.5"
                >
                  <option value="">Time Period</option>
                  <option value="upcoming">Future Only</option>
                  <option value="past">Past Archives</option>
                </select>
                <div className="h-4 w-px bg-slate-200" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 px-4 py-1.5"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort Alphabetically</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto pt-16">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="px-6 py-20 text-center"
            >
               <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] border border-red-100 inline-block max-w-lg">
                  <h2 className="text-xl font-black mb-2">Connection Issues</h2>
                  <p className="font-semibold text-sm opacity-80 mb-6">{error}</p>
                  <button onClick={fetchEvents} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform">Reload Data</button>
               </div>
            </motion.div>
          ) : (
            <>
              {/* Featured Section */}
              {featuredEvents.length > 0 && selectedCategory === "" && (
                 <FeaturedEvents events={featuredEvents} onRegister={handleRegisterClick} />
              )}

              {/* Main Grid Section */}
              <div className="pb-32">
                <AllEvents events={events} onRegister={handleRegisterClick} />
              </div>
            </>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
