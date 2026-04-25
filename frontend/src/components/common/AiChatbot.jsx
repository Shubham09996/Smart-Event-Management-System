import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AiChatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your CampusSync Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!isAuthenticated || !user?.token) {
         throw new Error("You must be logged in to use the AI Assistant.");
      }

      const { data } = await api.post('/chat', 
        { message: userMessage },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: error.response?.data?.message || error.message || "An error occurred while connecting to AI."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show chatbot if user is logged in
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer group border-2 border-white"
          >
            <Sparkles size={24} className="group-hover:animate-pulse" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 pb-6 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 relative z-10">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex flex-col items-center justify-center text-white backdrop-blur-sm border border-white/30">
                    <Bot size={22} />
                 </div>
                 <div>
                   <h3 className="font-bold text-white text-lg leading-tight">AI Assistant</h3>
                   <div className="flex items-center gap-1.5 mt-0.5">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                     <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Online</span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-indigo-100 flex-shrink-0 flex items-center justify-center mb-1 shadow-sm">
                      <Bot size={14} className="text-indigo-600" />
                    </div>
                  )}
                  
                  <div className={`p-3.5 max-w-[75%] font-medium text-sm rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-slate-200 flex-shrink-0 flex items-center justify-center mb-1 shadow-sm">
                      <User size={14} className="text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start items-end gap-2">
                   <div className="w-6 h-6 rounded-md bg-indigo-100 flex-shrink-0 flex items-center justify-center mb-1 shadow-sm">
                      <Bot size={14} className="text-indigo-600" />
                   </div>
                   <div className="p-4 bg-white rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm flex items-center gap-1.5 h-[44px]">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-100 group"
                >
                  <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatbot;
