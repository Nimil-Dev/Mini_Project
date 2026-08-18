import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiX, FiSend, FiCpu, FiBookOpen, FiEdit3, FiHelpCircle 
} from 'react-icons/fi';
import aiService from '../services/aiService';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your MACFAST Campus Assistant. How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState(null); // 'summarize' | 'improve' | null

  const chatEndRef = useRef(null);

  // Auto-scroll to the latest messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add user's message to UI
    const userMessage = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      let replyText = '';
      
      if (activeTool === 'summarize') {
        const response = await aiService.summarizeText(query);
        replyText = `**Summary:**\n${response.summary}`;
        setActiveTool(null); // Reset active tool state
      } else if (activeTool === 'improve') {
        const response = await aiService.improveDraft(query, 'grammar');
        replyText = `**Refined Text:**\n${response.result}`;
        setActiveTool(null);
      } else {
        // Fallback to conversational chat
        const historyPayload = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        const response = await aiService.sendMessage(query, historyPayload);
        replyText = response.reply;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: replyText }]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'ai', text: "I ran into an issue connecting to the campus brain. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionType) => {
    if (actionType === 'faq') {
      handleSendMessage("What are the college working hours and library guidelines?");
    } else if (actionType === 'summarize') {
      setActiveTool('summarize');
      setMessages(prev => [
        ...prev, 
        { id: Date.now(), sender: 'ai', text: "Please paste the long announcement or article you'd like me to summarize." }
      ]);
    } else if (actionType === 'grammar') {
      setActiveTool('improve');
      setMessages(prev => [
        ...prev, 
        { id: Date.now(), sender: 'ai', text: "Paste your text here. I will fix the grammar and improve the tone." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-80 sm:w-96 h-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Widget Header */}
            <div className="bg-blue-600 dark:bg-blue-900/80 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiCpu className="w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm">MACFAST AI Assistant</h3>
                  <p className="text-[10px] text-blue-200">Online | Powered by CAMPUSCONNECT</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/30 dark:border-slate-700/30'
                    }
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3.5 py-2.5 text-xs rounded-tl-none border border-slate-200/30 dark:border-slate-700/30 text-slate-400 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
              <button 
                onClick={() => handleQuickAction('faq')}
                className="flex items-center gap-1 shrink-0 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-500 transition"
              >
                <FiHelpCircle className="text-blue-500" />
                <span>FAQs</span>
              </button>
              <button 
                onClick={() => handleQuickAction('summarize')}
                className="flex items-center gap-1 shrink-0 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-500 transition"
              >
                <FiBookOpen className="text-indigo-500" />
                <span>Summarize Notice</span>
              </button>
              <button 
                onClick={() => handleQuickAction('grammar')}
                className="flex items-center gap-1 shrink-0 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-500 transition"
              >
                <FiEdit3 className="text-emerald-500" />
                <span>Fix Grammar</span>
              </button>
            </div>

            {/* Message Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                placeholder={activeTool ? `Mode: ${activeTool}...` : "Ask anything about MACFAST..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Trigger Orb */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-500/20 transition-all z-50 border border-blue-500/10 focus:outline-none"
        aria-label="Campus AI Assistant"
      >
        <FiMessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AIAssistantWidget;