import { useState } from 'react';
import { Search, Calendar, Clock, User } from 'lucide-react';

const AIAppointmentAssistant = () => {
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Appointment Assistant</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">Tell us what you need, we will find best slots for you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
         {/* Left: Input Form */}
         <div>
            <form onSubmit={handleSearch} className="pro-card p-6 sm:p-8 flex flex-col h-full">
               <div className="flex-1">
                 <textarea
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[160px] resize-none placeholder-slate-400"
                    placeholder="E.g., I need an appointment with a skin specialist tomorrow morning."
                    defaultValue="I need an appointment with a skin specialist tomorrow morning."
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
                    <>Find Available Slots <Search size={18} className="ml-2" /></>
                  )}
                </button>
            </form>
         </div>

         {/* Right: Results */}
         <div className={`transition-all duration-500 ${isAnalyzed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="space-y-6">
               <div className="pro-card p-6">
                  <h3 className="text-[15px] font-bold text-slate-800 mb-4">Recommended Slots</h3>
                  <div className="space-y-4">
                     {/* Slot 1 */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                              <span className="text-slate-600 font-bold text-sm">EW</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 text-sm">Dr. Emily Watson</h4>
                              <p className="text-[11px] font-medium text-slate-500">Dermatologist</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                 <Calendar size={14} className="text-blue-600" /> Tomorrow
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                 <Clock size={14} className="text-blue-600" /> 10:00 AM
                              </div>
                           </div>
                           <button className="px-4 py-2 bg-white border border-blue-200 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors shrink-0 shadow-sm">
                              Book Slot
                           </button>
                        </div>
                     </div>

                     {/* Slot 2 */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                              <span className="text-slate-600 font-bold text-sm">EW</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 text-sm">Dr. Emily Watson</h4>
                              <p className="text-[11px] font-medium text-slate-500">Dermatologist</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                 <Calendar size={14} className="text-blue-600" /> Tomorrow
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                 <Clock size={14} className="text-blue-600" /> 11:30 AM
                              </div>
                           </div>
                           <button className="px-4 py-2 bg-white border border-blue-200 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors shrink-0 shadow-sm">
                              Book Slot
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIAppointmentAssistant;
