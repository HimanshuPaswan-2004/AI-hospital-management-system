import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { Pill, AlertTriangle, Plus, Edit2, Check, X } from 'lucide-react';

const PharmacyDashboard = () => {
  const { user } = useAuthStore();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add new medicine state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', category: '', stockQuantity: '', unitPrice: '', description: '' });

  // Edit stock state
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/medicines', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMedicines(res.data);
    } catch (error) {
      console.error('Error fetching medicines', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchMedicines();
  }, [user]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/medicines', newMedicine, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setShowAddForm(false);
      setNewMedicine({ name: '', category: '', stockQuantity: '', unitPrice: '', description: '' });
      fetchMedicines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding medicine');
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medicines/${id}`,
        { stockQuantity: editStock },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setEditingId(null);
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div></div>;

  return (
    <div className="space-y-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4   p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-teal-500/30 text-white">
              <Pill size={24} />
            </div>
            Pharmacy Inventory
          </h2>
          <p className="text-slate-500 font-medium mt-2 ml-1">Manage medicines, track stock levels, and get low-stock alerts.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg ${showAddForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-teal-500/40 hover:-translate-y-0.5'}`}
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cancel' : 'Add New Medicine'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="pro-card p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeInUp_0.3s_ease-out]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medicine Name</label>
            <input required type="text" placeholder="e.g. Paracetamol 500mg" className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium" value={newMedicine.name} onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
            <input type="text" placeholder="e.g. Analgesic" className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium" value={newMedicine.category} onChange={e => setNewMedicine({ ...newMedicine, category: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Initial Stock</label>
            <input required type="number" placeholder="0" className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium" value={newMedicine.stockQuantity} onChange={e => setNewMedicine({ ...newMedicine, stockQuantity: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Price ($)</label>
            <input required type="number" step="0.01" placeholder="0.00" className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium" value={newMedicine.unitPrice} onChange={e => setNewMedicine({ ...newMedicine, unitPrice: e.target.value })} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
            <input type="text" placeholder="Optional details..." className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium" value={newMedicine.description} onChange={e => setNewMedicine({ ...newMedicine, description: e.target.value })} />
          </div>
          <div className="lg:col-span-3 flex justify-end mt-2">
            <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all">Save Medicine to Inventory</button>
          </div>
        </form>
      )}

      <div className="  rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-5 font-bold rounded-tl-[2rem]">Medicine Details</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold text-right">Price</th>
                <th className="p-5 font-bold text-center">Current Stock</th>
                <th className="p-5 font-bold text-center rounded-tr-[2rem]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 font-medium ">No medicines in inventory yet.</td>
                </tr>
              ) : medicines.map((med, index) => (
                <tr key={med.id} className="hover:bg-teal-50/30 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-slate-800 text-base">{med.name}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5 truncate max-w-xs">{med.description || 'No description'}</p>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                      {med.category || 'General'}
                    </span>
                  </td>
                  <td className="p-5 text-right font-bold text-slate-700">
                    ${parseFloat(med.unitPrice).toFixed(2)}
                  </td>
                  <td className="p-5 text-center">
                    {editingId === med.id ? (
                      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-xl border border-teal-100 shadow-sm animate-[fadeInUp_0.2s_ease-out]">
                        <input
                          type="number"
                          className="w-20 p-2 bg-slate-50 border-2 border-teal-100 rounded-lg text-center font-bold focus:outline-none focus:border-teal-400"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => handleUpdateStock(med.id)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"><Check size={18} /></button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-xl font-extrabold text-sm ${med.stockQuantity < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {med.stockQuantity}
                        </span>
                        {med.stockQuantity < 10 && (
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <AlertTriangle size={10} /> Low Stock
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    {editingId !== med.id && (
                      <button
                        onClick={() => { setEditingId(med.id); setEditStock(med.stockQuantity); }}
                        className="text-teal-600 hover:text-white bg-teal-50 hover:bg-teal-600 p-2.5 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="Update Stock"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
