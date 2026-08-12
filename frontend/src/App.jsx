import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile/Profile.jsx';
import DoctorDirectory from './pages/DoctorDirectory/DoctorDirectory.jsx';
import BookAppointment from './pages/Appointments/BookAppointment.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard.jsx';
import PatientDashboard from './pages/Dashboard/PatientDashboard.jsx';
import PharmacyDashboard from './pages/Pharmacy/PharmacyDashboard.jsx';
import BillingDashboard from './pages/Billing/BillingDashboard.jsx';
import AdminAnalytics from './pages/Analytics/AdminAnalytics.jsx';
import SymptomChecker from './pages/Patient/SymptomChecker.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctor-directory" element={<DoctorDirectory />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/admin/pharmacy" element={<PharmacyDashboard />} />
          <Route path="/admin/billing" element={<BillingDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />

          <Route path="/doctor/schedule" element={<DoctorDashboard />} />

          <Route path="/patient/appointments" element={<PatientDashboard initialTab="appointments" />} />
          <Route path="/patient/records" element={<PatientDashboard initialTab="records" />} />
          <Route path="/patient/symptom-checker" element={<SymptomChecker />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
