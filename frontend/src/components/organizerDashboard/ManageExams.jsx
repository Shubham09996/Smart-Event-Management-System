import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash, Users, CheckCircle, X } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const ManageExams = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Attendance Roster Modal State
  const [activeExamForAttendance, setActiveExamForAttendance] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/exams/myexams", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExams(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [refreshTrigger, user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await api.delete(`/exams/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success("Exam deleted successfully");
        fetchExams();
      } catch (err) {
        toast.error("Failed to delete exam");
      }
    }
  };

  const openAttendance = async (exam) => {
    setActiveExamForAttendance(exam);
    setLoadingRoster(true);
    try {
      const { data } = await api.get(`/exams/${exam._id}/roster`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRoster(data);
    } catch (err) {
      toast.error("Failed to fetch roster");
    } finally {
      setLoadingRoster(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await api.put(`/exams/${activeExamForAttendance._id}/attendance`, 
        { studentId, status }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Marked as ${status}`);
      // Refresh roster locally
      setRoster(roster.map(r => r.studentId._id === studentId ? { ...r, status } : r));
    } catch (err) {
       toast.error("Failed to mark attendance");
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse font-bold">Loading exams...</div>;
  if (error) return <div className="text-red-500 font-bold">{error}</div>;

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-black text-slate-900">Your Scheduled Exams</h3>
      
      {exams.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center text-slate-500 font-bold">
          No exams scheduled yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <motion.div 
               key={exam._id}
               className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group"
            >
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="text-lg font-black text-slate-900">{exam.subjectName}</h4>
                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">{exam.courseCode}</span>
                 </div>
                 <button onClick={() => handleDelete(exam._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash size={18} />
                 </button>
               </div>
               
               <div className="space-y-2 mb-6">
                 <div className="flex gap-3 text-sm font-bold text-slate-500 items-center">
                    <Calendar size={16} /> {new Date(exam.date).toLocaleDateString()} | {exam.startTime} - {exam.endTime}
                 </div>
                 <div className="flex gap-3 text-sm font-bold text-slate-500 items-center">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">Room</span> {exam.room}
                 </div>
               </div>
               
               <button 
                 onClick={() => openAttendance(exam)}
                 className="w-full py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transition"
               >
                 <Users size={18} /> Manage Attendance Roster ({exam.students.length} Enrolled)
               </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Attendance Roster Modal */}
      <AnimatePresence>
        {activeExamForAttendance && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setActiveExamForAttendance(null)} />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center z-10 bg-white">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Attendance Roster</h3>
                    <p className="text-xs font-bold text-slate-400">{activeExamForAttendance.subjectName}</p>
                  </div>
                  <button onClick={() => setActiveExamForAttendance(null)} className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-500">
                     <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  {loadingRoster ? (
                    <div className="text-center font-bold text-slate-400 py-10">Loading Roster...</div>
                  ) : roster.length === 0 ? (
                    <div className="text-center font-bold text-slate-400 py-10">No students enrolled yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {roster.map((record) => (
                        <div key={record.studentId._id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                           <div>
                             <p className="font-bold text-slate-900">{record.studentId.name}</p>
                             <p className="text-xs font-bold text-slate-500">{record.studentId.rollNo || "No Roll #"} • {record.studentId.department || "Dept"}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => markAttendance(record.studentId._id, 'attended')}
                                className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition ${record.status === 'attended' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                              >
                                <CheckCircle size={14} className="inline mr-1 -mt-0.5" /> Present
                              </button>
                              <button 
                                onClick={() => markAttendance(record.studentId._id, 'enrolled')}
                                className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition ${record.status === 'enrolled' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}
                              >
                                <X size={14} className="inline mr-1 -mt-0.5" /> Absent
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageExams;
