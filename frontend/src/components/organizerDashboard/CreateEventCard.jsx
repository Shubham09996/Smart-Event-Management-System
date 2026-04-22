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
        whileHover={{ scale: 1.01, y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 group mb-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <Upload size={30} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Event</h2>
              <p className="text-slate-500 font-bold">Start organizing your next amazing experience</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Launch Event
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-8 pb-4 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Image size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Launch New Event</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload Area */}
                  <div className="relative group">
                    <div className={`w-full h-56 rounded-3xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center ${eventData.eventImage ? "border-indigo-500" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                      {eventData.eventImage ? (
                        <img src={eventData.eventImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
                             <Upload size={24} />
                          </div>
                          <p className="text-slate-900 font-black text-sm">Upload Event Cover</p>
                          <p className="text-slate-500 text-xs mt-1">Recommended: 1200x600px, Under 5MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={eventData.title}
                        onChange={handleChange}
                        required
                        placeholder="Give your event a catchy name"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={eventData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                      <select
                        name="category"
                        value={eventData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                      >
                        <option value="">Select Genre</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Venue / Location</label>
                        <input
                          type="text"
                          name="location"
                          value={eventData.location}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Auditorium Hall, Campus Ground"
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                        />
                      </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Description</label>
                      <textarea
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell students what this event is about..."
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold resize-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider border border-red-100 text-center">
                      {error}
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.1em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Launching..." : "🚀 Launch Event"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateEventCard;
