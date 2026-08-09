import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Activity, Settings, FileText, ActivitySquare, Pill } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const role = user?.role || 'PATIENT';

  const menuItems = {
    ADMIN: [
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
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 text-slate-100 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
      <div className="flex items-center justify-center h-16 border-b border-slate-800/50 bg-slate-900/50">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AI Health</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Icon size={20} className={isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 transition-opacity'} />
              <span className="font-medium tracking-wide text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white uppercase shadow-sm">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-400 capitalize tracking-wide">{role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
