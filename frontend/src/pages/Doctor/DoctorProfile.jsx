import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const DoctorProfile = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: `Dr. ${user?.firstName || 'Sarah'} ${user?.lastName || 'Johnson'}`,
    specialization: 'Cardiologist',
    email: user?.email || 'sarah.johnson@mediai.com',
    phone: user?.phone || '+91 98765 43210',
    experience: '10 Years',
    registrationNo: 'DMC12345',
    address: 'City Hospital, New Delhi - 110001'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm">
            SJ
          </div>
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-sm">
            Change Photo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Specialization</label>
              <input 
                type="text" 
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Experience</label>
              <input 
                type="text" 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Registration No.</label>
              <input 
                type="text" 
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-400">Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>
            
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DoctorProfile;
