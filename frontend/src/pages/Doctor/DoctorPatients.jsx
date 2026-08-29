import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await doctorService.getPatients();
        const formatted = data.map(p => {
          // Calculate age if DOB exists
          let age = 'N/A';
          if (p.patientProfile?.dateOfBirth) {
            age = dayjs().diff(dayjs(p.patientProfile.dateOfBirth), 'year');
          }

          return {
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            age,
            gender: p.patientProfile?.gender || 'Unknown',
            lastVisit: dayjs(p.lastVisit).format('DD MMM YYYY'),
            initials: `${p.firstName[0]}${p.lastName[0]}`,
            color: 'bg-blue-100 text-blue-600'
          };
        });
        setPatients(formatted);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading patients...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold transition-colors hover:bg-blue-700 shadow-sm text-sm">
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-shadow"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500">No patients found.</div>
        )}
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-6 flex items-center justify-between hover:border-blue-100 transition-colors cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${patient.color}`}>
                {patient.initials}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{patient.age} Years, {patient.gender}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">ID: {patient.id}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">Last Visit</p>
              <p className="text-sm font-bold text-slate-700 mt-1">{patient.lastVisit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPatients;
