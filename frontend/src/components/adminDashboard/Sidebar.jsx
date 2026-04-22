import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Home,
  Layers,
  User2,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  Tags,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = ({ active, setActivePage, mobileSidebarOpen, setMobileSidebarOpen, isDesktop }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const NavItem = ({ icon: Icon, label, page }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        navigate(`?page=${page}`);
        if(setMobileSidebarOpen) setMobileSidebarOpen(false);
      }}
      className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-5'} py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
        active === page
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 border border-transparent hover:border-slate-100"
      }`}
    >
      <Icon size={20} className={`flex-shrink-0 ${active === page ? "text-white" : "text-slate-400 group-hover:text-indigo-600"} transition-colors`} />
      {!isCollapsed && (
        <span className="font-bold tracking-tight whitespace-nowrap">{label}</span>
      )}
    </motion.div>
  );

  return (
    <>
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isDesktop || mobileSidebarOpen ? 0 : -300,
          width: isCollapsed ? "6rem" : "18rem"
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200, width: { duration: 0.3 } }}
        className={`fixed md:sticky top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200 ${isCollapsed ? 'p-4' : 'p-6'} flex flex-col z-[60] ${mobileSidebarOpen ? "left-0 w-72" : ""}`}
      >
        {isDesktop && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-full p-1 shadow-md z-50 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}

        {/* Close button for mobile sidebar */}
        <button
          onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 md:hidden"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-2 mb-10 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="h-12 w-12 flex-shrink-0 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-slate-900 font-black text-xl leading-tight tracking-tighter">Admin<span className="text-indigo-600 text-sm align-top leading-none ml-0.5">•</span></p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] -mt-1">Control Center</p>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2.5">
          <NavItem icon={Home} label="Dashboard" page="dashboard" />
          <NavItem icon={Layers} label="Pending Events" page="events" />
          <NavItem icon={User2} label="Manage Users" page="users" />
          <NavItem icon={Tags} label="Event Categories" page="categories" />
          <NavItem icon={BarChart3} label="Analytics" page="analytics" />
          <NavItem icon={Settings} label="System Settings" page="settings" />
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="mt-auto pt-10">
            <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-6 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              <p className="relative z-10 text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">System Status</p>
              <p className="relative z-10 text-sm text-slate-300 font-bold leading-relaxed mb-4">
                All systems online. Security protocols active.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Protected Session
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
