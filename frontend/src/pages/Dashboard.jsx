import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/pharmacy');
    } else if (user?.role === 'DOCTOR') {
      navigate('/doctor/schedule');
    } else if (user?.role === 'PATIENT') {
      navigate('/patient/appointments');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="p-8 text-center text-gray-500">
      Loading your dashboard...
    </div>
  );
};

export default Dashboard;



