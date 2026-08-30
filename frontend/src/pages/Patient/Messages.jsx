import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, User, Phone, Video } from 'lucide-react';
import { patientService } from '../../services/patientService';
import useAuthStore from '../../store/authStore';
import dayjs from 'dayjs';

const Messages = () => {
  const { user } = useAuthStore();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  const fetchContacts = async () => {
    try {
      const data = await patientService.getContacts();
      const formatted = data.map(c => ({
        ...c,
        time: c.time ? dayjs(c.time).format('hh:mm A') : ''
      }));
      setContacts(formatted);
      if (formatted.length > 0 && !activeChat) {
        setActiveChat(formatted[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;
    try {
      const data = await patientService.getMessages(userId);
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      const interval = setInterval(() => fetchMessages(activeChat), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      try {
        const text = message.trim();
        setMessage('');
        
        const tempMsg = {
          id: Date.now(),
          content: text,
          senderId: user.id,
          createdAt: new Date().toISOString()
        };
        setChats(prev => [...prev, tempMsg]);

        await patientService.sendMessage(activeChat, text);
        fetchMessages(activeChat);
        fetchContacts();
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Messages
        </h1>
        <p className="text-slate-500 text-sm mt-1">Communicate with your doctors securely.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex overflow-hidden min-h-[500px]">
        {/* Sidebar / Contacts */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {loading && contacts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">Loading contacts...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No contacts found</div>
            ) : (
              filteredContacts.map((contact) => (
                <button 
                  key={contact.id}
                  onClick={() => setActiveChat(contact.id)}
                  className={`w-full flex items-start gap-3 p-4 border-b border-slate-50 transition-colors text-left ${activeChat === contact.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${contact.color || 'bg-indigo-100 text-indigo-600'}`}>
                    {contact.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-sm font-bold truncate pr-2 ${activeChat === contact.id ? 'text-blue-700' : 'text-slate-800'}`}>
                        {contact.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{contact.time}</span>
                    </div>
                    <p className="text-xs truncate text-slate-500">
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-slate-50/30">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="h-[76px] border-b border-slate-100 px-6 flex items-center justify-between bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${activeContact.color || 'bg-indigo-100 text-indigo-600'}`}>
                    {activeContact.initials}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">{activeContact.name}</h2>
                    <p className="text-xs text-emerald-600 font-medium">Online</p>
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
                {chats.map(msg => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                        <div 
                          className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-tr-sm' 
                              : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className={`text-[10px] text-slate-400 mt-1 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {dayjs(msg.createdAt).format('hh:mm A')}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a doctor to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
