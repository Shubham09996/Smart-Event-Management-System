import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const StudentDatesheet = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/exams", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExams(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load datesheet");
    } finally {
      setLoading(false);
    }
  };

  const enrollInExam = async (examId) => {
    try {
      await api.post(`/exams/${examId}/enroll`, {}, {
         headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success("Successfully enrolled in Examination!");
      fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll");
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse font-bold p-8">Loading Datesheet Database...</div>;
  if (error) return <div className="text-red-500 font-bold p-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-3xl font-black text-slate-900 tracking-tight">Academic Datesheet</h3>
         <div className="h-1 flex-1 bg-gradient-to-r from-blue-100 to-transparent ml-6 rounded-full hidden sm:block"></div>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center font-bold text-slate-500">
          No exams scheduled at the moment.
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam, i) => {
            const isEnrolled = exam.students?.some(s => s.studentId === user?._id || s.studentId?._id === user?._id);
            
            return (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                 key={exam._id}
                 className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition group"
               >
                 <div className="flex items-start gap-6">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition">
                      <span className="text-xl">{new Date(exam.date).getDate()}</span>
                      <span className="text-[10px] uppercase tracking-widest leading-none">{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                   </div>
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-xs text-blue-600 tracking-widest uppercase">{exam.courseCode}</span>
                        {isEnrolled && <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full">Enrolled</span>}
                     </div>
                     <h4 className="text-xl font-black text-slate-900 mb-2">{exam.subjectName}</h4>
                     
                     <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1"><Clock size={14} /> {exam.startTime} - {exam.endTime}</div>
                        <div className="flex items-center gap-1"><MapPin size={14} /> {exam.room}</div>
                        {exam.syllabusLink && (
                          <a href={exam.syllabusLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <ExternalLink size={14} /> Syllabus
                          </a>
                        )}
                     </div>
                   </div>
                 </div>

                 <div className="flex-shrink-0 w-full md:w-auto">
                    {!isEnrolled ? (
                      <button 
                         onClick={() => enrollInExam(exam._id)}
                         className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-black tracking-widest uppercase hover:bg-slate-800 transition shadow-lg text-sm"
                      >
                         Enroll Now
                      </button>
                    ) : (
                      <div className="w-full md:w-auto px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-black tracking-widest uppercase text-center text-sm cursor-not-allowed">
                         Enrolled
                      </div>
                    )}
                 </div>
               </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDatesheet;
