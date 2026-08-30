import { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import dayjs from 'dayjs';

const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await doctorService.getReports();
        const formatted = data.map(report => ({
          id: report.id,
          name: report.reportName,
          patient: `${report.patient.firstName} ${report.patient.lastName}`,
          date: dayjs(report.dateUploaded).format('DD MMM YYYY'),
          type: 'Lab Report',
          fileUrl: report.fileUrl
        }));
        setReports(formatted);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading reports...</div>;
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 transition-colors text-sm shadow-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search reports..."
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-shadow shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Report Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">No reports found.</td>
                </tr>
              )}
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50/50 transition-colors group bg-white dark:bg-slate-800">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 dark:text-white">{report.name}</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">{report.patient}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">{report.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {report.fileUrl && (
                      <a href={`http://localhost:5000/${report.fileUrl}`} target="_blank" rel="noreferrer" className="inline-block p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </a>
                    )}
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
