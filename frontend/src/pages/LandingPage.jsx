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

        {/* Right Typography / Features Composition (Replacing Image) */}
        <div className="relative w-full h-full min-h-[480px] flex flex-col justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-50/80 via-[#f5f9ff] to-indigo-50/80 p-8 md:p-12 mt-10 md:mt-0 border-2 border-white shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] overflow-hidden">
          {/* Decorative Background Icon */}
          <div className="absolute -top-10 -right-10 text-blue-600/5 pointer-events-none transform rotate-12">
             <ShieldPlus size={350} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.2] tracking-tight">
              Transforming healthcare with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Intelligent Automation</span>.
            </h3>
            
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-0.5 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-inner">
                  <CheckCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">AI-Powered Insights</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Instant preliminary health assessments and symptom checking powered by advanced AI.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-0.5 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-inner">
                  <CheckCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Smart Scheduling</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Book appointments with top specialists instantly without long queues or waiting times.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-0.5 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-inner">
                  <CheckCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Secure Digital Records</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Your medical history is encrypted, stored safely, and accessible only to you and your doctor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
