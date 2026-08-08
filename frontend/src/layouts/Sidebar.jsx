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
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
      <div className="flex items-center justify-center h-16 bg-gray-950">
        <span className="text-2xl font-bold text-blue-500">AI Health</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold uppercase">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 capitalize">{role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
