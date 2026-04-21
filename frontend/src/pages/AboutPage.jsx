import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Sparkles, Rocket, Target, Heart, Github, Linkedin, Mail, ChevronRight, User } from "lucide-react";

export default function AboutPage() {
  const principles = [
    {
      title: "Our Mission",
      icon: Target,
      desc: "To revolutionize how campuses experience events through cutting-edge technology and seamless integration.",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-100",
      delay: 0.2
    },
    {
      title: "Our Vision",
      icon: Rocket,
      desc: "To be the global benchmark for academic event coordination and student community engagement.",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-100",
      delay: 0.3
    },
    {
      title: "Our Values",
      icon: Heart,
      desc: "Innovation, accessibility, and reliability are at the core of everything we build.",
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      borderColor: "border-pink-100",
      delay: 0.4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden"
    >
      {/* 🚀 PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4">
        {/* Mesh Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-500">
              <Sparkles size={14} className="text-indigo-500" />
              Redefining Coordination
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[950] tracking-[-0.04em] leading-[0.95] text-slate-900 mb-8 max-w-4xl mx-auto">
              Behind the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
                Innovation.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-12">
              SmartEvents is more than an app—it's a vision to eliminate the friction between great ideas and unforgettable events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🧩 BENTO PRINCIPLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: p.delay, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`bg-white p-8 rounded-[2.5rem] border ${p.borderColor} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all flex flex-col items-start`}
            >
              <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center mb-6`}>
                <p.icon size={28} className={p.iconColor} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{p.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 👑 FEATURED CREATOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden relative"
        >
          {/* Decorative background for the dark section */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px] -mr-64 -mt-64"></div>
          </div>

          {/* Image Container */}
          <div className="w-64 h-64 md:w-80 md:h-80 relative shrink-0">
             <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] animate-pulse blur-md opacity-50"></div>
             <div className="relative w-full h-full bg-slate-800 rounded-[2rem] overflow-hidden border-2 border-slate-700">
               <img 
                 src="https://media.licdn.com/dms/image/v2/D5603AQEvPj9xscU1eQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1691238491873?e=1750723200&v=beta&t=A2N0c7XUe8Z9K8z0Xz8_8A0P9-6X8Y-Z8Z-Z8Z-Z8Z8" 
                 alt="Shubham Gupta"
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
               {/* Default Placeholder if image fails */}
               <div className="absolute inset-0 flex items-center justify-center bg-slate-800 -z-10">
                 <User size={80} className="text-slate-600" />
               </div>
             </div>
          </div>

          <div className="flex-1 text-center lg:text-left relative z-10">
            <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Lead Architect</span>
            <h2 className="text-4xl md:text-6xl font-[950] text-white tracking-tight mb-6">
              Shubham Gupta
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
              "Building SmartEvents was driven by a single goal: to simplify campus life for students and organizers alike. 
              As the sole architect, I've poured every ounce of innovation into creating a platform that is as reliable as it is beautiful."
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <motion.a 
                 whileHover={{ scale: 1.05 }}
                 href="https://github.com/shubhamgupta" target="_blank"
                 className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
               >
                 <Github size={20} /> GitHub
               </motion.a>
               <motion.a 
                 whileHover={{ scale: 1.05 }}
                 href="https://linkedin.com/in/shubhamgupta" target="_blank"
                 className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
               >
                 <Linkedin size={20} /> LinkedIn
               </motion.a>
               <motion.a 
                 whileHover={{ scale: 1.05 }}
                 href="mailto:contact@shubham.dev"
                 className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold transition-all shadow-xl shadow-indigo-900/20"
               >
                 <Mail size={20} /> Stay Connected
               </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 📜 JOURNEY SECTION */}
      <section className="max-w-5xl mx-auto px-4 md:px-10 mb-32">
         <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4">The Evolution</h3>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full mx-auto" />
         </div>

         <div className="space-y-12">
            {[
              { year: "The Spark", desc: "Initially started as a weekend prototype to solve internal society management." },
              { year: "The Pivot", desc: "Recognized the need for a unified platform for all college departments." },
              { year: "The Future", desc: "Continuously evolving with AI-driven insights and real-time ecosystem integration." }
            ].map((step, i) => (
              <motion.div 
                key={step.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 group"
              >
                 <div className="bg-white border border-gray-100 shadow-sm px-6 py-2 rounded-full text-indigo-600 font-extrabold text-sm whitespace-nowrap">
                   {step.year}
                 </div>
                 <p className="text-slate-500 font-medium text-lg leading-relaxed text-center md:text-left">
                   {step.desc}
                 </p>
              </motion.div>
            ))}
         </div>
      </section>

      <Footer />
    </motion.div>
  );
}