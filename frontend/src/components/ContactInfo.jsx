import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo() {
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
      className="bg-dark/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h3>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Email</p>
            <a
              href="mailto:support@smartevents.edu"
              className="text-purple-400 hover:underline text-sm sm:text-base"
            >
              support@smartevents.edu
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Call Us</p>
            <p className="text-sm sm:text-base">+91 98765 43210</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Visit Us</p>
            <p className="text-sm sm:text-base">123 Innovation Drive, Tech City, India</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
