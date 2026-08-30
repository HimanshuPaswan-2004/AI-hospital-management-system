import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { doctorService } from '../../services/doctorService';
import axios from 'axios';

const DoctorProfile = () => {
  const { user, fetchMe } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    specialization: user?.doctorProfile?.specialization || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experience: user?.doctorProfile?.experience || '',
    qualification: user?.doctorProfile?.qualification || '',
    consultationFee: user?.doctorProfile?.consultationFee || '',
    bio: user?.doctorProfile?.bio || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        specialization: user.doctorProfile?.specialization || prev.specialization,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        experience: user.doctorProfile?.experience || prev.experience,
        qualification: user.doctorProfile?.qualification || prev.qualification,
        consultationFee: user.doctorProfile?.consultationFee || prev.consultationFee,
        bio: user.doctorProfile?.bio || prev.bio,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profileData: {
          specialization: formData.specialization,
          experience: formData.experience,
          qualification: formData.qualification,
          consultationFee: formData.consultationFee,
          bio: formData.bio
        }
      });
      await fetchMe();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Failed to update profile", error);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
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
              <label className="block text-sm font-medium text-slate-400">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
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
              <label className="block text-sm font-medium text-slate-400">Qualification</label>
              <input 
                type="text" 
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Consultation Fee</label>
              <input 
                type="number" 
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-400">Bio</label>
              <textarea 
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700 shadow-sm"
              ></textarea>
            </div>
            
          </div>

          <div className="pt-6">
            <button type="submit" disabled={saving} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DoctorProfile;
