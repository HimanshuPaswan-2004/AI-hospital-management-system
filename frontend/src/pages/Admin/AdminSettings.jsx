import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { adminService } from '../../services/adminService';

const settingsMenu = [
  { id: 'general', label: 'General Settings' },
  { id: 'hospital', label: 'Hospital Information' },
  { id: 'email', label: 'Email Settings' },
  { id: 'sms', label: 'SMS Settings' },
  { id: 'payment', label: 'Payment Settings' },
  { id: 'notification', label: 'Notification Settings' },
  { id: 'security', label: 'Security Settings' },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General
    hospitalName: 'MediAI Super Speciality Hospital',
    hospitalEmail: 'info@mediai.com',
    contactNumber: '+91 98765 43210',
    currency: 'INR (₹)',
    timezone: '(GMT +05:30) Asia/Kolkata',
    address: '123, Healthcare Street, New Delhi - 110001',
    // Hospital
    licenseNumber: 'LIC-12345678',
    establishedYear: '2010',
    totalBeds: '500',
    // Email
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'alerts@mediai.com',
    smtpPass: '',
    // SMS
    smsProvider: 'Twilio',
    smsApiKey: '',
    smsSenderId: 'MEDIAI',
    // Payment
    stripeKey: '',
    razorpayKey: '',
    // Notification
    emailNotifications: 'true',
    smsNotifications: 'true',
    // Security
    sessionTimeout: '30',
    passwordMinLength: '8'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value 
    }));
  };

  const handleSave = async () => {
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const renderFormContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Hospital Name</label>
              <input type="text" name="hospitalName" value={settings.hospitalName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Hospital Email</label>
              <input type="email" name="hospitalEmail" value={settings.hospitalEmail || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Contact Number</label>
              <input type="text" name="contactNumber" value={settings.contactNumber || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Currency</label>
              <select name="currency" value={settings.currency || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200 appearance-none">
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Timezone</label>
              <select name="timezone" value={settings.timezone || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200 appearance-none">
                <option>(GMT +05:30) Asia/Kolkata</option>
                <option>(GMT +00:00) London</option>
                <option>(GMT -05:00) Eastern Time (US & Canada)</option>
              </select>
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Address</label>
              <input type="text" name="address" value={settings.address || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      case 'hospital':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">License Number</label>
              <input type="text" name="licenseNumber" value={settings.licenseNumber || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Established Year</label>
              <input type="number" name="establishedYear" value={settings.establishedYear || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Total Beds</label>
              <input type="number" name="totalBeds" value={settings.totalBeds || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">SMTP Server</label>
              <input type="text" name="smtpServer" value={settings.smtpServer || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">SMTP Port</label>
              <input type="text" name="smtpPort" value={settings.smtpPort || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">SMTP Username</label>
              <input type="text" name="smtpUser" value={settings.smtpUser || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">SMTP Password</label>
              <input type="password" name="smtpPass" value={settings.smtpPass || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      case 'sms':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">SMS Provider</label>
              <select name="smsProvider" value={settings.smsProvider || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200 appearance-none">
                <option>Twilio</option>
                <option>MessageBird</option>
                <option>AWS SNS</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">API Key</label>
              <input type="password" name="smsApiKey" value={settings.smsApiKey || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Sender ID</label>
              <input type="text" name="smsSenderId" value={settings.smsSenderId || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Stripe Secret Key</label>
              <input type="password" name="stripeKey" value={settings.stripeKey || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Razorpay Key</label>
              <input type="password" name="razorpayKey" value={settings.razorpayKey || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <input type="checkbox" id="emailNotif" name="emailNotifications" checked={settings.emailNotifications === 'true'} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
              <label htmlFor="emailNotif" className="text-sm text-slate-700 dark:text-slate-200">Enable Email Notifications for Appointments</label>
            </div>
            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <input type="checkbox" id="smsNotif" name="smsNotifications" checked={settings.smsNotifications === 'true'} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
              <label htmlFor="smsNotif" className="text-sm text-slate-700 dark:text-slate-200">Enable SMS Notifications for Appointments</label>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Session Timeout (Minutes)</label>
              <input type="number" name="sessionTimeout" value={settings.sessionTimeout || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Minimum Password Length</label>
              <input type="number" name="passwordMinLength" value={settings.passwordMinLength || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        );
      default:
        return <div>Select a setting to configure</div>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">System Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Menu */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <div className="space-y-1">
            {settingsMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 pro-card p-6 min-h-[500px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            {settingsMenu.find(s => s.id === activeTab)?.label}
          </h2>

          <div className="space-y-6 max-w-3xl flex-1">
            {renderFormContent()}
          </div>

          <div className="pt-6 mt-auto border-t border-slate-100 dark:border-slate-800">
            <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
