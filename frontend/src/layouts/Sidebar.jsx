import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Bot, 
  FileText, 
  Pill, 
  Activity, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  ShieldPlus,
  Users,
  Clock,
  ClipboardList
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  // Using PATIENT as default since this is a patient-centric mockup
  const role = user?.role || 'PATIENT';

  const menuItems = {
    PATIENT: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
      { name: 'Appointments', icon: Calendar, path: '/patient/appointments' },
      { name: 'AI Assistant', icon: Bot, path: '/patient/ai-assistant' },
      { name: 'Medical Records', icon: FileText, path: '/patient/records' },
      { name: 'Prescriptions', icon: Pill, path: '/patient/prescriptions' },
      { name: 'Health Summary', icon: Activity, path: '/patient/health-summary' },
      { name: 'Messages', icon: MessageSquare, path: '/patient/messages' },
      { name: 'Profile', icon: User, path: '/patient/profile' },
      { name: 'Settings', icon: Settings, path: '/patient/settings' },
    ],
    DOCTOR: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
      { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
      { name: 'Patients', icon: Users, path: '/doctor/patients' },
      { name: 'My Schedule', icon: Clock, path: '/doctor/schedule' },
      { name: 'Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
      { name: 'Reports', icon: ClipboardList, path: '/doctor/reports' },
      { name: 'AI Assistant', icon: Bot, path: '/doctor/ai-assistant' },
      { name: 'Messages', icon: MessageSquare, path: '/doctor/messages' },
      { name: 'Profile', icon: User, path: '/doctor/profile' },
      { name: 'Settings', icon: Settings, path: '/doctor/settings' },
    ]
  };

  const links = menuItems[role] || menuItems.PATIENT;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-300 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
      {/* Brand Logo Area */}
      <div className="flex items-center h-[88px] px-6 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <ShieldPlus className="text-blue-600 w-8 h-8" strokeWidth={2.5} />
          <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Medi<span className="text-blue-600 dark:text-blue-400">AI</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
              )}
              <Icon size={20} className={`relative z-10 transition-transform duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span className="tracking-wide text-[15px] relative z-10">{t(link.name)}</span>
            </Link>
          );
        })}

        <div className="mt-8">
           <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200"
          >
            <LogOut size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
            <span className="tracking-wide text-[15px]">{t('Logout')}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
