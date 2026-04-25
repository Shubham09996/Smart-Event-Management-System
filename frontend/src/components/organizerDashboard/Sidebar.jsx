import { Home, Layers, LogOut, ShieldCheck, LayoutDashboard, User2, Settings, QrCode, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active, setActivePage, setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItem = ({ icon: Icon, label, isActive, page }) => (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        navigate(`/organizer?page=${page}`);
        if(setMobileSidebarOpen) setMobileSidebarOpen(false);
      }}
      className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl cursor-pointer transition-all duration-300 relative group ${
        isActive
          ? "bg-indigo-50 text-indigo-700 shadow-sm"
          : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="active-pill-organizer"
          className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
        />
      )}
      <Icon size={20} className={`flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"} transition-colors`} />
      {!isCollapsed && (
        <span className={`font-bold text-sm whitespace-nowrap overflow-hidden ${isActive ? "text-indigo-700" : "text-slate-600 group-hover:text-slate-900"} transition-colors`}>{label}</span>
      )}
    </motion.div>
  );

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event('loginStateChange'));
    navigate('/login');
    setMobileSidebarOpen(false);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? "6rem" : "18rem" }}
      transition={{ type: "spring", damping: 25, stiffness: 200, width: { duration: 0.3 } }}
      className={`flex flex-col h-full bg-white relative z-[60] ${isCollapsed ? 'p-4 gap-8' : 'p-6 gap-8'}`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-full p-1 shadow-md z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`flex items-center gap-3 px-2 py-3 ${isCollapsed ? 'justify-center' : ''}`}
      >
        <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Home size={20} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <p className="text-slate-900 font-black text-xl leading-tight tracking-tight">SmartEvents</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest -mt-0.5">Organizer Suite</p>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 relative">
        {!isCollapsed && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Management</p>}
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={active === "dashboard"}
          page="dashboard"
        />
        <NavItem
          icon={Layers}
          label="My Events"
          isActive={active === "events"}
          page="events"
        />
        <NavItem
          icon={BookOpen}
          label="Manage Exams"
          isActive={active === "exams"}
          page="exams"
        />
        <NavItem
          icon={User2}
          label="Organizer Profile"
          isActive={active === "profile"}
          page="profile"
        />
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={active === "settings"}
          page="settings"
        />
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-auto"
        >
          <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100/50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            
            <p className="text-sm text-slate-600 font-medium relative z-10">
              Easily verify guest passes using the QR scanner.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm bg-white border border-slate-200 hover:border-indigo-200 text-slate-700 font-bold py-2.5 rounded-xl transition shadow-sm hover:shadow-md relative z-10"
            >
              <QrCode size={16} className="text-indigo-600" /> Scanner Help
            </motion.button>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ x: 5 }}
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
          >
            <LogOut size={18} className="flex-shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="font-bold text-sm whitespace-nowrap">Logout</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
