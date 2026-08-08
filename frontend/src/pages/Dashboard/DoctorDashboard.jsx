import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Calendar, Clock, User, Check, X, CheckCircle, AlertCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/appointments/schedule', {
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
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      // Refresh the schedule
      fetchSchedule();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update appointment status.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(app => app.appointmentDate.split('T')[0] === today);
  const upcomingAppointments = appointments.filter(app => app.appointmentDate.split('T')[0] > today);

  const renderAppointmentCard = (app) => (
    <div key={app.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            {app.patient.firstName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{app.patient.firstName} {app.patient.lastName}</h4>
            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={14} /> 
              {new Date(app.appointmentDate).toLocaleDateString()}
              <span className="mx-1">•</span>
              <Clock size={14} />
              {app.timeSlot}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
          app.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
          'bg-red-100 text-red-700'
        }`}>
          {app.status}
        </span>
      </div>
      
      {app.reason && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
          <span className="font-semibold text-gray-700 block mb-1">Reason for visit:</span>
          {app.reason}
        </div>
      )}

      {app.status === 'PENDING' && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
          <button 
            onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          >
            <Check size={16} /> Approve
          </button>
          <button 
            onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          >
            <X size={16} /> Decline
          </button>
        </div>
      )}
      {app.status === 'CONFIRMED' && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
           <button 
            onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          >
            <CheckCircle size={16} /> Mark Completed
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (error) return <div className="p-8 text-center text-red-500"><AlertCircle className="mx-auto mb-2" />{error}</div>;

  return (
    <div className="space-y-8">
      {/* Today's Schedule */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-blue-600" /> Today's Schedule
        </h2>
        {todayAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayAppointments.map(renderAppointmentCard)}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="text-blue-600" /> Upcoming Appointments
        </h2>
        {upcomingAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
            No upcoming appointments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map(renderAppointmentCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
