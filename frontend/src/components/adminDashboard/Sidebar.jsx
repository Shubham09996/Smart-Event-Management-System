import { motion } from "framer-motion";
import {
  Home,
  Layers,
  User2,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  Tags, // Changed from Category to Tags icon
  X,
} from "lucide-react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = ({ active, setActivePage, mobileSidebarOpen, setMobileSidebarOpen, isDesktop }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const NavItem = ({ icon: Icon, label, page }) => (
    <motion.div
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        navigate(`?page=${page}`);
        setMobileSidebarOpen(false); // Close sidebar on navigation
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${
        active === page
          ? "bg-indigo-600/20 text-indigo-300"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </motion.div>
  );

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isDesktop || mobileSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`hidden md:flex flex-col w-72 bg-[#0b1220] border-r border-white/5 p-4 gap-3 ${mobileSidebarOpen ? "fixed inset-y-0 left-0 z-40 flex" : ""}`}
      >
        {/* Close button for mobile sidebar */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none md:hidden"
        >
          <X size={24} />
        </motion.button>

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 px-2 py-3"
        >
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
            <Home size={18} />
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">SmartEvents</p>
            <p className="text-[11px] text-slate-400 -mt-0.5">Campus Edition</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="mt-2 flex flex-col gap-2">
          <NavItem icon={Home} label="Dashboard" page="dashboard" />
          <NavItem icon={Layers} label="Events" page="events" />
          <NavItem icon={User2} label="Users" page="users" />
          <NavItem icon={Tags} label="Categories" page="categories" /> {/* Changed from Category to Tags NavItem */}
          <NavItem icon={BarChart3} label="Analytics" page="analytics" />
          <NavItem icon={Settings} label="Settings" page="settings" />
        </nav>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-auto"
        >
          {/* Promo Box */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-4 border border-white/5">
            <p className="text-sm text-slate-300">
              Stay updated with campus events and workshops.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl transition"
            >
              <ShieldCheck size={16} /> Verify Pass
            </motion.button>
          </div>

          {/* Logout Button */}
          
        </motion.div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
