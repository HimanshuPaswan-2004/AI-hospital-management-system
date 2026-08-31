import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { messageService } from '../../services/messageService';

const AdminMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await messageService.getContacts();
        setContacts(data);
        if (data.length > 0) {
          setActiveContact(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages when active contact changes
  const fetchMessages = async (contactId) => {
    try {
      const data = await messageService.getMessages(contactId);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.id);
    }
  }, [activeContact]);

  // Polling for new messages
  useEffect(() => {
    if (!activeContact) return;
    const interval = setInterval(() => {
      fetchMessages(activeContact.id);
    }, 5000); // 5 seconds polling
    
    return () => clearInterval(interval);
  }, [activeContact]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!msgInput.trim() || !activeContact) return;

    const content = msgInput.trim();
    setMsgInput(''); // optimistic clear
    
    try {
      const newMessage = await messageService.sendMessage(activeContact.id, content);
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      
      // Update contact's last message in the list
      setContacts(prev => prev.map(c => 
        c.id === activeContact.id 
          ? { ...c, lastMessage: content, time: new Date().toISOString() } 
          : c
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  // Determine current user from sessionStorage
  const userStr = sessionStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id;

  if (loadingContacts) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Left Sidebar - Contacts */}
      <div className="w-[300px] flex-shrink-0 flex flex-col pro-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white font-outfit">Messages / Communication</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {contacts.length === 0 ? (
             <div className="p-4 text-center text-slate-500 text-sm">No contacts found</div>
          ) : contacts.map((contact) => (
            <div 
              key={contact.id} 
              onClick={() => setActiveContact(contact)}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                activeContact?.id === contact.id 
                  ? 'bg-slate-50 dark:bg-slate-800' 
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${contact.color || 'bg-indigo-100 text-indigo-600'} dark:bg-opacity-20`}>
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate">{contact.name}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {contact.time ? new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area - Chat Window */}
      <div className="flex-1 flex flex-col pro-card overflow-hidden">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${activeContact.color || 'bg-indigo-100 text-indigo-700'} dark:bg-opacity-30 flex items-center justify-center font-bold text-sm`}>
                {activeContact.initials}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white font-outfit">{activeContact.name}</h3>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">No messages yet. Say hello!</div>
              ) : messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'self-end' : ''}`}>
                    <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'} p-4 rounded-2xl`}>
                      {msg.content}
                    </div>
                    <span className={`text-xs text-slate-400 ${isMe ? 'mr-1 self-end' : 'ml-1'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                />
                <button type="submit" disabled={!msgInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
