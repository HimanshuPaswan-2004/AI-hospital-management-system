import { useState } from 'react';
import { Search, HeartPulse, User, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIDoctorRecommendation = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Find the Right Specialist</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">Describe your health concern and get AI recommendation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
         {/* Left: Input Form */}
         <div>
            <form onSubmit={handleSearch} className="pro-card p-6 sm:p-8 flex flex-col h-full">
               <div className="flex-1">
                 <label className="block text-sm font-bold text-slate-700 mb-3">Your Symptoms</label>
                 <textarea
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[160px] resize-none placeholder-slate-400"
                    placeholder="E.g., I have chest discomfort and breathing issues."
                    required
                 ></textarea>
               </div>
               <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center mt-6 disabled:opacity-70"
                >
                  {isAnalyzing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Find Specialist <Search size={18} className="ml-2" /></>
                  )}
                </button>
            </form>
         </div>

         {/* Right: Results */}
         <div className={`transition-all duration-500 ${isAnalyzed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="space-y-6">
               {/* Recommendations Box */}
               <div className="pro-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 border-blue-100">
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recommended Dept</h3>
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                              <HeartPulse size={16} />
                           </div>
                           <span className="font-bold text-slate-800">Cardiology</span>
                        </div>
                     </div>
                     <div>
                        <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Specialist</h3>
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                              <User size={16} />
                           </div>
                           <span className="font-bold text-slate-800">Cardiologist</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Top Doctors */}
               <div className="pro-card p-6">
                  <h3 className="text-[15px] font-bold text-slate-800 mb-4">Top Doctors</h3>
                  <div className="space-y-4">
                     {/* Doctor 1 */}
                     <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                              <span className="text-slate-600 font-bold">SJ</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Dr. Sarah Johnson</h4>
                              <p className="text-xs font-medium text-slate-500">Cardiologist</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                           <Star size={14} className="text-amber-500 fill-amber-500" />
                           <span className="text-xs font-bold text-amber-700">4.8</span>
                        </div>
                     </div>

                     {/* Doctor 2 */}
                     <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                              <span className="text-slate-600 font-bold">MB</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Dr. Michael Brown</h4>
                              <p className="text-xs font-medium text-slate-500">Cardiologist</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                           <Star size={14} className="text-amber-500 fill-amber-500" />
                           <span className="text-xs font-bold text-amber-700">4.6</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 text-center">
                     <Link to="/doctor-directory" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                        View All Doctors <ChevronRight size={16} />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIDoctorRecommendation;
