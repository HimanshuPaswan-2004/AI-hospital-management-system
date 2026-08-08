import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Calendar, Clock, Activity, FileText, CheckCircle, Clock as ClockIcon, XCircle, FilePlus, Download } from 'lucide-react';

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
        axios.get('http://localhost:5000/api/appointments/my-appointments', { headers }),
        axios.get('http://localhost:5000/api/records/prescriptions', { headers }),
        axios.get('http://localhost:5000/api/records/reports', { headers })
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
      await axios.post('http://localhost:5000/api/records/reports', formData, {
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CONFIRMED': return <CheckCircle size={16} className="text-green-600" />;
      case 'CANCELLED': return <XCircle size={16} className="text-red-600" />;
      case 'COMPLETED': return <CheckCircle size={16} className="text-gray-600" />;
      default: return <ClockIcon size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
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
        <Link to="/doctor-directory" className="p-6 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Book Appointment</h3>
            <p className="text-blue-100 text-sm mt-1">Find a doctor and schedule a visit</p>
          </div>
          <Calendar size={32} className="opacity-80" />
        </Link>
        <button onClick={() => { setActiveTab('records'); navigate('/patient/records'); }} className="p-6 bg-purple-600 text-white rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center justify-between text-left">
          <div>
            <h3 className="font-bold text-lg">Medical Records</h3>
            <p className="text-purple-100 text-sm mt-1">View prescriptions & lab reports</p>
          </div>
          <FileText size={32} className="opacity-80" />
        </button>
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm opacity-60">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">AI Assistant</h3>
            <p className="text-gray-500 text-sm mt-1">Check symptoms (Coming Soon)</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`py-3 px-6 font-medium text-sm border-b-2 ${activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('appointments'); navigate('/patient/appointments'); }}
        >
          My Appointments
        </button>
        <button 
          className={`py-3 px-6 font-medium text-sm border-b-2 ${activeTab === 'records' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('records'); navigate('/patient/records'); }}
        >
          Medical Records
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : activeTab === 'appointments' ? (
        /* Appointments List */
        appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>You have no appointments booked yet.</p>
            <Link to="/doctor-directory" className="mt-4 inline-block text-blue-600 font-medium hover:underline">Find a Doctor</Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {appointments.map(app => (
                <li key={app.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                      {app.doctor.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Dr. {app.doctor.firstName} {app.doctor.lastName}</h4>
                      <p className="text-sm text-gray-500">{app.doctor.doctorProfile?.specialization || 'Doctor'}</p>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className={app.appointmentDate.split('T')[0] === today ? 'font-bold text-blue-600' : ''}>
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-300">•</span>
                        <Clock size={14} className="text-gray-400" />
                        <span>{app.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)} {app.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        /* Medical Records View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Prescriptions */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-purple-600" size={20} /> My Prescriptions
            </h3>
            {prescriptions.length === 0 ? (
              <p className="text-gray-500 text-sm">No prescriptions found.</p>
            ) : (
              <div className="space-y-4">
                {prescriptions.map(pres => (
                  <div key={pres.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Dr. {pres.doctor.firstName} {pres.doctor.lastName}</h4>
                        <p className="text-xs text-gray-500">{new Date(pres.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">Prescription</span>
                    </div>
                    {pres.diagnosis && (
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</span>
                        <p className="text-sm text-gray-800">{pres.diagnosis}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Medicines</span>
                      <ul className="mt-1 space-y-2">
                        {pres.medicines && pres.medicines.map((med, idx) => (
                          <li key={idx} className="bg-gray-50 p-2 rounded text-sm">
                            <span className="font-semibold">{med.name}</span> — {med.dosage} ({med.duration})
                            {med.instructions && <span className="block text-xs text-gray-500 mt-1">{med.instructions}</span>}
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
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-blue-600" size={20} /> Lab Reports
            </h3>
            
            {/* Upload Form */}
            <form onSubmit={handleUploadReport} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <FilePlus size={16} /> Upload New Report
              </h4>
              <input 
                type="text" 
                placeholder="Report Name (e.g., Blood Test)" 
                required 
                value={reportName}
                onChange={e => setReportName(e.target.value)}
                className="w-full text-sm border p-2 rounded"
              />
              <input 
                type="file" 
                required 
                onChange={e => setUploadFile(e.target.files[0])}
                className="w-full text-sm"
                accept=".pdf, .jpg, .jpeg, .png"
              />
              <button disabled={uploading} type="submit" className="bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload Report'}
              </button>
            </form>

            {/* List Reports */}
            {labReports.length === 0 ? (
              <p className="text-gray-500 text-sm">No lab reports uploaded.</p>
            ) : (
              <div className="space-y-3">
                {labReports.map(report => (
                  <div key={report.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{report.reportName}</h4>
                      <p className="text-xs text-gray-500">{new Date(report.dateUploaded).toLocaleDateString()}</p>
                    </div>
                    <a 
                      href={`http://localhost:5000${report.fileUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
