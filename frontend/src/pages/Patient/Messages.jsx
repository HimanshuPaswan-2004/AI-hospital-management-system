import { useState } from 'react';
import { MessageSquare, Search, Send, User, MoreVertical, Paperclip, Image as ImageIcon } from 'lucide-react';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 1, name: 'Dr. Sarah Jenkins', role: 'Cardiologist', unread: 2, lastMessage: 'Your test results look normal.', time: '10:42 AM', online: true },
    { id: 2, name: 'Dr. Michael Chen', role: 'General Physician', unread: 0, lastMessage: 'Please remember to take your medication.', time: 'Yesterday', online: false },
    { id: 3, name: 'Support Team', role: 'MediAI Support', unread: 0, lastMessage: 'Your appointment has been confirmed.', time: 'Monday', online: true },
  ];

  const messages = [
    { id: 1, text: 'Hello Dr. Jenkins, I was wondering about my recent ECG results.', sender: 'me', time: '10:30 AM' },
    { id: 2, text: 'Hi! I just reviewed them. Your test results look perfectly normal. No irregularities detected.', sender: 'doctor', time: '10:42 AM' },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send to the backend
      setMessage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Messages
        </h1>
        <p className="text-slate-500 text-sm mt-1">Communicate with your doctors and support staff.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex overflow-hidden min-h-[500px]">
        {/* Sidebar / Contacts */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {contacts.map((contact) => (
              <button 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full flex items-start gap-3 p-4 border-b border-slate-50 transition-colors text-left ${activeChat === contact.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-sm font-bold truncate pr-2 ${activeChat === contact.id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {contact.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{contact.time}</span>
                  </div>
                  <p className={`text-xs truncate ${contact.unread > 0 ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-slate-50/30">
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Dr. Sarah Jenkins</h2>
                <p className="text-xs text-emerald-600 font-medium">Online</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                Today
              </span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                      msg.sender === 'me' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-[10px] text-slate-400 mt-1 flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                <Paperclip size={20} />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                <ImageIcon size={20} />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-700"
                />
              </div>
              <button 
                type="submit" 
                disabled={!message.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
