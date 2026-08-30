import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, Moon, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { patientService } from '../../services/patientService';

const Settings = () => {
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await patientService.updateProfile(formData);
      // Update local store with the new user data (keeping token intact)
      login({ ...user, ...updatedUser }, user.token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-4 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'account' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon size={18} /> Account
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield size={18} /> Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'preferences' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe size={18} /> Preferences
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 md:p-8 w-full">
          {activeTab === 'account' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Account Details</h2>
                <p className="text-slate-500 text-sm">Update your personal account information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" value={user?.email} disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                {saved ? (
                   <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                     <CheckCircle2 size={18} /> Settings Saved!
                   </span>
                ) : <div />}
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notification Preferences</h2>
                <p className="text-slate-500 text-sm">Control how you receive updates and alerts.</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive appointment reminders and health reports via email.', id: 'email-notif', default: true },
                  { title: 'SMS Alerts', desc: 'Get SMS text messages for urgent appointment updates.', id: 'sms-notif', default: false },
                  { title: 'Marketing Communications', desc: 'Receive news, special offers, and platform updates.', id: 'marketing-notif', default: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Key className="w-5 h-5 text-slate-500" />
                  Change Password
                </h2>
                <p className="text-slate-500 text-sm">Ensure your account is using a long, random password to stay secure.</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                {saved ? <span className="text-emerald-600 text-sm font-medium">Password Updated!</span> : <div />}
                <button type="submit" className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition shadow-sm">
                  Update Password
                </button>
              </div>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">App Preferences</h2>
                <p className="text-slate-500 text-sm">Customize your platform experience.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Moon size={16} /> Dark Mode</p>
                    <p className="text-xs text-slate-500 mt-1">Switch to a darker theme for night time.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
