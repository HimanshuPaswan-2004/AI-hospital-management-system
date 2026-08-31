import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ChevronRight, Sun, Moon, Monitor, Bell, Mail, Smartphone, Clock, Calendar as CalIcon, CreditCard, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DoctorSettings = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('General Settings');

  // General Settings
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Light');
  const [timeZone, setTimeZone] = useState(localStorage.getItem('timeZone') || '(GMT +05:30) Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD MMM YYYY');
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem('timeFormat') || '12 Hour (AM/PM)');

  // Notification Settings
  const [emailNotifs, setEmailNotifs] = useState(localStorage.getItem('emailNotifs') !== 'false');
  const [smsNotifs, setSmsNotifs] = useState(localStorage.getItem('smsNotifs') === 'true');
  const [apptReminders, setApptReminders] = useState(localStorage.getItem('apptReminders') !== 'false');

  // Calendar Settings
  const [apptDuration, setApptDuration] = useState(localStorage.getItem('apptDuration') || '30');
  const [bufferTime, setBufferTime] = useState(localStorage.getItem('bufferTime') || '10');
  const [workingHoursStart, setWorkingHoursStart] = useState(localStorage.getItem('workingHoursStart') || '09:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState(localStorage.getItem('workingHoursEnd') || '17:00');

  // Payment Settings
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [bankAccount, setBankAccount] = useState(localStorage.getItem('bankAccount') || '');

  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'Light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const handleSave = () => {
    // General
    localStorage.setItem('theme', theme);
    localStorage.setItem('timeZone', timeZone);
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('timeFormat', timeFormat);

    // Notifications
    localStorage.setItem('emailNotifs', emailNotifs);
    localStorage.setItem('smsNotifs', smsNotifs);
    localStorage.setItem('apptReminders', apptReminders);

    // Calendar
    localStorage.setItem('apptDuration', apptDuration);
    localStorage.setItem('bufferTime', bufferTime);
    localStorage.setItem('workingHoursStart', workingHoursStart);
    localStorage.setItem('workingHoursEnd', workingHoursEnd);

    // Payment
    localStorage.setItem('currency', currency);
    localStorage.setItem('bankAccount', bankAccount);

    toast.success('Settings saved successfully!');
  };

  const preferences = [
    { name: 'General Settings', desc: 'Manage general preferences' },
    { name: 'Notification Settings', desc: 'Manage notifications' },
    { name: 'Calendar Settings', desc: 'Manage calendar and schedule' },
    { name: 'Payment Settings', desc: 'Manage payment methods' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Preferences</h2>
          <div className="space-y-2">
            {preferences.map((pref) => (
              <button
                key={pref.name}
                onClick={() => setActiveTab(pref.name)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors text-left border ${activeTab === pref.name
                    ? 'border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-700'
                  }`}
              >
                <div>
                  <h3 className={`font-bold text-sm ${activeTab === pref.name ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-white dark:text-slate-200'}`}>
                    {pref.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{pref.desc}</p>
                </div>
                <ChevronRight size={18} className={activeTab === pref.name ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 p-8 transition-colors duration-200">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{activeTab}</h2>

          {activeTab === 'General Settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Time Zone</span>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="text-sm font-bold text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right [&>option]:text-black"
                >
                  <option value="(GMT +05:30) Asia/Kolkata">(GMT +05:30) Asia/Kolkata</option>
                  <option value="(GMT -05:00) EST">(GMT -05:00) EST</option>
                  <option value="(GMT +00:00) UTC">(GMT +00:00) UTC</option>
                </select>
              </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Date Format</span>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="text-sm font-bold text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right [&>option]:text-black"
                  >
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Time Format</span>
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="text-sm font-bold text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer outline-none text-right [&>option]:text-black"
                  >
                    <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                    <option value="24 Hour">24 Hour</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('Light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${theme === 'Light' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/40' : 'border-slate-200 dark:border-slate-700 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  >
                    <Sun size={24} className={theme === 'Light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={`text-sm font-bold ${theme === 'Light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('Dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${theme === 'Dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/40' : 'border-slate-200 dark:border-slate-700 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  >
                    <Moon size={24} className={theme === 'Dark' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={`text-sm font-bold ${theme === 'Dark' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('System')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${theme === 'System' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/40' : 'border-slate-200 dark:border-slate-700 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  >
                    <Monitor size={24} className={theme === 'System' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={`text-sm font-bold ${theme === 'System' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>System</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notification Settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 dark:border-slate-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">Email Notifications</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Receive daily summaries and critical alerts via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 dark:border-slate-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">SMS Notifications</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Get text messages for urgent patient updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 dark:border-slate-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">Appointment Reminders</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Notify 30 minutes before an upcoming appointment</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={apptReminders} onChange={(e) => setApptReminders(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Calendar Settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Appointment Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <select
                      value={apptDuration}
                      onChange={(e) => setApptDuration(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 text-slate-800 dark:text-white [&>option]:text-black"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Buffer Time (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <select
                      value={bufferTime}
                      onChange={(e) => setBufferTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 text-slate-800 dark:text-white [&>option]:text-black"
                    >
                      <option value="0">None</option>
                      <option value="5">5 Minutes</option>
                      <option value="10">10 Minutes</option>
                      <option value="15">15 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Working Hours</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={workingHoursStart}
                    onChange={(e) => setWorkingHoursStart(e.target.value)}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  />
                  <span className="text-slate-400 dark:text-slate-500">to</span>
                  <input
                    type="time"
                    value={workingHoursEnd}
                    onChange={(e) => setWorkingHoursEnd(e.target.value)}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Payment Settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Default Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 text-slate-800 dark:text-white [&>option]:text-black"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Bank Account Details (For Payouts)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="IBAN or Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action button appears for all tabs */}
          <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-700">
            <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
