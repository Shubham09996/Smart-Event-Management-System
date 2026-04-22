// 📂 src/pages/OrganizerDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../utils/api"; // Import the API instance
import { useAuth } from "../context/AuthContext";
import { Menu, QrCode as LucideQrCode, CheckCircle, Image, X, Bell, ShieldCheck } from "lucide-react"; // Aliased QrCode to LucideQrCode
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate(); // Initialize navigate hook
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("page") || "dashboard";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // New state for mobile sidebar
  const [scannedQrData, setScannedQrData] = useState(null); // New state for scanned QR data
  const [showVerificationModal, setShowVerificationModal] = useState(false); // New state for modal visibility
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      if (!isAuthenticated || !user?.token) return;
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await api.get("/events/organizer-stats", config);
      setStats(data);
      setStatsLoading(false);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchEvents();
      fetchStats();
    }
  }, [isAuthenticated, authLoading, fetchEvents, fetchStats]);

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
    fetchStats();
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
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold animate-pulse">Loading Organizer Hub...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 font-medium mb-8">Please log in with an organizer account to access this dashboard.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
          >
            Go to Login
          </motion.button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-500 font-medium mb-8">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700"
    >
      {/* Mobile Sidebar (animated) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-50 flex-col w-72 bg-white border-r border-slate-200 p-6 shadow-2xl md:hidden"
          >
            <Sidebar active={activePage} setActivePage={setActivePage} setMobileSidebarOpen={setMobileSidebarOpen} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (static) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <Sidebar active={activePage} setActivePage={setActivePage} setMobileSidebarOpen={setMobileSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
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
        <div className="pt-8 md:pt-10 px-6 space-y-6 overflow-y-auto">
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
                <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 group mb-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-32 -mb-32 transition-transform group-hover:scale-110 duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md opacity-20 scale-110"></div>
                        <img
                          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=4f46e5&color=fff`}
                          alt="Profile"
                          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                        />
                      </div>
                      <div>
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
                        >
                          Hello, {user?.name?.split(' ')[0] || "Organizer"}! <span className="inline-block animate-bounce">👋</span>
                        </motion.h2>
                        <p className="text-slate-500 font-bold text-lg mt-2">Manage your events and track performance from one place.</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowVerificationModal(true)}
                      className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                    >
                      <LucideQrCode size={20} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
                      Verify Attendee Pass
                    </motion.button>
                  </div>
                </div>
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
                  <StatsCards stats={stats} loading={statsLoading} />
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowVerificationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 pb-4 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <LucideQrCode size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verify Attendee</h2>
                </div>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {!scannedQrData ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative group">
                       <QrScanner onResult={onScanResult} />
                       <div className="absolute inset-0 pointer-events-none border-[3rem] border-white/10 flex items-center justify-center">
                          <div className="w-64 h-64 border-2 border-indigo-500 rounded-3xl opacity-50 relative">
                             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600 -translate-x-1 -translate-y-1"></div>
                             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-600 translate-x-1 -translate-y-1"></div>
                             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-600 -translate-x-1 translate-y-1"></div>
                             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600 translate-x-1 translate-y-1"></div>
                             <div className="absolute inset-x-0 h-0.5 bg-indigo-500/50 animate-scan"></div>
                          </div>
                       </div>
                    </div>
                    <p className="text-slate-500 font-bold text-center">Position the QR code within the frame to scan</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Scan Successful!</h3>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 max-h-32 overflow-y-auto">
                       <p className="text-slate-500 font-bold text-sm break-all">{scannedQrData}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setScannedQrData(null)}
                        className="py-4 rounded-2xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-100 transition-all border border-slate-100"
                      >
                        Rescan
                      </button>
                      <button
                        onClick={handleVerification}
                        className="py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                      >
                        Verify Entry
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrganizerDashboardPage;
