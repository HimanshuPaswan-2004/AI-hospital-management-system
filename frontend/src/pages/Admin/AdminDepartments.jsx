import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { Building2, Plus, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '', status: 'Active' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const data = await adminService.getDepartments();
      setDepartments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch departments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createDepartment(newDept);
      setIsModalOpen(false);
      setNewDept({ name: '', description: '', status: 'Active' });
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add department');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">Departments Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept, idx) => {
          const colors = [
            'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
            'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
          ];
          const iconBg = colors[idx % colors.length];
          return (
            <div key={dept.id} className="pro-card p-6 flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-outfit">{dept.name}</h3>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{dept.doctorsCount} Doctors</p>
                </div>

              </div>

              <div className="mt-auto">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  dept.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  {dept.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Add New Department</h2>
            
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
                <input 
                  type="text" 
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 dark:text-white"
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  value={newDept.description}
                  onChange={(e) => setNewDept({...newDept, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 dark:text-white resize-none h-24"
                  placeholder="Brief description..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  value={newDept.status}
                  onChange={(e) => setNewDept({...newDept, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
