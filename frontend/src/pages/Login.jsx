import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import doctorIllustration from '../assets/doctor_illustration.jpg';

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
      navigate('/patient/dashboard');
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

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm">
              <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" alt="Microsoft" className="w-5 h-5" />
              Microsoft
            </button>
          </div>

          <p className="text-center text-sm font-medium text-slate-500 mt-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex w-[50%] bg-blue-50/50 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 max-w-lg w-full aspect-square bg-gradient-to-b from-blue-100 to-transparent rounded-[3rem] border border-white/50 shadow-2xl flex items-center justify-center overflow-hidden">
          <img
            src={doctorIllustration}
            alt="Doctor Illustration"
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
          />

          {/* Floating UI element */}
          <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ShieldPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Secure Login</p>
              <p className="text-[10px] font-medium text-slate-500">Data Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
