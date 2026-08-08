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
      const res = await axios.get('http://localhost:5000/api/medicines', {
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
      await axios.post('http://localhost:5000/api/medicines', newMedicine, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setShowAddForm(false);
      setNewMedicine({ name: '', category: '', stockQuantity: '', unitPrice: '', description: '' });
      fetchMedicines();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding medicine');
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/medicines/${id}`, 
        { stockQuantity: editStock },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setEditingId(null);
      fetchMedicines();
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Pill className="text-blue-600" /> Pharmacy Inventory
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage medicines and stock levels.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add Medicine'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input required type="text" placeholder="Medicine Name" className="p-2 border rounded" value={newMedicine.name} onChange={e => setNewMedicine({...newMedicine, name: e.target.value})} />
          <input type="text" placeholder="Category" className="p-2 border rounded" value={newMedicine.category} onChange={e => setNewMedicine({...newMedicine, category: e.target.value})} />
          <input required type="number" placeholder="Initial Stock" className="p-2 border rounded" value={newMedicine.stockQuantity} onChange={e => setNewMedicine({...newMedicine, stockQuantity: e.target.value})} />
          <input required type="number" step="0.01" placeholder="Unit Price ($)" className="p-2 border rounded" value={newMedicine.unitPrice} onChange={e => setNewMedicine({...newMedicine, unitPrice: e.target.value})} />
          <input type="text" placeholder="Description" className="p-2 border rounded md:col-span-2" value={newMedicine.description} onChange={e => setNewMedicine({...newMedicine, description: e.target.value})} />
          <div className="lg:col-span-3 flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Medicine</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b border-gray-100">
                <th className="p-4 font-semibold">Medicine Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Price</th>
                <th className="p-4 font-semibold text-center">Stock</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No medicines in inventory.</td>
                </tr>
              ) : medicines.map(med => (
                <tr key={med.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{med.name}</td>
                  <td className="p-4 text-gray-600">{med.category || '-'}</td>
                  <td className="p-4 text-right text-gray-600">${med.unitPrice.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    {editingId === med.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="number" 
                          className="w-20 p-1 border rounded text-center"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => handleUpdateStock(med.id)} className="text-green-600 hover:text-green-800"><Check size={18} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className={`font-bold ${med.stockQuantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {med.stockQuantity}
                        </span>
                        {med.stockQuantity < 10 && (
                          <span className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                            <AlertTriangle size={10} /> Low Stock
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editingId !== med.id && (
                      <button 
                        onClick={() => { setEditingId(med.id); setEditStock(med.stockQuantity); }}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg"
                        title="Update Stock"
                      >
                        <Edit2 size={16} />
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
