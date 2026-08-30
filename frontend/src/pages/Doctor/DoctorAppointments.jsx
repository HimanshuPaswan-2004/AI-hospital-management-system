import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Upcoming: 'bg-amber-50 text-amber-600 border-amber-100',
    Cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await doctorService.getAppointments();
        // Map backend data to frontend structure
        const formatted = data.map(apt => {
          const name = `${apt.patient.firstName} ${apt.patient.lastName}`;
          const initials = `${apt.patient.firstName[0]}${apt.patient.lastName[0]}`;
          // Status from backend is usually uppercase (PENDING, CONFIRMED, CANCELLED, COMPLETED)
          // We need to map it to what StatusBadge expects (Upcoming, Confirmed, Cancelled)
          let statusText = apt.status === 'PENDING' ? 'Upcoming' : 
                           apt.status === 'CONFIRMED' ? 'Confirmed' : 
                           apt.status === 'COMPLETED' ? 'Confirmed' : 'Cancelled';
          
          return {
            id: apt.id,
            time: apt.timeSlot,
            date: dayjs(apt.appointmentDate).format('DD MMM YYYY'),
            patient: name,
            type: apt.reason || 'Consultation',
            status: statusText,
            initials: initials,
            color: 'bg-blue-100 text-blue-600'
          };
        });
        setAppointments(formatted);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await doctorService.updateAppointmentStatus(id, newStatus);
      // Update local state
      setAppointments(prev => prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            status: newStatus === 'COMPLETED' ? 'Confirmed' : 'Cancelled'
          };
        }
        return apt;
      }));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return apt.status === 'Confirmed'; // Simplified mapping
    return apt.status === activeTab;
  });

  if (loading) return <div className="p-8 text-center text-slate-500">Loading appointments...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold transition-colors hover:bg-blue-700 shadow-sm text-sm">
          <Plus size={18} />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors border ${
              activeTab === tab
                ? 'bg-white border-blue-600 text-blue-600 shadow-[0_2px_10px_rgb(37,99,235,0.1)]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-shadow"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        {filteredAppointments.length === 0 && (
          <div className="p-8 text-center text-slate-500">No appointments found.</div>
        )}
        {filteredAppointments.map((apt, index) => (
          <div 
            key={apt.id} 
            className={`flex items-center justify-between p-5 ${index !== filteredAppointments.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className="flex items-center gap-8 w-full">
              {/* Date & Time */}
              <div className="w-24 flex-shrink-0">
                <p className="font-bold text-slate-800">{apt.time}</p>
                <p className="text-xs text-slate-400 font-medium">{apt.date}</p>
              </div>

              {/* Patient Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${apt.color}`}>
                  {apt.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{apt.patient}</h4>
                  <p className="text-sm text-slate-500">{apt.type}</p>
                </div>
              </div>

              {/* Status */}
              <div className="w-32 flex justify-end">
                <StatusBadge status={apt.status} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {apt.status === 'Upcoming' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                      className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
