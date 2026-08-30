import { useState, useEffect } from 'react';
import { Search, FileText, Image, File, UploadCloud, X } from 'lucide-react';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const data = await patientService.getLabReports();
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('report', uploadFile);

      await patientService.uploadLabReport(formData);
      setIsUploading(false);
      setUploadFile(null);
      setUploadTitle('');
      fetchRecords(); // Refresh list
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload report");
    }
  };
  const filteredRecords = records.filter(r => (r.title || '').toLowerCase().includes(search.toLowerCase()));

  const getIcon = (type) => {
    if (type && type.includes('image')) return <Image size={18} className="text-blue-500 dark:text-blue-400" />;
    return <FileText size={18} className="text-rose-500 dark:text-rose-400" />;
  };
  const getBg = (type) => {
    if (type && type.includes('image')) return 'bg-blue-50 dark:bg-blue-900/30';
    return 'bg-rose-50 dark:bg-rose-900/30';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Medical Records</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsUploading(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            Upload New
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 relative">
          <button onClick={() => setIsUploading(false)} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold mb-4 dark:text-white">Upload Lab Report</h2>
          <form onSubmit={handleUpload} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Report Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-lg text-sm"
                placeholder="e.g. Blood Test - Aug 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">File</label>
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
                className="w-full text-sm"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">
              Upload Report
            </button>
          </form>
        </div>
      )}

      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading medical records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No medical records found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Record</th>
                  <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 sm:px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  return (
                    <tr key={record.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBg(record.reportType)}`}>
                            {getIcon(record.reportType)}
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white">{record.title}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:px-6 py-4">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{dayjs(record.dateUploaded).format('DD MMM YYYY')}</span>
                      </td>
                      <td className="p-4 sm:px-6 py-4">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{record.reportType ? record.reportType.split('/')[1]?.toUpperCase() || 'DOCUMENT' : 'DOCUMENT'}</span>
                      </td>
                      <td className="p-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <a href={`http://localhost:5000${record.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                            View
                          </a>
                          <button
                            onClick={() => navigate('/patient/ai-assistant/report-summarizer', { state: { reportTitle: record.title } })}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            AI Summarize
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
