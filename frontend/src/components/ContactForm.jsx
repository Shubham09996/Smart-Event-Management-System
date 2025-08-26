import { motion } from "framer-motion";

export default function ContactForm() {
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
      <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

      <form className="space-y-4">
        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 rounded-lg bg-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 rounded-lg bg-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded-lg bg-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Subject */}
        <input
          type="text"
          placeholder="Subject"
          className="w-full p-3 rounded-lg bg-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Message */}
        <textarea
          placeholder="Your Message"
          rows="5"
          className="w-full p-3 rounded-lg bg-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Send Message ✉️
        </motion.button>
      </form>
    </motion.div>
  );
}
