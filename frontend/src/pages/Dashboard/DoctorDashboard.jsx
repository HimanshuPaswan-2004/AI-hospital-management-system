import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Calendar, Clock, User, Check, X, CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';
import PrescriptionModal from '../../components/Prescription/PrescriptionModal';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Prescription modal state
  const [prescribingAppt, setPrescribingAppt] = useState(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments/schedule', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchSchedule();
    }
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchSchedule();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update appointment status.');
    }
  };

  const handlePrescriptionSuccess = () => {
    setPrescribingAppt(null);
    alert('Prescription saved successfully!');
    // If we were automatically marking it completed when prescribing, we could do it here
  };

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(app => app.appointmentDate.split('T')[0] === today);
  const upcomingAppointments = appointments.filter(app => app.appointmentDate.split('T')[0] > today);

  const renderAppointmentCard = (app) => (
    <div key={app.id} className="pro-card rounded-2xl p-6 flex flex-col group hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-6 gap-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-teal-600 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform">
            {app.patient.firstName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-lg truncate group-hover:text-teal-600 transition-colors">{app.patient.firstName} {app.patient.lastName}</h4>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md"><Calendar size={14} className="text-teal-500" /> <span className="whitespace-nowrap">{new Date(app.appointmentDate).toLocaleDateString()}</span></span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md"><Clock size={14} className="text-amber-500" /> <span className="whitespace-nowrap">{app.timeSlot}</span></span>
            </div>
          </div>
        </div>
        <span className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border ${
          app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
          app.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
          app.status === 'COMPLETED' ? 'bg-slate-50 text-slate-700 border-slate-200/50' :
          'bg-rose-50 text-rose-700 border-rose-200/50'
        }`}>
          {app.status}
        </span>
      </div>
      
      {app.reason && (
        <div className="text-sm font-medium text-slate-600 bg-slate-50/80 p-4 rounded-xl mb-6 flex-1 border border-slate-100">
          <span className="font-bold text-slate-800 block mb-1">Reason for visit:</span>
          {app.reason}
        </div>
      )}

      {app.status === 'PENDING' && (
        <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
          <button 
            onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5"
          >
            <Check size={18} /> Approve
          </button>
          <button 
            onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
            className="flex-1 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-100 hover:border-rose-200 py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5"
          >
            <X size={18} /> Decline
          </button>
        </div>
      )}
      
      {app.status === 'CONFIRMED' && (
        <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
           <button 
            onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5"
          >
            <CheckCircle size={18} /> Mark Completed
          </button>
        </div>
      )}

      {app.status === 'COMPLETED' && (
        <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
           <button 
            onClick={() => setPrescribingAppt(app)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5"
          >
            <FileText size={18} /> Write Prescription
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-100 border-t-blue-600"></div></div>;
  if (error) return <div className="p-12 text-center text-rose-500 bg-rose-50 rounded-3xl font-bold"><AlertCircle className="mx-auto mb-3 h-10 w-10" />{error}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-[fadeInUp_0.4s_ease-out]">
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="pro-card p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 transition-all group">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <User size={24} className="text-teal-500" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Patients Today</p>
          <h3 className="text-3xl font-black text-slate-800">{todayAppointments.length}</h3>
        </div>
        
        <div className="pro-card p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            <CheckCircle size={24} className="text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
          <h3 className="text-3xl font-black text-slate-800">
            {todayAppointments.filter(a => a.status === 'COMPLETED').length}
          </h3>
        </div>

        <div className="pro-card p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 transition-all group">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Clock size={24} className="text-amber-500" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Action</p>
          <h3 className="text-3xl font-black text-slate-800">
            {appointments.filter(a => a.status === 'PENDING').length}
          </h3>
        </div>

        <div className="pro-card p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 transition-all group relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-100 rounded-full blur-2xl opacity-60"></div>
          <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform relative z-10">
            <span className="font-bold text-sky-500 text-2xl">₹</span>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Est. Earnings</p>
          <h3 className="text-3xl font-black text-slate-800 relative z-10">₹{todayAppointments.length * 500}</h3>
        </div>
      </div>

      {/* Today's Schedule */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 text-teal-600 rounded-xl shadow-sm border border-teal-50">
            <Calendar size={24} />
          </div>
          Today's Schedule
        </h2>
        {todayAppointments.length === 0 ? (
          <div className="  p-16 rounded-2xl border border-slate-200 text-center shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <Calendar className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-700 relative z-10 tracking-tight">No Appointments Today</h3>
            <p className="text-slate-500 font-medium mt-2 text-lg relative z-10">Enjoy your free time or prepare for upcoming days!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayAppointments.map(renderAppointmentCard)}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-200 text-sky-600 rounded-xl shadow-sm border border-sky-50">
            <Clock size={24} />
          </div>
          Upcoming Appointments
        </h2>
        {upcomingAppointments.length === 0 ? (
          <div className="  p-16 rounded-2xl border border-slate-200 text-center shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <Clock className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-700 relative z-10 tracking-tight">No Upcoming Appointments</h3>
            <p className="text-slate-500 font-medium mt-2 text-lg relative z-10">Your future schedule is currently clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map(renderAppointmentCard)}
          </div>
        )}
      </div>

      {prescribingAppt && (
        <PrescriptionModal 
          appointment={prescribingAppt} 
          onClose={() => setPrescribingAppt(null)}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
