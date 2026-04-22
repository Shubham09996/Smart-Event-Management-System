import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const ScannerModal = ({ isOpen, onClose, eventId }) => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isOpen && isScanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      });

      scanner.render(
        async (result) => {
          scanner.clear();
          setIsScanning(false);
          verifyTicket(result);
        },
        (err) => {
          // ignore stream errors securely
        }
      );

      return () => {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      };
    }
  }, [isOpen, isScanning]);

  const verifyTicket = async (qrCodeText) => {
    try {
      setScanError(null);
      const { data } = await api.post("/registrations/verify", { qrCode: qrCodeText }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setScanResult(data);
    } catch (err) {
      setScanError(err.response?.data?.message || err.message);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setScanError(null);
    setIsScanning(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">QR Scanner</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
            <X size={20} />
          </button>
        </div>

        {isScanning ? (
          <div>
            <div className="overflow-hidden rounded-3xl border-4 border-indigo-50 mb-4 bg-slate-50 min-h-[250px]">
              <div id="reader" className="w-full"></div>
            </div>

            <div className="relative flex items-center mb-4">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">Or Enter Code</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="flex gap-2">
              <input
                 type="text"
                 id="manual-qr-input"
                 placeholder="e.g. 69E9-69E9-D13B"
                 className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold text-sm uppercase"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                      const val = e.target.value.trim();
                      if (val) {
                         setIsScanning(false);
                         verifyTicket(val);
                      }
                   }
                 }}
              />
              <button 
                onClick={() => {
                  const val = document.getElementById('manual-qr-input')?.value.trim();
                  if(val) {
                    setIsScanning(false);
                    verifyTicket(val);
                  }
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition"
              >
                Verify
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {scanResult ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-4">
                <CheckCircle size={64} className="text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900">Valid Ticket!</h3>
                <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 shadow-inner space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                    <p className="font-bold text-slate-900 text-lg">{scanResult.attendee?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-900">{scanResult.attendee?.email || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roll / Student ID</p>
                      <p className="font-bold text-slate-900">{scanResult.attendee?.rollNo || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</p>
                      <p className="font-bold text-slate-900">{scanResult.attendee?.department || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-4">
                <AlertCircle size={64} className="text-red-500 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900">Invalid Ticket</h3>
                <p className="text-red-600 bg-red-50 p-4 rounded-xl font-medium border border-red-100">{scanError}</p>
              </motion.div>
            )}

            <button onClick={handleReset} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Scan Next Ticket
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScannerModal;
