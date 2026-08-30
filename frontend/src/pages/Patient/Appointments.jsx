import { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

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
    const isPast = new Date(apt.appointmentDate) < new Date(new Date().setHours(0, 0, 0, 0));
    if (activeTab === 'Upcoming') return !isPast && apt.status !== 'CANCELLED';
    if (activeTab === 'Past') return isPast && apt.status !== 'CANCELLED';
    if (activeTab === 'Cancelled') return apt.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Appointments</h1>
        <Link to="/doctor-directory" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
          Book Appointment
        </Link>
      </div>

      <div className="flex items-center gap-6 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pro-card overflow-hidden mt-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No {activeTab.toLowerCase()} appointments found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <tbody>
                {filteredAppointments.map((apt, index) => (
                  <tr key={apt.id} className={`border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${index === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                    <td className="p-4 sm:px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm uppercase">
                          {apt.doctor.firstName[0]}{apt.doctor.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{apt.doctor.doctorProfile?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 py-5">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{dayjs(apt.appointmentDate).format('DD MMM YYYY')}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-5">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{apt.timeSlot}</p>
                    </td>
                    <td className="p-4 sm:px-6 py-5">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${apt.status === 'CONFIRMED' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' :
                          apt.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' :
                            'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
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
