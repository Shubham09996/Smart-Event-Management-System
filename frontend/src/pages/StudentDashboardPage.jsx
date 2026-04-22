// 📂 src/pages/StudentDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Bell, CalendarDays, UserRound, Calendar, Users, BarChart2, Award } from "lucide-react"; // Removed Settings, LogOut
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import toast from 'react-hot-toast'; // Import toast

import Sidebar from "../components/studentDashboard/Sidebar";
import Topbar from "../components/studentDashboard/Topbar";
import AvailableEvents from "../components/studentDashboard/AvailableEvents";
import RegisteredEvents from "../components/studentDashboard/RegisteredEvents";
import Notifications from "../components/studentDashboard/Notifications";
import StudentProfile from "../components/studentDashboard/StudentProfile";
// import StatsCards from "../components/organizerDashboard/StatsCards"; // We will create a new one for student

const StudentDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("page") || "dashboard";
  });
  const [availableEvents, setAvailableEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [studentStats, setStudentStats] = useState({
    availableEventsCount: 0,
    registeredEventsCount: 0,
    attendeesMet: 0,
    certificatesEarned: 0,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
      // const token = userInfo ? userInfo.token : null; // Removed

      if (!isAuthenticated || !user?.token) {
        // throw new Error("User not authenticated"); // Handle this with AuthContext loading
        return;
      }
      const token = user.token;
      setCurrentUser(user); // Set current user info from AuthContext
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data: allEvents } = await api.get("/events", config);
      const { data: userRegisteredEvents } = await api.get("/users/registeredevents", config);

      setRegisteredEvents(userRegisteredEvents);

      const available = allEvents.filter(event =>
        !userRegisteredEvents.some(registeredEvent =>
          registeredEvent.eventId && registeredEvent.eventId._id === event._id
        )
      );
      setAvailableEvents(available);

      // Update stats based on fetched data
      setStudentStats({
        availableEventsCount: available.length,
        registeredEventsCount: userRegisteredEvents.length,
        // Dummy data for now, actual implementation will fetch from backend
        attendeesMet: 47,
        certificatesEarned: 8,
      });

      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchEvents();
    }
  }, [isAuthenticated, authLoading, fetchEvents]);

  // Update activePage when URL search params change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = params.get("page");
    if (pageFromUrl && pageFromUrl !== activePage) {
      setActivePage(pageFromUrl);
    } else if (!pageFromUrl && activePage !== "dashboard") {
      // If page param is removed, default to dashboard
      setActivePage("dashboard");
    }
  }, [location.search, activePage]);

  const handleRegister = async (eventId) => {
    try {
      // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
      // const token = userInfo ? userInfo.token : null; // Removed

      if (!isAuthenticated || !user?.token) {
        toast.error("Please login to register for this event."); // Replaced alert with toast
        return;
      }
      const token = user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await api.post(`/events/${eventId}/register`, {}, config);

      toast.success("Successfully registered for event!"); // Replaced alert with toast
      fetchEvents(); // Refresh events after successful registration
    } catch (err) {
      toast.error(`Error registering for event: ${err.response && err.response.data.message ? err.response.data.message : err.message}`); // Replaced alert with toast
    }
  };


  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserRound size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Not Authenticated</h2>
          <p className="text-slate-500 mb-6 font-medium">Please log in to access your student dashboard.</p>
          <button 
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Available Events",
      value: studentStats.availableEventsCount,
      change: "+3 this week", // Dummy data for now
      icon: Calendar,
      iconBg: "bg-purple-600",
    },
    {
      title: "Registered Events",
      value: studentStats.registeredEventsCount,
      change: "+1 this week", // Dummy data for now
      icon: Users,
      iconBg: "bg-blue-600",
    },
    {
      title: "Attendees Met",
      value: studentStats.attendeesMet,
      change: "+12 this month", // Dummy data for now
      icon: UserRound,
      iconBg: "bg-pink-600",
    },
    {
      title: "Certificates Earned",
      value: studentStats.certificatesEarned,
      change: "+2 completed", // Dummy data for now
      icon: Award,
      iconBg: "bg-teal-600",
    },
  ];

  const StatCard = ({ title, value, change, icon: Icon, iconBg }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between h-full group transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconBg.replace('bg-', 'text-')} ${iconBg} p-3 rounded-xl bg-opacity-10 flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{change.split(' ')[1]}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-tight">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-slate-900">{value}</p>
          <span className="text-indigo-600 text-xs font-bold">{change.split(' ')[0]}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-slate-50 text-slate-900"
    >
      {/* Sidebar */}
      <Sidebar active={activePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Page Wrapper */}
        <div className="p-4 md:p-8 space-y-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                >
                  {/* Decorative background blurs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -ml-32 -mb-32"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md opacity-20 scale-110"></div>
                      <img
src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${currentUser?.name || "User"}&background=4f46e5&color=fff`}
                        alt="Profile"
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight"
                      >
                        Hello, {currentUser?.name?.split(' ')[0] || "Student"}! 👋
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-slate-500 font-medium text-lg max-w-md"
                      >
                        Welcome back! You have <span className="text-indigo-600 font-bold">{studentStats.availableEventsCount} new events</span> waiting for you today.
                      </motion.p>
                    </div>
                    <div className="md:ml-auto flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setActivePage("available-events")}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                      >
                        Explore Events
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsData.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      <StatCard {...stat} />
                    </motion.div>
                  ))}
                </div>

                <AvailableEvents events={availableEvents} onRegister={handleRegister} />
                <RegisteredEvents events={registeredEvents} />
              </motion.div>
            )}

            {activePage === "available-events" && (
              <motion.div
                key="available-events"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <AvailableEvents events={availableEvents} onRegister={handleRegister} />
              </motion.div>
            )}

            {activePage === "registered-events" && (
              <motion.div
                key="registered-events"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <RegisteredEvents events={registeredEvents} />
              </motion.div>
            )}

            {activePage === "notifications" && (
              <motion.div
                key="notifications"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                <Notifications />
              </motion.div>
            )}

            {activePage === "profile" && (
              <motion.div
                key="profile"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <StudentProfile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboardPage;
