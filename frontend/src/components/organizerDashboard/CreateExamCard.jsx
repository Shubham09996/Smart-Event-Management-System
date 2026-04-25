import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, AlertCircle, Calendar } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const CreateExamCard = ({ onExamCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    subjectName: "",
    courseCode: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    syllabusLink: ""
  });

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/exams", examData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Exam successfully created!");
      setExamData({ subjectName: "", courseCode: "", date: "", startTime: "", endTime: "", room: "", syllabusLink: "" });
      setIsOpen(false);
      if (onExamCreated) onExamCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01, y: -4 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <BookOpen size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Schedule Examination</h2>
            <p className="text-slate-500 font-bold">Deploy a new datesheet entry</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
        >
          + Add Exam
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
               onClick={() => setIsOpen(false)} 
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }} 
               className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="p-8 pb-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Exam Entry</h2>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                       <input type="text" name="subjectName" value={examData.subjectName} onChange={handleChange} required placeholder="e.g. Data Structures" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Code</label>
                       <input type="text" name="courseCode" value={examData.courseCode} onChange={handleChange} required placeholder="e.g. CS-201" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Date</label>
                       <input type="date" name="date" value={examData.date} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                       <input type="time" name="startTime" value={examData.startTime} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                       <input type="time" name="endTime" value={examData.endTime} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Allocation</label>
                       <input type="text" name="room" value={examData.room} onChange={handleChange} required placeholder="e.g. Hall A" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Syllabus Link (PDF/Drive)</label>
                       <input type="url" name="syllabusLink" value={examData.syllabusLink} onChange={handleChange} placeholder="https://..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-5 mt-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition disabled:opacity-50">
                    {loading ? "Publishing..." : "Add to Datesheet"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateExamCard;
