import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';

import LandingPage from './pages/LandingPage.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';

// Core Dashboard Pages
import PatientDashboard from './pages/Dashboard/PatientDashboard.jsx';
import Profile from './pages/Profile/Profile.jsx';

// New Patient Pages
import Appointments from './pages/Patient/Appointments.jsx';
import MedicalRecords from './pages/Patient/MedicalRecords.jsx';

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

// Dummy Settings component if it doesn't exist
const DummySettings = () => <div className="p-6">Settings Placeholder</div>;

function App() {
  return (
    <Router>
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
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/patient/settings" element={<DummySettings />} />

          {/* AI Assistant Suite */}
          <Route path="/patient/ai-assistant" element={<AIAssistantHome />} />
          <Route path="/patient/ai-assistant/symptom-checker" element={<AISymptomChecker />} />
          <Route path="/patient/ai-assistant/report-summarizer" element={<AIReportSummarizer />} />
          <Route path="/patient/ai-assistant/prescription-explainer" element={<AIPrescriptionExplainer />} />
          <Route path="/patient/ai-assistant/chatbot" element={<AIChatbot />} />
          <Route path="/patient/ai-assistant/doctor-recommendation" element={<AIDoctorRecommendation />} />
          <Route path="/patient/ai-assistant/appointment-assistant" element={<AIAppointmentAssistant />} />

          {/* Fallback for legacy routes if needed */}
          <Route path="/doctor-directory" element={<DoctorDirectory />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          
          <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
