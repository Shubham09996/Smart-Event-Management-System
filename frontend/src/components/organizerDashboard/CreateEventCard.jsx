import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Upload, Calendar, Tags, CheckCircle, ArrowRight, ArrowLeft, Ticket } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const CreateEventCard = ({ onEventCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "",
    eventImage: "",
    isPaid: false,
    ticketPrice: 0,
    capacity: 0,
  });
  const [eventImageFile, setEventImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated || !user?.token) return;
      try {
        const { data } = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories([...data, { _id: "hackathon-id", name: "Hackathon" }]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [isAuthenticated, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({ ...prev, eventImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEventData({ ...eventData, [e.target.name]: value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 3) return; // Only submit on final step
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...eventData };
      if (eventImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(eventImageFile);
        await new Promise(resolve => {
          reader.onloadend = () => {
            dataToSend.eventImage = reader.result;
            resolve();
          };
        });
      }
      
      await api.post("/events", dataToSend, {
        headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
      });
      
      setEventData({ title: "", date: "", startTime: "", endTime: "", location: "", description: "", category: "", eventImage: "", isPaid: false, ticketPrice: 0, capacity: 0 });
      setEventImageFile(null);
      setStep(1);
      setIsOpen(false);
      if (onEventCreated) onEventCreated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <Calendar size={30} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Event</h2>
              <p className="text-slate-500 font-bold">Launch a beautiful, multi-step event experience</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Next-Gen Event
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsOpen(false)} />

            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]">
              <div className="p-8 pb-6 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Tags size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Event Studio</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 3</p>
                  </div>
                </div>
                <button onClick={() => { setIsOpen(false); setStep(1); }} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-slate-50">
                <motion.div 
                  initial={{ width: '33%' }}
                  animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                  className="h-full bg-indigo-600"
                />
              </div>

              <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Identity</label>
                        <input type="text" name="title" value={eventData.title} onChange={handleChange} required placeholder="Title of the event..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                        <input type="date" name="date" value={eventData.date} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                        <select name="category" value={eventData.category} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold appearance-none">
                          <option value="">Select Genre</option>
                          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                        <input type="time" name="startTime" value={eventData.startTime} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                        <input type="time" name="endTime" value={eventData.endTime} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Venue</label>
                        <input type="text" name="location" value={eventData.location} onChange={handleChange} required placeholder="Location details..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold" />
                      </div>

                      <button type="button" onClick={handleNext} disabled={!eventData.title || !eventData.date || !eventData.category || !eventData.location} className="md:col-span-2 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        Continue to Media <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Event Poster</label>
                        <div className={`w-full h-48 rounded-3xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center ${eventData.eventImage ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                          {eventData.eventImage ? (
                            <img src={eventData.eventImage} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <Upload size={32} className="mx-auto mb-3 text-indigo-400" />
                              <p className="text-slate-900 font-black">Browse or Drop Image</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                          <Ticket size={24} className="text-indigo-600" />
                          <h3 className="text-lg font-black text-slate-900">Ticketing & Capacity</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <label className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
                            <input type="checkbox" name="isPaid" checked={eventData.isPaid} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500" />
                            <span className="font-bold text-slate-900">Paid Event</span>
                          </label>

                          <div className={`transition-opacity ${!eventData.isPaid ? 'opacity-40 pointer-events-none' : ''}`}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Ticket Price (₹)</label>
                            <input type="number" name="ticketPrice" value={eventData.ticketPrice} onChange={handleChange} min="0" className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-100 font-bold" />
                          </div>

                          <div className="sm:col-span-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Max Capacity (0 = Unlimited)</label>
                             <input type="number" name="capacity" value={eventData.capacity} onChange={handleChange} min="0" className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-100 font-bold" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button type="button" onClick={handleBack} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                          <ArrowLeft size={18} /> Back
                        </button>
                        <button type="button" onClick={handleNext} className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                          Final Review <ArrowRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Synopsis</label>
                          <textarea name="description" value={eventData.description} onChange={handleChange} required rows={5} placeholder="Full event description..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold resize-none" />
                        </div>

                        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
                           <CheckCircle size={28} className="text-indigo-600 flex-shrink-0" />
                           <div>
                              <h4 className="font-black text-indigo-900 text-lg mb-1">Ready for Launch</h4>
                              <p className="text-indigo-600/80 font-medium text-sm">Please review your description. Admin approval may be required before the event goes live to students.</p>
                           </div>
                        </div>

                        {error && <p className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase border border-red-100 text-center">{error}</p>}

                        <div className="flex gap-4">
                          <button type="button" onClick={handleBack} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                            <ArrowLeft size={18} /> Back
                          </button>
                          <button type="submit" disabled={loading || !eventData.description} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? "Publishing..." : "🔥 Publish Event"}
                          </button>
                        </div>
                     </motion.div>
                  )}
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
