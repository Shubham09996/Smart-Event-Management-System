import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const HackathonRegistrationForm = ({ event, onClose, onRegister }) => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['', '', '', '']); // Max 4 members, including the current user
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!teamName.trim()) {
      setError('Team Name is required.');
      setLoading(false);
      return;
    }

    const validMembers = members.filter(member => member.trim() !== '');
    if (validMembers.length === 0) {
      setError('At least one team member (you) is required.');
      setLoading(false);
      return;
    }

    // Here, you would typically make an API call to register the team for the hackathon.
    // For this example, we'll just call the onRegister prop with event ID and team data.
    try {
      // Assuming onRegister can handle team data as a second argument
      await onRegister(event._id, { teamName, members: validMembers });
      setLoading(false);
      onClose(); // Close modal on successful registration
    } catch (err) {
      setError(err.message || 'Failed to register team.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-lg relative border border-slate-100"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full"
          >
            <X size={20} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Team Registration</h2>
            <p className="text-slate-500 font-medium italic">Registering for <span className="text-indigo-600 font-bold">{event.title}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Team Identity</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="The Innovation Squad"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold placeholder:font-normal placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Team Roster (Max 4 Members)</label>
              <div className="grid grid-cols-1 gap-3">
                {members.map((member, index) => (
                  <div key={index} className="relative group">
                    <input
                      type="email"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      placeholder={`Member ${index + 1} Email ${index === 0 ? '(You)' : '(Optional)'}`}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold placeholder:font-normal placeholder:text-slate-400"
                    />
                    {index === 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 px-2.5 py-1 rounded-full">Lead</span>}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-600 text-xs font-bold text-center bg-red-50 p-4 rounded-2xl border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-[0.2em] uppercase shadow-xl shadow-slate-100 hover:bg-indigo-600 transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Finalize Registration'
              )}
            </motion.button>
          </form>
          
          <p className="mt-6 text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest leading-loose">
            By submitting, you agree to the hackathon's <br className="hidden sm:block" /> codes of conduct and team guidelines.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HackathonRegistrationForm;
