import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Download, X } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: '',
    diagnosis: '',
    symptoms: '',
    notes: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
  });

  const fetchAppointments = async () => {
    try {
      const data = await doctorService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await doctorService.getPrescriptions();
        const formatted = data.map(rx => {
          let medCount = Array.isArray(rx.medicines) ? rx.medicines.length : 0;
          return {
            id: rx.id,
            patient: `${rx.patient.firstName} ${rx.patient.lastName}`,
            date: dayjs(rx.createdAt).format('DD MMM YYYY'),
            diagnosis: rx.diagnosis || 'N/A',
            medicines: `${medCount} Medicine${medCount !== 1 ? 's' : ''}`,
            initials: `${rx.patient.firstName[0]}${rx.patient.lastName[0]}`,
            color: 'bg-blue-100 text-blue-600'
          };
        });
        setPrescriptions(formatted);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
    fetchAppointments();
  }, []);

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      await doctorService.createPrescription(formData);
      setShowModal(false);
      // Refetch prescriptions
      const data = await doctorService.getPrescriptions();
      const formatted = data.map(rx => {
        let medCount = Array.isArray(rx.medicines) ? rx.medicines.length : 0;
        return {
          id: rx.id,
          patient: `${rx.patient.firstName} ${rx.patient.lastName}`,
          date: dayjs(rx.createdAt).format('DD MMM YYYY'),
          diagnosis: rx.diagnosis || 'N/A',
          medicines: `${medCount} Medicine${medCount !== 1 ? 's' : ''}`,
          initials: `${rx.patient.firstName[0]}${rx.patient.lastName[0]}`,
          color: 'bg-blue-100 text-blue-600'
        };
      });
      setPrescriptions(formatted);
      setFormData({
        appointmentId: '', diagnosis: '', symptoms: '', notes: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
      });
    } catch (error) {
      console.error("Failed to create prescription", error);
      alert("Failed to create prescription. Maybe one already exists for this appointment.");
    }
  };

  const handleMedChange = (index, field, value) => {
    const newMeds = [...formData.medicines];
    newMeds[index][field] = value;
    setFormData({ ...formData, medicines: newMeds });
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading prescriptions...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold transition-colors hover:bg-blue-700 shadow-sm text-sm"
        >
          <Plus size={18} />
          New Prescription
        </button>
      </div>

      {/* Filters */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search prescriptions..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-shadow"
        />
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnosis</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicines</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No prescriptions found.</td>
                </tr>
              )}
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${rx.color}`}>
                        {rx.initials}
                      </div>
                      <span className="font-bold text-slate-800">{rx.patient}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-600">{rx.date}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-600">{rx.diagnosis}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-600">{rx.medicines}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">New Prescription</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePrescription} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Appointment</label>
                  <select 
                    required
                    value={formData.appointmentId}
                    onChange={(e) => setFormData({...formData, appointmentId: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">-- Select Appointment --</option>
                    {appointments.map(apt => (
                      <option key={apt.id} value={apt.id}>
                        {dayjs(apt.appointmentDate).format('DD MMM')} - {apt.patient.firstName} {apt.patient.lastName} ({apt.reason})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Diagnosis</label>
                    <input 
                      type="text" required
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Symptoms</label>
                    <input 
                      type="text" required
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">Medicines</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, medicines: [...formData.medicines, { name: '', dosage: '', duration: '', instructions: '' }]})}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      + Add Medicine
                    </button>
                  </div>
                  {formData.medicines.map((med, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Name" required value={med.name} onChange={(e) => handleMedChange(index, 'name', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none" />
                      <input type="text" placeholder="Dosage" required value={med.dosage} onChange={(e) => handleMedChange(index, 'dosage', e.target.value)} className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none" />
                      <input type="text" placeholder="Duration" required value={med.duration} onChange={(e) => handleMedChange(index, 'duration', e.target.value)} className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Notes</label>
                  <textarea 
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
