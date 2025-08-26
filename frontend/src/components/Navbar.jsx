import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User2, LogOut, Menu, X } from "lucide-react"; // Added Menu and X icons
import { AnimatePresence } from "framer-motion"; // Added AnimatePresence for mobile menu

export default function Navbar() {
  const navigate = useNavigate();
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
    navigate(getDashboardPath(user?.role));
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
    { path: "/about", label: "About Us", highlight: true }, // Highlighted link
    { path: "/contact", label: "Contact Us" }, // 👈 Contact page link
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-10 py-6 bg-gray-900 text-white fixed top-0 left-0 w-full z-50 border-b border-white/10"
    >
      {/* Logo */}
      <Link to="/">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-bold flex items-center gap-2"
        >
          <span className="text-primary">📅 SmartEvents</span>
        </motion.div>
      </Link>

      {/* Hamburger Menu Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 text-gray-300">
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
              className={`hover:text-white transition ${
                link.highlight
                  ? "text-primary font-medium hover:text-primary"
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
            <Link to={getDashboardPath(user.role)} className="hover:text-white transition">
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
              src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"}
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
                className="absolute right-0 mt-2 w-48 bg-[#1f2937] rounded-md shadow-lg py-1 z-10"
              >
                <button
                  onClick={handleProfileView}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <User2 size={16} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
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
                className="hover:text-white transition"
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
                className="hover:text-white transition"
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
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 z-40 p-5 pt-28 shadow-lg md:hidden"
          >
            {/* Close button for mobile menu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white focus:outline-none"
            >
              <X size={24} />
            </motion.button>
            <ul className="flex flex-col gap-5 text-gray-300">
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
                    className={`block py-2 text-lg hover:text-white transition ${
                      link.highlight ? "text-primary font-medium hover:text-primary" : ""
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
                  <Link
                    to={getDashboardPath(user?.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-lg hover:text-white transition"
                  >
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
                >
                  <Link
                    to={getDashboardPath(user?.role)} // Profile link goes to dashboard
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left py-2 text-lg text-gray-300 hover:text-white"
                  >
                    <User2 size={20} /> Profile
                  </Link>
                  <button
                    onClick={() => {handleLogout(); setMobileMenuOpen(false);}}
                    className="flex items-center gap-2 w-full text-left py-2 text-lg text-red-400 hover:text-white"
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
                      className="block py-2 text-lg hover:text-white transition"
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
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-lg hover:text-white transition"
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
