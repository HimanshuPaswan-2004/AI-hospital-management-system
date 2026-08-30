import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ loading: false, error: null, success: false });

  // In a real app, we would fetch the doctor details specifically.
  // For now, we'll fetch all doctors and find this one.
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/doctors', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const doc = res.data.find(d => d.id === doctorId);
        if (doc) setDoctor(doc);
      } catch (error) {
        console.error('Error fetching doctor info', error);
      }
    };
    if (user?.token) fetchDoctorInfo();
  }, [doctorId, user]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      try {
        setLoadingSlots(true);
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments/slots', {
          headers: { Authorization: `Bearer ${user?.token}` },
          params: { doctorId, date: selectedDate }
        });
        setAvailableSlots(res.data.availableSlots || []);
        setSelectedSlot(''); // Reset selected slot when date changes
      } catch (error) {
        console.error('Error fetching slots', error);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchSlots();
  }, [selectedDate, doctorId, user]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    try {
      setBookingStatus({ loading: true, error: null, success: false });
      
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments', {
        doctorId,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reason
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setBookingStatus({ loading: false, error: null, success: true });
      
      // Navigate away after a short delay
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
      
    } catch (error) {
      setBookingStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to book appointment', 
        success: false 
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Book Appointment</h1>
        <p className="text-gray-500 dark:text-slate-400">Select a date and time to schedule your visit.</p>
      </div>

      {bookingStatus.success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 p-8 rounded-xl text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-300">Appointment Confirmed!</h2>
          <p>Your appointment has been successfully booked.</p>
          <p className="mt-2 text-sm text-green-600 dark:text-green-500">Redirecting to your appointments...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          {doctor && (
            <div className="bg-teal-50 dark:bg-teal-900/20 p-6 border-b border-teal-100 dark:border-teal-900/30 flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-600 dark:bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase shrink-0 shadow-sm">
                {doctor.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dr. {doctor.firstName} {doctor.lastName}</h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium">{doctor.profile?.specialization}</p>
                <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">Consultation Fee: ${doctor.profile?.consultationFee}</div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {bookingStatus.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <span>{bookingStatus.error}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-teal-600 dark:text-teal-400" /> Select Date
                </h3>
                <input 
                  type="date" 
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full md:w-1/2 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-teal-500 dark:focus:border-teal-600 transition-colors"
                  required
                />
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-teal-600 dark:text-teal-400" /> Select Time Slot
                  </h3>
                  
                  {loadingSlots ? (
                    <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600 dark:border-teal-400"></div>
                      Checking availability...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">No slots available on this date. Please choose another date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                            selectedSlot === slot 
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reason Input */}
              {selectedSlot && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-teal-600 dark:text-teal-400" /> Reason for Visit (Optional)
                  </h3>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for consultation..."
                    className="w-full p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-teal-500 dark:focus:border-teal-600 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                    rows="3"
                  ></textarea>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={!selectedDate || !selectedSlot || bookingStatus.loading}
                  className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {bookingStatus.loading ? 'Processing...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
