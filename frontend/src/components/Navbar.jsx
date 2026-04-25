import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User2, LogOut, Menu, X, LayoutDashboard, CalendarDays, Layers, Bell, Tags, BarChart3, Settings } from "lucide-react"; // Added Menu and X icons
import { AnimatePresence } from "framer-motion"; // Added AnimatePresence for mobile menu

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu

  const handleLogout = () => {
    logout(); // Use context logout
    navigate("/login"); // Redirect to login page after logout
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileView = () => {
    setShowProfileMenu(false);
    navigate(`${getDashboardPath(user?.role)}?page=profile`);
  };

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "organizer":
        return "/organizer";
      case "student":
        return "/student";
      default:
        return "/login"; // Fallback or a generic dashboard if roles aren't defined
    }
  };

  // Variants for staggered animation
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  // Nav Links
  const navLinks = [
    { path: "/events", label: "Events" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  // New: Dashboard Nav Links for authenticated users in mobile menu
  const dashboardNavLinks = [
    { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
    { icon: CalendarDays, label: "Available Events", page: "available-events" },
    { icon: Layers, label: "Registered Events", page: "registered-events" },
    { icon: Bell, label: "Notifications", page: "notifications" },
  ];

  // New: Admin Dashboard Nav Links for authenticated admin users in mobile menu
  const adminDashboardNavLinks = [
    { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
    { icon: Layers, label: "Events", page: "events" },
    { icon: User2, label: "Users", page: "users" },
    { icon: Tags, label: "Categories", page: "categories" },
    { icon: BarChart3, label: "Analytics", page: "analytics" },
    { icon: Settings, label: "Settings", page: "settings" },
  ];

  // Do not show the public navbar on dashboard pages
  if (location.pathname.startsWith("/student") || 
      location.pathname.startsWith("/organizer") || 
      location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-6 md:px-8 py-3 md:py-4 bg-white/90 backdrop-blur-xl text-gray-900 fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full"
    >
      {/* Logo */}
      <Link to="/">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg md:text-xl font-bold flex items-center gap-2"
        >
          <span className="text-slate-900 font-extrabold text-xl md:text-2xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-base">✨</span>
            </div>
            CampusSync
          </span>
        </motion.div>
      </Link>

      {/* Hamburger Menu Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 focus:outline-none p-2">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-2 lg:gap-6 text-slate-600 font-medium">
        {navLinks.map((link, i) => (
          <motion.li
            key={link.path || link.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            <Link
              to={link.path}
              className={`px-4 py-2 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-colors ${
                location.pathname === link.path
                  ? "text-indigo-600 font-semibold bg-indigo-50"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          </motion.li>
        ))}

        {isAuthenticated && user && (
          <motion.li
            custom={navLinks.length}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            <Link to={getDashboardPath(user.role)} className="hover:text-indigo-600 transition">
              Dashboard
            </Link>
          </motion.li>
        )}

        {isAuthenticated ? (
          <motion.li
            custom={navLinks.length + (isAuthenticated && user ? 1 : 0)}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            className="relative"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=4f46e5&color=fff`}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500 object-cover"
              onClick={handleProfileClick}
            />
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 md:w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-10"
              >
                <button
                  onClick={handleProfileView}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User2 size={16} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </motion.li>
        ) : (
          <>
            <motion.li
              custom={navLinks.length + (isAuthenticated && user ? 1 : 0)}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full hover:bg-slate-50 hover:text-indigo-600 text-slate-700 font-semibold transition-colors"
              >
                Login
              </Link>
            </motion.li>
            <motion.li
              custom={navLinks.length + 1 + (isAuthenticated && user ? 1 : 0)}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                Sign Up
              </Link>
            </motion.li>
          </>
        )}
      </ul>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-56 sm:w-64 bg-white border-l border-gray-100 z-40 p-5 pt-20 shadow-2xl md:hidden overflow-y-auto"
          >
            {/* Close button for mobile menu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <X size={24} />
            </motion.button>
            <ul className="flex flex-col gap-5 text-gray-600 font-medium">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.path || link.label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-lg hover:text-indigo-600 transition ${
                      location.pathname === link.path ? "text-primary font-medium hover:text-indigo-600" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              {isAuthenticated && user && (
                <>
                  {user?.role === "admin" ? (
                    adminDashboardNavLinks.map((link, i) => (
                      <motion.li
                        key={link.page}
                        custom={navLinks.length + i}
                        initial="hidden"
                        animate="visible"
                        variants={navItemVariants}
                      >
                        <Link
                          to={`${getDashboardPath(user?.role)}?page=${link.page}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 w-full text-left py-2 text-lg text-gray-600 hover:text-indigo-600"
                        >
                          <link.icon size={20} /> {link.label}
                        </Link>
                      </motion.li>
                    ))
                  ) : (
                    dashboardNavLinks.map((link, i) => (
                      <motion.li
                        key={link.page}
                        custom={navLinks.length + i}
                        initial="hidden"
                        animate="visible"
                        variants={navItemVariants}
                      >
                        <Link
                          to={`${getDashboardPath(user?.role)}?page=${link.page}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 w-full text-left py-2 text-lg text-gray-600 hover:text-indigo-600"
                        >
                          <link.icon size={20} /> {link.label}
                        </Link>
                      </motion.li>
                    ))
                  )}
                </>
              )}

              {isAuthenticated ? (
                <motion.li
                  custom={navLinks.length + (user?.role === "admin" ? adminDashboardNavLinks.length : dashboardNavLinks.length) + 1}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                >
                  <Link
                    to={`${getDashboardPath(user?.role)}?page=profile`} // Profile link goes to dashboard profile page
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left py-2 text-lg text-gray-600 hover:text-indigo-600"
                  >
                    <User2 size={20} /> Profile
                  </Link>
                  <button
                    onClick={() => {handleLogout(); setMobileMenuOpen(false);}}
                    className="flex items-center gap-2 w-full text-left py-2 text-lg text-red-500 hover:text-red-700"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </motion.li>
              ) : (
                <>
                  <motion.li
                    custom={navLinks.length + (isAuthenticated && user ? 1 : 0)}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-lg hover:text-indigo-600 transition"
                    >
                      Login
                    </Link>
                  </motion.li>
                  <motion.li
                    custom={navLinks.length + (user?.role === "admin" ? adminDashboardNavLinks.length : dashboardNavLinks.length) + 2}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-lg hover:text-indigo-600 transition"
                    >
                      Sign Up
                    </Link>
                  </motion.li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
