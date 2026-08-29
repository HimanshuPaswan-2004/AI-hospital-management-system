import { Pill, Calendar, Clock, User, Download, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Prescriptions = () => {
  // Mock data for UI demonstration
  const mockPrescriptions = [
    {
      id: 'RX-7890',
      date: 'Aug 28, 2026',
      doctor: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      diagnosis: 'Mild Hypertension',
      medicines: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '90 days' }
      ]
    },
    {
      id: 'RX-7891',
      date: 'Jul 15, 2026',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      diagnosis: 'Seasonal Allergies',
      medicines: [
        { name: 'Cetirizine', dosage: '10mg', frequency: 'As needed', duration: '14 days' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-600" />
            My Prescriptions
          </h1>
          <p className="text-slate-500 text-sm mt-1">View your active and past prescriptions.</p>
        </div>
        <Link 
          to="/patient/ai-assistant/prescription-explainer"
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold transition-colors text-sm"
        >
          <Bot size={18} />
          Explain with AI
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPrescriptions.map((rx) => (
          <div key={rx.id} className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full mb-3">
                  ID: {rx.id}
                </span>
                <h2 className="text-lg font-bold text-slate-800">{rx.diagnosis}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar size={14} /> {rx.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <User size={14} /> {rx.doctor}
                  </span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Download size={20} />
              </button>
            </div>

            {/* Medicines List */}
            <div className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Prescribed Medicines</h3>
              {rx.medicines.map((med, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Pill size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5">
                      <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                        {med.dosage}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} /> {med.frequency}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={12} /> For {med.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100">
               <Link to={`/patient/ai-assistant/prescription-explainer?query=${rx.medicines.map(m=>m.name).join(',')}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2">
                 <Bot size={16} /> Have AI explain these medicines
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prescriptions;
