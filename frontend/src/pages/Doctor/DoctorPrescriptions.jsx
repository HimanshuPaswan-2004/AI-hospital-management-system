import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Download } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading prescriptions...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold transition-colors hover:bg-blue-700 shadow-sm text-sm">
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
    </div>
  );
};

export default DoctorPrescriptions;
