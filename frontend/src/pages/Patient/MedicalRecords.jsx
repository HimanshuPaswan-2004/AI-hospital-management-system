import { Search, FileText, Image, File } from 'lucide-react';

const MedicalRecords = () => {
  const records = [
    { id: 1, name: 'Blood Test Report', date: '28 Aug 2024', type: 'PDF', icon: FileText, action: 'AI Summarize', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 2, hoverName: 'X-Ray Chest', name: 'X-Ray Chest', date: '15 Aug 2024', type: 'Image', icon: Image, action: 'AI Summarize', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, name: 'Prescription', date: '10 Aug 2024', type: 'PDF', icon: File, action: 'AI Explain', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 4, name: 'MRI Scan', date: '05 Aug 2024', type: 'Image', icon: Image, action: 'AI Summarize', color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Medical Records</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Record</th>
                <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const Icon = record.icon;
                return (
                  <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.bg}`}>
                          <Icon size={18} className={record.color} />
                        </div>
                        <span className="font-bold text-slate-800">{record.name}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600">{record.date}</span>
                    </td>
                    <td className="p-4 sm:px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600">{record.type}</span>
                    </td>
                    <td className="p-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                          View
                        </button>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          {record.action}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
