import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
// import { QrReader } from 'react-qr-reader'; // Commented out QrReader
import api from "../../utils/api"; // Import the API instance
import QrScanner from "../common/QrScanner"; // Import the new QrScanner component

const QRPassGenerator = ({ events }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  const selectedEvent = events.find(event => event._id === selectedEventId);

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    setQrValue("");

    if (!selectedEventId) {
      setError("Please select an event to generate QR.");
      setLoading(false);
      return;
    }

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

      const { data } = await api.get(`/events/${selectedEventId}/qrcode`, config);
      setQrValue(data.qrCode);
      setIsOpen(true);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (decodedText, decodedResult) => {
    if (!!decodedText) {
      setScanResult(null);
      setScanError(null);
      setShowScanner(false);
      
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo ? userInfo.token : null;
  
        if (!token) {
          throw new Error("Organizer not authenticated for QR verification.");
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
  
        const { data } = await api.post("/events/verifyqr", { qrToken: decodedText }, config);
        setScanResult(data);
      } catch (err) {
        setScanError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }

    // if (!!error && error.name !== "NotAllowedError" && error.name !== "NotFoundError") {
    //   // console.info(error);
    // }
  };

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-[#1e293b] p-6 rounded-xl mt-6 shadow-lg"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-lg font-semibold text-white mb-4"
        >
          QR Pass Generator & Scanner
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 bg-[#0f172a] p-4 rounded-lg"
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-white font-medium"
          >
            Select Event to Manage
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setQrValue(""); // Clear QR when event changes
                setScanResult(null);
                setScanError(null);
              }}
              className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500 mt-2"
            >
              <option value="">-- Select an Event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </motion.div>

          {selectedEventId && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="text-gray-400 text-sm mt-2"
            >
              Selected: {selectedEvent?.title}
            </motion.p>
          )}

          {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
            className="flex gap-3 mt-3"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={generateQR}
              disabled={!selectedEventId || loading}
              className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate QR Passes"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
              onClick={() => setShowScanner(!showScanner)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md"
            >
              {showScanner ? "Close Scanner" : "Scan QR Pass"}
            </motion.button>
          </motion.div>

          {showScanner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-4 p-4 bg-gray-800 rounded-lg"
            >
              <motion.h4
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.3 }}
                className="text-white mb-2"
              >
                Scan QR Code:
              </motion.h4>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <QrScanner onResult={handleScan} qrbox={250} fps={10} /> {/* New QrScanner component */}
              </motion.div>
              {/* <QrReader
                onResult={handleScan}
                videoContainerStyle={{ width: '100%', paddingBottom: '56.25%', position: 'relative' }}
                videoStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                constraints={{
                  facingMode: 'environment'
                }}
              /> */}
              {/* <p className="text-yellow-400">QR Scanner functionality is temporarily disabled due0 to library incompatibility.</p> */}
              {scanError && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.5 }}
                  className="text-red-500 text-sm mt-2"
                >
                  Scan Error: {scanError}
                </motion.p>
              )}
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.6 }}
                  className="mt-4 text-green-500"
                >
                  <p>Verified: {scanResult.message}</p>
                  <p>Event: {scanResult.event.title} ({scanResult.event.location})</p>
                  <p>User: {scanResult.user.name} ({scanResult.user.email})</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

      </motion.div>

      {/* Modal for QR */}
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

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl p-6 relative text-center">
                {/* Close */}
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
                  🎟 QR Pass for {selectedEvent?.title}
                </motion.h2>

                {qrValue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center"
                  >
                    <QRCodeCanvas value={qrValue} size={200} bgColor="#0f172a" fgColor="#ffffff" />
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-4 text-gray-300 text-sm"
                >
                  Scan this QR to verify registration
                </motion.p>
                {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRPassGenerator;
