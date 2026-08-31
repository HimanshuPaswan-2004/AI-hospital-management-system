import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { FileText, Wallet, Download, Edit2, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBilling = async () => {
    try {
      const data = await adminService.getBilling();
      setInvoices(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch billing data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const openStatusModal = (inv) => {
    setSelectedInvoice(inv);
    setNewStatus(inv.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateInvoiceStatus(selectedInvoice.id, newStatus);
      setIsModalOpen(false);
      fetchBilling();
    } catch(err) {
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING' || inv.status === 'UNPAID').length;
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'PAID' ? inv.totalAmount : 0), 0);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-outfit">Billing & Payments</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="pro-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Invoices</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalInvoices}</h3>
          </div>
        </div>

        <div className="pro-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Paid</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{paidInvoices}</h3>
          </div>
        </div>

        <div className="pro-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{pendingInvoices}</h3>
          </div>
        </div>

        <div className="pro-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Billing Table */}
      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.length > 0 ? invoices.map((inv) => {
                let statusBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
                if(inv.status === 'PAID') statusBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
                
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {inv.id.substring(0,8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-white">{inv.appointment?.patient?.firstName} {inv.appointment?.patient?.lastName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-white">
                      ₹{inv.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => openStatusModal(inv)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" className="text-center p-4">No billing data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Update Invoice Status</h2>
            <div className="mb-4 text-slate-600 dark:text-slate-300">
              <p><strong>Invoice ID:</strong> {selectedInvoice.id.substring(0,8)}</p>
              <p><strong>Amount:</strong> ₹{selectedInvoice.totalAmount}</p>
            </div>
            
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 dark:text-white"
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
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
                  {submitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBilling;
