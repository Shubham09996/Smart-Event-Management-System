import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Upload } from "lucide-react";
import api from "../../utils/api"; // Import the API instance
import { useAuth } from "../../context/AuthContext";

const CreateEventCard = ({ onEventCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState({
    title: "", // Changed from name to title as per backend model
    date: "",
    startTime: "", // Added startTime
    endTime: "", // Added endTime
    location: "",
    description: "",
    category: "", // Added category
    eventImage: "", // Added eventImage field
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching categories..."); // Debug log
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        // const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Removed
        // const token = userInfo ? userInfo.token : null; // Removed
        if (!isAuthenticated || !user?.token) {
          throw new Error("User not authenticated");
        }
        const token = user.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await api.get("/categories", config);
        console.log("Categories fetched successfully:", data); // Debug log
        // Add "Hackathon" category to the fetched list
        setCategories([...data, { _id: "hackathon-id", name: "Hackathon" }]); // Manually add Hackathon
        setCategoriesLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err); // Debug log
        setCategoriesError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setCategoriesLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, user]);

  // Debug log for categories state
  // useEffect(() => {
  //   console.log("Current categories state:", categories);
  // }, [categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({ ...prev, eventImage: reader.result })); // Set for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // const token = JSON.parse(localStorage.getItem("userInfo")).token; // Removed
      if (!isAuthenticated || !user?.token) {
        throw new Error("User not authenticated");
      }
      const token = user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const dataToSend = { ...eventData };
      if (eventImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(eventImageFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            dataToSend.eventImage = reader.result; // Send base64 string
            resolve();
          };
        });
      }
      
      await api.post("/events", dataToSend, config);
      setSuccess(true);
      setEventData({ title: "", date: "", startTime: "", endTime: "", location: "", description: "", category: "", eventImage: "" }); // reset
      setEventImageFile(null);
      setIsOpen(false);
      if (onEventCreated) {
        onEventCreated(); // Notify parent to refresh events
      }
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-[#1e293b] p-6 rounded-xl mt-6 shadow-lg flex justify-between items-center"
      >
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-xl font-semibold text-white"
          >
            Create New Event
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-gray-400 text-sm"
          >
            Start organizing your next amazing event
          </motion.p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md"
        >
          + Create Event
        </motion.button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="bg-[#1e293b] w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl p-6 relative overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </motion.button>

                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-xl font-semibold text-white mb-4"
                >
                  Create New Event
                </motion.h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-800"
                  >
                    {eventData.eventImage ? (
                      <img src={eventData.eventImage} alt="Event Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Upload size={32} className="mx-auto mb-2" />
                        <p>Upload Event Image</p>
                        <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <label htmlFor="title" className="text-gray-400 text-sm block mb-1">Event Title</label>
                      <input
                        type="text"
                        name="title" // Changed from name to title
                        value={eventData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <label htmlFor="date" className="text-gray-400 text-sm block mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={eventData.date}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <label htmlFor="startTime" className="text-gray-400 text-sm block mb-1">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <label htmlFor="endTime" className="text-gray-400 text-sm block mb-1">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <label htmlFor="location" className="text-gray-400 text-sm block mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={eventData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <label htmlFor="category" className="text-gray-400 text-sm block mb-1">Category</label>
                      <select
                        name="category"
                        value={eventData.category}
                        onChange={handleChange}
                        required
                        disabled={categoriesLoading}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                      >
                        <option value="">{categoriesLoading ? "Loading Categories..." : "Select Category"}</option>
                        {categoriesError && <option value="">Error loading categories</option>}
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  <motion.label
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    htmlFor="description"
                    className="text-gray-400 text-sm block mb-1"
                  >
                    Description
                  </motion.label>
                  <motion.textarea
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                    name="description"
                    placeholder="Event Description"
                    value={eventData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                  />

                  {error && <p className="text-red-500 text-sm">Error: {error}</p>}
                  {success && <p className="text-green-500 text-sm">Event created successfully!</p>}

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 1.1 }}
                    type="submit"
                    disabled={loading || categoriesLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "🚀 Create Event"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateEventCard;
