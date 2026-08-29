import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Calendar, Clock, Activity, FileText, CheckCircle, Clock as ClockIcon, XCircle, FilePlus, Download, Sparkles, Trash2 } from 'lucide-react';

const PatientDashboard = ({ initialTab = 'appointments' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update local state if the route changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [reportName, setReportName] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${user?.token}` };

      const [appRes, presRes, labRes] = await Promise.all([
        axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments/my-appointments', { headers }),
        axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/records/prescriptions', { headers }),
        axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/records/reports', { headers })
      ]);

      setAppointments(appRes.data);
      setPrescriptions(presRes.data);
      setLabReports(labRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user]);

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert('Please select a file to upload');

    const formData = new FormData();
    formData.append('report', uploadFile);
    formData.append('reportName', reportName);

    try {
      setUploading(true);
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/records/reports', formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      alert('Report uploaded successfully');
      setUploadFile(null);
      setReportName('');
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to upload report');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/records/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert('Report deleted successfully');
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to delete report');
      console.error(error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle size={16} className="text-green-600" />;
      case 'CANCELLED': return <XCircle size={16} className="text-red-600" />;
      case 'COMPLETED': return <CheckCircle size={16} className="text-gray-600" />;
      default: return <ClockIcon size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/doctor-directory" className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div>
            <h3 className="font-bold text-lg tracking-tight">Book Appointment</h3>
            <p className="text-teal-100 text-sm mt-1">Find a doctor and schedule a visit</p>
          </div>
          <Calendar size={32} className="opacity-80 group-hover:scale-110 transition-transform duration-300" />
        </Link>
        <button onClick={() => { setActiveTab('records'); navigate('/patient/records'); }} className="p-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between text-left group">
          <div>
            <h3 className="font-bold text-lg tracking-tight">Medical Records</h3>
            <p className="text-emerald-100 text-sm mt-1">View prescriptions & lab reports</p>
          </div>
          <FileText size={32} className="opacity-80 group-hover:scale-110 transition-transform duration-300" />
        </button>
        <Link to="/patient/symptom-checker" className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32  rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
              AI Assistant <span className="text-[10px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </h3>
            <p className="text-orange-100 text-sm mt-1">Check your symptoms instantly</p>
          </div>
          <Sparkles size={32} className="opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Tabs */}
        <div className="flex   p-1.5 rounded-2xl border border-slate-200 shadow-sm w-max animate-[fadeInUp_0.4s_ease-out]">
          <button
            className={`py-2.5 px-6 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'appointments' ? 'bg-white text-teal-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)]' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:'}`}
            onClick={() => { setActiveTab('appointments'); navigate('/patient/appointments'); }}
          >
            My Appointments
          </button>
          <button
            className={`py-2.5 px-6 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'records' ? 'bg-white text-teal-600 shadow-[0_2px_10px_rgb(0,0,0,0.06)]' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:'}`}
            onClick={() => { setActiveTab('records'); navigate('/patient/records'); }}
          >
            Medical Records
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-100 border-t-blue-600"></div></div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 bg-rose-50 rounded-3xl font-bold border border-rose-100"><XCircle className="mx-auto mb-3 h-10 w-10" />{error}</div>
        ) : activeTab === 'appointments' ? (
          appointments.length === 0 ? (
            <div className="pro-card p-16 rounded-2xl text-center shadow-sm border border-slate-200 relative overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 pointer-events-none"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm relative z-10">
                <Calendar className="h-10 w-10 text-teal-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2 relative z-10">No Appointments Yet</h3>
              <p className="text-slate-500 font-medium mb-8 relative z-10">Ready to prioritize your health? Find a specialist today.</p>
              <Link to="/doctor-directory" className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300">
                <Sparkles size={18} />
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeInUp_0.3s_ease-out]">
              {appointments.map(app => (
                <div key={app.id} className="pro-card rounded-2xl p-6 flex flex-col group hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6 gap-3">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-teal-600 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform">
                        {app.doctor.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-lg truncate group-hover:text-teal-600 transition-colors">Dr. {app.doctor.firstName} {app.doctor.lastName}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{app.doctor.doctorProfile?.specialization || 'Doctor'}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border ${getStatusColor(app.status)} border-opacity-50`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="mt-auto bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <div className="p-2 bg-teal-50 text-teal-500 rounded-lg"><Calendar size={16} /></div>
                      <span className={app.appointmentDate.split('T')[0] === today ? 'font-bold text-teal-600' : ''}>
                        {new Date(app.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600 mt-2">
                      <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Clock size={16} /></div>
                      <span>{app.timeSlot}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Medical Records View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeInUp_0.4s_ease-out]">
            {/* Prescriptions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <FileText size={24} />
                </div>
                My Prescriptions
              </h3>
              {prescriptions.length === 0 ? (
                <div className="pro-card p-12 rounded-2xl text-center border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-slate-400 h-8 w-8" />
                  </div>
                  <p className="text-slate-500 font-medium">No prescriptions found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {prescriptions.map(pres => (
                    <div key={pres.id} className="pro-card p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                            {pres.doctor.firstName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Dr. {pres.doctor.firstName} {pres.doctor.lastName}</h4>
                            <p className="text-xs font-medium text-slate-500">{new Date(pres.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">Prescription</span>
                      </div>
                      {pres.diagnosis && (
                        <div className="mb-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Diagnosis</span>
                          <p className="text-sm font-medium text-slate-700">{pres.diagnosis}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 ml-1">Medicines</span>
                        <ul className="mt-1 space-y-3">
                          {pres.medicines && pres.medicines.map((med, idx) => (
                            <li key={idx} className=" p-4 rounded-xl text-sm border border-slate-100 shadow-sm flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-base">{med.name}</span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{med.duration}</span>
                              </div>
                              <span className="text-slate-600 font-medium">{med.dosage}</span>
                              {med.instructions && <span className="block text-xs font-medium text-slate-400 mt-1 bg-slate-50 p-2 rounded-lg">{med.instructions}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lab Reports */}
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
                <div className="p-2.5 bg-teal-100 text-teal-600 rounded-xl">
                  <Activity size={24} />
                </div>
                Lab Reports
              </h3>

              {/* Upload Form */}
              <form onSubmit={handleUploadReport} className="pro-card p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full mix-blend-multiply filter blur-2xl opacity-60 pointer-events-none"></div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 relative z-10">
                  <FilePlus size={18} className="text-teal-500" /> Upload New Report
                </h4>
                <input
                  type="text"
                  placeholder="Report Name (e.g., Blood Test)"
                  required
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  className="w-full text-sm font-medium border-2 border-slate-100 p-3 rounded-xl bg-white/50 focus:bg-white focus:outline-none focus:border-teal-400 transition-colors relative z-10"
                />
                <div className="relative z-10">
                  <input
                    type="file"
                    required
                    onChange={e => setUploadFile(e.target.files[0])}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 transition-colors"
                    accept=".pdf, .jpg, .jpeg, .png"
                  />
                </div>
                <button disabled={uploading} type="submit" className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 relative z-10">
                  {uploading ? 'Uploading...' : 'Upload Report'}
                </button>
              </form>

              {/* List Reports */}
              {labReports.length === 0 ? (
                <div className="pro-card p-12 rounded-2xl text-center border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-slate-400 h-8 w-8" />
                  </div>
                  <p className="text-slate-500 font-medium">No lab reports uploaded.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {labReports.map(report => (
                    <div key={report.id} className="pro-card p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 text-teal-500 rounded-xl group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{report.reportName}</h4>
                          <p className="text-xs font-medium text-slate-500">{new Date(report.dateUploaded).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${report.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
