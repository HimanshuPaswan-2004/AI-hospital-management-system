import { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const STANDARD_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

const DoctorSchedule = () => {
  const [activeView, setActiveView] = useState('Day');
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Just use today for now
  const today = dayjs();
  const dateStr = today.format('YYYY-MM-DD');
  const displayDate = today.format('DD MMM YYYY');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const appointments = await doctorService.getAppointments(dateStr);
        
        // Map fetched appointments to STANDARD_SLOTS
        const slots = STANDARD_SLOTS.map(time => {
          const apt = appointments.find(a => a.timeSlot === time);
          if (apt) {
            return {
              time,
              status: 'booked',
              patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
              type: apt.reason || 'Consultation',
              initials: `${apt.patient.firstName[0]}${apt.patient.lastName[0]}`
            };
          }
          return { time, status: 'open' };
        });

        setScheduleData(slots);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [dateStr]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading schedule...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">My Schedule</h1>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-white rounded-full p-1 border border-slate-200">
            {['Day', 'Week', 'Month'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeView === view
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-600">{displayDate}</span>
        </div>
      </div>

      {/* Schedule Container */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-8 h-[600px] overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {scheduleData.map((slot, index) => (
            <div key={index} className="flex items-start gap-8 group">
              {/* Time Label */}
              <div className="w-20 pt-4 flex-shrink-0 text-right">
                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {slot.time}
                </span>
              </div>
              
              {/* Slot Content */}
              <div className="flex-1">
                {slot.status === 'open' ? (
                  <div className="h-16 w-full rounded-xl border-2 border-dashed border-slate-200 flex items-center px-6 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <span className="text-sm font-medium text-slate-400">Open slot</span>
                  </div>
                ) : (
                  <div className="w-full bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-sm text-blue-600 shadow-sm">
                      {slot.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">{slot.patient}</h4>
                      <p className="text-xs font-medium text-blue-600 mt-0.5">{slot.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
