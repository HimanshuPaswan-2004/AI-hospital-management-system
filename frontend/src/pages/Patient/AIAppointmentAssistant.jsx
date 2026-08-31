import toast from 'react-hot-toast';
import { useState } from 'react';
import { Search, Calendar, Clock, User } from 'lucide-react';
import { patientService } from '../../services/patientService';

const AIAppointmentAssistant = () => {
   const [isAnalyzed, setIsAnalyzed] = useState(false);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [requestText, setRequestText] = useState('I need an appointment with a skin specialist tomorrow morning.');
   const [resultData, setResultData] = useState(null);

   const handleSearch = async (e) => {
      e.preventDefault();
      if (!requestText.trim()) return;

      setIsAnalyzing(true);
      try {
         const data = await patientService.aiFindAppointmentSlots(requestText);

         setResultData(data);
         setIsAnalyzed(true);
      } catch (error) {
         console.error(error);
         toast.error('Failed to find slots.');
      } finally {
         setIsAnalyzing(false);
      }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-8">
         <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Appointment Assistant</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px] font-medium">Tell us what you need, we will find best slots for you</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Input Form */}
            <div>
               <form onSubmit={handleSearch} className="pro-card p-6 sm:p-8 flex flex-col h-full">
                  <div className="flex-1">
                     <textarea
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[15px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all min-h-[160px] resize-none placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="E.g., I need an appointment with a skin specialist tomorrow morning."
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
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
                     <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-4">Recommended Slots</h3>
                     <div className="space-y-4">
                        {resultData?.slots?.length > 0 ? (
                           resultData.slots.map((slot, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden">
                                       <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">{slot.doctorName.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-slate-800 dark:text-white text-sm">{slot.doctorName}</h4>
                                       <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{slot.specialization}</p>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                                    <div className="flex flex-col gap-1">
                                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                          <Calendar size={14} className="text-blue-600 dark:text-blue-400" /> {slot.date}
                                       </div>
                                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                          <Clock size={14} className="text-blue-600 dark:text-blue-400" /> {slot.time}
                                       </div>
                                    </div>
                                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-800 transition-colors shrink-0 shadow-sm">
                                       Book Slot
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">No slots found matching your request.</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AIAppointmentAssistant;
