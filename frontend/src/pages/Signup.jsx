import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, Image, User, Hash, Briefcase, Users, Camera } from "lucide-react"; // Added Camera icon
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Corrected Import path
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast'; // Import toast

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role to student
  const [profilePicture, setProfilePicture] = useState("https://i.pravatar.cc/150?img=68"); // Default profile picture URL for display
  const [profilePictureFile, setProfilePictureFile] = useState(null); // To store the actual file object or base64 string
  const [gender, setGender] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Set for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const name = `${firstName} ${lastName}`.trim();
      const signupData = {
        name, email, password, role
      };

      // If a file is selected, convert it to base64 before sending
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            signupData.profilePicture = reader.result; // Send base64 string
            resolve();
          };
        });
      } else {
        signupData.profilePicture = profilePicture; // Send default or existing URL if no new file is selected
      }

      if (role === "student") {
        signupData.gender = gender;
        signupData.rollNo = rollNo;
        signupData.department = department;
      } else if (role === "organizer") {
        signupData.gender = gender;
        signupData.rollNo = rollNo;
        signupData.department = department;
        signupData.societyName = societyName;
      }

      const { data } = await api.post("/users", signupData);

      login(data);
      // window.dispatchEvent(new Event('loginStateChange')); // Dispatch custom event
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration Successful!"); // Replaced alert with toast
      if (data.role === "student") {
        navigate("/student"); // Changed from /student-dashboard to /student
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
    <div className="flex items-center justify-center bg-[#0a0a0f] text-white px-4 pt-20 sm:pt-32 pb-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-lg bg-[#1a1a24] rounded-2xl p-8 shadow-lg"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-full mb-4">
            <UserPlus size={32} />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-purple-400"
          >
            Join SmartEvents
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm sm:text-base text-gray-400 mt-1"
          >
            Create your account to get started
          </motion.p>
        </div>

        {/* Profile Picture Upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mb-6"
        >
          <label htmlFor="profile-picture-upload" className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-indigo-500 hover:border-purple-400 transition-colors duration-200">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <Camera size={24} className="text-white" />
            </div>
          </label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          {/* First + Last Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="relative"
          >
            <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="your.email@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="relative"
          >
            <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="relative"
          >
            <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {/* Role */} 
          <motion.select
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            value={role}
            onChange={(e) => {setRole(e.target.value); setError(null); /* Clear error on role change */}}
            className="w-full py-2 sm:py-3 px-4 rounded-xl bg-[#0f0f16] border border-white/20 
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
          >
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
            {/* Admin role is not directly selectable for signup */} 
          </motion.select>

          {/* Conditional Fields for Student and Organizer */}
          {(role === "student" || role === "organizer") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Gender */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="relative"
              >
                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </motion.div>

              {/* Roll No. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.3 }}
                className="relative"
              >
                <Hash className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Roll Number (e.g., 20XXXXX)"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
              </motion.div>

              {/* Department */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                className="relative"
              >
                <Briefcase className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Department (e.g., Computer Science)"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Conditional Field for Organizer only */}
          {role === "organizer" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
              className="space-y-4"
            >
              {/* Society Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.6 }}
                className="relative"
              >
                <Users className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Society/Club Name (e.g., Tech Club)"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl bg-[#0f0f16] border border-white/20 
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(138, 90, 246, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 1.7 }}
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl 
            font-bold text-white text-base sm:text-lg transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}

        {/* Already have account */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.8 }}
          className="mt-6 text-center text-gray-400 text-sm sm:text-base"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Sign in here
          </Link>
        </motion.p>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.9 }}
          className="mt-4 text-xs text-gray-500 text-center"
        >
          By creating an account, you agree to our{" "}
          <span className="text-purple-400">Terms of Service</span> and{" "}
          <span className="text-purple-400">Privacy Policy</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
