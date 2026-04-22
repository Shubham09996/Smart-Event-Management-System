import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Save, Upload, User, Mail, Shield, Camera, Lock, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profilePicture: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff&size=200`,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      let updatedProfilePicture = profile.profilePicture;
      if (imageFile) {
        const result = await api.post("/upload", { image: profile.profilePicture }, config);
        updatedProfilePicture = result.data.secure_url;
      }

      const updatedData = {
        name: profile.name,
        email: profile.email,
        profilePicture: updatedProfilePicture,
      };
      if (password) {
        updatedData.password = password;
      }

      const { data } = await api.put("/users/profile", updatedData, config);

      login({ ...user, ...data });
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden"
      >
        {/* Banner Section */}
        <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          <div className="absolute -bottom-16 left-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={profile.profilePicture}
                className="w-32 h-32 rounded-full border-8 border-white object-cover shadow-2xl relative z-10"
                alt="Admin"
              />
              <AnimatePresence>
                {isEditing && (
                  <motion.label
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    htmlFor="pic-upload"
                    className="absolute bottom-1 right-1 z-20 bg-slate-900 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-colors shadow-lg border-2 border-white"
                  >
                    <Camera size={18} />
                    <input id="pic-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </motion.label>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  System Admin
                </span>
                <span className="text-slate-400 text-xs font-medium italic">• Control Access Granted</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
              disabled={loading}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all ${
                isEditing 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600" 
                  : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
              }`}
            >
              {loading ? "Syncing..." : isEditing ? <><Save size={18} /> Update Profile</> : <><Pencil size={18} /> Edit Identity</>}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                <User size={18} className="text-indigo-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Identification</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Full Legal Name</label>
                  <input
                    disabled={!isEditing}
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 disabled:opacity-60 transition-all font-bold text-slate-900 outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">System Email Address</label>
                  <input
                    disabled={!isEditing}
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 disabled:opacity-60 transition-all font-bold text-slate-900 outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                <Lock size={18} className="text-indigo-500" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Security Credentials</h3>
              </div>

              <div className="space-y-4">
                <div className={!isEditing ? "opacity-40 grayscale pointer-events-none" : ""}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">New Access Key</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 transition-all font-bold text-slate-900 outline-none shadow-inner"
                  />
                </div>
                <div className={!isEditing ? "opacity-40 grayscale pointer-events-none" : ""}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Verify New Key</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 transition-all font-bold text-slate-900 outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 font-bold px-6">
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-600 font-bold px-6">
                <CheckCircle size={20} />
                Platform identity updated successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
