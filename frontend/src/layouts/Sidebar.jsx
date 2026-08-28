import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Activity, Settings, FileText, ActivitySquare, Pill, BarChart2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const role = user?.role || 'PATIENT';

  const menuItems = {
    ADMIN: [
      { name: 'Analytics Dashboard', icon: BarChart2, path: '/admin/analytics' },
      { name: 'Pharmacy Inventory', icon: Pill, path: '/admin/pharmacy' },
      { name: 'Billing & Invoicing', icon: FileText, path: '/admin/billing' }
    ],
    DOCTOR: [
      { name: 'My Schedule', icon: Calendar, path: '/doctor/schedule' }
    ],
    PATIENT: [
      { name: 'My Appointments', icon: Calendar, path: '/patient/appointments' },
      { name: 'Medical Records', icon: Activity, path: '/patient/records' },
      { name: 'Doctor Directory', icon: Users, path: '/doctor-directory' }
    ]
  };

  const links = menuItems[role] || menuItems.PATIENT;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0A0F1C] border-r border-white/[0.08] text-slate-300 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
      {/* Brand Logo Area */}
      <div className="flex items-center h-[88px] px-8 border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent opacity-50"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <ActivitySquare className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Medi<span className="text-teal-500">AI</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Menu</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-teal-600/10 text-teal-400 font-bold' 
                  : 'text-slate-400 font-semibold hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              )}
              <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-teal-500' : 'group-hover:scale-110'}`} />
              <span className="tracking-wide text-[15px] relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area */}
      <div className="p-4 m-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-white border border-white/10 group-hover:border-teal-500/50 transition-colors shadow-inner">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
