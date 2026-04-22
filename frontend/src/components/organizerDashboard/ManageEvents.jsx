import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Edit, Trash, X, Upload, Clock, QrCode, Download, BarChart2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import ScannerModal from "./ScannerModal";
import EventAnalyticsModal from "./EventAnalyticsModal";

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
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeScanEventId, setActiveScanEventId] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeAnalyticsEvent, setActiveAnalyticsEvent] = useState(null);

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

  const handleExportCSV = async (eventId, title) => {
    try {
      const { data } = await api.get(`/registrations/${eventId}/export`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h2>
          <p className="text-slate-500 font-bold">Monitor and update your scheduled experiences</p>
        </div>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col sm:flex-row h-full transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
            >
              {/* Event Image */}
              <div className="sm:w-2/5 relative overflow-hidden h-48 sm:h-auto">
                <img
                  src={event.eventImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent sm:hidden"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${
                    event.isApproved 
                      ? "bg-emerald-500/90 text-white" 
                      : "bg-amber-500/90 text-white"
                  }`}>
                    {event.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                       {event.category?.name || event.category || "General"}
                    </div>
                    <div className="flex gap-2">
                       {/* Analytics Dashboard Button */}
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => { setActiveAnalyticsEvent(event); setAnalyticsOpen(true); }}
                         className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100"
                         title="View Analytics Dashboard"
                       >
                         <BarChart2 size={18} />
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => { setActiveScanEventId(event._id); setScannerOpen(true); }}
                         className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-100"
                         title="Scan Attendee QR Codes"
                       >
                         <QrCode size={18} />
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => handleExportCSV(event._id, event.title)}
                         className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
                         title="Export CSV Report"
                       >
                         <Download size={18} />
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => handleEditClick(event)}
                         className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
                       >
                         <Edit size={18} />
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => setDeleteId(event._id)}
                         className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100"
                       >
                         <Trash size={18} />
                       </motion.button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Calendar size={14} />
                      </div>
                      {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Clock size={14} />
                      </div>
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <MapPin size={14} />
                      </div>
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Redesigned Modals */}
      <AnimatePresence>
        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl relative z-10 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Event?</h3>
              <p className="text-slate-500 font-medium mb-8">This action will permanently remove the event and all registrations.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="py-4 rounded-2xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-100 transition-all"
                >
                  Keep It
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={loadingDelete}
                  className="py-4 rounded-2xl bg-red-600 text-white font-bold shadow-xl shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loadingDelete ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editingEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setEditModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-8 pb-4 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Edit size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Update Experience</h2>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                  {/* Image Upload Area */}
                  <div className="relative group">
                    <div className="w-full h-56 rounded-3xl border-2 border-dashed border-indigo-500 transition-all overflow-hidden flex items-center justify-center bg-slate-50">
                      {editingEvent.eventImage ? (
                        <img src={editingEvent.eventImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
                             <Upload size={24} />
                          </div>
                          <p className="text-slate-900 font-black text-sm">Update Event Cover</p>
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
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Change Date</label>
                      <input
                        type="date"
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                      <select
                        value={editingEvent.category}
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                      <input
                        type="time"
                        value={editingEvent.startTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                      <input
                        type="time"
                        value={editingEvent.endTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Venue / Location</label>
                        <input
                          type="text"
                          value={editingEvent.location}
                          onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                        />
                      </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Description</label>
                      <textarea
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold resize-none"
                      />
                    </div>
                  </div>

                  {errorUpdate && (
                    <p className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider border border-red-100 text-center">
                      {errorUpdate}
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    type="submit"
                    disabled={loadingUpdate}
                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.1em] shadow-xl shadow-slate-100 hover:bg-indigo-600 transition-all disabled:opacity-50"
                  >
                    {loadingUpdate ? "Updating..." : "📦 Save Changes"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ScannerModal 
        isOpen={scannerOpen} 
        onClose={() => setScannerOpen(false)} 
        eventId={activeScanEventId} 
      />

      <EventAnalyticsModal 
        isOpen={analyticsOpen} 
        onClose={() => setAnalyticsOpen(false)} 
        event={activeAnalyticsEvent} 
      />
    </motion.div>
  );
};

export default ManageEvents;
