import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { label: "Active Students", value: "50K+" },
    { label: "Events Hosted", value: "1000+" },
    { label: "Platform Uptime", value: "99.9%" }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row justify-around items-center gap-12 text-center relative z-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                {stat.value}
              </h2>
              <p className="text-slate-300 font-medium tracking-wide uppercase text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
