import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { resettoken } = useParams(); // Get resettoken from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await api.put(`/users/resetpassword/${resettoken}`, { password, confirmPassword });
      setSuccess(true);
      toast.success(data.data);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white px-4 pt-20 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md bg-[#1a1a24] rounded-2xl p-8 shadow-lg"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-full mb-4">
            <Lock size={32} />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-purple-400"
          >
            Reset Password
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm sm:text-base text-gray-400 mt-1 text-center"
          >
            Enter your new password below.
          </motion.p>
        </div>

        {success ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-center mt-4 text-sm"
          >
            Password reset successful! Redirecting to login...
          </motion.p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="relative"
            >
              <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {/* Confirm New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="relative"
            >
              <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(138, 90, 246, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-bold text-base sm:text-lg text-white transition"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        )}

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: success ? 0.5 : 0.9 }}
          className="mt-6 text-center text-gray-400 text-sm sm:text-base"
        >
          Remember your password?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
