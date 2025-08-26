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
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-[#1e293b] p-8 rounded-xl shadow-2xl w-full max-w-md relative border border-gray-700"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Register for {event.title}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="teamName" className="block text-gray-300 text-sm font-medium mb-2">Team Name</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Team Members (Max 4, including yourself)</label>
              {members.map((member, index) => (
                <input
                  key={index}
                  type="email"
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder={`Member ${index + 1} Email (optional)`}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-3"
                />
              ))}
              <p className="text-gray-400 text-xs">Note: You will be automatically included as a team member.</p>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-500/20 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Submit Team Registration'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HackathonRegistrationForm;
