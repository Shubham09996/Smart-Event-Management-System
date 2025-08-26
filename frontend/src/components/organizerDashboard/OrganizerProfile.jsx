import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Save,
  Camera,
  User,
  Hash,
  Briefcase,
  Users,
  Mail,
  X
} from "lucide-react";
import api from "../../utils/api"; // Import the API instance
import { useAuth } from "../../context/AuthContext";

const OrganizerProfile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profilePicture: "https://i.pravatar.cc/150?img=68",
    gender: "",
    rollNo: "",
    department: "",
    societyName: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const { data } = await api.get("/users/profile", config);
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
      // localStorage.setItem("userInfo", JSON.stringify(data)); // Moved to AuthContext
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading, fetchUserProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
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

      const updatedData = { ...profile };
      if (password) {
        updatedData.password = password;
      }
      let updatedProfilePicture = profile.profilePicture;
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            updatedProfilePicture = reader.result;
            resolve();
          };
        });
      } else if (profile.profilePicture === "") {
        updatedProfilePicture = "https://i.pravatar.cc/150?img=68";
      }
      updatedData.profilePicture = updatedProfilePicture;

      const { data } = await api.put("/users/profile", updatedData, config);

      // localStorage.setItem("userInfo", JSON.stringify(data)); // Moved to AuthContext
      setProfile({
        name: data.name,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture,
        gender: data.gender,
        rollNo: data.rollNo,
        department: data.department,
        societyName: data.societyName,
      });
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setIsEditing(false);
      setProfilePictureFile(null);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
        {/* Profile Picture */}
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-indigo-500"
          />
          {isEditing && (
            <label
              htmlFor="profilePictureInput"
              className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer shadow-md transform translate-x-1 translate-y-1"
            >
              <Camera className="w-4 h-4 text-white" />
              <input
                id="profilePictureInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
                disabled // Email cannot be changed for now
              />
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={profile.department}
                onChange={handleChange}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
              />
              {profile.role === "organizer" && (
                <input
                  type="text"
                  name="societyName"
                  placeholder="Society Name"
                  value={profile.societyName}
                  onChange={handleChange}
                  className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
                />
              )}
              <input
                type="password"
                name="password"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 p-2 rounded-lg w-full outline-none text-white"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-1"
            >
              <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
              <p className="text-indigo-300 text-lg flex items-center gap-2">
                <Mail size={18} /> {profile.email}
              </p>
              {profile.gender && (
                <p className="text-gray-400 flex items-center gap-2">
                  <User size={18} /> {profile.gender}
                </p>
              )}
              {profile.department && (
                <p className="text-gray-400 flex items-center gap-2">
                  <Briefcase size={18} /> {profile.department}
                </p>
              )}
              {profile.societyName && (
                <p className="text-gray-400 flex items-center gap-2">
                  <Users size={18} /> {profile.societyName}
                </p>
              )}
              <span className="text-sm text-blue-400 bg-blue-900 px-3 py-1 rounded-full mt-2 inline-block">
                {profile.role}
              </span>
            </motion.div>
          )}
          {error && <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-2"
          >Error: {error}</motion.p>}
          {success && <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-sm mt-2"
          >Profile updated successfully!</motion.p>}
        </div>

        {/* Edit / Save / Cancel */}
        <div className="absolute top-2 right-2 flex gap-2">
          {!isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white"
            >
              <Pencil size={16} /> Edit
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : <Save size={16} />} {loading ? "Saving..." : "Save"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsEditing(false);
                  fetchUserProfile(); // Revert changes by refetching profile
                  setPassword("");
                  setConfirmPassword("");
                  setError(null);
                  setSuccess(false);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white"
              >
                <X size={16} /> Cancel
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700"></div>

      {/* Bio / About Section (Optional) */}
      {/* Agar aapko yaha koi 'bio' ya 'about' section chahiye, toh add kar sakte hain. */}
      {/* Example: */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 bg-gray-800 rounded-xl p-4 text-gray-300 text-sm"
      >
        <h3 className="text-lg font-semibold text-white mb-2">About Me</h3>
        <p>This is where the organizer can write a short bio about themselves or their organization.</p>
      </motion.div> */}
    </motion.div>
  );
};

export default OrganizerProfile;
