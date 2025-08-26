import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";
import api from "../../utils/api"; // Import the API instance

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] p-3 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-indigo-400">📊 {payload[0].value} events</p>
      </div>
    );
  }
  return null;
};

const EventCategories = ({ categories, onCategoryCreated, onCategoryUpdated, onCategoryDeleted }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(false);

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

      await api.post("/categories", { name: newCategoryName }, config);
      setCreateSuccess(true);
      setNewCategoryName("");
      if (onCategoryCreated) {
        onCategoryCreated();
      }
    } catch (err) {
      setCreateError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setDeleteLoading(true);
    setDeleteError(null);
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

      await api.delete(`/categories/${id}`, config);
      if (onCategoryDeleted) {
        onCategoryDeleted();
      }
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!editingCategory?.name) {
      setUpdateError("Category name cannot be empty.");
      setUpdateLoading(false);
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
          "Content-Type": "application/json",
        },
      };

      await api.put(`/categories/${editingCategory._id}`, { name: editingCategory.name }, config);
      setUpdateSuccess(true);
      setEditModalOpen(false);
      if (onCategoryUpdated) {
        onCategoryUpdated();
      }
    } catch (err) {
      setUpdateError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Dummy data for chart (we don't have actual event counts per category in backend yet)
  const chartData = categories.map((cat, index) => ({
    name: cat.name,
    value: 1, // Placeholder value
    color: `hsl(${index * 60}, 70%, 50%)`, // Generate distinct colors
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#1e293b] p-6 rounded-xl shadow-lg"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-lg font-semibold text-white mb-4"
      >
        Event Categories Management
      </motion.h3>
      
      {/* Create New Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mb-6 p-4 bg-[#111827] rounded-lg"
      >
        <h4 className="text-md font-medium text-white mb-2">Add New Category</h4>
        <form onSubmit={handleCreateCategory} className="flex gap-3">
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            type="submit"
            disabled={createLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md disabled:opacity-50"
          >
            {createLoading ? "Adding..." : <PlusCircle size={18} />} {createLoading ? "Adding..." : "Add"}
          </motion.button>
        </form>
        {createError && <p className="text-red-500 text-sm mt-2">Error: {createError}</p>}
        {createSuccess && <p className="text-green-500 text-sm mt-2">Category created successfully!</p>}
      </motion.div>

      {/* Existing Categories List */}
      <motion.h4
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="text-md font-medium text-white mb-3"
      >
        Existing Categories
      </motion.h4>
      {categories.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-gray-400"
        >
          No categories found. Add some above!
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="bg-[#111827] p-4 rounded-lg flex items-center justify-between shadow-sm"
            >
              <span className="text-white font-medium">{category.name}</span>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => handleEditClick(category)}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => setDeleteId(category._id)}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
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
              className="bg-[#1e293b] p-6 rounded-xl w-80 text-center"
            >
              <h3 className="text-white font-semibold mb-2">
                Delete "{categories.find(cat => cat._id === deleteId)?.name}"?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                This action cannot be undone.
              </p>
              {deleteError && <p className="text-red-500 text-sm mb-2">Error: {deleteError}</p>}
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
                  onClick={() => handleDeleteCategory(deleteId)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Edit Modal */}
      <AnimatePresence>
        {editModalOpen && editingCategory && (
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
                Edit Category
              </motion.h2>
              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500"
                />

                {updateError && <p className="text-red-500 text-sm mt-2">Error: {updateError}</p>}
                {updateSuccess && <p className="text-green-500 text-sm mt-2">Category updated successfully!</p>}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-50"
                >
                  {updateLoading ? "Updating..." : "Update Category"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pie Chart (using dummy data for now, update with real counts if backend provides) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-10 bg-[#111827] p-6 rounded-xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="w-full md:w-2/3 h-64"
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Custom Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="flex flex-col gap-3"
          >
            {chartData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-white text-sm font-medium">
                  {item.name} ({item.value} events)
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventCategories;
