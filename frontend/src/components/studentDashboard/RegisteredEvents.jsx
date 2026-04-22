import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Calendar, QrCode, Download, X, MapPin } from "lucide-react"; // Removed Clock, Added X, MapPin
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas
import api from "../../utils/api"; // Import the API instance

const RegisteredEvents = ({ events }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  const generateAndShowQr = async (eventId, eventTitle) => {
    setQrLoading(true);
    setQrError(null);
    setCurrentQrCode(null);
    setSelectedEventTitle(eventTitle);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo ? userInfo.token : null;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.get(`/events/${eventId}/qrcode`, config);
      setCurrentQrCode(data.qrCode); // Changed from data.token to data.qrCode
      setShowQrModal(true);
    } catch (err) {
      setQrError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">My Registered Events</h3>
        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-100 to-transparent ml-6 rounded-full hidden sm:block"></div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center">
          <p className="text-slate-500 font-medium">You haven't registered for any events yet. Start exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((ev, i) => (
            <motion.div
              key={ev.eventId._id}
              className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between overflow-hidden group hover:border-indigo-100 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative mb-5 overflow-hidden rounded-[1.5rem]">
                {ev.eventId.eventImage ? (
                  <img
                    src={ev.eventId.eventImage}
                    alt={ev.eventId.title}
                    className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-36 bg-slate-100 flex items-center justify-center">
                    <Calendar size={32} className="text-slate-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm bg-white border border-slate-100 text-slate-900`}
                  >
                    {ev.eventId.category}
                  </span>
                </div>
              </div>

              <div className="px-1">
                <h4 className="text-slate-900 font-black text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{ev.eventId.title}</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex gap-2 items-center text-slate-500">
                    <Calendar size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-bold">{new Date(ev.eventId.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 items-center text-slate-500">
                    <MapPin size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-bold truncate">{ev.eventId.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => generateAndShowQr(ev.eventId._id, ev.eventId.title)}
                    disabled={qrLoading}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider disabled:opacity-50 shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    {qrLoading ? "Wait..." : <QrCode size={14} />} <span>QR PASS</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-slate-100 hover:bg-slate-800 transition-all"
                  >
                    <Download size={14} /> <span>PDF</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 rounded-[2.5rem] w-[350px] text-center relative shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="mt-4 mb-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode size={32} />
                </div>
                <h3 className="text-slate-900 font-black text-xl mb-1 truncate px-4">{selectedEventTitle}</h3>
                <p className="text-slate-500 font-medium text-xs">Event Entry Pass</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-6 flex justify-center">
                {currentQrCode ? (
                  <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <QRCodeCanvas value={currentQrCode} size={180} bgColor="#ffffff" fgColor="#0f172a" level="H" includeMargin={false} />
                  </div>
                ) : qrError ? (
                  <p className="text-red-500 text-sm font-bold">Error: {qrError}</p>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-bold">Generating...</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Personal Access Token</p>
                <p className="text-indigo-600 text-sm font-black truncate">{currentQrCode?.substring(0, 20)}...</p>
              </div>
              
              <p className="text-slate-400 text-[10px] mt-8 font-medium italic">Present this QR code at the event entrance for quick verification.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegisteredEvents;
