import { useState } from 'react';
import { Bot, Sparkles, FileText, Pill, ClipboardList, Send, Mic } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const DoctorAIAssistant = () => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col overflow-hidden">
        
        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar space-y-8">
          
          {/* Welcome Message */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Hello Dr. {user?.firstName || 'Sarah'}!</h2>
              <p className="text-slate-500 mt-1">How can I help you today?</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Analyze Symptoms</h3>
              <p className="text-xs text-slate-500 mt-1">Analyze patient symptoms</p>
            </button>
            
            <button className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Summarize Interactions</h3>
              <p className="text-xs text-slate-500 mt-1">Summarize patient reports</p>
            </button>

            <button className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Pill size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Drug Interaction</h3>
              <p className="text-xs text-slate-500 mt-1">Check drug interactions</p>
            </button>

            <button className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group bg-white">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ClipboardList size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Treatment Guidelines</h3>
              <p className="text-xs text-slate-500 mt-1">Get treatment recommendations</p>
            </button>
          </div>

          {/* Chat bubbles */}
          <div className="space-y-6 pt-4">
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 text-slate-700 px-5 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm max-w-[80%]">
                Hello Dr. {user?.firstName || 'Sarah'}! How can I help you today?
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything about your patient or medical knowledge..." 
              className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-slate-700"
            />
            <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors">
              <Mic size={20} />
            </button>
            <button 
              disabled={!message.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-1"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorAIAssistant;
