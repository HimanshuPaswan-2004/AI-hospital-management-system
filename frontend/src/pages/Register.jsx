import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Activity, UserPlus, Mail, Lock, User, ArrowRight, HeartPulse } from 'lucide-react';

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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-slate-500 font-medium z-10">
          Already have an account? 
          <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Sign In
          </Link>
        </div>

        <div className="w-full max-w-md my-12 z-10">
          <div className="mb-10 text-center lg:text-left mt-8 md:mt-0">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 shadow-lg shadow-blue-500/30">
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
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
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
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
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
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
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
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
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
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'PATIENT' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="PATIENT" checked={role === 'PATIENT'} onChange={onChange} className="sr-only" />
                  <HeartPulse size={24} className={role === 'PATIENT' ? 'text-blue-600' : ''} />
                  <span className="font-bold">Patient</span>
                </label>
                <label className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'DOCTOR' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="DOCTOR" checked={role === 'DOCTOR'} onChange={onChange} className="sr-only" />
                  <Activity size={24} className={role === 'DOCTOR' ? 'text-indigo-600' : ''} />
                  <span className="font-bold">Doctor</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
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
              Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30" style={{ animationDuration: '4s' }}></div>
        
        <div className="relative z-10 text-white max-w-lg p-12 flex flex-col items-start">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <HeartPulse size={40} className="text-blue-300" />
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Your Health Data, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
              Secured & Analyzed.
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed font-medium mb-10">
            Join thousands of patients and doctors experiencing the next generation of healthcare management powered by Artificial Intelligence.
          </p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl"><Lock size={20} /></div>
              <p className="font-semibold text-sm">Enterprise-grade Security</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="p-2 bg-blue-500/20 text-blue-300 rounded-xl"><Activity size={20} /></div>
              <p className="font-semibold text-sm">Real-time AI Health Insights</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Register;
