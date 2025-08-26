import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Users,
  Edit3,
  Save,
  X,
} from "lucide-react";

const ProfileCard = ({
  user = {
    name: "Shubham Gupta",
    email: "shubhamgupta0996@gmail.com",
    role: "student",
    department: "BCA",
    year: "3rd Year",
    societyName: "Tech Club",
    joined: "Jan 2023",
    stats: {
      eventsJoined: 12,
      certificates: 5,
      eventsCreated: 4,
      attendance: 10,
    },
    bio: "Passionate about technology and events. Member of Tech Club.",
  },
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated profile:", form);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
    >
      {/* Edit / Save Buttons */}
      {editable && (
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 transition"
            >
              <Edit3 className="w-5 h-5 text-indigo-400" />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition"
              >
                <Save className="w-5 h-5 text-green-400" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          src= "image.png"
          alt="Profile"
          className="w-28 h-28 rounded-2xl object-cover shadow-lg"
        />

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold text-white">{form.name}</h2>
              <p className="text-indigo-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                <User size={16} />{" "}
                {form.role === "student"
                  ? "Student"
                  : form.role === "organizer"
                  ? "Organizer"
                  : "Admin"}
              </p>
              <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail size={16} /> {form.email}
              </p>
              {form.role === "student" && (
                <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                  <MapPin size={16} /> {form.department}, {form.year}
                </p>
              )}
              {form.role === "organizer" && (
                <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                  <Users size={16} /> {form.societyName}
                </p>
              )}
              {form.role === "admin" && (
                <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                  <Shield size={16} /> Super Admin Access
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/10 p-2 rounded-lg text-white"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/10 p-2 rounded-lg text-white"
              />
              {form.role === "student" && (
                <>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full bg-white/10 p-2 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full bg-white/10 p-2 rounded-lg text-white"
                  />
                </>
              )}
              {form.role === "organizer" && (
                <input
                  type="text"
                  name="societyName"
                  value={form.societyName}
                  onChange={handleChange}
                  className="w-full bg-white/10 p-2 rounded-lg text-white"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-white/10"></div>

      {/* Role Based Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {form.role === "student" && (
          <>
            <StatBox label="Events Joined" value={form.stats.eventsJoined} />
            <StatBox label="Certificates" value={form.stats.certificates} />
            <StatBox
              label="Attendance"
              value={`${form.stats.attendance}/${form.stats.eventsJoined}`}
            />
            <StatBox label="Upcoming" value={3} />
          </>
        )}
        {form.role === "organizer" && (
          <>
            <StatBox label="Events Created" value={form.stats.eventsCreated} />
            <StatBox
              label="Registrations"
              value={form.stats.registrations || 0}
            />
            <StatBox
              label="Attendance Marked"
              value={form.stats.attendanceMarked || 0}
            />
            <StatBox label="QR Scans" value={form.stats.qrScans || 0} />
          </>
        )}
        {form.role === "admin" && (
          <>
            <StatBox label="Total Events" value={form.stats.totalEvents} />
            <StatBox
              label="Approved Events"
              value={form.stats.approvedEvents}
            />
            <StatBox
              label="Pending Requests"
              value={form.stats.pendingEvents}
            />
            <StatBox label="Total Users" value={form.stats.totalUsers} />
          </>
        )}
      </div>

      {/* Bio */}
      {!isEditing ? (
        form.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 bg-white/5 rounded-xl p-4 text-slate-300 text-sm"
          >
            {form.bio}
          </motion.div>
        )
      ) : (
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full mt-6 bg-white/10 p-3 rounded-lg text-white"
          rows={3}
        />
      )}

      {/* Joined */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-slate-500 mt-6 flex items-center gap-2 justify-center sm:justify-start"
      >
        <Calendar size={14} /> Joined on {form.joined}
      </motion.p>
    </motion.div>
  );
};

const StatBox = ({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/5 rounded-xl p-4"
  >
    <p className="text-2xl font-bold text-indigo-400">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{label}</p>
  </motion.div>
);

export default ProfileCard;
