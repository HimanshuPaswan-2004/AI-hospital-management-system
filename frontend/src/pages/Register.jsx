import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import doctorIllustration from '../assets/doctor_illustration.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT'
  });
  
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agree) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    const payload = {
      firstName: formData.firstName || formData.fullName?.split(' ')[0] || 'User',
      lastName: formData.lastName || formData.fullName?.split(' ').slice(1).join(' ') || '.',
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone || ''
    };

    const success = await register(payload);
    if (success) {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Section */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative overflow-y-auto">
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 xl:left-24">
          <Link to="/" className="flex items-center gap-2">
            <ShieldPlus className="text-blue-600 w-7 h-7" strokeWidth={2.5} />
            <span className="text-xl font-bold text-slate-800 tracking-tight">Medi<span className="text-blue-600">AI</span></span>
          </Link>
        </div>

        <div className="max-w-[460px] w-full mx-auto mt-16 lg:mt-0">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Create Your Account</h1>
          <p className="text-slate-500 font-medium mb-8">Join MediAI today</p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                    placeholder="Create a password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 appearance-none"
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="pt-2 pb-4">
              <button
                type="button"
                onClick={() => setAgree(!agree)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {agree ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-300" />}
                I agree to the <span className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-2">Terms & Conditions</span>.
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex w-[50%] bg-blue-50/50 p-12 items-center justify-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
         
         <div className="relative z-10 max-w-lg w-full aspect-square bg-gradient-to-b from-blue-100 to-transparent rounded-[3rem] border border-white/50 shadow-2xl flex items-center justify-center overflow-hidden">
            <img 
               src={doctorIllustration} 
               alt="Doctor Illustration" 
               className="w-full h-full object-cover mix-blend-multiply opacity-90"
            />
            
            <div className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Quick Registration</p>
                <p className="text-[10px] font-medium text-slate-500">Takes 2 minutes</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Register;
