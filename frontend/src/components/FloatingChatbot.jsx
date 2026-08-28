import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Send, Loader2, Stethoscope, FileText, Paperclip } from 'lucide-react';
import Draggable from 'react-draggable';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import useAuthStore from '../store/authStore';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your AI Medical Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [mode, setMode] = useState('chat'); // 'chat', 'symptom', 'report'
  const messagesEndRef = useRef(null);
  const nodeRef = useRef(null);
  
  const { user } = useAuthStore();
  const token = user?.token;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !attachment) return; // Allow sending just an attachment

    const userMessage = { role: 'user', text: input, attachment };
    setMessages(prev => [...prev, userMessage]);
    
    // Store current values for the API call
    const currentInput = input;
    const currentAttachment = attachment;

    setInput('');
    setAttachment(null);
    setLoading(true);

    try {
      // Exclude the first default message from history to save tokens and avoid confusing the prompt
      const chatHistory = messages.slice(1);
      
      let endpoint = '/api/ai/chat';
      let payload = { message: currentInput, history: chatHistory, attachment: currentAttachment };

      if (mode === 'symptom') {
        endpoint = '/api/ai/symptom-checker';
        payload = { symptoms: currentInput, history: chatHistory, attachment: currentAttachment };
      } else if (mode === 'report') {
        endpoint = '/api/ai/summarize-report';
        payload = { reportText: currentInput, history: chatHistory, attachment: currentAttachment };
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const replyText = mode === 'chat' ? res.data.reply : (mode === 'symptom' ? res.data.analysis : res.data.summary);
      
      setMessages(prev => [...prev, { role: 'model', text: replyText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Maximum 5MB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setAttachment({
        previewUrl: URL.createObjectURL(file),
        base64: base64String,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset input
  };

  const chatbotContent = (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen ? (
        <Draggable nodeRef={nodeRef} handle=".chat-header">
          <div ref={nodeRef} className="w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col h-[500px] border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="chat-header cursor-move bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Assistant</h3>
                  <p className="text-xs text-teal-100">MediAI Health</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

          {/* Mode Selector */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2 gap-2 overflow-x-auto text-sm">
            <button 
              onClick={() => setMode('chat')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-1 ${mode === 'chat' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              General Chat
            </button>
            <button 
              onClick={() => setMode('symptom')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-1 ${mode === 'symptom' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              Symptoms
            </button>
            <button 
              onClick={() => setMode('report')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-1 ${mode === 'report' ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              Reports
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm prose prose-sm dark:prose-invert ${
                    msg.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap flex flex-col gap-2">
                      {msg.attachment && msg.attachment.mimeType.startsWith('image/') && (
                        <img src={msg.attachment.previewUrl || `data:${msg.attachment.mimeType};base64,${msg.attachment.base64}`} alt="Attachment" className="max-w-[200px] max-h-[200px] object-cover rounded-lg" />
                      )}
                      {msg.attachment && !msg.attachment.mimeType.startsWith('image/') && (
                        <div className="flex items-center gap-2 bg-teal-700/50 p-2 rounded text-xs">
                          <FileText size={16} /> {msg.attachment.name}
                        </div>
                      )}
                      <div>{msg.text}</div>
                    </div>
                  ) : (
                    <ReactMarkdown>{msg.text || ''}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 className="animate-spin text-teal-500" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 relative">
            {/* Attachment Preview */}
            {attachment && (
              <div className="absolute bottom-full mb-2 left-3 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600 shadow-md flex items-center gap-2">
                {attachment.mimeType.startsWith('image/') ? (
                  <img src={attachment.previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex flex-col items-center justify-center text-xs overflow-hidden p-1">
                    <FileText size={16} />
                    <span className="truncate w-full text-center mt-1 text-gray-500">{attachment.name.split('.').pop()}</span>
                  </div>
                )}
                <div className="flex flex-col max-w-[120px]">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{attachment.name}</span>
                </div>
                <button 
                  onClick={() => setAttachment(null)}
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 ml-2"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex relative items-end group">
              <input 
                type="file" 
                id="chatbot-file-upload" 
                className="hidden" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
              />
              <label 
                htmlFor="chatbot-file-upload"
                className="absolute left-2 bottom-2 p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg cursor-pointer transition-colors z-10"
                title="Attach Image or PDF"
              >
                <Paperclip size={20} />
              </label>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'chat' ? 'Ask a medical question...' :
                  mode === 'symptom' ? 'Describe your symptoms...' :
                  'Paste lab report text...'
                }
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-12 max-h-32 transition-all"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={(!input.trim() && !attachment) || loading}
                className="absolute right-2 bottom-2 p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} className={loading ? 'opacity-0' : 'opacity-100'} />
                {loading && <Loader2 size={18} className="animate-spin absolute top-1.5 left-1.5" />}
              </button>
            </form>
          </div>
        </div>
        </Draggable>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex items-center justify-center relative"
        >
          <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </button>
      )}
    </div>
  );

  // Use React Portal to render chatbot directly in document.body
  // This prevents parent CSS properties like `transform`, `overflow: hidden`, or z-index context
  // from breaking the fixed positioning and floating behavior.
  return typeof document !== 'undefined' ? createPortal(chatbotContent, document.body) : chatbotContent;
};

export default FloatingChatbot;
