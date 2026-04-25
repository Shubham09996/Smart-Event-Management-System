import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function ContactInfo() {
  const details = [
    {
      label: "Email",
      value: "support@CampusSync.edu",
      href: "mailto:support@CampusSync.edu",
      icon: Mail,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-100"
    },
    {
      label: "Call Us",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
      icon: Phone,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-100"
    },
    {
      label: "Visit Us",
      value: "123 Innovation Drive, Tech City, India",
      icon: MapPin,
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      borderColor: "border-pink-100"
    }
  ];

  return (
    <motion.div
      className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full"
    >
      <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Contact Channels</h3>
      <div className="space-y-6">
        {details.map((item, i) => (
          <motion.div
            key={item.label}
            whileHover={{ x: 5 }}
            className={`flex items-start gap-5 p-5 rounded-3xl border ${item.borderColor} hover:bg-slate-50 transition-all group`}
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
              <item.icon size={24} className={item.iconColor} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              {item.href ? (
                <a 
                  href={item.href}
                  className="text-slate-800 font-bold hover:text-indigo-600 transition-colors flex items-center gap-1.5 break-words"
                >
                  {item.value} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <p className="text-slate-800 font-bold leading-tight">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
