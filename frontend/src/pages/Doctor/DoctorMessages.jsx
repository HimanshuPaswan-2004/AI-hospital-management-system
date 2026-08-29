import { useState } from 'react';
import { Send, Phone, Video } from 'lucide-react';

const DoctorMessages = () => {
  const [activeChat, setActiveChat] = useState('PT4');
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 'PT1', name: 'Emily Davis', unread: 0, lastMessage: 'Thank you doctor!', time: '10:30 AM', initials: 'ED', color: 'bg-indigo-100 text-indigo-600', active: false },
    { id: 'PT2', name: 'Robert Williams', unread: 0, lastMessage: 'I have a question...', time: 'Yesterday', initials: 'RW', color: 'bg-blue-100 text-blue-600', active: false },
    { id: 'PT3', name: 'Michael Brown', unread: 0, lastMessage: 'Please share the report.', time: '20 May', initials: 'MB', color: 'bg-sky-100 text-sky-600', active: false },
    { id: 'PT4', name: 'Jessica Miller', unread: 0, lastMessage: 'When is my next visit?', time: '18 May', initials: 'JM', color: 'bg-purple-100 text-purple-600', active: false },
    { id: 'PT5', name: 'William Jones', unread: 0, lastMessage: 'Thanks for the help.', time: '18 May', initials: 'WJ', color: 'bg-blue-100 text-blue-600', active: true },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
      {/* Sidebar / Contacts */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-xl font-bold text-slate-800">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <button 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-start gap-4 p-5 border-b border-slate-50 transition-colors text-left ${activeChat === contact.id || contact.active ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${contact.color}`}>
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-sm font-bold truncate pr-2 ${activeChat === contact.id || contact.active ? 'text-blue-700' : 'text-slate-800'}`}>
                    {contact.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col flex-1 bg-white">
        {/* Chat Header */}
        <div className="h-[76px] border-b border-slate-100 px-6 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              WJ
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">William Jones</h2>
              <p className="text-xs text-slate-400 font-medium">Offline</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
              <Phone size={18} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
              <Video size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <div className="px-5 py-3 rounded-2xl text-sm bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm">
                Thanks for the help.
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-1.5 ml-1">
                18 May
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..." 
                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-700 shadow-sm"
              />
            </div>
            <button 
              type="submit" 
              className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorMessages;
