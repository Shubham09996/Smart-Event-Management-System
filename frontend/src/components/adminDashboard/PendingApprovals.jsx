import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, User, AlertCircle } from 'lucide-react';
import api from "../../utils/api";

const PendingApprovals = ({ pendingEvents, onEventApproved, onEventRejected }) => {
  const [processingId, setProcessingId] = useState(null);

  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    };
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await api.put(`/events/${id}/approve`, {}, getAuthHeader());
      if (onEventApproved) onEventApproved();
    } catch (err) {
      console.error("Error approving event:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await api.put(`/events/${id}/reject`, {}, getAuthHeader());
      if (onEventRejected) onEventRejected();
    } catch (err) {
      console.error("Error rejecting event:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Pending Approvals
            {pendingEvents.length > 0 && (
              <span className="bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {pendingEvents.length}
              </span>
            )}
          </h3>
          <p className="text-slate-500 font-medium italic">Review and verify upcoming campus event requests</p>
        </div>
      </div>

      {pendingEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-4"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center shadow-inner mb-2">
            <CheckCircle size={40} />
          </div>
          <div>
            <h4 className="text-slate-900 font-black text-xl mb-1">Queue is Clear!</h4>
            <p className="text-slate-500 font-medium italic">All event requests have been processed successfully.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {pendingEvents.map((event, index) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image || `https://images.unsplash.com/photo-1540575861501-7ad05823c9fe?w=800&auto=format&fit=crop&q=60`}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                    {event.category || "General"}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold font-mono">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center gap-3 border border-slate-100">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${event.organizer?.name || "O"}&background=4f46e5&color=fff`} 
                      className="w-10 h-10 rounded-xl"
                      alt="Organizer"
                    />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Organizer</p>
                      <p className="text-sm font-black text-slate-900 leading-none">{event.organizer?.name || "System User"}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3 pt-6 border-t border-slate-50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(event._id)}
                      disabled={processingId === event._id}
                      className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {processingId === event._id ? "Processing..." : <><CheckCircle size={16} /> Approve Event</>}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(event._id)}
                      disabled={processingId === event._id}
                      className="px-5 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black transition-all hover:bg-red-50 hover:text-red-500"
                    >
                      <XCircle size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;


