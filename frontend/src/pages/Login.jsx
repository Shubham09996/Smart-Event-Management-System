import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, AtSign, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/users/login", { email, password });

      login(data);

      if (data.role === "student") {
        navigate("/student");
      } else if (data.role === "organizer") {
        navigate("/organizer");
      } else if (data.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-28 md:p-8 md:pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-gray-100 min-h-[600px] mt-4"
      >
        
        {/* Left Side: Lottie Animation Container */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-50/50 items-center justify-center p-12 relative overflow-hidden">
          {/* subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-2 text-center">Welcome Back!</h2>
            <p className="text-indigo-700 font-medium text-center mb-8 max-w-xs">Sign in to continue discovering brilliant campus events.</p>
            
            <div className="w-full max-w-sm aspect-square relative drop-shadow-xl">
              <DotLottieReact
                src="https://lottie.host/056f7d74-d795-4d28-b7e7-e7141c6a8c0d/0nbEyjSFgn.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your details to access your account.</p>
            </div>

            {/* Google Authentication Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 mb-6 bg-white border border-gray-200 rounded-xl font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base hover:border-gray-300 focus:ring-4 focus:ring-slate-100"
              onClick={() => alert("Backend Google Auth flow needed to proceed.")}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <AtSign className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 text-red-600 text-sm font-bold p-3.5 rounded-xl border border-red-100 mt-2 flex items-center justify-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-slate-900 text-white rounded-xl font-extrabold text-base shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 text-center text-slate-500 font-medium text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 transition ml-1">
                Create Account
              </Link>
            </div>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
