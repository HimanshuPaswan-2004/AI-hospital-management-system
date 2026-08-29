import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Search, FileText, Building, Loader2 } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your AI health assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const quickQuestions = [
    { text: 'How to book an appointment?', icon: MessageSquare },
    { text: 'Find a doctor', icon: Search },
    { text: 'Explain my medical report', icon: FileText },
    { text: 'Hospital services', icon: Building }
  ];

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userText = inputValue;
    const userMsg = { id: messages.length + 1, type: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      
      const history = messages.map(m => ({ role: m.type, text: m.text }));
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`,
        { message: userText, history },
        config
      );
      
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'bot', text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'bot', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleQuickQuestion = (text) => {
    setInputValue(text);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Health Chatbot</h1>
      </div>

      <div className="flex-1 pro-card flex flex-col lg:flex-row overflow-hidden">
         {/* Sidebar - Quick Questions */}
         <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-3 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Quick Questions</h3>
            {quickQuestions.map((q, idx) => {
               const Icon = q.icon;
               return (
                 <button 
                   key={idx}
                   onClick={() => handleQuickQuestion(q.text)}
                   className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-blue-300 hover:shadow-sm transition-all group"
                 >
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Icon size={16} />
                   </div>
                   <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{q.text}</span>
                 </button>
               )
            })}
         </div>

         {/* Chat Area */}
         <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.type === 'bot' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                       {msg.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}>
                       {msg.text}
                    </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex gap-4 max-w-[80%]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-blue-600 text-white">
                       <Bot size={20} />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-sm flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
               <form onSubmit={handleSend} className="relative flex items-center">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="Type your message..." 
                   className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                 />
                 <button 
                   type="submit"
                   disabled={!inputValue.trim() || isTyping}
                   className="absolute right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center shadow-md transition-all"
                 >
                   {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
                 </button>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIChatbot;
