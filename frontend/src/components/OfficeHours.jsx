import { motion } from "framer-motion";

export default function OfficeHours() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.8 }}
      className="bg-dark/80 p-8 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-6">Office Hours</h3>
      <ul className="space-y-2 text-gray-300">
        <li className="flex justify-between">
          <span>Monday - Friday</span>
          <span>9:00 AM - 6:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Saturday</span>
          <span>10:00 AM - 4:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Sunday</span>
          <span className="text-red-400">Closed</span>
        </li>
      </ul>
    </motion.div>
  );
}
