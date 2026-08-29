import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Download, X } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const AIReportSummarizer = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` }
        };
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/summarize-report`,
          {
            attachment: {
              base64: base64data,
              mimeType: file.type
            }
          },
          config
        );
        setResultData(data);
        setIsAnalyzed(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze report.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6 flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Medical Report Analysis</h1>
           </div>
           <button 
             onClick={() => setIsAnalyzed(false)}
             className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
           >
             ← Upload Another
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Key Findings */}
           <div className="space-y-6">
              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    Key Findings
                 </h2>
                 
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Normal</h3>
                       <ul className="space-y-3">
                         {resultData?.normalFindings?.map((finding, idx) => (
                           <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                              <CheckCircle2 size={16} className="text-emerald-500" /> {finding}
                           </li>
                         ))}
                       </ul>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Needs Attention</h3>
                       <ul className="space-y-3">
                         {resultData?.abnormalFindings?.map((finding, idx) => (
                           <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                              <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
                                 <AlertCircle size={16} className="text-rose-500" /> {finding.name}
                              </div>
                              <span className="text-xs font-bold text-rose-500 bg-white px-2 py-1 rounded-md">{finding.status}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </div>

           {/* Summary & Questions */}
           <div className="space-y-6">
              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Summary
                 </h2>
                 <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                   {resultData?.summary}
                 </p>
              </div>

              <div className="pro-card p-6">
                 <h2 className="text-[15px] font-bold text-slate-800 mb-4">Questions to Ask Your Doctor</h2>
                 <ul className="space-y-3">
                   {resultData?.questionsForDoctor?.map((q, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        {q}
                     </li>
                   ))}
                 </ul>
              </div>

              <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2">
                 <Download size={18} />
                 Download Summary
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Medical Report Summarizer</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">Upload your health report and get AI insights</p>
      </div>

      <div className="pro-card p-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all rounded-3xl min-h-[400px]">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,application/pdf"
        />
        
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
           {isAnalyzing ? (
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
           ) : (
              <UploadCloud size={32} className="text-blue-500 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
           )}
        </div>
        
        {file ? (
          <div className="flex items-center gap-4 mb-8 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
            <span className="text-sm font-bold text-slate-700">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-rose-500 hover:bg-rose-50 p-1 rounded-md">
              <X size={16} />
            </button>
            <button onClick={handleUpload} disabled={isAnalyzing} className="ml-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              Analyze
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Drag & drop your file here</h2>
            <p className="text-sm font-medium text-slate-500 mb-8">or <button className="text-blue-600 font-bold hover:underline" onClick={() => fileInputRef.current?.click()}>click to browse</button></p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
          </>
        )}
      </div>

      <div className="mt-8 pro-card p-6 bg-slate-50 border-slate-100">
         <h3 className="text-sm font-bold text-slate-700 mb-3">Tips:</h3>
         <ul className="space-y-2 text-sm font-medium text-slate-500">
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Upload clear images or PDF</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Reports in English work best</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Ensure all pages are visible</li>
         </ul>
      </div>
    </div>
  );
};

export default AIReportSummarizer;
