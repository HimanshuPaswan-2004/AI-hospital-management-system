import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Search, User, MapPin, Award, CreditCard, Stethoscope, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDirectory = () => {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${user?.token}` },
        params: { search: searchTerm, specialization: specializationFilter }
      });
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDoctors();
    }
  }, [user, specializationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const specializations = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Psychiatrist", "Orthopedic", "General Physician"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Directory</h1>
        <p className="text-gray-500">Find and book appointments with the best doctors.</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-1.5 right-1.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>

        <div className="w-full md:w-64">
          <select 
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="block w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Stethoscope className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold uppercase shrink-0">
                      {doctor.firstName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
                      <p className="text-blue-600 font-medium text-sm">{doctor.profile?.specialization || 'General'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-gray-400" />
                    <span>{doctor.profile?.experience || 0} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-400" />
                    <span>${doctor.profile?.consultationFee || 0} Consultation Fee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>
                      {doctor.profile?.availableDays?.length > 0 
                        ? doctor.profile.availableDays.join(', ') 
                        : 'Contact for availability'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                <Link to={`/patient/appointments`} className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
