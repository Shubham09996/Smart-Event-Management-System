import { Home, Layers, LogOut, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Sidebar = ({ active }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-indigo-600/20 text-indigo-300"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </motion.div>
  );

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // agar token/session hai to clear
    navigate('/login'); // ya tum jis page pe le jana chaho
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex flex-col w-72 bg-[#0b1220] border-r border-white/5 p-4 gap-3"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center gap-3 px-2 py-3"
      >
        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
          <Home size={18} />
        </div>
        <div>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-white font-semibold leading-tight"
          >
            SmartEvents
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-[11px] text-slate-400 -mt-0.5"
          >
            Campus Edition
          </motion.p>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-2 flex flex-col gap-2"
      >
        <NavItem
          icon={Home}
          label="Dashboard"
          isActive={active === "dashboard"}
          onClick={() => navigate("/organizer?page=dashboard")}
        />
        <NavItem
          icon={Layers}
          label="Events"
          isActive={active === "events"}
          onClick={() => navigate("/organizer?page=events")}
        />
      </motion.nav>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="mt-auto"
      >
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-4 border border-white/5">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="text-sm text-slate-300"
          >
            Stay updated with campus events and workshops.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 1.0 }}
            onClick={() => navigate("/organizer?page=verify-pass")} // ✅ yaha verify-pass page pe le jaa
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl transition"
          >
            <ShieldCheck size={16} /> Verify Pass
          </motion.button>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
        >
          <LogOut size={18} /> Logout
        </motion.button>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
