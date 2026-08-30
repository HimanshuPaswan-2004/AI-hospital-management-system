import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, FileText, Pill, ClipboardList, Send, Mic, User, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { doctorService } from '../../services/doctorService';

const DoctorAIAssistant = () => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text = message) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);
    
    try {
      const history = messages.map(m => ({ role: m.type, text: m.text }));
      
      const data = await doctorService.aiChat(text, history);
      
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Assistant</h1>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar space-y-8">
          
          {/* Welcome Message */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hello Dr. {user?.firstName || 'Sarah'}!</h2>
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">How can I help you today?</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => handleQuickAction('Analyze the following symptoms: ')} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white dark:bg-slate-800">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Analyze Symptoms</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Analyze patient symptoms</p>
            </button>
            
            <button onClick={() => handleQuickAction('Summarize the recent interactions for my patient: ')} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white dark:bg-slate-800">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Summarize Interactions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Summarize patient reports</p>
            </button>

            <button onClick={() => handleQuickAction('Check drug interactions for: ')} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white dark:bg-slate-800">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Pill size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Drug Interaction</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Check drug interactions</p>
            </button>

            <button onClick={() => handleQuickAction('What are the latest treatment guidelines for: ')} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white dark:bg-slate-800">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ClipboardList size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Treatment Guidelines</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Get treatment recommendations</p>
            </button>
          </div>

          {/* Chat bubbles */}
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-blue-600 text-white">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm">
                Hello Dr. {user?.firstName || 'Sarah'}! How can I help you today?
              </div>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.type === 'bot' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                  {msg.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'
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
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all"
          >
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything about your patient or medical knowledge..." 
              className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
            />
            <button type="button" className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors">
              <Mic size={20} />
            </button>
            <button 
              type="submit"
              disabled={!message.trim() || isTyping}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-1"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DoctorAIAssistant;
