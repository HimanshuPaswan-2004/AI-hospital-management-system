import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Wallet, 
  Stethoscope,
  MoreVertical
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboardAnalytics();
        setData(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const appointmentData = data.appointmentData || [];
  const departmentData = data.departmentData || [];
  const revenueData = data.revenueData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">Admin Dashboard Overview</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Patients</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.totalPatients}</h3>
            </div>
          </div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Appointments</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.totalAppointments}</h3>
            </div>
          </div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹{data.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Doctors</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.totalDoctors}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Chart */}
        <div className="pro-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Appointments (This Month)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Pie Chart */}
        <div className="pro-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Department Wise Patients</h3>
          <div className="h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }}></span>
                <span className="text-slate-600 dark:text-slate-400">{dept.name} {dept.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="pro-card p-0 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.recentAppointments.length > 0 ? data.recentAppointments.map((apt) => {
                  let statusColor = 'bg-amber-100 text-amber-700';
                  if(apt.status === 'CONFIRMED') statusColor = 'bg-emerald-100 text-emerald-700';
                  if(apt.status === 'CANCELLED') statusColor = 'bg-rose-100 text-rose-700';
                  if(apt.status === 'COMPLETED') statusColor = 'bg-blue-100 text-blue-700';

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 pl-6 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {apt.timeSlot}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800 dark:text-white">{apt.patient?.firstName} {apt.patient?.lastName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">General</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                        Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-slate-500">No recent appointments</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="pro-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Monthly Revenue</h3>
          <div className="mb-6">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">₹{data.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  dy={10} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
