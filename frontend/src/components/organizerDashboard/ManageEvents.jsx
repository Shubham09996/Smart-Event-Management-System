import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Edit, Trash, X, Upload, Clock } from "lucide-react";
import api from "../../utils/api"; // Import the API instance
import { useAuth } from "../../context/AuthContext";

const ManageEvents = ({ events, onEventDeleted, onEventUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const [deleteId, setDeleteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
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
        setCategories(data);
        setCategoriesLoading(false);
      } catch (err) {
        setCategoriesError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setCategoriesLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setErrorDelete(null);
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

      await api.delete(`/events/${id}`, config);
      if (onEventDeleted) {
        onEventDeleted(id);
      }
      setDeleteId(null);
    } catch (err) {
      setErrorDelete(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent({ 
      ...event, 
      date: new Date(event.date).toISOString().split('T')[0], // Format date for input type="date"
      startTime: event.startTime, // Add startTime
      endTime: event.endTime, // Add endTime
    }); 
    setEventImageFile(null); // Clear any previously selected file
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEvent(prev => ({ ...prev, eventImage: reader.result })); // Set for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setErrorUpdate(null);
    setSuccessUpdate(false);

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
          "Content-Type": "application/json",
        },
      };

      const dataToUpdate = { ...editingEvent };

      // Handle event image file upload if a new file is selected
      if (eventImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(eventImageFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            dataToUpdate.eventImage = reader.result; // Send base64 string
            resolve();
          };
        });
      } else if (editingEvent.eventImage === "") {
        // If profile picture is explicitly cleared (empty string), set to default
        dataToUpdate.eventImage = "https://via.placeholder.com/400x200?text=Event+Image";
      }

      await api.put(`/events/${editingEvent._id}`, dataToUpdate, config);
      setSuccessUpdate(true);
      setEditModalOpen(false);
      setEventImageFile(null); // Clear file input
      if (onEventUpdated) {
        onEventUpdated(editingEvent._id); // Pass updated event ID to refresh
      }
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-xl font-semibold text-white mb-4"
      >
        Manage My Events
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event._id} // Use event._id from backend
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 + index * 0.1 }}
              className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
            >
              {/* Event Image */}
              <img
                src={event.eventImage || "https://via.placeholder.com/400x200?text=Event+Image"}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              {/* Status + Actions */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${event.isApproved ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}
                >
                  {event.isApproved ? "Approved" : "Pending Approval"}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
                    onClick={() => handleEditClick(event)}>
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                    onClick={() => setDeleteId(event._id)}>
                    <Trash size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Title + Description */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="text-lg text-white font-semibold"
              >
                {event.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="text-gray-400 text-sm mb-3"
              >
                {event.description}
              </motion.p>

              {/* Details */}
              <div className="flex flex-col gap-1 text-gray-400 text-sm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" /> {event.startTime} - {event.endTime}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> {event.location}
                </motion.div>
              </div>

              {/* Progress Bar and Publish Button removed */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e293b] p-6 rounded-xl w-80 text-center"
            >
              <h3 className="text-white font-semibold mb-2">
                Delete this event?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                This action cannot be undone.
              </p>
              {errorDelete && <p className="text-red-500 text-sm mb-2">Error: {errorDelete}</p>}
              <div className="flex justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => handleDelete(deleteId)}
                  disabled={loadingDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {editModalOpen && editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="bg-[#1e293b] w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl p-6 relative overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setEditModalOpen(false)}
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
                  Edit Event
                </motion.h2>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  {/* Image Upload for Edit */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-800"
                  >
                    {editingEvent.eventImage ? (
                      <img src={editingEvent.eventImage} alt="Event Preview" className="w-full h-full object-cover" />
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
                        name="title"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
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
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
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
                        value={editingEvent.startTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
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
                        value={editingEvent.endTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
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
                        value={editingEvent.location}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
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
                        value={editingEvent.category}
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
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
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                  />

                  {errorUpdate && <p className="text-red-500 text-sm">Error: {errorUpdate}</p>}
                  {successUpdate && <p className="text-green-500 text-sm">Event updated successfully!</p>}

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 1.1 }}
                    type="submit"
                    disabled={loadingUpdate || categoriesLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
                  >
                    {loadingUpdate ? "Updating..." : "Update Event"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageEvents;
 