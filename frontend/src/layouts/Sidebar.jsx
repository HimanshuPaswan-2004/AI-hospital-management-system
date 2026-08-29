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
    <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-300 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
      {/* Brand Logo Area */}
      <div className="flex items-center h-[88px] px-8 border-b border-slate-100 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
            <ActivitySquare className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">Medi<span className="text-primary-600">AI</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Menu</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 font-bold' 
                  : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full"></div>
              )}
              <Icon size={20} className={`relative z-10 transition-transform duration-200 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="tracking-wide text-[15px] relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area */}
      <div className="p-4 m-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition-colors duration-300 cursor-pointer group shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 shadow-sm transition-colors duration-300">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-primary-600 font-bold tracking-wider uppercase mt-0.5">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
