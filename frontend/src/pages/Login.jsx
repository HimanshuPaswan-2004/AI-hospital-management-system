import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogIn, Mail, Lock, HeartPulse, Activity } from 'lucide-react';

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
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="relative z-10 text-white max-w-lg p-12 flex flex-col items-start">
          <div className="w-20 h-20 bg-white/10 rounded-2xl border border-slate-200 flex items-center justify-center mb-8 shadow-md">
            <HeartPulse size={40} className="text-white" />
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Intelligent Healthcare, <br/>
            <span className="text-blue-200">
              Simplified.
            </span>
          </h2>
          
          <p className="text-lg text-blue-100 leading-relaxed font-medium mb-10">
            Access your medical records, connect with specialists, and manage your health journey with our advanced AI platform.
          </p>
          
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-slate-200 w-full">
            <div className="p-2 bg-white/20 text-white rounded-lg"><Activity size={20} /></div>
            <p className="font-semibold text-sm">Trusted by over 10,000 healthcare professionals</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white border-l border-slate-200">
        
        <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 text-slate-500 font-medium z-10">
          Don't have an account? 
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Register
          </Link>
        </div>

        <div className="w-full max-w-md my-12 z-10">
          <div className="mb-10 text-center lg:text-left mt-8 md:mt-0">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-sm">
              <HeartPulse size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Sign in to your MediAI account to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                  placeholder="you@example.com"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
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
              className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
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
