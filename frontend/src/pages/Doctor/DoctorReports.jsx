import { Search, Filter, Download } from 'lucide-react';

const mockReports = [
  { id: 'REP1', name: 'Complete Blood Count', patient: 'Robert Williams', date: '15 May 2024', type: 'Lab Report' },
  { id: 'REP2', name: 'Lipid Profile', patient: 'Emily Davis', date: '18 May 2024', type: 'Lab Report' },
  { id: 'REP3', name: 'Thyroid Profile', patient: 'Michael Brown', date: '17 May 2024', type: 'Lab Report' },
  { id: 'REP4', name: 'Blood Sugar Fasting', patient: 'Jessica Miller', date: '15 May 2024', type: 'Lab Report' },
  { id: 'REP5', name: 'Liver Function Test', patient: 'William Jones', date: '14 May 2024', type: 'Lab Report' },
];

const DoctorReports = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm shadow-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search reports..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-shadow shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Report Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group bg-white">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800">{report.name}</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500">{report.patient}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500">{report.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
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

export default DoctorReports;
