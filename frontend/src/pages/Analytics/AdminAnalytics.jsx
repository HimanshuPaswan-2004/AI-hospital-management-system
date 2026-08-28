import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import { Activity, Users, DollarSign, Calendar, TrendingUp, Award, Clock } from 'lucide-react';
import useAuthStore from '../../store/authStore';

// Custom Active Shape for Donut Chart
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#1e293b" className="text-2xl font-bold">
        {payload.status}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#64748b" className="text-sm font-medium">
        {value} ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        fill={fill}
      />
    </g>
  );
};

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuthStore();
  const token = user?.token;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/analytics/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.status === 'success') {
          const apiData = response.data.data;
          
          // Ensure we always have at least 7 days of data for the chart to look good
          const today = new Date();
          const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
          });
          
          // Map existing revenue to the last 7 days
          const revenueMap = {};
          apiData.revenueByDate?.forEach(item => {
            revenueMap[item.date] = item.revenue;
          });
          
          // Format date to a nice string like "Aug 09"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          };
          
          const paddedRevenueByDate = last7Days.map(date => ({
            date,
            formattedDate: formatDate(date),
            revenue: revenueMap[date] || 0
          })).reverse(); // Reverse so it goes from oldest to newest
          
          // Merge padded data back with API data
          setData({
            ...apiData,
            revenueByDate: paddedRevenueByDate
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    } else {
      setLoading(false);
      setError('No authentication token found.');
    }
  }, [token]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="relative flex justify-center items-center w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-4 border-teal-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-sky-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
          <div className="absolute inset-4 rounded-full border-b-4 border-violet-500 animate-spin" style={{ animationDuration: '0.8s' }}></div>
          <Activity className="w-6 h-6 text-teal-500 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl shadow-sm flex items-center gap-3 max-w-2xl mx-auto mt-10">
        <div className="p-3 bg-red-100 rounded-full"><Activity className="w-6 h-6" /></div>
        <div>
          <h3 className="font-bold text-lg">Error Loading Data</h3>
          <p className="font-medium opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const avgRevenue = data?.totalAppointments > 0 ? (data.totalRevenue / data.totalAppointments) : 0;

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Decorative Background Blur */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 tracking-tight">
            Hospital Insights
          </h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            Real-time analytics and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 text-sm font-semibold text-slate-700 flex items-center gap-2 transition-all hover:shadow-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            System Online
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        
        {/* Card 1: Revenue */}
        <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                ₹{data?.totalRevenue?.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm border border-teal-100 group-hover:border-teal-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +14.2%
            </span>
            <span className="text-xs font-medium text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 2: Appointments */}
        <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Appointments</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {data?.totalAppointments}
              </h3>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-sm border border-sky-100 group-hover:border-sky-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" /> +5.8%
            </span>
            <span className="text-xs font-medium text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 3: Avg Revenue */}
        <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.1)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Avg Rev / Visit</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                ₹{avgRevenue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm border border-amber-100 group-hover:border-amber-500">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Quality Indicator
            </span>
          </div>
        </div>

        {/* Card 4: Doctors & Patients */}
        <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Staff & Patients</p>
              <div className="flex items-center gap-3 mt-2">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {data?.totalDoctors} <span className="text-sm text-slate-400 font-semibold">Docs</span>
                </h3>
                <div className="h-6 w-[2px] bg-slate-200"></div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {data?.totalPatients} <span className="text-sm text-slate-400 font-semibold">Pts</span>
                </h3>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-100 group-hover:border-emerald-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Growing Network
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Revenue Trajectory</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Daily income tracking</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueByDate} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#0f172a', fontWeight: '800', fontSize: '16px' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Interactive Donut Chart */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Status Distribution</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Appointments breakdown</p>
          </div>
          <div className="flex-1 min-h-[350px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data?.appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={6}
                  dataKey="count"
                  nameKey="status"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                  animationDuration={1000}
                >
                  {data?.appointmentsByStatus?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PIE_COLORS[index % PIE_COLORS.length]} 
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-slate-600 font-semibold ml-2 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminAnalytics;
