import { Bell, Search, UserRound, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/student?page=profile");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate("/login");
    setShowDropdown(false);
  };

  return (
    <motion.div
      className="sticky top-0 z-40 backdrop-blur bg-[#0b1220]/80 border-b border-white/5"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block"
        >
          <h1 className="text-lg font-semibold text-white">Student Dashboard</h1>
          <p className="text-sm text-slate-400">Discover and register for exciting campus events</p>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-white/5 text-sm text-slate-200 px-4 py-2 rounded-xl focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
          </div>
          <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
            <Bell className="text-slate-300" size={20} />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-xs text-white rounded-full px-1">
              3
            </span>
          </motion.div>
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <p className="text-sm text-white font-medium">{user?.name || "Student"}</p>
                <p className="text-xs text-slate-400">{user?.email || "student@example.com"}</p>
              </div>
            </div>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-[#1a1a24] rounded-xl shadow-lg border border-gray-700 z-50"
              >
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white hover:bg-white/5 transition rounded-t-xl"
                >
                  <UserRound size={18} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition rounded-b-xl"
                >
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
