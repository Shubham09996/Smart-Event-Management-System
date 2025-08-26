import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/adminDashboard/Topbar";
import StatsCards from "../components/adminDashboard/StatsCards";
import Charts from "../components/adminDashboard/Charts";
import EventCategories from "../components/adminDashboard/EventCategories";
import SystemSettings from "../components/adminDashboard/SystemSettings";
import PendingApprovals from "../components/adminDashboard/PendingApprovals";
import ManageUsers from "../components/adminDashboard/ManageUsers";
import AdminProfile from "../components/adminDashboard/AdminProfile";
import RecentActivity from "../components/adminDashboard/RecentActivity"; // New import
import AdminTips from "../components/adminDashboard/AdminTips"; // New import
import api from "../utils/api"; // Import the API instance
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AdminDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("page") || "dashboard";
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [eventCategoryCounts, setEventCategoryCounts] = useState([]);
  const [eventMonthCounts, setEventMonthCounts] = useState([]);
  const [systemSettings, setSystemSettings] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [loadingPendingEvents, setLoadingPendingEvents] = useState(true);
  const [errorPendingEvents, setErrorPendingEvents] = useState(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState(true);
  const [errorAdminStats, setErrorAdminStats] = useState(null);
  const [loadingCategoryCounts, setLoadingCategoryCounts] = useState(true);
  const [errorCategoryCounts, setErrorCategoryCounts] = useState(null);
  const [loadingMonthCounts, setLoadingMonthCounts] = useState(true);
  const [errorMonthCounts, setErrorMonthCounts] = useState(null);
  const [loadingSystemSettings, setLoadingSystemSettings] = useState(true);
  const [errorSystemSettings, setErrorSystemSettings] = useState(null);

  const getAuthHeader = useCallback(() => {
    // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
    // const token = userInfo ? userInfo.token : null; // Removed

    if (!isAuthenticated || !user?.token || user.role !== 'admin') {
      throw new Error("Not authorized as an admin or token missing");
    }
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }, [user, isAuthenticated]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/users", config);
      setUsers(data);
      setLoadingUsers(false);
    } catch (err) {
      setErrorUsers(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingUsers(false);
    }
  }, [getAuthHeader]);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/categories", config);
      setCategories(data);
      setLoadingCategories(false);
    } catch (err) {
      setErrorCategories(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingCategories(false);
    }
  }, [getAuthHeader]);

  const fetchPendingEvents = useCallback(async () => {
    setLoadingPendingEvents(true);
    setErrorPendingEvents(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/events/pending", config);
      setPendingEvents(data);
      setLoadingPendingEvents(false);
    } catch (err) {
      setErrorPendingEvents(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingPendingEvents(false);
    }
  }, [getAuthHeader]);

  const fetchAdminStats = useCallback(async () => {
    setLoadingAdminStats(true);
    setErrorAdminStats(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/admin/stats", config);
      setAdminStats(data);
      setLoadingAdminStats(false);
    } catch (err) {
      setErrorAdminStats(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingAdminStats(false);
    }
  }, [getAuthHeader]);

  const fetchEventCategoryCounts = useCallback(async () => {
    setLoadingCategoryCounts(true);
    setErrorCategoryCounts(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/admin/event-category-counts", config);
      setEventCategoryCounts(data);
      setLoadingCategoryCounts(false);
    } catch (err) {
      setErrorCategoryCounts(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingCategoryCounts(false);
    }
  }, [getAuthHeader]);

  const fetchEventMonthCounts = useCallback(async () => {
    setLoadingMonthCounts(true);
    setErrorMonthCounts(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/admin/event-month-counts", config);
      setEventMonthCounts(data);
      setLoadingMonthCounts(false);
    } catch (err) {
      setErrorMonthCounts(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingMonthCounts(false);
    }
  }, [getAuthHeader]);

  const fetchSystemSettings = useCallback(async () => {
    setLoadingSystemSettings(true);
    setErrorSystemSettings(null);
    try {
      const config = getAuthHeader();
      const { data } = await api.get("/settings", config);
      setSystemSettings(data);
      setLoadingSystemSettings(false);
    } catch (err) {
      setErrorSystemSettings(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingSystemSettings(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    if (isAuthenticated && !authLoading && user?.role === 'admin') {
      fetchUsers();
      fetchCategories();
      fetchPendingEvents();
      fetchAdminStats();
      fetchEventCategoryCounts();
      fetchEventMonthCounts();
      fetchSystemSettings();
    }
  }, [isAuthenticated, authLoading, user, fetchUsers, fetchCategories, fetchPendingEvents, fetchAdminStats, fetchEventCategoryCounts, fetchEventMonthCounts, fetchSystemSettings]);

  // Update activePage when URL search params change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = params.get("page");
    console.log("AdminDashboardPage - location.search changed:", location.search); // Debug log
    console.log("AdminDashboardPage - pageFromUrl:", pageFromUrl); // Debug log
    setActivePage(pageFromUrl || "dashboard");
    console.log("AdminDashboardPage - New activePage set to:", pageFromUrl || "dashboard"); // Debug log
  }, [location.search]);

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  const handleCategoryDeleted = () => {
    fetchCategories();
  };

  const handleEventApproved = () => {
    fetchPendingEvents();
    fetchAdminStats(); // Refresh stats when an event is approved/rejected
  };

  const handleEventRejected = () => {
    fetchPendingEvents();
    fetchAdminStats(); // Refresh stats when an event is approved/rejected
  };

  const handleSystemSettingUpdated = () => {
    fetchSystemSettings();
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <motion.div
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StatsCards stats={adminStats} />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Charts categoryCounts={eventCategoryCounts} monthCounts={eventMonthCounts} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <AdminTips /> {/* New AdminTips component */}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RecentActivity /> {/* New Recent Activity component */}
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial="hidden"
                animate="enter"
                variants={pageVariants} // Reusing pageVariants for consistency
                transition={{ duration: 0.5, delay: 0.5 }}
                className="col-span-1 md:col-span-2"
              >
                <PendingApprovals pendingEvents={pendingEvents} onEventApproved={handleEventApproved} onEventRejected={handleEventRejected} />
              </motion.div>
            </div>
          </motion.div>
        );
      case "events":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PendingApprovals pendingEvents={pendingEvents} onEventApproved={handleEventApproved} onEventRejected={handleEventRejected} />
          </motion.div>
        );
      case "users":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ManageUsers users={users} onUserUpdated={handleUserUpdated} onUserDeleted={handleUserDeleted} currentAdminId={user?._id} />
          </motion.div>
        );
      case "analytics":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Charts categoryCounts={eventCategoryCounts} monthCounts={eventMonthCounts} />
          </motion.div>
        );
      case "categories": // New case for categories page
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <EventCategories categories={categories} onCategoryCreated={handleCategoryCreated} onCategoryUpdated={handleCategoryUpdated} onCategoryDeleted={handleCategoryDeleted} />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SystemSettings settings={systemSettings} onSettingUpdated={handleSystemSettingUpdated} />;
          </motion.div>
        );
      case "profile": // New case for profile page
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AdminProfile />;
          </motion.div>
        );
      default:
        return <StatsCards stats={adminStats} />;
    }
  };

  const isLoading = authLoading || loadingUsers || loadingCategories || loadingPendingEvents || loadingAdminStats || loadingCategoryCounts || loadingMonthCounts || loadingSystemSettings;
  const hasError = errorUsers || errorCategories || errorPendingEvents || errorAdminStats || errorCategoryCounts || errorMonthCounts || errorSystemSettings;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
    >
      {/* Sidebar */}
      <Sidebar active={activePage} setActivePage={setActivePage} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Welcome Message */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-extrabold text-white mb-6"
          >
            Hello, {user?.name || "Admin"}!
          </motion.h1>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="text-center text-xl text-white">Loading data...</div>
            ) : hasError ? (
              <div className="text-center text-xl text-red-500">Error: {hasError}</div>
            ) : (!isAuthenticated || user?.role !== 'admin') ? (
              <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: You are not authorized to view this page.</div>
            ) : (
              <motion.div
                key={activePage}
                variants={pageVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {renderPage()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
