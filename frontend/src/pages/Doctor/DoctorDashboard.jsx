import { Calendar, Users, FileText, Sparkles, MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';

const data = [
  { name: 'Mon', appointments: 22 },
  { name: 'Tue', appointments: 30 },
  { name: 'Wed', appointments: 18 },
  { name: 'Thu', appointments: 25 },
  { name: 'Fri', appointments: 15 },
  { name: 'Sat', appointments: 28 },
  { name: 'Sun', appointments: 10 },
];

const schedule = [
  { time: '09:00 AM', patient: 'Robert Williams', type: 'Follow Up', status: 'Confirmed', initials: 'RW', color: 'bg-blue-100 text-blue-600' },
  { time: '10:30 AM', patient: 'Emily Davis', type: 'Consultation', status: 'Confirmed', initials: 'ED', color: 'bg-indigo-100 text-indigo-600' },
  { time: '12:00 PM', patient: 'Michael Brown', type: 'New Patient', status: 'Confirmed', initials: 'MB', color: 'bg-sky-100 text-sky-600' },
  { time: '02:30 PM', patient: 'Jessica Miller', type: 'Follow Up', status: 'Upcoming', initials: 'JM', color: 'bg-purple-100 text-purple-600' },
  { time: '04:00 PM', patient: 'William Jones', type: 'Consultation', status: 'Upcoming', initials: 'WJ', color: 'bg-blue-100 text-blue-600' },
  { time: '05:00 PM', patient: 'David Anderson', type: 'Follow Up', status: 'Cancelled', initials: 'DA', color: 'bg-slate-100 text-slate-600' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Upcoming: 'bg-amber-50 text-amber-600 border-amber-100',
    Cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    totalPatients: 0,
    pendingReports: 0,
    consultations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardStats = await doctorService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Good morning, Dr. {user?.firstName || 'Sarah'} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Appointments</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.todaysAppointments}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">+2 from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Patients</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalPatients}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">+38 this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Reports</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.pendingReports}</h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <FileText size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">-3 from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Consultations</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.consultations}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Sparkles size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">This week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Today's Schedule</h2>
            <Link to="/doctor/schedule" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          
          <div className="space-y-6">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-[60px] text-xs font-bold text-slate-400">{item.time}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.color}`}>
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.patient}</h4>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">Appointments Overview</h2>
            <select className="text-sm font-medium text-slate-500 bg-transparent border-none focus:ring-0 cursor-pointer outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  ticks={[0, 8, 16, 24, 32]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#2563eb', stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
