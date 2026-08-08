import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Calendar, Clock, Activity, FileText, CheckCircle, Clock as ClockIcon, XCircle } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        setLoading(true);
        // Note: For this quick setup we reuse the doctor schedule API by creating a generic one, 
        // OR we can just fetch all appointments and filter by patientId for now if we didn't build a patient specific API.
        // Let's create a quick API fetch for Patient's appointments. We haven't created the patient API yet.
        // I will temporarily fetch them directly or via a new endpoint. 
        const res = await axios.get('http://localhost:5000/api/appointments/my-appointments', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchMyAppointments();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CONFIRMED': return <CheckCircle size={16} className="text-green-600" />;
      case 'CANCELLED': return <XCircle size={16} className="text-red-600" />;
      case 'COMPLETED': return <CheckCircle size={16} className="text-gray-600" />;
      default: return <ClockIcon size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/doctor-directory" className="p-6 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Book Appointment</h3>
            <p className="text-blue-100 text-sm mt-1">Find a doctor and schedule a visit</p>
          </div>
          <Calendar size={32} className="opacity-80" />
        </Link>
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm opacity-60">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Medical Records</h3>
            <p className="text-gray-500 text-sm mt-1">View lab reports (Coming Soon)</p>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm opacity-60">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">AI Assistant</h3>
            <p className="text-gray-500 text-sm mt-1">Check symptoms (Coming Soon)</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-blue-600" /> My Appointments
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>You have no appointments booked yet.</p>
            <Link to="/doctor-directory" className="mt-4 inline-block text-blue-600 font-medium hover:underline">Find a Doctor</Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {appointments.map(app => (
                <li key={app.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                      {app.doctor.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. {app.doctor.firstName} {app.doctor.lastName}</h4>
                      <p className="text-sm text-gray-500">{app.doctor.doctorProfile?.specialization || 'Doctor'}</p>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className={app.appointmentDate.split('T')[0] === today ? 'font-bold text-blue-600' : ''}>
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-300">•</span>
                        <Clock size={14} className="text-gray-400" />
                        <span>{app.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)} {app.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
