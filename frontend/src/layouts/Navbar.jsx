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
    <header className="flex items-center justify-between h-24 px-8 sm:px-12 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
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
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-300 group"
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
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-100 mb-2">
                <p className="text-sm font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <User size={16} />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
