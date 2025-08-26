// 📂 src/pages/OrganizerDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../utils/api"; // Import the API instance
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/organizerDashboard/Sidebar";
import Topbar from "../components/organizerDashboard/Topbar";
import StatsCards from "../components/organizerDashboard/StatsCards";
import CreateEventCard from "../components/organizerDashboard/CreateEventCard";
import QRPassGenerator from "../components/organizerDashboard/QRPassGenerator";
import ManageEvents from "../components/organizerDashboard/ManageEvents";
import OrganizerProfile from "../components/organizerDashboard/OrganizerProfile";

const OrganizerDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("page") || "dashboard";
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.get("/events/myevents", config); // Assuming a route for organizer's events
      setEvents(data);
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

  const handleEventCreated = () => {
    fetchEvents();
  };

  const handleEventDeleted = () => {
    fetchEvents();
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (authLoading || loading) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl">Loading organizer dashboard...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: User not authenticated. Please log in.</div>;
  }

  if (error) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-[#0b1220] text-white"
    >
      {/* Sidebar */}
      <Sidebar active={activePage} setActivePage={setActivePage} />

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
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl font-bold text-purple-400 mb-2"
                >
                  Hello, {user?.name || "Organizer"}!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-400 mb-6"
                >
                  Welcome to your dashboard. Here's a quick overview of your events and tools.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CreateEventCard onEventCreated={handleEventCreated} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <StatsCards />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <QRPassGenerator events={events} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <ManageEvents events={events} onEventDeleted={handleEventDeleted} onEventUpdated={handleEventUpdated} />
                </motion.div>
              </motion.div>
            )}

            {activePage === "events" && (
              <motion.div
                key="events"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-[#111827] rounded-2xl p-6 shadow-md"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  Manage Your Events
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ManageEvents events={events} onEventDeleted={handleEventDeleted} onEventUpdated={handleEventUpdated} />
                </motion.div>
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
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  Organizer Profile
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <OrganizerProfile />
                </motion.div>
              </motion.div>
            )}

            {/* {activePage === "analytics" && (
              <motion.div
                key="analytics"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-[#111827] rounded-2xl p-6 shadow-md"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  Event Analytics
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <EventAnalytics events={events} />
                </motion.div>
              </motion.div>
            )} */}

            {/* {activePage === "approvals" && (
              <motion.div
                key="approvals"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-[#111827] rounded-2xl p-6 shadow-md"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  Pending Approvals
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <PendingApprovals />
                </motion.div>
              </motion.div>
            )} */}

            {activePage === "settings" && (
              <motion.div
                key="settings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-[#111827] rounded-2xl p-6 shadow-md"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  System Settings
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-400"
                >
                  Organizer settings panel coming soon 🚀
                </motion.p>
              </motion.div>
            )}

            {activePage === "verify-pass" && (
              <motion.div
                key="verify-pass"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-[#111827] rounded-2xl p-6 shadow-md"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold mb-4"
                >
                  Verify Pass
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <QRPassGenerator events={events} />
                </motion.div>
              </motion.div>
            )}

            {activePage === "login" && (
              <motion.div
                key="login"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center h-full"
              >
                <div className="bg-[#111827] p-10 rounded-2xl shadow-lg text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-2xl font-bold mb-4"
                  >
                    You are logged out
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-400"
                  >
                    Please login again to continue.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizerDashboardPage;
