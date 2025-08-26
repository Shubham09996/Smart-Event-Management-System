import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative border-t border-white/10 px-10 py-16 mt-10 text-gray-300"
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Logo + Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-sm"
        >
          <h3 className="text-xl font-bold text-indigo-400">📅 SmartEvents</h3>
          <p className="mt-3">
            Revolutionizing campus event management with AI-powered registration,
            real-time analytics, and seamless integration for students and organizers.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "Events", "Contact", "Login", "Sign Up"].map((link, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.1, x: 6, color: "#818cf8" }}
                transition={{ type: "spring", stiffness: 200 }}
                className="cursor-pointer"
              >
                {link}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h4 className="font-semibold mb-3 text-white">Contact Info</h4>
          <p>📧 smart.events@gmail.com</p>
          <p>📞 +91 9650843965</p>
          <div className="flex gap-4 mt-3 text-xl">
            {[
              { icon: "fab fa-facebook", color: "#3b82f6" },
              { icon: "fab fa-twitter", color: "#06b6d4" },
              { icon: "fab fa-instagram", color: "#ec4899" },
              { icon: "fab fa-linkedin", color: "#3b82f6" },
            ].map((social, i) => (
              <motion.i
                key={i}
                className={`${social.icon} cursor-pointer`}
                whileHover={{ scale: 1.2, color: social.color }}
                transition={{ type: "spring", stiffness: 250 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="relative z-10 text-center text-gray-500 mt-10"
      >
        © 2025 SmartEvents. All rights reserved.
      </motion.p>
    </motion.footer>
  );
}
