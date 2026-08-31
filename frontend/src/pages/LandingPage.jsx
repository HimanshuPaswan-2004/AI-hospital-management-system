import { Link } from 'react-router-dom';
import { ShieldPlus, CheckCircle, Brain, Heart, Activity, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden" id="home">
      {/* Absolute Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-50"></div>
      
      {/* Floating Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/40 rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-400/40 rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <div className="sticky top-6 z-50 px-4 md:px-8 w-full max-w-6xl mx-auto">
        <nav className="relative flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <ShieldPlus className="text-blue-600 w-8 h-8" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Medi<span className="text-blue-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm bg-slate-50/50 px-6 py-2.5 rounded-full border border-slate-100">
            <a href="#home" className="text-blue-600 font-bold">Home</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#departments" className="hover:text-blue-600 transition">Departments</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
          <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm">
            Get Started
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        {/* Text Content */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-[4rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Smart Healthcare <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite]">Powered by AI</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            MediAI helps you manage appointments, medical records and provides AI-powered health insights for a better tomorrow.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-center">
              Book Appointment
            </Link>
            <a href="#features" className="px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm text-center block">
              Explore Features
            </a>
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

        {/* Right Typography / Features Composition */}
        <div className="relative w-full h-full min-h-[480px] flex flex-col justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-50/80 via-[#f5f9ff] to-indigo-50/80 p-8 md:p-12 mt-10 md:mt-0 border-2 border-white shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] overflow-hidden">
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

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Powerful Features for Better Care</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Everything you need to manage your health or your practice, all in one intelligent platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'AI Symptom Checker', desc: 'Get instant insights on your symptoms and know when to see a doctor.' },
              { icon: Activity, title: 'Health Tracking', desc: 'Monitor your vital signs, prescriptions, and lab reports easily.' },
              { icon: Heart, title: 'Specialist Matching', desc: 'Our AI finds the perfect doctor for your specific health needs.' }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden z-10">
                {/* Decorative hover gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <feature.icon size={26} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Orb for bottom sections */}
      <div className="absolute top-[50%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-[150px] animate-[pulse_12s_ease-in-out_infinite] pointer-events-none z-0"></div>
      <div className="absolute top-[70%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[150px] animate-[pulse_10s_ease-in-out_infinite] pointer-events-none z-0" style={{ animationDelay: '3s' }}></div>

      {/* Departments Section */}
      <section id="departments" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Departments</h2>
              <p className="text-slate-500 mt-4">We offer a wide range of specialized medical services.</p>
            </div>
            <Link to="/login" className="text-blue-600 font-bold hover:underline mt-4 md:mt-0">View all departments &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Oncology', 'General Medicine'].map((dept, i) => (
              <div key={i} className="group p-6 bg-white rounded-[1.5rem] border border-slate-100 text-left hover:bg-gradient-to-br hover:from-slate-900 hover:to-indigo-950 hover:border-slate-800 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-2 flex items-center justify-between min-h-[100px] overflow-hidden relative">
                {/* Subtle overlay reflection */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-bold text-slate-700 group-hover:text-white transition-colors text-lg relative z-10">
                  {dept}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 border border-transparent group-hover:border-white/20">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section id="about" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">About MediAI</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              MediAI was founded with a simple mission: to make healthcare accessible, efficient, and intelligent. 
              By leveraging cutting-edge Artificial Intelligence, we bridge the gap between patients and doctors, 
              ensuring that quality care is always just a click away.
            </p>
            <Link to="/register" onClick={() => window.scrollTo(0, 0)} className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition shadow-lg inline-block relative z-20">
              Join Us Today
            </Link>
          </div>
          <div className="relative" id="contact">
            {/* Ambient background glow for contact card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative bg-slate-800/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
              
              <h3 className="text-2xl font-bold mb-8 text-white">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-600/50"><Phone size={22} /></div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-600/50"><Mail size={22} /></div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-0.5">Email</p>
                    <p className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">support@mediai.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-600/50"><MapPin size={22} /></div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">123 Health Ave, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-sm font-medium">&copy; {new Date().getFullYear()} MediAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
