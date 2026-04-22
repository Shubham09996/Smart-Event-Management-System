import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Save, Camera, User, Hash, Briefcase, Users, Mail } from "lucide-react"; // Added new icons
import api from "../../utils/api"; // Import the API instance
import { useAuth } from "../../context/AuthContext";

const StudentProfile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profilePicture: `https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff`, // Default profile picture
    gender: "",
    rollNo: "",
    department: "",
    societyName: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null); // For new profile picture file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
      // const token = userInfo ? userInfo.token : null; // Removed

      if (!isAuthenticated || !user?.token) {
        throw new Error("User not authenticated or token missing");
      }
      const token = user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.get("/users/profile", config); // Fetch full profile from backend
      setProfile({
        name: data.name,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture || `https://ui-avatars.com/api/?name=${data.name || "User"}&background=4f46e5&color=fff`,
        gender: data.gender || "",
        rollNo: data.rollNo || "",
        department: data.department || "",
        societyName: data.societyName || "",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data)); // Moved to AuthContext
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]); // Dependencies on user and isAuthenticated

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading, fetchUserProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result })); // Set for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
      // const token = userInfo ? userInfo.token : null; // Removed

      if (!isAuthenticated || !user?.token) {
        throw new Error("User not authenticated or token missing");
      }
      const token = user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const updatedData = { ...profile }; // Send all profile data
      if (password) {
        updatedData.password = password;
      }

      // Handle profile picture file upload if a new file is selected
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            updatedData.profilePicture = reader.result; // Send base64 string
            resolve();
          };
        });
      } else if (profile.profilePicture === "") {
        // If profile picture is explicitly cleared (empty string), set to default
        updatedData.profilePicture = `https://ui-avatars.com/api/?name=${profile.name || "User"}&background=4f46e5&color=fff`;
      }

      const { data } = await api.put("/users/profile", updatedData, config);

      // localStorage.setItem("userInfo", JSON.stringify(data)); // Moved to AuthContext
      setProfile({
        name: data.name,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture || "https://i.pravatar.cc/150?img=68",
        gender: data.gender || "",
        rollNo: data.rollNo || "",
        department: data.department || "",
        societyName: data.societyName || "",
      });
      setPassword("");
      setConfirmPassword("");
      setProfilePictureFile(null); // Clear file input
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleUpdateProfile();
    }
    setIsEditing(!isEditing);
    setSuccess(false); // Clear success message on toggle
    setError(null); // Clear error message on toggle
  };

  if (authLoading) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen bg-[#0b1220] text-white items-center justify-center text-xl text-red-500">Error: User not authenticated. Please log in.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <User size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md ${isEditing ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100" : "bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-200"}`}
          onClick={toggleEdit}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isEditing ? (
            <Save size={18} />
          ) : (
            <Pencil size={18} />
          )}
          {loading ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
        </motion.button>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Profile Picture Display/Upload */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 group"
          >
            <div className="absolute inset-0 bg-indigo-500 opacity-20 blur-xl rounded-full scale-110"></div>
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover relative z-10"
            />
            {isEditing && (
              <label htmlFor="profile-picture-upload" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera size={32} className="text-white" />
              </label>
            )}
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={!isEditing}
            />
          </motion.div>
          <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{profile.role}</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 w-full">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid sm:grid-cols-2 gap-5"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="Roll Number"
                  value={profile.rollNo}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department / Branch</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Computer Science Engineering"
                  value={profile.department}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                />
              </div>
              
              <div className="sm:col-span-2 pt-4 border-t border-slate-50 mt-2">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Security Settings</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h4 className="text-slate-900 text-3xl font-black tracking-tight mb-2 uppercase">{profile.name}</h4>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full w-fit">
                    <Mail size={14} /> {profile.email}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse hover:animate-none hover:bg-slate-100 hover:text-indigo-600 transition-all">
                    <User size={24} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                    <p className="text-slate-900 font-black text-lg">{profile.gender || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse hover:animate-none hover:bg-slate-100 hover:text-indigo-600 transition-all">
                    <Hash size={24} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID / Roll No</label>
                    <p className="text-slate-900 font-black text-lg">{profile.rollNo || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 sm:col-span-2">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse hover:animate-none hover:bg-slate-100 hover:text-indigo-600 transition-all">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Campus Details</label>
                    <p className="text-slate-900 font-black text-lg">{profile.department || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <AnimatePresence>
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-8 p-4 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-wider ${error ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
              >
                {error ? `Action Failed: ${error}` : "Profile Updated Successfully!"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
