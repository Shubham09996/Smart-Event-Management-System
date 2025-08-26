import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, X } from "lucide-react";
import api from "../../utils/api"; // Import the API instance

const ManageUsers = ({ users, onUserUpdated, onUserDeleted, currentAdminId }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [successUpdate, setSuccessUpdate] = useState(false);

  // Role badge colors
  const roleColors = {
    admin: "bg-red-500/20 text-red-400",
    organizer: "bg-blue-500/20 text-blue-400",
    student: "bg-green-500/20 text-green-400",
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setErrorDelete(null);
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

      await api.delete(`/users/${id}`, config);
      if (onUserDeleted) {
        onUserDeleted();
      }
      setDeleteId(null);
    } catch (err) {
      setErrorDelete(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setErrorUpdate(null);
    setSuccessUpdate(false);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo ? userInfo.token : null;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await api.put(`/users/${editingUser._id}`, editingUser, config);
      setSuccessUpdate(true);
      setEditModalOpen(false);
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <h3 className="text-lg font-semibold text-white">Manage Users</h3>
        {/* Search input removed for now */}
      </motion.div>

      {/* Table */}
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            No users found.
          </motion.p>
        ) : (
          <table className="w-full text-left text-gray-300 border-collapse">
            <thead>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-gray-400 border-b border-gray-700"
              >
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </motion.tr>
            </thead>
            <tbody>
              {users
                .filter(user => user._id !== currentAdminId) // Filter out the current admin
                .map((u, index) => (
                <motion.tr
                  key={u._id} // Use u._id from backend
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition" onClick={() => handleEditClick(u)}>
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 transition" onClick={() => setDeleteId(u._id)}>
                      <Trash2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
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
              transition={{ duration: 0.3 }}
              className="bg-[#1e293b] p-6 rounded-xl w-80 text-center"
            >
              <h3 className="text-white font-semibold mb-2">
                Delete this user?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                This action cannot be undone.
              </p>
              {errorDelete && <p className="text-red-500 text-sm mb-2">Error: {errorDelete}</p>}
              <div className="flex justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => handleDelete(deleteId)}
                  disabled={loadingDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModalOpen && editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-40 flex items-center justify-center"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl shadow-2xl p-6 bg-[#1e293b] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xl font-semibold text-white mb-4"
              >
                Edit User
              </motion.h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="User Name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="User Email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                />
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                  <option value="student">Student</option>
                </select>

                {errorUpdate && <p className="text-red-500 text-sm">Error: {errorUpdate}</p>}
                {successUpdate && <p className="text-green-500 text-sm">User updated successfully!</p>}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
                >
                  {loadingUpdate ? "Updating..." : "Update User"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageUsers;
