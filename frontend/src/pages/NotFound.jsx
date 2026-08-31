import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';

const NotFound = () => {
  const { user } = useAuthStore();
  
  // Determine home path based on user role
  const getHomePath = () => {
    if (!user) return '/login';
    switch(user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'PATIENT': return '/patient/dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700/60 p-8 text-center pro-card">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-6xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to={getHomePath()}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
