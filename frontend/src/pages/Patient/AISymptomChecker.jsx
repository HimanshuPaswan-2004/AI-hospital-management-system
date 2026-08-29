import { useState } from 'react';
import { ClipboardList, ShieldCheck, AlertCircle, Activity, ChevronRight, CheckCircle2, ShieldAlert, HeartPulse, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const AISymptomChecker = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [resultData, setResultData] = useState(null);
  const { user } = useAuthStore();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/symptom-checker`, 
        { symptoms }, 
        config
      );
      setResultData(data);
      setIsAnalyzed(true);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzed) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-6 flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Symptom Analysis Result</h1>
           </div>
           <button 
             onClick={() => setIsAnalyzed(false)}
             className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
           >
             ← Check Again
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Left Column */}
           <div className="space-y-6">
              {/* Possible Conditions */}
              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" />
                    Possible Conditions
                 </h2>
                 <div className="space-y-3">
                    {resultData?.possibleConditions?.map((condition, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                               <HeartPulse size={16} />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{condition.name}</span>
                         </div>
                         <span className="text-xs font-bold text-slate-500">{condition.probability}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Severity & Recommended Dept */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="pro-card p-6">
                    <h2 className="text-[13px] font-bold text-slate-500 mb-2">Severity</h2>
                    <div className="flex items-center gap-2">
                       <AlertCircle size={20} className={`${resultData?.severity?.toLowerCase().includes('high') || resultData?.severity?.toLowerCase().includes('severe') ? 'text-rose-500' : 'text-amber-500'}`} />
                       <span className={`font-bold text-lg ${resultData?.severity?.toLowerCase().includes('high') || resultData?.severity?.toLowerCase().includes('severe') ? 'text-rose-500' : 'text-amber-500'}`}>{resultData?.severity || 'Moderate'}</span>
                    </div>
                 </div>
                 <div className="pro-card p-6">
                    <h2 className="text-[13px] font-bold text-slate-500 mb-2">Recommended Dept</h2>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-blue-600 text-sm">{resultData?.recommendedDepartment || 'General Medicine'}</span>
                    </div>
                 </div>
              </div>
              
              {/* Recommended Tests */}
              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Microscope size={18} className="text-blue-600" />
                    Recommended Tests
                 </h2>
                 <ul className="space-y-2">
                   {resultData?.recommendedTests?.map((test, idx) => (
                     <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {test}</li>
                   ))}
                 </ul>
              </div>
           </div>

           {/* Right Column */}
           <div className="space-y-6">
              {/* Warning Signs */}
              <div className="pro-card p-6 bg-rose-50/50 border-rose-100">
                 <h2 className="text-[15px] font-bold text-rose-800 mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-500" />
                    Warning Signs
                 </h2>
                 <ul className="space-y-3">
                   {resultData?.warningSigns?.map((warning, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-sm font-medium text-rose-700">
                        <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                        {warning}
                     </li>
                   ))}
                 </ul>
              </div>

              {/* What You Can Do */}
              <div className="pro-card p-6 bg-emerald-50/50 border-emerald-100">
                 <h2 className="text-[15px] font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    What You Can Do
                 </h2>
                 <ul className="space-y-3">
                   {resultData?.actions?.map((action, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-sm font-medium text-emerald-700">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        {action}
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Action Area */}
              <div className="pt-4 flex flex-col items-center gap-4">
                 <p className="text-xs text-slate-500 font-medium text-center flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-full">
                   <AlertCircle size={14} className="text-blue-500" />
                   This is AI-generated information. Please consult a doctor for medical advice.
                 </p>
                 <Link to="/patient/ai-assistant/appointment-assistant" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center">
                    Book Appointment
                 </Link>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
      <div className="w-full lg:w-[55%]">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Symptom Checker</h1>
          <p className="text-slate-500 mt-2 text-[15px] font-medium">Help us understand your symptoms better</p>
        </div>

        <form onSubmit={handleAnalyze} className="pro-card p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                defaultValue={32}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[120px] resize-none placeholder-slate-400"
              placeholder="Fever, headache, cough..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none">
              <option>1 Day</option>
              <option>2 Days</option>
              <option selected>3 Days</option>
              <option>1 Week</option>
              <option>More than 1 week</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center disabled:opacity-70 mt-2"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Analyze Symptoms'
            )}
          </button>
          
          <p className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5 mt-4">
             <ShieldCheck size={14} />
             Your information is secure and confidential.
          </p>
        </form>
      </div>

      <div className="hidden lg:flex w-[45%] h-[600px] bg-blue-50/50 rounded-3xl items-center justify-center relative overflow-hidden border border-slate-100">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.blue.100)_0%,transparent_70%)]"></div>
         
         <div className="relative z-10 w-64 h-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col transform rotate-2">
            <div className="w-12 h-2 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
                     <CheckCircle2 size={14} className="text-blue-500" />
                   </div>
                   <div className="h-2.5 bg-slate-100 rounded-full w-full"></div>
                 </div>
               ))}
               <div className="flex items-center gap-3 pt-2">
                 <div className="w-6 h-6 rounded border-2 border-slate-200"></div>
                 <div className="h-2.5 bg-slate-100 rounded-full w-2/3"></div>
               </div>
            </div>
            
            <div className="mt-auto self-end">
              <ClipboardList className="w-16 h-16 text-slate-100 -mr-4 -mb-4" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AISymptomChecker;
