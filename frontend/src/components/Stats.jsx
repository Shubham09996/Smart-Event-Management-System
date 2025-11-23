export default function Stats() {
  return (
    <section className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-20 text-center py-12 sm:py-16 text-white px-4">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-400">50K+</h2>
        <p className="text-gray-400 text-sm sm:text-base">Active Students</p>
      </div>
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-400">1000+</h2>
        <p className="text-gray-400 text-sm sm:text-base">Events Hosted</p>
      </div>
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-400">99.9%</h2>
        <p className="text-gray-400 text-sm sm:text-base">Uptime</p>
      </div>
    </section>
  );
}
