import React from 'react';
import { Heart, Calendar, Wallet, Users, Download } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const appointmentData = [
  { name: 'May 1', value: 720 },
  { name: 'May 8', value: 810 },
  { name: 'May 15', value: 640 },
  { name: 'May 22', value: 900 },
  { name: 'May 29', value: 700 },
];

const revenueData = [
  { name: 'Jan', value: 50 },
  { name: 'Feb', value: 60 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 70 },
  { name: 'May', value: 90 },
  { name: 'Jun', value: 70 },
];

const departmentData = [
  { name: 'Cardiology', value: 35, color: '#3b82f6' },
  { name: 'Neurology', value: 25, color: '#8b5cf6' },
  { name: 'Orthopedics', value: 20, color: '#f97316' },
  { name: 'Pediatrics', value: 10, color: '#14b8a6' },
  { name: 'Others', value: 10, color: '#94a3b8' },
];

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <Download size={18} />
          <span>Export Report</span>
        </button>
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
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">2,568</h3>
            </div>
          </div>
          <div className="text-sm font-medium text-emerald-500">+12.6%</div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Appointments</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">1,256</h3>
            </div>
          </div>
          <div className="text-sm font-medium text-emerald-500">+8.4%</div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹12,45,000</h3>
            </div>
          </div>
          <div className="text-sm font-medium text-emerald-500">+15.2%</div>
        </div>

        <div className="pro-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New Patients</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">320</h3>
            </div>
          </div>
          <div className="text-sm font-medium text-emerald-500">+10.0%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend Chart */}
        <div className="pro-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Appointments Trend</h3>
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

        {/* Revenue Trend Chart */}
        <div className="pro-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="pro-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Department Distribution</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            {departmentData.map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{dept.name}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{dept.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ width: `${dept.value}%`, backgroundColor: dept.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-1/3 h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  innerRadius={50}
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
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
