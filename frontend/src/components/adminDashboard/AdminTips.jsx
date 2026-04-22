import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, Shield, Settings } from 'lucide-react';

const AdminTips = () => {
  const tips = [
    { 
      id: 1, 
      title: 'Active Event Review', 
      description: 'Check pending approvals twice daily to keep the platform vibrant.',
      icon: CheckCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      id: 2, 
      title: 'Security Audits', 
      description: 'Review higher-level user permissions monthly for system integrity.',
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    { 
      id: 3, 
      title: 'Category Relevance', 
      description: 'Ensure tags reflect current seasonal trends and student interests.',
      icon: Lightbulb,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Admin Resources</h3>
          <p className="text-sm text-slate-500 font-medium italic">Best practices for platform management</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Lightbulb size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="group flex gap-4 p-5 rounded-[1.5rem] bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300"
          >
            <div className={`shrink-0 w-12 h-12 rounded-2xl ${tip.bg} ${tip.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <tip.icon size={22} />
            </div>
            <div>
              <h4 className="text-slate-900 font-black text-base tracking-tight mb-1">{tip.title}</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {tip.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-8 w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
        <Settings size={18} className="text-indigo-400 group-hover:rotate-90 transition-transform duration-500" />
        Advanced Resources
      </button>
    </motion.div>
  );
};

export default AdminTips;
