import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, X, CheckCircle, Loader2 } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, event, onPaymentSuccess }) => {
  const [step, setStep] = useState(0); // 0: Details, 1: Processing, 2: Success
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setCardNumber('');
    }
  }, [isOpen]);

  const handlePay = () => {
    setStep(1);
    // Simulate real payment delay
    setTimeout(() => {
      setStep(2);
      // Brief success visual before closing
      setTimeout(() => {
        onPaymentSuccess(event);
      }, 1500);
    }, 2500);
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
        onClick={() => step === 0 && onClose()}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Gateway</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                     <p className="text-sm font-bold text-slate-500 mb-1">Event Ticket</p>
                     <p className="font-black text-slate-900 line-clamp-1">{event.title}</p>
                  </div>
                  <div className="text-right ml-4">
                     <p className="text-sm font-bold text-slate-500 mb-1">Total</p>
                     <p className="text-xl font-black text-indigo-600">₹{event.ticketPrice}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200 w-full mb-4 border-dashed border-b-2"></div>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <ShieldCheck size={16} /> <span>Encrypted transaction</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-8">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Card Number</label>
                   <input
                     type="text"
                     placeholder="4111 1111 1111 1111"
                     value={cardNumber}
                     onChange={(e) => setCardNumber(e.target.value)}
                     className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Expiry</label>
                     <input type="text" placeholder="MM/YY" defaultValue="12/26" className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">CVV</label>
                     <input type="password" placeholder="123" defaultValue="123" className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900" />
                   </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Pay ₹{event.ticketPrice}
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]"
            >
              <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
              <h3 className="text-xl font-black text-slate-900">Processing Payment...</h3>
              <p className="text-slate-500 font-medium mt-2">Please do not close this window.</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-16 flex flex-col items-center justify-center text-center min-h-[400px] bg-emerald-500 text-white rounded-[2.5rem]"
            >
              <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1, rotate: 360 }}
                 transition={{ type: "spring", damping: 20 }}
              >
                <CheckCircle size={80} className="mb-6 drop-shadow-lg" />
              </motion.div>
              <h3 className="text-3xl font-black mb-2 tracking-tight">Payment Successful!</h3>
              <p className="font-bold opacity-90 text-sm">Generating your ticket...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
