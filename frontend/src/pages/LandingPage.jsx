import { Link } from 'react-router-dom';
import { ShieldPlus, CheckCircle } from 'lucide-react';
import heroImage from '../assets/hero_image.jpg';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldPlus className="text-blue-600 w-8 h-8" strokeWidth={2.5} />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">Medi<span className="text-blue-600">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
          <a href="#" className="text-blue-600 font-bold">Home</a>
          <a href="#" className="hover:text-blue-600 transition">Features</a>
          <a href="#" className="hover:text-blue-600 transition">Departments</a>
          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
        </div>
        <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Smart Healthcare <br />
            <span className="text-blue-600">Powered by AI</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            MediAI helps you manage appointments, medical records and provides AI-powered health insights for a better tomorrow.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
              Book Appointment
            </Link>
            <button className="px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
              Explore Features
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
            <div>
              <p className="text-3xl font-black text-slate-900">10K+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Happy Patients</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">500+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">50+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Departments</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">99%</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
          <img
            src={heroImage}
            alt="Healthcare App Preview"
            className="w-full h-full object-cover scale-[1.12]"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
