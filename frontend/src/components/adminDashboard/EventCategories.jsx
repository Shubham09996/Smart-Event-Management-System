import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit, Trash2, X, Tags, BarChart3, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 backdrop-blur-md">
        <p className="text-slate-900 font-black mb-1">{payload[0].name}</p>
        <p className="text-indigo-600 font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          {payload[0].value} Events
        </p>
      </div>
    );
  }
  return null;
};

const EventCategories = ({ categories, onCategoryCreated, onCategoryUpdated, onCategoryDeleted }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setError(null);
    try {
      await api.post("/categories", { name: newCategoryName }, getAuthHeader());
      setNewCategoryName("");
      if (onCategoryCreated) onCategoryCreated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoadingAction(true);
    setError(null);
    try {
      await api.delete(`/categories/${id}`, getAuthHeader());
      if (onCategoryDeleted) onCategoryDeleted();
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setError(null);
    try {
      await api.put(`/categories/${editingCategory._id}`, { name: editingCategory.name }, getAuthHeader());
      setEditModalOpen(false);
      if (onCategoryUpdated) onCategoryUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const chartColors = [
    "#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"
  ];

  const chartData = categories.map((cat, index) => ({
    name: cat.name,
    value: 1, // Placeholder
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Event Taxonomy
            <span className="bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest">
              {categories.length} Categories
            </span>
          </h3>
          <p className="text-slate-500 font-medium italic">Manage interest tags and event classification</p>
        </div>
        <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl">
          <Tags size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Management */}
        <div className="space-y-10">
          {/* Add New */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2 text-center lg:text-left">Initialize New Category</h4>
            <form onSubmit={handleCreateCategory} className="flex gap-3">
              <input
                type="text"
                placeholder="Category identification..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-indigo-100 outline-none transition-all font-bold text-slate-900 shadow-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loadingAction}
                className="px-6 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loadingAction ? "..." : <PlusCircle size={22} />}
              </motion.button>
            </form>
            {error && <p className="text-red-500 text-[10px] font-black uppercase mt-3 ml-2 tracking-widest">{error}</p>}
          </div>

          {/* List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                  <span className="text-slate-900 font-bold tracking-tight">{category.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingCategory(category); setEditModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setDeleteId(category._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Analytics */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col justify-center min-h-[400px]">
          <div className="text-center mb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Density Analytics</h4>
            <p className="text-xs text-slate-500 font-medium italic">Category distribution across system</p>
          </div>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border border-slate-50">
                <BarChart3 size={24} className="text-indigo-600 mb-0.5" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Growth</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {chartData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-slate-50">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                <span className="text-[10px] font-bold text-slate-600 truncate uppercase tracking-widest">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Category?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed italic">All events under this tag will be reclassified as "General".</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors">Abort</button>
                <button onClick={() => handleDeleteCategory(deleteId)} disabled={loadingAction} className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors disabled:opacity-50">Destroy</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editModalOpen && editingCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
              <button onClick={() => setEditModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 p-2"><X size={24} /></button>
              <div className="mb-10 text-center">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner"><Edit size={32} /></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Refactor Brand</h2>
                <p className="text-slate-500 font-medium italic">Update category identification settings</p>
              </div>
              <form onSubmit={handleUpdateCategory} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Category Label</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-900 text-lg shadow-inner"
                    placeholder="Category Name"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loadingAction} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-lg uppercase tracking-widest disabled:opacity-50">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventCategories;
