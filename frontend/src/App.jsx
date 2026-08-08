import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/Profile';
import DoctorDirectory from './pages/DoctorDirectory/DoctorDirectory';
import BookAppointment from './pages/Appointments/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctor-directory" element={<DoctorDirectory />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/admin/users" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/admin/reports" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/admin/settings" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/doctor/appointments" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/doctor/patients" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/doctor/prescriptions" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/patient/appointments" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/patient/records" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/patient/medicines" element={<Dashboard />} /> {/* Placeholder */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
