import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart2, Users, CheckCircle, Clock } from "lucide-react";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const EventAnalyticsModal = ({ isOpen, onClose, event }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState([]);
  
  // Computed Stats
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalAttended, setTotalAttended] = useState(0);

  const ATTENDANCE_COLORS = ['#10b981', '#94a3b8']; // Emerald for Attended, Slate for No-show

  useEffect(() => {
    if (isOpen && event) {
      fetchReport();
    }
  }, [isOpen, event]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/registrations/${event._id}/report`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      const registrations = response.data;
      setData(registrations);
      
      const attendedCount = registrations.filter(r => r.status === 'attended').length;
      const noShowCount = registrations.length - attendedCount;
      
      setTotalRegistrations(registrations.length);
      setTotalAttended(attendedCount);
      
      setAttendanceData([
        { name: 'Attended', value: attendedCount },
        { name: 'Registered Only', value: noShowCount }
      ]);
      
      // Calculate Department Data
      const deptMap = {};
      registrations.forEach(r => {
        const dept = r.userId?.department || 'Unknown';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });
      
      const deptArray = Object.keys(deptMap).map(key => ({
        name: key,
        Students: deptMap[key]
      })).sort((a, b) => b.Students - a.Students); // Sort descending
      
      setDepartmentData(deptArray);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-50 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
              <BarChart2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h2>
              <p className="text-sm font-bold text-slate-400 max-w-md truncate">{event.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="font-bold tracking-widest uppercase text-xs">Crunching Data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-bold">
               {error}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Quick KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                     <Users size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registrations</p>
                     <p className="text-3xl font-black text-slate-900">{totalRegistrations}</p>
                   </div>
                </div>
                
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
                   <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <CheckCircle size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actual Attendees</p>
                     <p className="text-3xl font-black text-slate-900">{totalAttended}</p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
                   <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                     <Clock size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance Rate</p>
                     <p className="text-3xl font-black text-slate-900">
                        {totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0}%
                     </p>
                   </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Attendance Doughnut */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 mb-6">Audience Turnout</h3>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {attendanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-500">Attended</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                        <span className="text-xs font-bold text-slate-500">Registered Only</span>
                     </div>
                  </div>
                </div>

                {/* Demographics Bar Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 mb-6">Department Distribution</h3>
                  <div className="flex-1 min-h-[300px]">
                    {departmentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                            dy={10} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="Students" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm font-bold">
                        No demographic data available
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventAnalyticsModal;
