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
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/doctors', {
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
    <div className="max-w-7xl mx-auto space-y-8 animate-[fadeInUp_0.4s_ease-out] relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none z-0"></div>

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Specialist</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Book appointments with world-class doctors instantly.</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-5 relative z-10">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-teal-500 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-32 py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 dark:focus:border-teal-600 focus:bg-white dark:focus:bg-slate-900 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium transition-all"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all">
            Search
          </button>
        </form>

        <div className="w-full md:w-72">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="block w-full py-4 px-5 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 dark:focus:border-teal-600 focus:bg-white dark:focus:bg-slate-900 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 font-medium transition-all appearance-none cursor-pointer"
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
        <div className="flex justify-center py-20 relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-100 border-t-blue-600"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative z-10">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">No doctors found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
          {doctors.map((doctor, idx) => (
            <div key={doctor.id} className="pro-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-3xl font-extrabold uppercase shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {doctor.firstName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border border-slate-200 dark:border-slate-700 rounded-full"></div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <p className="text-teal-600 dark:text-teal-400 font-bold text-sm tracking-wide uppercase mt-1 bg-teal-50 dark:bg-teal-900/20 inline-block px-2 py-0.5 rounded-lg">{doctor.profile?.specialization || 'General'}</p>
                  </div>
                </div>

                <div className="space-y-4 mt-8 pt-6 border-t border-slate-100/60 dark:border-slate-700/60 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <div className="p-2 bg-sky-50 dark:bg-sky-900/20 text-sky-500 dark:text-sky-400 rounded-lg"><Award size={18} /></div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{doctor.profile?.experience || 0} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-lg"><CreditCard size={18} /></div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">${doctor.profile?.consultationFee || 0} Consultation Fee</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 rounded-lg"><Clock size={18} /></div>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {doctor.profile?.availableDays?.length > 0
                        ? doctor.profile.availableDays.join(', ')
                        : 'Contact for availability'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-b from-transparent to-slate-50/80 dark:to-slate-800/80">
                <Link to={`/book-appointment/${doctor.id}`} className="flex w-full items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300">
                  <Calendar size={18} />
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
