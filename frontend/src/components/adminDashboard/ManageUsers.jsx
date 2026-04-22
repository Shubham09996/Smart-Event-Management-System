import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, X, User as UserIcon, Mail, Shield, UserCheck, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const ManageUsers = ({ users, onUserUpdated, onUserDeleted, currentAdminId }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);

  const roleConfigs = {
    admin: { color: "text-red-600", bg: "bg-red-50", icon: Shield },
    organizer: { color: "text-indigo-600", bg: "bg-indigo-50", icon: UserCheck },
    student: { color: "text-emerald-600", bg: "bg-emerald-50", icon: UserIcon },
  };

  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  };

  const handleDelete = async (id) => {
    setLoadingAction(true);
    setError(null);
    try {
      await api.delete(`/users/${id}`, getAuthHeader());
      if (onUserDeleted) onUserDeleted();
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setError(null);
    try {
      await api.put(`/users/${editingUser._id}`, editingUser, getAuthHeader());
      setEditModalOpen(false);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            User Management
            <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest">
              {users.length - 1} Registered
            </span>
          </h3>
          <p className="text-slate-500 font-medium italic">Control access levels and manage platform accounts</p>
        </div>
        <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl">
          <UserIcon size={20} />
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-50">
              <th className="py-4 px-4 font-black uppercase text-[10px] tracking-[0.2em]">User Profile</th>
              <th className="py-4 px-4 font-black uppercase text-[10px] tracking-[0.2em]">Contact</th>
              <th className="py-4 px-4 font-black uppercase text-[10px] tracking-[0.2em]">Account Type</th>
              <th className="py-4 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users
              .filter(user => user._id !== currentAdminId)
              .map((u, index) => {
                const config = roleConfigs[u.role] || roleConfigs.student;
                return (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-all duration-300"
                  >
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.name}&background=f1f5f9&color=64748b`} 
                          alt={u.name}
                          className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm"
                        />
                        <p className="text-slate-900 font-black tracking-tight">{u.name}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Mail size={14} className="text-slate-300" />
                        {u.email}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${config.bg} ${config.color}`}>
                        <config.icon size={12} />
                        {u.role}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setEditingUser(u); setEditModalOpen(true); }}
                          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteId(u._id)}
                          className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-[0_20px_100px_rgb(0,0,0,0.2)] text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Account?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed italic">
                This action is permanent and will remove all user data from the platform.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteId)}
                  disabled={loadingAction}
                  className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loadingAction ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-white p-10 rounded-[3rem] w-full max-w-md shadow-[0_20px_100px_rgb(0,0,0,0.2)]"
            >
              <button 
                onClick={() => setEditModalOpen(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 p-2"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10 text-center">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Edit size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Permissions</h2>
                <p className="text-slate-500 font-medium italic">Modify account details and access level</p>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-900 text-lg shadow-inner"
                    placeholder="User Name"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-900 text-lg shadow-inner"
                    placeholder="Email Address"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Access Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-slate-900 appearance-none shadow-inner"
                  >
                    <option value="admin">System Admin</option>
                    <option value="organizer">Event Organizer</option>
                    <option value="student">Student User</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-[0_10px_30px_rgb(79,70,229,0.3)] hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all text-lg uppercase tracking-widest disabled:opacity-50"
                  >
                    {loadingAction ? "Safeguarding..." : "Update Permissions"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageUsers;
