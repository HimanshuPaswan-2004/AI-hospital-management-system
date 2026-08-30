import { useState, useEffect } from 'react';
import { Pill, Calendar, Clock, User, Download, Bot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await patientService.getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error("Failed to fetch prescriptions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            My Prescriptions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View your active and past prescriptions.</p>
        </div>
        <Link
          to="/patient/ai-assistant/prescription-explainer"
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 rounded-xl font-bold transition-colors text-sm"
        >
          <Bot size={18} />
          Explain with AI
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No prescriptions found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((rx) => {
            const meds = typeof rx.medicines === 'string' ? JSON.parse(rx.medicines) : rx.medicines;
            return (
              <div key={rx.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full mb-3">
                      ID: {rx.id.substring(0, 8).toUpperCase()}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{rx.diagnosis}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar size={14} /> {dayjs(rx.datePrescribed).format('DD MMM YYYY')}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <User size={14} /> Dr. {rx.doctor?.firstName} {rx.doctor?.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medicines List */}
                <div className="p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Prescribed Medicines</h3>
                  {meds && meds.length > 0 ? meds.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Pill size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{med.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                            {med.dosage}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock size={12} /> {med.frequency}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar size={12} /> For {med.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No medicines listed.</p>
                  )}
                  {rx.instructions && (
                    <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                      <strong>Instructions:</strong> {rx.instructions}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => navigate('/patient/ai-assistant/prescription-explainer', { state: { prescriptionText: meds?.map(m => m.name).join(', ') } })}
                    className="w-full text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-2"
                  >
                    <Bot size={16} /> Have AI explain these medicines
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
