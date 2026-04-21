import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Hash, Briefcase, Users, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
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
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
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
      const signupData = { name, email, password, role };

      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            signupData.profilePicture = reader.result;
            resolve();
          };
        });
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
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration Successful!");

      if (data.role === "student") navigate("/student");
      else if (data.role === "organizer") navigate("/organizer");
      else if (data.role === "admin") navigate("/admin");

    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-28 md:p-8 md:pt-32">



      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-gray-100 mt-4 md:mt-0"
      >

        {/* Left Side: Lottie Animation Container */}
        <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-indigo-50/50 items-center justify-center p-12 relative overflow-hidden flex-col sticky top-0 h-[800px]">
          {/* background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 w-full flex flex-col items-center justify-center mt-[-40px]">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-indigo-900 mb-3 text-center tracking-tight">Join the Community</h2>
            <p className="text-indigo-700 font-medium text-center mb-10 max-w-xs leading-relaxed">Unlock access to exclusive campus events, connect with peers, and elevate your experience.</p>

            <div className="w-full max-w-sm aspect-square relative drop-shadow-2xl">
              <DotLottieReact
                src="https://lottie.host/59140dad-0cb4-4c64-99d7-72d1d9d20a6a/FLbckrAvlu.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-[55%] lg:w-[60%] p-6 sm:p-10 lg:p-14 overflow-y-auto max-h-[85vh] md:max-h-[800px] custom-scrollbar">

          <div className="max-w-xl mx-auto">

            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200 mx-auto">
                <UserPlus size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create an Account</h2>
              <p className="text-slate-500 font-medium">Please fill in your details to get started.</p>
            </div>

            {/* Google Authentication Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 mb-6 bg-white border border-gray-200 rounded-xl font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base hover:border-gray-300 focus:ring-4 focus:ring-slate-100"
              onClick={() => alert("Backend Google Auth flow needed to proceed.")}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or register with email</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center justify-center mb-10 w-full">
              <div className="relative group">
                <label htmlFor="profile-picture-upload" className="flex items-center justify-center w-24 h-24 rounded-full overflow-hidden cursor-pointer border-[3px] border-indigo-100 hover:border-indigo-400 bg-slate-50 transition-all duration-300 shadow-sm relative group">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-slate-300" />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                    <Camera size={24} className="text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upload</span>
                  </div>
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSignup}>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">I am registering as a</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer w-full text-center py-3.5 rounded-xl font-bold transition-all border-2 ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-gray-100 bg-white text-slate-500 hover:bg-slate-50 hover:border-gray-200'}`}>
                    <input type="radio" value="student" checked={role === 'student'} onChange={(e) => { setRole(e.target.value); setError(null); }} className="hidden" />
                    Student
                  </label>
                  <label className={`cursor-pointer w-full text-center py-3.5 rounded-xl font-bold transition-all border-2 ${role === 'organizer' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-gray-100 bg-white text-slate-500 hover:bg-slate-50 hover:border-gray-200'}`}>
                    <input type="radio" value="organizer" checked={role === 'organizer'} onChange={(e) => { setRole(e.target.value); setError(null); }} className="hidden" />
                    Organizer
                  </label>
                </div>
              </div>

              {/* Name Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    placeholder="john.doe@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Fields */}
              <AnimatePresence>
                {(role === "student" || role === "organizer") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 pt-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-100 pt-6">
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      {/* Roll No */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Roll Number</label>
                        <div className="relative group">
                          <Hash className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                          <input
                            type="text"
                            placeholder="e.g., 20CS301"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                            required
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div className={role === "organizer" ? "" : "sm:col-span-2"}>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Department</label>
                        <div className="relative group">
                          <Briefcase className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                          <input
                            type="text"
                            placeholder="e.g., Computer Science"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                            required
                          />
                        </div>
                      </div>

                      {/* Society Name (Organizer only) */}
                      {role === "organizer" && (
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Society Name</label>
                          <div className="relative group">
                            <Users className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                            <input
                              type="text"
                              placeholder="e.g., Tech Club"
                              value={societyName}
                              onChange={(e) => setSocietyName(e.target.value)}
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 text-red-600 text-sm font-bold p-3.5 rounded-xl border border-red-100 flex items-center justify-center"
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
                className="w-full py-4 mt-6 bg-slate-900 text-white rounded-xl font-extrabold text-base shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center text-slate-500 font-medium text-sm border-t border-gray-100 pt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition ml-1">
                Sign in here
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400 text-center font-medium">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
            </p>

          </div>
        </div>
      </motion.div>
      <style>{`
        /* Custom scrollbar for the right side form so it neatly scrolls inside the card */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1; 
        }
      `}</style>
    </div>
  );
}
