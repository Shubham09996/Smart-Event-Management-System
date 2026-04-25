import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 pt-20 pb-10 border-t border-gray-200 overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Info */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <span className="text-slate-900 font-extrabold text-2xl tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-base">✨</span>
                </div>
                CampusSync
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-8">
              Revolutionizing campus event management with lightning-fast registrations, seamless team collaboration, and beautiful analytics.
            </p>
            <div className="flex gap-4">
              {[
                { icon: "fab fa-twitter", color: "hover:text-blue-400 hover:bg-blue-50" },
                { icon: "fab fa-instagram", color: "hover:text-pink-500 hover:bg-pink-50" },
                { icon: "fab fa-linkedin", color: "hover:text-blue-600 hover:bg-blue-50" },
                { icon: "fab fa-github", color: "hover:text-slate-900 hover:bg-slate-200" },
              ].map((social, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 transition-all ${social.color}`}>
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-4">
              {["Explore Events", "Host Event", "Pricing", "About Us"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4">
              {["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-4">
              Subscribe to our newsletter for the latest event updates and platform features.
            </p>
            <form className="relative mt-2 rounded-full shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                className="block w-full rounded-full border-0 py-3 pl-11 pr-14 text-slate-900 ring-1 ring-inset ring-gray-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                placeholder="you@example.com"
              />
              <button
                type="submit"
                className="absolute inset-y-1 right-1 flex items-center justify-center rounded-full bg-indigo-600 px-3 hover:bg-indigo-700 transition-colors"
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} CampusSync. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Made with</span>
            <span className="text-pink-500 animate-pulse">❤️</span>
            <span>for campus students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
