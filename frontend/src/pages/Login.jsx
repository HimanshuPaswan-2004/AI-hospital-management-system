import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Activity, Lock, Mail, ArrowRight, HeartPulse } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message, login, reset } = useAuthStore();

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
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      
      {/* Left Side - Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
        
        <div className="relative z-10 text-white max-w-lg p-12 flex flex-col items-start">
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30">
            <Activity className="text-blue-200" size={20} />
            <span className="font-semibold tracking-wide text-sm text-blue-50 uppercase">MediAI Ecosystem</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">
              Healthcare Management
            </span>
          </h1>
          
          <p className="text-lg text-blue-100/90 leading-relaxed font-medium">
            Experience intelligent workflows, seamless patient interactions, and cutting-edge medical AI assistance all in one unified platform.
          </p>
          
          <div className="mt-12 flex gap-4 items-center">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-blue-100 flex items-center justify-center font-bold text-blue-700 shadow-lg">Dr</div>
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-purple-100 flex items-center justify-center font-bold text-purple-700 shadow-lg">Pt</div>
              <div className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 shadow-lg">Ad</div>
            </div>
            <div className="text-sm font-medium text-blue-100">
              Trusted by 10,000+ <br/> Healthcare Professionals
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 text-slate-500 font-medium">
          New here? 
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Create an account
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 shadow-lg shadow-blue-500/30">
              <HeartPulse size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Sign in to your MediAI account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Password</label>
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to MediAI</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center md:hidden">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
