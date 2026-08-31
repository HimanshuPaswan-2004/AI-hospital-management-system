import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';

import LandingPage from './pages/LandingPage.jsx';
import NotFound from './pages/NotFound.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import useThemeStore from './store/themeStore.js';
import { useEffect } from 'react';

// Core Dashboard Pages
import PatientDashboard from './pages/Dashboard/PatientDashboard.jsx';
import Profile from './pages/Profile/Profile.jsx';

import Appointments from './pages/Patient/Appointments.jsx';
import MedicalRecords from './pages/Patient/MedicalRecords.jsx';
import Settings from './pages/Patient/Settings.jsx';
import Prescriptions from './pages/Patient/Prescriptions.jsx';
import HealthSummary from './pages/Patient/HealthSummary.jsx';
import Messages from './pages/Patient/Messages.jsx';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorPatients from './pages/Doctor/DoctorPatients.jsx';
import DoctorSchedule from './pages/Doctor/DoctorSchedule.jsx';
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions.jsx';
import DoctorReports from './pages/Doctor/DoctorReports.jsx';
import DoctorAIAssistant from './pages/Doctor/DoctorAIAssistant.jsx';
import DoctorMessages from './pages/Doctor/DoctorMessages.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import DoctorSettings from './pages/Doctor/DoctorSettings.jsx';

// AI Assistant Suite
import AIAssistantHome from './pages/Patient/AIAssistantHome.jsx';
import AISymptomChecker from './pages/Patient/AISymptomChecker.jsx';
import AIReportSummarizer from './pages/Patient/AIReportSummarizer.jsx';
import AIPrescriptionExplainer from './pages/Patient/AIPrescriptionExplainer.jsx';
import AIChatbot from './pages/Patient/AIChatbot.jsx';
import AIDoctorRecommendation from './pages/Patient/AIDoctorRecommendation.jsx';
import AIAppointmentAssistant from './pages/Patient/AIAppointmentAssistant.jsx';

// Other existing pages (keeping for now to avoid breaking)
import DoctorDirectory from './pages/DoctorDirectory/DoctorDirectory.jsx';
import BookAppointment from './pages/Appointments/BookAppointment.jsx';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import AdminDoctors from './pages/Admin/AdminDoctors.jsx';
import AdminPatients from './pages/Admin/AdminPatients.jsx';
import AdminAppointments from './pages/Admin/AdminAppointments.jsx';
import AdminDepartments from './pages/Admin/AdminDepartments.jsx';
import AdminInventory from './pages/Admin/AdminInventory.jsx';
import AdminPrescriptions from './pages/Admin/AdminPrescriptions.jsx';
import AdminBilling from './pages/Admin/AdminBilling.jsx';
import AdminReports from './pages/Admin/AdminReports.jsx';
import AdminMessages from './pages/Admin/AdminMessages.jsx';
import AdminSettings from './pages/Admin/AdminSettings.jsx';
import AdminAuditLogs from './pages/Admin/AdminAuditLogs.jsx';


function App() {
  const { initTheme, theme } = useThemeStore();
  
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Patient Routes inside MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/records" element={<MedicalRecords />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />
          <Route path="/patient/health-summary" element={<HealthSummary />} />
          <Route path="/patient/messages" element={<Messages />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/patient/settings" element={<Settings />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          <Route path="/doctor/reports" element={<DoctorReports />} />
          <Route path="/doctor/ai-assistant" element={<DoctorAIAssistant />} />
          <Route path="/doctor/messages" element={<DoctorMessages />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />

          {/* AI Assistant Suite */}
          <Route path="/patient/ai-assistant" element={<AIAssistantHome />} />
          <Route path="/patient/ai-assistant/symptom-checker" element={<AISymptomChecker />} />
          <Route path="/patient/ai-assistant/report-summarizer" element={<AIReportSummarizer />} />
          <Route path="/patient/ai-assistant/prescription-explainer" element={<AIPrescriptionExplainer />} />
          <Route path="/patient/ai-assistant/chatbot" element={<AIChatbot />} />
          <Route path="/patient/ai-assistant/doctor-recommendation" element={<AIDoctorRecommendation />} />
          <Route path="/patient/ai-assistant/appointment-assistant" element={<AIAppointmentAssistant />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
          <Route path="/admin/billing" element={<AdminBilling />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />

          {/* Fallback for legacy routes if needed */}
          <Route path="/doctor-directory" element={<DoctorDirectory />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />

          <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
        </Route>
        
        {/* Global Fallback for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
