// 📂 src/pages/StudentDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, LogOut, LayoutDashboard, Bell, CalendarDays, UserRound, Calendar, Users, BarChart2, Award } from "lucide-react";
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
    console.log("StudentDashboardPage - location.search changed:", location.search); // Debug log
    console.log("StudentDashboardPage - pageFromUrl:", pageFromUrl); // Debug log
    if (pageFromUrl && pageFromUrl !== activePage) {
      setActivePage(pageFromUrl);
      console.log("StudentDashboardPage - activePage updated to:", pageFromUrl); // Debug log
    } else if (!pageFromUrl && activePage !== "dashboard") {
      // If page param is removed, default to dashboard
      setActivePage("dashboard");
      console.log("StudentDashboardPage - activePage defaulted to dashboard"); // Debug log
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

  console.log("StudentDashboardPage - Rendering with:", {
    activePage,
    authLoading,
    loading,
    isAuthenticated,
    error,
    availableEventsCount: availableEvents.length,
    registeredEventsCount: registeredEvents.length,
    userRole: user?.role, // Added user role for debugging
  });

  if (authLoading || loading) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl">Loading student dashboard...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: User not authenticated. Please log in.</div>;
  }

  if (error) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: {error}</div>;
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
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-[#1a1a24] p-5 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
        <div className={`${iconBg} p-2 rounded-lg bg-opacity-30`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        <span className="text-green-400 text-xs">{change}</span>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-[#0b1220] text-white"
    >
      {/* Sidebar */}
      <Sidebar active={activePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        {/* Page Wrapper */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-4 bg-[#1f2937] p-5 rounded-2xl shadow-lg"
                >
                  <img
                    src={currentUser?.profilePicture || "https://i.pravatar.cc/150?img=68"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-2xl font-bold text-white"
                    >
                      Hello, {currentUser?.name || "Student"}!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-gray-400"
                    >
                      Welcome to your SmartEvents Dashboard.
                    </motion.p>
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
