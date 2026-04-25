import { motion } from "framer-motion";
import { Search, QrCode, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search size={32} className="text-indigo-600" />,
      title: "Discover & Create",
      description: "Find exciting events on campus or effortlessly host your own with our intuitive event builder.",
      color: "bg-indigo-100",
    },
    {
      icon: <QrCode size={32} className="text-purple-600" />,
      title: "Register Instantly",
      description: "Secure your spot with one click and get a unique QR code for lightning-fast check-ins.",
      color: "bg-purple-100",
    },
    {
      icon: <TrendingUp size={32} className="text-pink-600" />,
      title: "Manage & Analyze",
      description: "Organizers get real-time dashboards to track attendance, engagement, and feedbback.",
      color: "bg-pink-100",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-10 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">How CampusSync Works</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg hover:text-slate-800 transition">
            Designed for students and organizers alike. Get started in minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 rounded-full ${step.color} shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-800 transition">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
