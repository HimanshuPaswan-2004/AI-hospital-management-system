import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Activity, UserPlus, Mail, Lock, User, HeartPulse } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  });

  const { firstName, lastName, email, password, role } = formData;
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message, register, reset } = useAuthStore();

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    reset();
  }, [user, isError, isSuccess, message, navigate, reset]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    register({ firstName, lastName, email, password, role });
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto bg-white border-r border-slate-200 custom-scrollbar">
        <div className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-slate-500 font-medium z-10">
          Already have an account? 
          <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
            Sign In
          </Link>
        </div>

        <div className="w-full max-w-md my-12 z-10">
          <div className="mb-10 text-center lg:text-left mt-8 md:mt-0">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white mb-6 shadow-sm">
              <HeartPulse size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join MediAI</h2>
            <p className="text-slate-500 mt-2 font-medium">Create your account to start managing healthcare intelligently.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                    placeholder="John"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Last Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                    placeholder="Doe"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                  placeholder="you@example.com"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Account Type</label>
              <div className="grid grid-cols-3 gap-4">
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'PATIENT' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="PATIENT" checked={role === 'PATIENT'} onChange={onChange} className="sr-only" />
                  <HeartPulse size={24} className={role === 'PATIENT' ? 'text-primary-600' : ''} />
                  <span className="font-bold text-sm">Patient</span>
                </label>
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'DOCTOR' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="DOCTOR" checked={role === 'DOCTOR'} onChange={onChange} className="sr-only" />
                  <Activity size={24} className={role === 'DOCTOR' ? 'text-primary-600' : ''} />
                  <span className="font-bold text-sm">Doctor</span>
                </label>
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'ADMIN' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="ADMIN" checked={role === 'ADMIN'} onChange={onChange} className="sr-only" />
                  <User size={24} className={role === 'ADMIN' ? 'text-primary-600' : ''} />
                  <span className="font-bold text-sm">Admin</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center md:hidden">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="relative z-10 text-white max-w-lg p-12 flex flex-col items-start">
          <div className="w-20 h-20 bg-white/10 rounded-2xl border border-slate-700 flex items-center justify-center mb-8 shadow-md">
            <HeartPulse size={40} className="text-primary-300" />
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Your Health Data, <br/>
            <span className="text-primary-300">
              Secured & Analyzed.
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed font-medium mb-10">
            Join thousands of patients and doctors experiencing the next generation of healthcare management powered by Artificial Intelligence.
          </p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-slate-700">
              <div className="p-2 bg-primary-500/20 text-primary-300 rounded-lg"><Lock size={20} /></div>
              <p className="font-semibold text-sm">Enterprise-grade Security</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-slate-700">
              <div className="p-2 bg-primary-500/20 text-primary-300 rounded-lg"><Activity size={20} /></div>
              <p className="font-semibold text-sm">Real-time AI Health Insights</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Register;
