import { useState, useRef } from 'react';
import { UploadCloud, Pill, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const AIPrescriptionExplainer = () => {
  const location = useLocation();
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState(location.state?.prescriptionText || '');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExplain = async (e) => {
    if (e) e.preventDefault();
    if (!prescriptionText.trim() && !file) {
      if (!e) fileInputRef.current?.click();
      return;
    }

    setIsAnalyzing(true);
    try {
      let attachment = null;
      if (file) {
        attachment = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              base64: reader.result.split(',')[1],
              mimeType: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      }

      const data = await patientService.aiExplainPrescription({ prescriptionText, attachment });
      
      setResultData(data);
      setIsAnalyzed(true);
    } catch (error) {
      console.error(error);
      alert('Failed to explain prescription.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6 flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Prescription Explained</h1>
           </div>
           <button 
             onClick={() => setIsAnalyzed(false)}
             className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
           >
             ← Explain Another
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Details */}
           <div className="space-y-6">
              <div className="pro-card p-6">
                 <h2 className="text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Medicine</h2>
                 <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Pill size={20} className="text-blue-600" />
                    {resultData?.medicineName}
                 </p>
              </div>

              <div className="pro-card p-6">
                 <h2 className="text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Purpose</h2>
                 <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {resultData?.purpose}
                 </p>
              </div>

              <div className="pro-card p-6">
                 <h2 className="text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Instructions</h2>
                 <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {resultData?.instructions}
                 </p>
              </div>
           </div>

           {/* Warnings */}
           <div className="space-y-6">
              <div className="pro-card p-6 bg-rose-50/50 border-rose-100">
                 <h2 className="text-[15px] font-bold text-rose-800 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-rose-500" />
                    Precautions
                 </h2>
                 <p className="text-sm font-medium text-rose-700 flex items-start gap-2">
                    <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                    {resultData?.precautions}
                 </p>
              </div>

              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Info size={18} className="text-amber-500" />
                    Possible Side Effects
                 </h2>
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {resultData?.sideEffects}
                 </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                 <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                 <p className="text-[13px] font-medium text-amber-800 leading-relaxed">
                    This is AI-generated information. Do not change your medication without consulting your doctor.
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Prescription Explainer</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">Upload your prescription and get AI explanation</p>
      </div>

      <div className="pro-card p-8 sm:p-12 mb-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all rounded-3xl min-h-[300px]">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,application/pdf"
        />
        
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
           {isAnalyzing ? (
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
           ) : (
              <UploadCloud size={28} className="text-blue-500 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
           )}
        </div>
        
        {file ? (
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
            <span className="text-sm font-bold text-slate-700">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-rose-500 hover:bg-rose-50 p-1 rounded-md">
              <X size={16} />
            </button>
            <button onClick={() => handleExplain()} disabled={isAnalyzing} className="ml-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              Analyze
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Drag & drop image here</h2>
            <p className="text-sm font-medium text-slate-500">or <button className="text-blue-600 font-bold hover:underline" onClick={() => fileInputRef.current?.click()}>click to upload</button></p>
          </>
        )}
      </div>

      <form onSubmit={handleExplain} className="pro-card p-6">
         <h2 className="text-[15px] font-bold text-slate-800 mb-4">Enter Prescription Details</h2>
         <textarea
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[120px] resize-none placeholder-slate-400 mb-4"
            placeholder="Type medicine name, dosage, instructions..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
         ></textarea>
         <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center disabled:opacity-70"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Explain Prescription'
            )}
          </button>
      </form>
    </div>
  );
};

export default AIPrescriptionExplainer;
