import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, QrCode, Download, X, MapPin, MessageSquare, Star } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const RegisteredEvents = ({ events }) => {
  const { user } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  
  // Feedback States
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackEventId, setFeedbackEventId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const generateAndShowQr = async (eventId, eventTitle) => {
    setQrLoading(true);
    setQrError(null);
    setCurrentQrCode(null);
    setSelectedEventTitle(eventTitle);
    setShowQrModal(true);

    try {
      const { data } = await api.get(`/registrations/${eventId}/qr`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCurrentQrCode(data.qrCode);
    } catch (err) {
      setQrError(err.response?.data?.message || err.message);
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadCertificate = (eventTitle) => {
    import("jspdf").then(({ default: jsPDF }) => {
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 842, 595, "F");
      
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(10);
      doc.rect(20, 20, 802, 555);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.setTextColor(15, 23, 42);
      doc.text("Certificate of Participation", 421, 150, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(20);
      doc.setTextColor(100, 116, 139);
      doc.text("This is proudly presented to", 421, 230, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(35);
      doc.setTextColor(79, 70, 229);
      doc.text(user.name, 421, 300, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(100, 116, 139);
      doc.text(`For successfully attending and participating in`, 421, 360, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42);
      doc.text(eventTitle, 421, 410, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(`Date of Validation: ${new Date().toLocaleDateString()}`, 421, 480, { align: "center" });

      doc.save(`Certificate_${eventTitle.replace(/ /g,"_")}.pdf`);
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackMsg("");
    try {
      await api.post(`/registrations/${feedbackEventId}/feedback`, { rating, comment }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFeedbackMsg("Feedback submitted successfully!");
      setTimeout(() => {
        setFeedbackModalOpen(false);
        setFeedbackMsg("");
        setComment("");
        setRating(5);
      }, 2000);
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const openFeedback = (eventId, title) => {
    setFeedbackEventId(eventId);
    setSelectedEventTitle(title);
    setFeedbackModalOpen(true);
  };

  const activeEvents = events.filter(ev => ev.eventId); // Filter nulls just in case

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">My Event Portfolio</h3>
      </div>

      {activeEvents.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center shadow-sm">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium text-lg">No active registrations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeEvents.map((ev, i) => (
            <motion.div key={ev.eventId._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 group hover:border-indigo-100 transition-all">
              <div className="relative mb-5 overflow-hidden rounded-[1.5rem]">
                <img src={ev.eventId.eventImage || "https://images.unsplash.com/photo-1540575861501-7ad05823c9fe"} alt={ev.eventId.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                  {ev.eventId.category || "General"}
                </div>
              </div>

              <div>
                <h4 className="text-slate-900 font-black text-lg mb-3 line-clamp-1">{ev.eventId.title}</h4>
                <div className="space-y-2.5 mb-6">
                  <div className="flex gap-3 items-center text-slate-500 text-xs font-bold bg-slate-50 p-2 rounded-xl">
                    <Calendar size={14} className="text-indigo-500" /> {new Date(ev.eventId.date).toLocaleDateString()}
                  </div>
                  <div className="flex gap-3 items-center text-slate-500 text-xs font-bold bg-slate-50 p-2 rounded-xl truncate">
                    <MapPin size={14} className="text-indigo-500" /> {ev.eventId.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => generateAndShowQr(ev.eventId._id, ev.eventId.title)} className="py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                    <QrCode size={14} /> Entry Pass
                  </button>
                  <button onClick={() => handleDownloadCertificate(ev.eventId.title)} className="py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition flex items-center justify-center gap-2">
                    <Download size={14} /> Certificate
                  </button>
                </div>
                <button onClick={() => openFeedback(ev.eventId._id, ev.eventId.title)} className="w-full mt-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <MessageSquare size={14} /> Rate Event
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowQrModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-[2.5rem] w-[350px] text-center relative shadow-2xl z-10">
              <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-full"><X size={16} /></button>
              <h3 className="text-slate-900 font-black text-xl px-4 mt-2">{selectedEventTitle}</h3>
              <p className="text-slate-500 font-medium text-xs mb-6">Digital Entry Pass</p>
              <div className="bg-slate-50 p-4 rounded-3xl inline-block mb-6">
                {currentQrCode ? (
                  <QRCodeCanvas value={currentQrCode} size={180} />
                ) : (
                  <p className="text-slate-500 py-10 font-bold">{qrError || "Generating..."}</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setFeedbackModalOpen(false)} />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-10 rounded-[2.5rem] w-full max-w-md relative shadow-2xl z-10 text-center">
                <button onClick={() => setFeedbackModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20} /></button>
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star size={32} />
                </div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Rate Experience</h3>
                <p className="text-slate-500 font-medium text-xs mb-8">{selectedEventTitle}</p>

                <form onSubmit={handleFeedbackSubmit} className="space-y-6 text-left">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block text-center">Rating (1-5)</label>
                    <div className="flex justify-center gap-2">
                       {[1, 2, 3, 4, 5].map(num => (
                         <button type="button" key={num} onClick={() => setRating(num)} className={`w-12 h-12 rounded-2xl font-black text-lg transition-all ${rating >= num ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                           {num}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                     <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Leave a review..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-900 font-bold resize-none" />
                  </div>
                  {feedbackMsg && <p className="text-center font-bold text-xs uppercase tracking-widest text-emerald-500">{feedbackMsg}</p>}
                  <button type="submit" disabled={feedbackLoading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50">
                    {feedbackLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegisteredEvents;
