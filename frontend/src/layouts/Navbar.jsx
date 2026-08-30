import { Menu, Bell, Search, User } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between h-[88px] px-6 sm:px-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 rounded-xl md:hidden hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 focus-within:border-blue-400 transition-all">
          <Search className="text-slate-400 dark:text-slate-500 w-5 h-5 mr-2" />
          <input 
            type="text" 
            placeholder="Search records, appointments..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-700">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer" onClick={() => navigate('/patient/profile')}>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{user?.firstName || 'John Doe'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg overflow-hidden border border-blue-200 dark:border-blue-800">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
