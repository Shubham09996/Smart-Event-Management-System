import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import FeaturedEvents from "../components/FeaturedEvents";
import AllEvents from "../components/AllEvents";
import Footer from "../components/Footer";
import api from "../utils/api"; // Import the API instance
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast'; // Import toast

export default function EventsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Removed
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]); // State to store categories
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const { data } = await api.get("/categories");
      setCategories([...data, { _id: "hackathon-id", name: "Hackathon" }]); // Manually add Hackathon
      setCategoriesLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("Not authenticated for categories, showing no categories.");
        setCategories([]);
        setCategoriesError(null); // Clear error for 401, as it's expected for non-logged-in users
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
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedCategory, selectedDateRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchEvents();
    fetchCategories();

    // Check if user is logged in
    // const userInfo = localStorage.getItem("userInfo"); // Removed
    // if (userInfo) {
    //   setIsLoggedIn(true);
    // } else {
    //   setIsLoggedIn(false);
    // }
  }, [fetchEvents, fetchCategories]);

  const handleRegisterClick = (eventId) => {
    if (!isAuthenticated) {
      toast.error("Please login to register for this event."); // Replaced alert with toast
      navigate("/login");
    } else {
      // alert(`You have successfully registered for event ID: ${eventId}`); // Removed alert
      // 👉 Future: Implement actual registration API call here (already done in StudentDashboardPage.jsx)
      // For now, no action on Learn More click
    }
  };

  // Filter out featured events based on a boolean field (assuming 'isFeatured' in backend model)
  // Or if no 'isFeatured' field, you can define 'featured' logic here (e.g., top N events, or events from a specific category)
  const featuredEvents = events.filter(event => event.isFeatured); // Assuming an 'isFeatured' field in event model

  if (loading || categoriesLoading) {
    return <div className="pt-28 px-10 bg-gradient-to-b from-dark via-dark/95 to-dark text-white min-h-screen text-center text-xl">Loading events...</div>;
  }

  if (error || categoriesError) {
    return <div className="pt-28 px-10 bg-gradient-to-b from-dark via-dark/95 to-dark text-white min-h-screen text-center text-xl text-red-500">Error: {error || categoriesError}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-28 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-dark via-dark/95 to-dark text-white min-h-screen"
    >
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-500 text-transparent bg-clip-text"
      >
        Upcoming Events
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center text-gray-300 mb-14 max-w-2xl mx-auto px-4 sm:px-0"
      >
        Discover amazing events happening at your campus. From tech talks to
        cultural festivals, find opportunities to learn, connect, and grow.
      </motion.p>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mb-10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-3"
      >
        <input
          type="text"
          placeholder="Search events..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-[#1e293b] text-white border border-gray-700 focus:border-purple-500 outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={categoriesLoading}
          className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-[#1e293b] text-white border border-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="">{categoriesLoading ? "Loading Categories..." : "All Categories"}</option>
          {categoriesError && <option value="">Error loading categories</option>}
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-[#1e293b] text-white border border-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="">All Dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-[#1e293b] text-white border border-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-[#1e293b] text-white border border-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </motion.div>

      {/* Featured Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <FeaturedEvents events={featuredEvents} onRegister={handleRegisterClick} />
      </motion.div>

      {/* All Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <AllEvents events={events} onRegister={handleRegisterClick} />
      </motion.div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
