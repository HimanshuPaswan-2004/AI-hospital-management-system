import { Activity, FileText, Pill, MessageSquare, UserPlus, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAssistantHome = () => {
  const tools = [
    {
      title: 'Symptom Checker',
      desc: 'Check possible conditions based on your symptoms',
      icon: Activity,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      link: '/patient/ai-assistant/symptom-checker'
    },
    {
      title: 'Report Summarizer',
      desc: 'Upload medical reports and get AI summary',
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      link: '/patient/ai-assistant/report-summarizer'
    },
    {
      title: 'Prescription Explainer',
      desc: 'Understand your medicines and dosage',
      icon: Pill,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      link: '/patient/ai-assistant/prescription-explainer'
    },
    {
      title: 'AI Chatbot',
      desc: 'Ask anything about your health',
      icon: MessageSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      link: '/patient/ai-assistant/chatbot'
    },
    {
      title: 'Doctor Recommendation',
      desc: 'Find the right specialist for your concern',
      icon: UserPlus,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      link: '/patient/ai-assistant/doctor-recommendation'
    },
    {
      title: 'Appointment Assistant',
      desc: 'Find and book available appointment slots',
      icon: CalendarDays,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      link: '/patient/ai-assistant/appointment-assistant'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Health Assistant</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px] font-medium">How can I help you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link key={index} to={tool.link} className="block group">
              <div className="pro-card p-6 h-full transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${tool.bg} dark:bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${tool.color} dark:text-opacity-90`} />
                </div>

                <h3 className="text-[17px] font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AIAssistantHome;
