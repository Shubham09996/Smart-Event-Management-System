import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Edit, Trash, X, Upload, Clock } from "lucide-react";
import api from "../../utils/api";
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
        if (!isAuthenticated || !user?.token) throw new Error("User not authenticated");

        const { data } = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setCategories(data);
      } catch (err) {
        setCategoriesError(err.response?.data?.message || err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };
    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated, user]);

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setErrorDelete(null);
    try {
      if (!isAuthenticated || !user?.token) throw new Error("User not authenticated");

      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (onEventDeleted) onEventDeleted(id);
      setDeleteId(null);
    } catch (err) {
      setErrorDelete(err.response?.data?.message || err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      category: event.category?._id || event.category || "",
    });
    setEventImageFile(null);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEvent((prev) => ({ ...prev, eventImage: reader.result }));
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
      if (!isAuthenticated || !user?.token) throw new Error("User not authenticated");

      const dataToUpdate = { ...editingEvent };

      if (eventImageFile) {
        const reader = new FileReader();
        const filePromise = new Promise((resolve) => {
          reader.onloadend = () => {
            dataToUpdate.eventImage = reader.result;
            resolve();
          };
        });
        reader.readAsDataURL(eventImageFile);
        await filePromise;
      } else if (editingEvent.eventImage === "") {
        dataToUpdate.eventImage =
          "https://via.placeholder.com/400x200?text=Event+Image";
      }

      await api.put(`/events/${editingEvent._id}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessUpdate(true);
      setEditModalOpen(false);
      setEventImageFile(null);

      if (onEventUpdated) onEventUpdated(editingEvent._id);
    } catch (err) {
      setErrorUpdate(err.response?.data?.message || err.message);
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

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.5 + index * 0.1,
              }}
              className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
            >
              <img
                src={
                  event.eventImage ||
                  "https://via.placeholder.com/400x200?text=Event+Image"
                }
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              {/* Status + Actions */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    event.isApproved
                      ? "bg-green-700 text-green-200"
                      : "bg-yellow-700 text-yellow-200"
                  }`}
                >
                  {event.isApproved ? "Approved" : "Pending Approval"}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
                    onClick={() => handleEditClick(event)}
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                    onClick={() => setDeleteId(event._id)}
                  >
                    <Trash size={18} />
                  </motion.button>
                </div>
              </div>

              <motion.h3 className="text-lg text-white font-semibold">
                {event.title}
              </motion.h3>
              <motion.p className="text-gray-400 text-sm mb-3">
                {event.description}
              </motion.p>

              {/* Details */}
              <div className="flex flex-col gap-1 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {event.startTime} -{" "}
                  {event.endTime}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {event.location}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div className="bg-[#1e293b] p-6 rounded-xl w-80 text-center">
              <h3 className="text-white font-semibold mb-2">
                Delete this event?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                This action cannot be undone.
              </p>
              {errorDelete && (
                <p className="text-red-500 text-sm mb-2">Error: {errorDelete}</p>
              )}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={loadingDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && editingEvent && (
          <motion.div className="fixed inset-0 bg-black/75 z-40 flex items-center justify-center"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl p-6 bg-[#1e293b] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-white mb-4">
                Edit Event
              </h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="relative w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-800">
                  {editingEvent.eventImage ? (
                    <img
                      src={editingEvent.eventImage}
                      alt="Event Preview"
                      className="w-full h-full object-cover"
                    />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, title: e.target.value })
                      }
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingEvent.date}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, date: e.target.value })
                      }
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={editingEvent.startTime}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, startTime: e.target.value })
                      }
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={editingEvent.endTime}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, endTime: e.target.value })
                      }
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          location: e.target.value,
                        })
                      }
                      required
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Category
                    </label>
                    <select
                      value={editingEvent.category}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          category: e.target.value,
                        })
                      }
                      required
                      disabled={categoriesLoading}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading Categories..."
                          : "Select Category"}
                      </option>
                      {categoriesError && (
                        <option value="">Error loading categories</option>
                      )}
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="text-gray-400 text-sm block mb-1">
                  Description
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500"
                />

                {errorUpdate && (
                  <p className="text-red-500 text-sm">Error: {errorUpdate}</p>
                )}
                {successUpdate && (
                  <p className="text-green-500 text-sm">
                    Event updated successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loadingUpdate || categoriesLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
                >
                  {loadingUpdate ? "Updating..." : "Update Event"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageEvents;
