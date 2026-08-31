import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video } from 'lucide-react';
import dayjs from 'dayjs';
import { doctorService } from '../../services/doctorService';
import useAuthStore from '../../store/authStore';

const DoctorMessages = () => {
  const { user } = useAuthStore();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchContacts = async () => {
    try {
      const data = await doctorService.getContacts();
      // Format timestamps for contacts
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
      const data = await doctorService.getMessages(userId);
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    // Poll for new contacts/last messages every 10 seconds
    const interval = setInterval(fetchContacts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      // Poll for active chat messages every 5 seconds
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
        setMessage(''); // Clear input immediately for better UX
        
        // Optimistic update
        const tempMsg = {
          id: Date.now(),
          content: text,
          senderId: user.id,
          createdAt: new Date().toISOString()
        };
        setChats(prev => [...prev, tempMsg]);

        await doctorService.sendMessage(activeChat, text);
        fetchMessages(activeChat); // Refetch to get actual DB record
        fetchContacts(); // Update sidebar last message
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };
  
  const activeContact = contacts.find(c => c.id === activeChat);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading messages...</div>;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 overflow-hidden">
      {/* Sidebar / Contacts */}
      <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-700 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-sm">No contacts found</div>
          )}
          {contacts.map((contact) => (
            <button 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-start gap-4 p-5 border-b border-slate-50 transition-colors text-left ${activeChat === contact.id ? 'bg-blue-50/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${contact.color || 'bg-blue-100 text-blue-600'}`}>
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-sm font-bold truncate pr-2 ${activeChat === contact.id ? 'text-blue-700' : 'text-slate-800 dark:text-white'}`}>
                    {contact.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col flex-1 bg-white dark:bg-slate-800">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-[76px] border-b border-slate-100 dark:border-slate-700 px-6 flex items-center justify-between bg-white dark:bg-slate-800 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${activeContact.color || 'bg-blue-100 text-blue-600'}`}>
                  {activeContact.initials}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">{activeContact.name}</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Online</p>
                </div>
              </div>
              {/* Removed Phone and Video buttons as per request */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chats.map(msg => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%]">
                      <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                      <div className={`text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {dayjs(msg.createdAt).format('hh:mm A')}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-700 dark:text-slate-200 shadow-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMessages;
