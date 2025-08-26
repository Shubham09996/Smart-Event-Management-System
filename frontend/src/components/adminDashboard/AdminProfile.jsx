import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Upload } from "lucide-react";
import api from "../../utils/api"; // Import the API instance

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    // avatar: "https://i.pravatar.cc/150?img=5", // Remove avatar for now
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
        // avatar: user.avatar || "https://i.pravatar.cc/150?img=5",
      });
    }
  }, []);

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
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo ? userInfo.token : null;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const updatedData = { name: profile.name, email: profile.email };
      if (password) {
        updatedData.password = password;
      }

      const { data } = await api.put("/users/profile", updatedData, config);

      localStorage.setItem("userInfo", JSON.stringify(data)); // Update localStorage with new token/data
      setProfile({ name: data.name, email: data.email, role: data.role });
      setPassword("");
      setConfirmPassword("");
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-between items-center mb-4"
      >
        <h3 className="text-lg font-semibold text-white">Admin Profile</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          onClick={toggleEdit}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? <Save size={16} /> : <Pencil size={16} />}
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </motion.button>
      </motion.div>

      <div className="flex items-center gap-6">
        {/* Avatar Upload (functionality not implemented in backend) */}
        {/* <div className="relative">
          <img
            src={profile.avatar}
            alt="Admin"
            className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
          />
          {isEditing && (
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700"
            >
              <Upload size={16} className="text-white" />
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div> */}

        {/* Profile Info */}
        <div className="space-y-2 flex-1">
          {isEditing ? (
            <>
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              {/* Role is not editable by user, only by admin through ManageUsers */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="text-gray-400"
              >
                Role: {profile.role}
              </motion.p>
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                type="password"
                name="password"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
            </>
          ) : (
            <>
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-white text-xl font-semibold"
              >
                {profile.name}
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-gray-400"
              >
                {profile.email}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="text-gray-400"
              >
                Role: {profile.role}
              </motion.p>
            </>
          )}
          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Profile updated successfully!</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
