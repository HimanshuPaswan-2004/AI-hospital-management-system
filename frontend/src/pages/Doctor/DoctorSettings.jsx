import { useState } from 'react';
import { ChevronRight, Sun, Moon, Monitor } from 'lucide-react';

const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState('General Settings');
  const [theme, setTheme] = useState('Light');

  const preferences = [
    { name: 'General Settings', desc: 'Manage general preferences' },
    { name: 'Notification Settings', desc: 'Manage notifications' },
    { name: 'Calendar Settings', desc: 'Manage calendar and schedule' },
    { name: 'Payment Settings', desc: 'Manage payment methods' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Preferences</h2>
          <div className="space-y-2">
            {preferences.map((pref) => (
              <button
                key={pref.name}
                onClick={() => setActiveTab(pref.name)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-left border ${
                  activeTab === pref.name 
                    ? 'border-blue-100 bg-blue-50/50' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div>
                  <h3 className={`font-bold text-sm ${activeTab === pref.name ? 'text-blue-700' : 'text-slate-800'}`}>
                    {pref.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                </div>
                <ChevronRight size={18} className={activeTab === pref.name ? 'text-blue-600' : 'text-slate-400'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">{activeTab}</h2>

          {activeTab === 'General Settings' && (
            <div className="space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Language</span>
                  <select className="text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right">
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Time Zone</span>
                  <select className="text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right">
                    <option>(GMT +05:30) Asia/Kolkata</option>
                    <option>(GMT -05:00) EST</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Date Format</span>
                  <select className="text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right">
                    <option>DD MMM YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Time Format</span>
                  <select className="text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right">
                    <option>12 Hour (AM/PM)</option>
                    <option>24 Hour</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('Light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'Light' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <Sun size={24} className={theme === 'Light' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-sm font-bold ${theme === 'Light' ? 'text-blue-600' : 'text-slate-600'}`}>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('Dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'Dark' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <Moon size={24} className={theme === 'Dark' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-sm font-bold ${theme === 'Dark' ? 'text-blue-600' : 'text-slate-600'}`}>Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme('System')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'System' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <Monitor size={24} className={theme === 'System' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-sm font-bold ${theme === 'System' ? 'text-blue-600' : 'text-slate-600'}`}>System</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  Save Preferences
                </button>
              </div>

            </div>
          )}

          {activeTab !== 'General Settings' && (
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
