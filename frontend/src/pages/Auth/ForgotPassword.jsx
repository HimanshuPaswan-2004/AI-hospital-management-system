import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import axios from 'axios';
import loginIllustration from '../../assets/login_illustration.jpg';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/reset-password-direct`, { email, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Section */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-16 xl:px-24 relative">
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 xl:left-24">
          <Link to="/" className="flex items-center gap-2">
            <ShieldPlus className="text-blue-600 w-7 h-7" strokeWidth={2.5} />
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi<span className="text-blue-600">AI</span></span>
          </Link>
        </div>

        <div className="max-w-[420px] w-full mx-auto mt-16 lg:mt-0">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Reset Password</h1>
          <p className="text-slate-500 font-medium mb-8">Create a new password for your account</p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter your registered email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-10">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex w-[50%] bg-[#eef5fc] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Ambient Background */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>
        
        {/* Subtle Grid/Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a8a 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        {/* Image Container */}
        <div className="relative z-10 w-full max-w-2xl flex justify-center">
          <img
            src={loginIllustration}
            alt="Reset Password Illustration"
            className="w-full h-auto object-contain rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-8 ring-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
