import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, LogOut, Settings, UserRound, Menu } from "lucide-react";
import { useRef, useEffect } from "react"; // Add useRef and useEffect
import { useNavigate } from "react-router-dom"; // Add useNavigate
import { useAuth } from "../../context/AuthContext"; // Add useAuth

const Topbar = ({ setMobileSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // Ref for profile dropdown
  const navigate = useNavigate(); // Initialize useNavigate
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    "New user registered",
    "TechFest event approved",
    "Server backup completed",
  ];

  const handleProfileClick = () => {
    navigate("/admin?page=profile");
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  return (
    <motion.div
      className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Hamburger menu for mobile */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="text-slate-500 hover:text-slate-900 md:hidden p-2 transition-colors"
        >
          <Menu size={24} />
        </button>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block"
        >
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium italic">Global system control and management overview</p>
        </motion.div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden sm:block">
            <input
              type="text"
              placeholder="Search users or events..."
              className="bg-slate-100 text-sm text-slate-900 px-5 py-2.5 pl-11 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white border border-transparent focus:border-slate-200 w-64 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={18} />
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all shadow-sm"
          >
            <Bell className="text-slate-600" size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 -mr-1 -mt-1 bg-red-500 w-4 h-4 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white">
                {notifications.length}
              </span>
            )}
          </motion.div>

          <div className="relative" ref={profileMenuRef}>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="text-right hidden lg:block">
                <p className="text-sm text-slate-900 font-black">{user?.name || "Admin User"}</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=4f46e5&color=fff`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                />
              </div>
            </div>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 text-slate-600">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl font-semibold"
                    >
                      <UserRound size={18} /> Admin Profile
                    </button>
                    <button
                      onClick={() => { navigate("/admin?page=settings"); setShowProfileMenu(false); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl font-semibold"
                    >
                      <Settings size={18} /> System Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all rounded-xl font-semibold mt-1"
                    >
                      <LogOut size={18} /> Logout Admin
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
