import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { User, Mail, Phone, Calendar, MapPin, Activity, Stethoscope, Award, CreditCard, Clock } from 'lucide-react';

const Profile = () => {
  const { user, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profileData: {}
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/profile', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        const data = res.data;
        const pData = user?.role === 'DOCTOR' ? data.doctorProfile : data.patientProfile;
        
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          profileData: pData || {}
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profileData: formData.profileData
      };

      if (user?.role === 'PATIENT' && payload.profileData.allergies && typeof payload.profileData.allergies === 'string') {
          payload.profileData.allergies = payload.profileData.allergies.split(',').map(a => a.trim());
      }
      if (user?.role === 'DOCTOR' && payload.profileData.availableDays && typeof payload.profileData.availableDays === 'string') {
          payload.profileData.availableDays = payload.profileData.availableDays.split(',').map(d => d.trim());
      }

      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/profile', payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setMessage('Profile updated successfully!');
      fetchMe(); // Refresh global user state
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.firstName) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6 mb-6">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
          {formData.firstName.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><User size={20}/> Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full p-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
            </div>
          </div>

          {/* Role Specific Info */}
          {user?.role === 'PATIENT' && (
            <div className="col-span-full mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Activity size={20}/> Patient Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.profileData.dateOfBirth ? formData.profileData.dateOfBirth.split('T')[0] : ''} onChange={handleProfileChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.profileData.gender || ''} onChange={handleProfileChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <input type="text" name="bloodGroup" value={formData.profileData.bloodGroup || ''} onChange={handleProfileChange} placeholder="e.g. O+" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma separated)</label>
                  <input type="text" name="allergies" value={Array.isArray(formData.profileData.allergies) ? formData.profileData.allergies.join(', ') : (formData.profileData.allergies || '')} onChange={handleProfileChange} placeholder="e.g. Peanuts, Dust" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea name="address" value={formData.profileData.address || ''} onChange={handleProfileChange} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"></textarea>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'DOCTOR' && (
            <div className="col-span-full mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"><Stethoscope size={20}/> Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input type="text" name="specialization" value={formData.profileData.specialization || ''} onChange={handleProfileChange} placeholder="e.g. Cardiologist" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input type="number" name="experience" value={formData.profileData.experience || ''} onChange={handleProfileChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input type="text" name="qualification" value={formData.profileData.qualification || ''} onChange={handleProfileChange} placeholder="e.g. MBBS, MD" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                  <input type="number" name="consultationFee" value={formData.profileData.consultationFee || ''} onChange={handleProfileChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Days (comma separated)</label>
                  <input type="text" name="availableDays" value={Array.isArray(formData.profileData.availableDays) ? formData.profileData.availableDays.join(', ') : (formData.profileData.availableDays || '')} onChange={handleProfileChange} placeholder="e.g. Monday, Wednesday, Friday" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.profileData.bio || ''} onChange={handleProfileChange} rows="3" placeholder="Brief description about yourself" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm flex items-center gap-2">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
