import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const Topbar = ({ setMobileSidebarOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between bg-[#0b1220] px-6 py-2 sm:py-4 border-b border-gray-700"
    >
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="text-gray-400 hover:text-white md:hidden p-2"
      >
        <Menu size={24} />
      </button>
    </motion.div>
  );
};

export default Topbar;
