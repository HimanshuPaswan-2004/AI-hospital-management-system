import { Activity, Heart, Droplet, Ruler, Scale, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const HealthSummary = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Health Summary
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">A comprehensive overview of your vital health metrics.</p>
        </div>
        <Link
          to="/patient/ai-assistant/report-summarizer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 text-sm"
        >
          <Sparkles size={18} />
          Generate AI Health Report
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals & Bio Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 dark:text-rose-400" /> Vitals & Measurements
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                  <Droplet size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Blood Group</span>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">O+</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  <Activity size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Blood Pressure</span>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">118<span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">/75</span></p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Ruler size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Height</span>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">175<span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">cm</span></p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                  <Scale size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Weight</span>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">72<span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">kg</span></p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Allergies & Conditions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Known Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium text-sm rounded-lg border border-rose-100 dark:border-rose-800/50">Penicillin</span>
                  <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium text-sm rounded-lg border border-rose-100 dark:border-rose-800/50">Peanuts</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-medium text-sm rounded-lg border border-slate-200 dark:border-slate-600">Mild Asthma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 border border-blue-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot size={100} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full mb-4">
                <Sparkles size={14} /> AI Health Insight
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Looking good, {user?.firstName || 'User'}!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Based on your latest vitals and lab reports, your blood pressure is well within the normal range. Your weight has remained stable over the last 6 months.
              </p>
              <div className="mt-4 p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-blue-50 dark:border-slate-700 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">AI Recommendation</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Given your mild asthma, it is recommended to keep your inhaler handy during the upcoming spring season due to projected high pollen counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummary;
