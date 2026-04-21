import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import OfficeHours from "../components/OfficeHours";
import Footer from "../components/Footer";
import { Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden"
    >
      {/* 🚀 PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-4 overflow-hidden">
        {/* Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-500">
              <Sparkles size={14} className="text-indigo-500" />
              We're Here for You
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[950] tracking-[-0.04em] leading-[0.95] text-slate-900 mb-8 max-w-4xl mx-auto">
              Get in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 italic">
                Touch.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-12">
              Have a question, feedback, or just want to say hello? Our team is always ready to assist you in making your campus experience better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🧩 MAIN CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Premium Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ContactForm />
          </motion.div>

          {/* Right Side: Contact Info & Hours */}
          <div className="flex flex-col gap-8 md:gap-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <OfficeHours />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
