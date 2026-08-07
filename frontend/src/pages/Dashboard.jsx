import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediAI Dashboard</h1>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded font-semibold transition"
          >
            Logout
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-xl text-gray-700">
            Welcome back, <span className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</span>!
          </h2>
          <p className="mt-2 text-gray-600">You are logged in as a <strong>{user?.role}</strong>.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder cards for future modules */}
            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Appointments</h3>
              <p className="text-sm text-gray-600">View and manage your upcoming schedule.</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Medical Records</h3>
              <p className="text-sm text-gray-600">Access your lab reports and prescriptions.</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600">Check symptoms or summarize your reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
