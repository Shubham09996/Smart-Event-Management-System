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
      className="bg-[#111827] rounded-2xl p-5 mt-6 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">My Registered Events</h3>
      {events.length === 0 ? (
        <p className="text-gray-400">No registered events yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <motion.div
              key={ev.eventId._id} // Use ev.eventId._id
              className="bg-[#111827] rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
            >
              {ev.eventId.eventImage && (
                <img
                  src={ev.eventId.eventImage}
                  alt={ev.eventId.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-3">
                <p className={`px-3 py-1 rounded-full text-xs font-medium text-white ${ev.eventId.category === 'Workshop' ? 'bg-green-600/20' : ev.eventId.category === 'Seminar' ? 'bg-yellow-600/20' : 'bg-blue-600/20'}`}>
                  {ev.eventId.category}
                </p>
              </div>
              <h4 className="text-white font-bold text-xl mb-2">{ev.eventId.title}</h4>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">{ev.eventId.description}</p>
              <div className="flex flex-col gap-2 text-slate-300 text-sm mb-4">
                <div className="flex gap-2 items-center">
                  <Calendar size={16} className="text-indigo-400" /> {new Date(ev.eventId.date).toLocaleDateString()} at {ev.eventId.startTime} - {ev.eventId.endTime}
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} className="text-indigo-400" /> {ev.eventId.location}
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => generateAndShowQr(ev.eventId._id, ev.eventId.title)}
                  disabled={qrLoading}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs disabled:opacity-50"
                >
                  {qrLoading ? "Loading QR..." : <QrCode size={14} />} {qrLoading ? "Loading QR..." : "Show QR"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-slate-700 text-white px-3 py-1 rounded-lg text-xs"
                >
                  <Download size={14} /> Download Pass
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
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
              className="bg-[#1e293b] p-6 rounded-xl w-80 text-center relative"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-white font-semibold mb-4">Your QR Pass for {selectedEventTitle}</h3>
              {currentQrCode ? (
                <div className="flex justify-center">
                  <QRCodeCanvas value={currentQrCode} size={256} bgColor="#111827" fgColor="#ffffff" level="L" includeMargin={true} />
                </div>
              ) : qrError ? (
                <p className="text-red-500 text-sm">Error: {qrError}</p>
              ) : (
                <p className="text-gray-400 text-sm">Generating QR code...</p>
              )}
              <p className="text-gray-400 text-sm mt-4">Present this QR code at the event entrance.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegisteredEvents;
