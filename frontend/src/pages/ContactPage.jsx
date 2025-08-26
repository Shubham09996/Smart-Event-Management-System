import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import OfficeHours from "../components/OfficeHours";
import Footer from "../components/Footer";

export default function ContactPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8 }}
      className="pt-28 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-dark via-dark/95 to-dark text-white min-h-screen flex flex-col"
    >
      {/* Heading */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center leading-tight mb-6"
      >
        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Get in Touch
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center text-gray-300 mb-16 max-w-3xl mx-auto text-base sm:text-lg"
      >
        Have questions? We'd love to hear from you. Send us a message and we'll
        respond as soon as possible.
      </motion.p>

      {/* Main Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <ContactForm />
        </motion.div>
        <div className="flex flex-col gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <ContactInfo />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <OfficeHours />
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
