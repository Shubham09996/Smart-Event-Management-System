import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api"; // Import the API instance

const SystemSettings = ({ settings, onSettingUpdated }) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo ? userInfo.token : null;

    if (!token || userInfo.role !== 'admin') {
      throw new Error("Not authorized as an admin");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const toggleSetting = async (settingId, currentValue) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const config = getAuthHeader();
      await api.put(`/settings/${settingId}`, { settingValue: String(!currentValue) }, config);
      if (onSettingUpdated) {
        onSettingUpdated();
      }
    } catch (err) {
      setUpdateError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#1e293b]/80 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-lg"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-lg font-semibold text-white mb-4"
      >
        System Settings
      </motion.h3>
      {updateError && <p className="text-red-500 text-sm mb-2">Error: {updateError}</p>}
      <div className="space-y-4">
        {(!settings || settings.length === 0) ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            No system settings found.
          </motion.p>
        ) : (
          settings.map((s, i) => (
            <motion.div
              key={s._id} // Use _id from backend
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              className="flex justify-between items-center bg-[#111827]/70 px-4 py-3 rounded-xl hover:shadow-lg transition"
            >
              <p className="text-gray-300">{s.settingName}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    s.settingValue === 'true' ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {s.settingValue === 'true' ? "On" : "Off"}
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.settingValue === 'true'}
                    onChange={() => toggleSetting(s._id, s.settingValue === 'true')}
                    disabled={updateLoading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
                  <motion.div
                    layout
                    className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5"
                    animate={{ x: s.settingValue === 'true' ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 + i * 0.1 }}
                  />
                </label>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SystemSettings;
