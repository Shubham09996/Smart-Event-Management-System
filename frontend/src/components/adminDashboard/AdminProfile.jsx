import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Upload } from "lucide-react";
import api from "../../utils/api"; // Import the API instance
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook

const AdminProfile = () => {
  const { user, login } = useAuth(); // Get user and login from AuthContext
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    profilePicture: "", // Initialize with an empty string
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
        profilePicture: user.profilePicture || "https://i.pravatar.cc/150?img=68", // Set default if no picture
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
    if (password !== confirmPassword) {
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
        // Assuming uploadImage function handles base64 string or FormData
        // You might need to adjust this based on your backend's uploadImage implementation
        const result = await api.post("/upload", { image: profile.profilePicture }, config); // Example upload route
        updatedProfilePicture = result.data.secure_url; // Adjust based on your API response
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

      login(data); // Update user in AuthContext
      setProfile({ name: data.name, email: data.email, role: data.role, profilePicture: data.profilePicture });
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
        {/* Avatar Upload */}
        <div className="relative">
          <img
            src={profile.profilePicture}
            alt="Admin Profile"
            className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
          />
          {isEditing && (
            <label
              htmlFor="profilePictureUpload"
              className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700"
            >
              <Upload size={16} className="text-white" />
              <input
                id="profilePictureUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

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
