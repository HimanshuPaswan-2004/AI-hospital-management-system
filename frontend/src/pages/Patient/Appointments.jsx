import { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await patientService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const tabs = ['Upcoming', 'Past', 'Cancelled'];

  const filteredAppointments = appointments.filter(apt => {
    const isPast = new Date(apt.appointmentDate) < new Date(new Date().setHours(0,0,0,0));
    if (activeTab === 'Upcoming') return !isPast && apt.status !== 'CANCELLED';
    if (activeTab === 'Past') return isPast && apt.status !== 'CANCELLED';
    if (activeTab === 'Cancelled') return apt.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
          Book Appointment
        </button>
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
          {loading ? (
             <div className="p-8 text-center text-slate-500 font-medium">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
             <div className="p-8 text-center text-slate-500 font-medium">No {activeTab.toLowerCase()} appointments found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
               <tbody>
                 {filteredAppointments.map((apt, index) => (
                   <tr key={apt.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-slate-50/50' : ''}`}>
                     <td className="p-4 sm:px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 border border-blue-200 shadow-sm uppercase">
                            {apt.doctor.firstName[0]}{apt.doctor.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</p>
                            <p className="text-xs font-medium text-slate-500">{apt.doctor.doctorProfile?.specialization}</p>
                          </div>
                        </div>
                     </td>
                     <td className="p-4 sm:px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">{dayjs(apt.appointmentDate).format('DD MMM YYYY')}</p>
                     </td>
                     <td className="p-4 sm:px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">{apt.timeSlot}</p>
                     </td>
                     <td className="p-4 sm:px-6 py-5">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                          apt.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 
                          'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {apt.status}
                        </span>
                     </td>
                     <td className="p-4 sm:px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                            View
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
