import { Calendar, FileText, Pill, Activity, ChevronRight, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const stats = [
    { title: 'Upcoming Appointments', value: '02', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', link: '/patient/appointments' },
    { title: 'Medical Records', value: '12', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/patient/records' },
    { title: 'Prescriptions', value: '05', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/patient/prescriptions' },
    { title: 'Health Score', value: '85%', subtext: 'Good', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50/50', link: '/patient/health-summary' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, John Doe 👋</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">Here's what's happening with your health today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="pro-card p-6 flex flex-col justify-between group cursor-pointer transition-all hover:border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-500 leading-tight">{stat.title}</p>
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-800">{stat.value}</h3>
                  {stat.subtext && <span className="text-sm font-bold text-emerald-500">{stat.subtext}</span>}
                </div>
              </div>

              <Link to={stat.link} className="flex items-center gap-1 text-[13px] font-bold text-blue-600 mt-6 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                View all <ChevronRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Upcoming Appointment */}
        <div className="lg:col-span-2 pro-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Appointment</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-14 h-14 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                 {/* Doctor Image Placeholder */}
                 <span className="text-blue-600 font-bold text-xl">SJ</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Dr. Sarah Johnson</h3>
                <p className="text-sm font-medium text-slate-500">Cardiologist</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-1">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Calendar size={16} className="text-blue-600" />
                  30 Aug 2024
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Activity size={16} className="text-blue-600" />
                  10:30 AM
               </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/patient/appointments" className="text-sm font-bold text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        </div>

        {/* AI Health Tip */}
        <div className="pro-card p-6 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Droplets size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-bold">AI Health Tip</h2>
            </div>
            
            <p className="text-[15px] font-medium leading-relaxed text-blue-50 flex-1">
              Drink at least 8 glasses of water daily and maintain a balanced diet.
            </p>
            
            <button className="flex items-center gap-2 text-sm font-bold bg-white text-blue-600 w-max px-4 py-2 rounded-lg mt-6 hover:bg-blue-50 transition-colors shadow-sm">
              Learn more <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Decorative background for the tip card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
