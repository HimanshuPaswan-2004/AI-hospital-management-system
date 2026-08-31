import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { MoreVertical, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const tabs = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

  const fetchAppointments = async () => {
    try {
      const data = await adminService.getAppointments();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openStatusModal = (apt) => {
    setSelectedAppt(apt);
    setNewStatus(apt.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateAppointmentStatus(selectedAppt.id, newStatus);
      setIsModalOpen(false);
      fetchAppointments();
    } catch(err) {
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return apt.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return apt.status === 'CANCELLED';
    if (activeTab === 'Today') {
       const today = new Date().toISOString().split('T')[0];
       return new Date(apt.appointmentDate).toISOString().split('T')[0] === today;
    }
    if (activeTab === 'Upcoming') {
       const today = new Date().toISOString().split('T')[0];
       return new Date(apt.appointmentDate).toISOString().split('T')[0] > today;
    }
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">Appointments Management</h1>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => {
                let statusBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
                if(apt.status === 'CONFIRMED') statusBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
                if(apt.status === 'COMPLETED') statusBg = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
                if(apt.status === 'CANCELLED') statusBg = 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';

                return (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {new Date(apt.appointmentDate).toLocaleDateString()} {apt.timeSlot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-white">{apt.patient?.firstName} {apt.patient?.lastName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {apt.doctor?.doctorProfile?.specialization || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      Consultation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => openStatusModal(apt)} className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="text-center p-4">No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      {isModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Update Appointment Status</h2>
            <div className="mb-4 text-slate-600 dark:text-slate-300">
              <p><strong>Patient:</strong> {selectedAppt.patient?.firstName} {selectedAppt.patient?.lastName}</p>
              <p><strong>Date:</strong> {new Date(selectedAppt.appointmentDate).toLocaleDateString()} {selectedAppt.timeSlot}</p>
            </div>
            
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
