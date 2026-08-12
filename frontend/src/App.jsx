import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/Profile';
import DoctorDirectory from './pages/DoctorDirectory/DoctorDirectory';
import BookAppointment from './pages/Appointments/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import PharmacyDashboard from './pages/Pharmacy/PharmacyDashboard';
import BillingDashboard from './pages/Billing/BillingDashboard';
import AdminAnalytics from './pages/Analytics/AdminAnalytics';
import SymptomChecker from './pages/Patient/SymptomChecker';
import ForgotPassword from './pages/Auth/ForgotPassword';

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
