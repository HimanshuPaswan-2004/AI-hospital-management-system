import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { X, Plus, Trash2 } from 'lucide-react';

const PrescriptionModal = ({ appointment, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      // Filter out empty medicines
      const validMedicines = medicines.filter(m => m.name.trim() !== '');
      
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/records/prescriptions', {
        appointmentId: appointment.id,
        symptoms,
        diagnosis,
        notes,
        medicines: validMedicines
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Write Prescription for {appointment.patient.firstName}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <textarea 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500" 
                rows="2"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="E.g., Fever, Headache"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea 
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500" 
                rows="2"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                placeholder="E.g., Viral Infection"
              ></textarea>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Medicines</label>
              <button 
                type="button" 
                onClick={handleAddMedicine}
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800"
              >
                <Plus size={16} /> Add Medicine
              </button>
            </div>
            
            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                    <input type="text" placeholder="Medicine Name (e.g. Paracetamol)" className="p-2 text-sm border rounded" required value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)} />
                    <input type="text" placeholder="Dosage (e.g. 1-0-1)" className="p-2 text-sm border rounded" required value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)} />
                    <input type="text" placeholder="Duration (e.g. 5 Days)" className="p-2 text-sm border rounded" required value={med.duration} onChange={e => handleMedicineChange(index, 'duration', e.target.value)} />
                    <input type="text" placeholder="Instructions" className="p-2 text-sm border rounded" value={med.instructions} onChange={e => handleMedicineChange(index, 'instructions', e.target.value)} />
                  </div>
                  {medicines.length > 1 && (
                    <button type="button" onClick={() => handleRemoveMedicine(index)} className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-blue-500" 
              rows="2"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Rest well, drink plenty of fluids..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
