import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Sparkles, Activity, AlertCircle, ArrowLeft, Bot, ShieldAlert, HeartPulse, Stethoscope, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/ai/symptom-checker',
        { symptoms },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setResult(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-[calc(100vh-100px)] relative w-full pb-10">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Link to="/patient/appointments" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-gray-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <Sparkles className="text-teal-600 dark:text-teal-400 w-8 h-8" /> 
              AI Symptom Analyzer
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mt-1">Describe your symptoms and get an instant preliminary analysis powered by Medical AI.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-2xl">
                  <Activity size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">How are you feeling?</h2>
              </div>
              
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <textarea
                    className="w-full p-5 bg-gray-50/50 dark:bg-slate-900 border-2 border-transparent dark:border-slate-700 focus:border-teal-100 dark:focus:border-teal-900 focus:bg-white dark:focus:bg-slate-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/20 outline-none resize-none transition-all duration-300 text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
                    rows="6"
                    placeholder="E.g., I've been having a severe headache for the past 2 days, along with a mild fever of 100°F and nausea, especially in the mornings..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} className="group-hover:rotate-12 transition-transform" /> 
                        <span>Analyze Symptoms</span>
                      </>
                    )}
                  </button>
                  
                  {result && (
                    <button 
                      type="button" 
                      onClick={handleReset}
                      className="p-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 rounded-2xl transition-colors font-medium flex items-center justify-center shadow-sm"
                      title="Reset"
                    >
                      <RefreshCcw size={22} />
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 p-5 bg-sky-50/50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30 rounded-2xl flex gap-4 items-start">
                <ShieldAlert className="text-sky-500 shrink-0" />
                <p className="text-xs font-medium text-sky-900/80 dark:text-sky-300/80 leading-relaxed">
                  Your data is analyzed securely using our advanced Gemini Medical AI. This tool is for informational purposes only and does not replace a doctor's diagnosis.
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-start gap-4 mb-6 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Analysis Error</h3>
                  <p className="font-medium opacity-90 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-100 dark:bg-teal-900/50 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <Bot size={64} className="text-teal-300 dark:text-teal-600 relative z-10 mb-6 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 dark:text-slate-500 mb-2">Awaiting Symptoms</h3>
                <p className="text-gray-400 dark:text-slate-500 max-w-sm font-medium">Please enter your symptoms on the left to receive an AI-driven medical analysis and recommendations.</p>
              </div>
            )}

            {loading && (
              <div className="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center p-12">
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute w-24 h-24 border-4 border-teal-100 dark:border-teal-900/50 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute w-20 h-20 border-4 border-sky-200 dark:border-sky-900/50 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/40 relative z-10">
                    <HeartPulse size={32} className="text-white animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-white">Synthesizing Medical Data...</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">Our AI is analyzing your symptoms against vast medical knowledge.</p>
              </div>
            )}

            {result && !loading && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] overflow-hidden animate-[fadeInUp_0.5s_ease-out]">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-teal-100/50 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-teal-600 dark:text-teal-400">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">AI Analysis Report</h3>
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mt-1">Generated Successfully</p>
                  </div>
                </div>
                
                <div className="p-8 sm:p-10 prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-slate-300
                  prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight 
                  prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-6
                  prose-p:leading-loose prose-p:mb-6 prose-p:text-lg
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold 
                  prose-ul:space-y-4 prose-ul:my-6
                  prose-li:leading-relaxed prose-li:text-lg prose-li:marker:text-teal-500
                  prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 dark:prose-blockquote:bg-teal-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  ">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-t border-amber-100/50 dark:border-amber-900/30 p-6 flex gap-4 items-start m-4 rounded-2xl shadow-inner">
                  <div className="p-2 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 rounded-full shadow-sm shrink-0 mt-1 border border-amber-100 dark:border-amber-900/50">
                    <AlertCircle size={20} />
                  </div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 leading-loose">
                    <strong className="font-bold text-amber-900 dark:text-amber-100">Important Medical Disclaimer:</strong> This report is generated by Artificial Intelligence and is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
