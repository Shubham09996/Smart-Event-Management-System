import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const Notifications = () => {
  const items = [
    {
      id: 1,
      title: "AI Workshop starts in 2 hours",
      subtitle: "Computer Lab A",
      color: "bg-purple-600/40",
    },
    {
      id: 2,
      title: "New event: Spring Festival 2024",
      subtitle: "Registration now open",
      color: "bg-blue-600/40",
    },
  ];

  return (
    <motion.div
      className="bg-[#111827] rounded-2xl p-5 mt-6 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-indigo-400" size={18} />
        <h3 className="text-white font-semibold">Recent Notifications</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            className={`p-3 rounded-xl ${n.color} cursor-pointer`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * i }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-white text-sm">{n.title}</p>
            <p className="text-slate-300 text-xs">{n.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notifications;
