import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi';

import api from '../services/api';

const SUGGESTIONS = [
  'Find O+ donor near me',
  'Show nearby hospitals',
  'Track my request',
  'Blood group inventory',
  'How does AI matching work?',
];

const typeColors = {
  result: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30',
  emergency: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30',
  info: 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10',
  track: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
};

const AIAssistant = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "👋 Hi! I'm BloodBridge AI. How can I help with your emergency healthcare needs today?", type: 'info', time: 'now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: 'now' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', { message: msg });
      const aiResp = response.data.data;
      
      setIsTyping(false);
      
      const newMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: newMsgId,
        role: 'ai',
        text: '',
        type: aiResp.type || 'info',
        time: 'now',
      }]);

      let index = 0;
      const fullText = aiResp.text || "I'm sorry, I couldn't process that right now.";
      let currentText = '';

      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText.charAt(index);
          setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: currentText } : m));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 15);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: "I'm having trouble connecting to my brain right now. Please try again in a moment!",
        type: 'warning',
        time: 'now',
      }]);
    }
  };

  return (
    <>
      {/* ===== Toggle Button ===== */}
      <motion.button
        className="fixed bottom-24 right-5 z-50 lg:bottom-6 lg:right-6 w-13 h-13 rounded-2xl bg-gradient-to-br from-aiblue to-aipurple shadow-lg glow-blue flex items-center justify-center text-white"
        style={{ width: 52, height: 52 }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? {} : { y: [0, -4, 0] }}
        transition={open ? {} : { duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl border-2 border-aiblue/50 animate-pulse-ring-slow" />
        )}
      </motion.button>

      {/* ===== Chat Window ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-44 right-5 z-50 lg:bottom-24 lg:right-6 w-80 sm:w-96"
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="glass-floating rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ maxHeight: 480 }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-aiblue/10 to-aipurple/10 border-b border-white/10 dark:border-white/5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-aiblue to-aipurple flex items-center justify-center text-sm">
                  <FiZap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">BloodBridge AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-aigreen animate-pulse" />
                    <span className="text-[10px] text-aigreen font-semibold">Online · AI Active</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                      msg.role === 'user'
                        ? 'bg-bloodred text-white border-bloodred/30 rounded-br-sm'
                        : `${typeColors[msg.type] || typeColors.info} text-gray-700 dark:text-gray-200 rounded-bl-sm`
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div className="px-3 py-2 flex gap-1.5 overflow-x-auto">
                {SUGGESTIONS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl bg-gray-100/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-bloodred/10 hover:text-bloodred transition-colors whitespace-nowrap"
                  >
                    {s.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-3 pb-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask BloodBridge AI..."
                  className="flex-1 bg-gray-100/80 dark:bg-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 outline-none border border-gray-100 dark:border-white/10 focus:border-aiblue/40"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-aiblue to-aipurple text-white flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
