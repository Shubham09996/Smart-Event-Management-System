import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { motion } from "framer-motion";
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
    profilePicture: "https://i.pravatar.cc/150?img=68", // Default profile picture
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
        updatedData.profilePicture = "https://i.pravatar.cc/150?img=68";
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
      className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex justify-between items-center mb-4"
      >
        <h3 className="text-lg font-semibold text-white">Student Profile</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          onClick={toggleEdit}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? <Save size={16} /> : <Pencil size={16} />}
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </motion.button>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Picture Display/Upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg flex-shrink-0"
        >
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <label htmlFor="profile-picture-upload" className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
              <Camera size={24} className="text-white" />
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

        {/* Profile Info */}
        <div className="space-y-2 flex-1">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-2"
            >
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              {/* Role is not editable by user, but can be displayed */}
              <p className="text-gray-400 text-sm">Role: <span className="font-medium text-white">{profile.role}</span></p>

              {/* Conditional fields for editing */}
              {(profile.role === "student" || profile.role === "organizer") && (
                <>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <input
                    type="text"
                    name="rollNo"
                    placeholder="Roll Number"
                    value={profile.rollNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={profile.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                  />
                </>
              )}
              {profile.role === "organizer" && (
                <input
                  type="text"
                  name="societyName"
                  placeholder="Society Name"
                  value={profile.societyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
                />
              )}

              {/* Password change fields */}
              <input
                type="password"
                name="password"
                placeholder="New Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-2"
            >
              <h4 className="text-white text-xl font-semibold">{profile.name}</h4>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} /> {profile.email}
              </div>
              <p className="text-gray-400">Role: <span className="font-medium text-white">{profile.role}</span></p>

              {/* Conditional fields for display */}
              {profile.gender && (
                <div className="flex items-center gap-2 text-gray-400">
                  <User size={16} /> {profile.gender}
                </div>
              )}
              {profile.rollNo && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Hash size={16} /> {profile.rollNo}
                </div>
              )}
              {profile.department && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase size={16} /> {profile.department}
                </div>
              )}
              {profile.societyName && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} /> {profile.societyName}
                </div>
              )}
            </motion.div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Profile updated successfully!</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
