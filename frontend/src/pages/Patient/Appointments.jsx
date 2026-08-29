import { useState } from 'react';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const tabs = ['Upcoming', 'Past', 'Cancelled'];

  const appointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', spec: 'Cardiologist', date: '30 Aug 2024', time: '10:00 AM', status: 'Confirmed', initials: 'SJ' },
    { id: 2, doctor: 'Dr. Michael Brown', spec: 'Neurologist', date: '15 Sep 2024', time: '11:00 AM', status: 'Confirmed', initials: 'MB' },
    { id: 3, doctor: 'Dr. Emily Watson', spec: 'Dermatologist', date: '20 Sep 2024', time: '09:30 AM', status: 'Pending', initials: 'EW' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
      </div>

      <div className="flex items-center gap-6 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pro-card overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <tbody>
               {appointments.map((apt, index) => (
                 <tr key={apt.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-slate-50/50' : ''}`}>
                   <td className="p-4 sm:px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 border border-blue-200 shadow-sm">
                          {apt.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{apt.doctor}</p>
                          <p className="text-xs font-medium text-slate-500">{apt.spec}</p>
                        </div>
                      </div>
                   </td>
                   <td className="p-4 sm:px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{apt.date}</p>
                   </td>
                   <td className="p-4 sm:px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{apt.time}</p>
                   </td>
                   <td className="p-4 sm:px-6 py-5">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                   </td>
                   <td className="p-4 sm:px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                          View
                        </button>
                        <button className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition-colors border border-rose-200">
                          Cancel
                        </button>
                      </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
