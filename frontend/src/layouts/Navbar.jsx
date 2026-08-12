import { Menu, Bell, User, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between h-24 px-8 sm:px-12 bg-white/70 backdrop-blur-2xl border-b border-white/50 sticky top-0 z-30 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 -ml-2 text-slate-500 rounded-xl md:hidden hover:bg-slate-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex flex-col">
          <h2 className="text-[22px] font-extrabold text-slate-800 tracking-tight leading-none">Dashboard Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Welcome back, here is your summary.</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-700 transition-colors group">
          <div className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
          <Bell size={22} className="relative z-10" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse z-20"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.firstName}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user?.role?.toLowerCase() || 'User'}</p>
            </div>
          </button>
          
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden animate-[fadeInUp_0.2s_ease-out] origin-top-right">
                <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100/50">
                  <p className="text-sm font-extrabold text-slate-800">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button 
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <User size={18} /> My Profile
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-3"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
