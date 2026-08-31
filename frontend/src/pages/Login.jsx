import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import loginIllustration from '../assets/login_illustration.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, message: error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (currentUser?.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
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
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back!</h1>
          <p className="text-slate-500 font-medium mb-8">Login to your account</p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {rememberMe ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-300" />}
                Remember me
              </button>
              <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>


          <p className="text-center text-sm font-medium text-slate-500 mt-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
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
            alt="Login Illustration"
            className="w-full h-auto object-contain rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-8 ring-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
