// 📂 src/pages/OrganizerDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../utils/api"; // Import the API instance
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react"; // Import Menu icon

import Sidebar from "../components/organizerDashboard/Sidebar";
import Topbar from "../components/organizerDashboard/Topbar";
import StatsCards from "../components/organizerDashboard/StatsCards";
import CreateEventCard from "../components/organizerDashboard/CreateEventCard";
import ManageEvents from "../components/organizerDashboard/ManageEvents";
import OrganizerProfile from "../components/organizerDashboard/OrganizerProfile";
import QrScanner from "../components/common/QrScanner";

const OrganizerDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("page") || "dashboard";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // New state for mobile sidebar
  const [scannedQrData, setScannedQrData] = useState(null); // New state for scanned QR data
  const [showVerificationModal, setShowVerificationModal] = useState(false); // New state for modal visibility
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

  const handleVerification = () => {
    console.log("Verifying QR Data:", scannedQrData);
    // Implement your verification logic here.
    // After verification, you might want to clear the scanned data:
    setScannedQrData(null);
    alert(`Verification initiated for: ${scannedQrData}`);
  };

  const onScanResult = (decodedText, decodedResult) => {
    console.log("QR Code Scanned:", decodedText);
    setScannedQrData(decodedText);
    setShowVerificationModal(false); // Close the modal after a successful scan
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
      {/* Mobile Sidebar (animated) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-40 flex-col w-72 bg-[#0b1220] border-r border-white/5 p-4 gap-3 md:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6 rotate-90" /> {/* Using Menu icon as 'X' for consistency */}
            </motion.button>
            <Sidebar active={activePage} setActivePage={setActivePage} setMobileSidebarOpen={setMobileSidebarOpen} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (static) */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0b1220] border-r border-white/5 p-4 pr-6 gap-3">
        <Sidebar active={activePage} setActivePage={setActivePage} setMobileSidebarOpen={setMobileSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-6">
        {/* Mobile Sidebar Toggle (for smaller screens) */}
        
        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        <Topbar setMobileSidebarOpen={setMobileSidebarOpen} />

        {/* Page Wrapper */}
        <div className="pt-12 md:pt-20 px-6 space-y-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className=""
              >
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl font-bold text-purple-400 relative"
                >
                  Hello, {user?.name || "Organizer"}!
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVerificationModal(true)}
                    className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-sm md:absolute md:top-0 md:right-0"
                  >
                    Verify Pass
                  </motion.button>
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
                  className="mb-6"
                >
                  <CreateEventCard onEventCreated={handleEventCreated} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-6"
                >
                  <StatsCards />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-6"
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
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVerificationModal(false)} // Close modal on overlay click
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-[#111827] rounded-2xl p-6 shadow-2xl relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              <button
                onClick={() => setShowVerificationModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
              >
                <Menu className="w-6 h-6 rotate-45" /> {/* Use Menu icon rotated for 'X' */}
              </button>
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Verify Pass</h2>
              {!scannedQrData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QrScanner onResult={onScanResult} />
                </motion.div>
              )}

              {scannedQrData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2 text-indigo-300">Scanned Data:</h3>
                  <p className="text-white break-words mb-4">{scannedQrData}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVerification}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Verify
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScannedQrData(null)}
                    className="ml-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Clear
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrganizerDashboardPage;
