import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Bell, Database, Globe, Lock, Cpu, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const SystemSettings = ({ settings, onSettingUpdated }) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const toggleSetting = async (settingId, currentValue) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await api.put(`/settings/${settingId}`, { settingValue: String(!currentValue) }, getAuthHeader());
      if (onSettingUpdated) onSettingUpdated();
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const settingIcons = {
    "Registration": Globe,
    "Maintenance": Cpu,
    "Email": Bell,
    "Security": Shield,
    "Database": Database,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Core</h3>
          <p className="text-slate-500 font-medium italic">Configure global platform behavior</p>
        </div>
        <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl">
          <Settings size={20} />
        </div>
      </div>

      {updateError && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-xs">
          <AlertCircle size={16} />
          {updateError}
        </motion.div>
      )}

      <div className="space-y-4">
        {(!settings || settings.length === 0) ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
              <Database size={24} />
            </div>
            <p className="text-slate-400 font-medium italic">Initialization required...</p>
          </div>
        ) : (
          settings.map((s, i) => {
            const Icon = settingIcons[Object.keys(settingIcons).find(k => s.settingName.includes(k))] || Settings;
            const isActive = s.settingValue === 'true';
            
            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`flex justify-between items-center px-6 py-5 rounded-[1.5rem] border transition-all duration-500 ${
                  isActive ? "bg-white border-indigo-100 shadow-md shadow-indigo-500/5" : "bg-slate-50 border-transparent grayscale font-medium"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isActive ? "bg-indigo-50 text-indigo-600" : "bg-white text-slate-400 shadow-sm"}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={`font-black tracking-tight ${isActive ? "text-slate-900" : "text-slate-500"}`}>{s.settingName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isActive ? "System Active" : "Disabled"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleSetting(s._id, isActive)}
                    disabled={updateLoading}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 outline-none ${
                      isActive ? "bg-indigo-600 shadow-lg shadow-indigo-600/30" : "bg-slate-300"
                    }`}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm"
                      animate={{ x: isActive ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-10 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Shield size={64} className="text-indigo-600" />
        </div>
        <h4 className="text-indigo-900 font-black text-sm mb-1 relative z-10">Security Note</h4>
        <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider relative z-10 leading-relaxed shadow-sm">
          System-wide changes require high-level authorization. All logs are audited for security compliance.
        </p>
      </div>
    </motion.div>
  );
};

export default SystemSettings;
