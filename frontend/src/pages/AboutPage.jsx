import { motion } from "framer-motion";
import Footer from "../components/Footer";

const timelineData = [
  {
    year: "2020",
    title: "Vision Born",
    description: "Conceived the idea of revolutionizing college event management.",
    gradient: "from-pink-400 to-purple-500",
  },
  {
    year: "2021",
    title: "Platform Development",
    description: "Built the core infrastructure with cutting-edge technology.",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    year: "2022",
    title: "Student Integration",
    description: "Launched with 10,000+ students across 50+ colleges.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    year: "2023",
    title: "Nationwide Expansion",
    description: "Scaled to 100+ colleges, fostering a connected student community.",
    gradient: "from-yellow-400 to-orange-500",
  },
];

export default function AboutPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 80, scale: 0.9 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 1, ease: "easeOut" },
    viewport: { once: false, amount: 0.2 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pt-28 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-dark via-dark/95 to-dark text-white min-h-screen flex flex-col"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center leading-tight mb-8"
      >
        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          About SmartEvents
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        viewport={{ once: true }}
        className="text-center text-gray-300 mb-20 max-w-4xl mx-auto text-base sm:text-lg md:text-xl"
      >
        Transforming the future of college event management through innovation,
        technology, and seamless user experiences.
      </motion.p>

      {/* Mission, Vision, Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24"
      >
        {[
          {
            title: "🎯 Our Mission",
            gradient: "from-pink-400 to-purple-500",
            text: "To revolutionize how colleges organize, manage, and experience events through cutting-edge technology and intuitive design.",
          },
          {
            title: "🚀 Our Vision",
            gradient: "from-indigo-400 to-purple-500",
            text: "A world where every college event is seamlessly organized, highly engaging, and accessible to all students.",
          },
          {
            title: "💡 Our Values",
            gradient: "from-pink-400 to-indigo-400",
            text: "Innovation, accessibility, community building, and empowering students to create memorable experiences.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            {...fadeUp}
            className="bg-dark/80 p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-500"
          >
            <h3
              className={`text-3xl font-bold mb-6 bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}
            >
              {item.title}
            </h3>
            <p className="text-gray-300 text-lg">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Journey Section */}
      <motion.h2
        {...fadeUp}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        className="text-5xl font-extrabold text-center mb-20 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
      >
        Our Journey
      </motion.h2>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto mb-28"
      >
        {/* Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-400 via-purple-600/50 to-pink-400 rounded"></div>

        <div className="space-y-24">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.9 + index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center md:items-start gap-10 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.0 + index * 0.2 }}
                viewport={{ once: false }}
                className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full shadow-2xl z-10 bg-gradient-to-r ${item.gradient}`}
              ></motion.div>

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.1 + index * 0.2 }}
                className={`bg-dark/90 p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-lg w-full md:w-5/12 ${
                  index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <h4
                  className={`text-2xl font-bold mb-4 bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}
                >
                  {item.year} – {item.title}
                </h4>
                <p className="text-gray-300 text-lg">{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
