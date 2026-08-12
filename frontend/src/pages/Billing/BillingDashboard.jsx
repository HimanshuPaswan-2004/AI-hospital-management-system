import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { generateInvoicePDF } from '../../utils/generatePDF';
import { FileText, CheckCircle, Clock, Download, RefreshCw } from 'lucide-react';

const BillingDashboard = () => {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extra state to fetch un-invoiced completed appointments (to allow cashier to generate bill)
  const [completedAppointments, setCompletedAppointments] = useState([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${user?.token}` };
      
      const invRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/billing', { headers });
      setInvoices(invRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user]);

  const handleMarkPaid = async (id) => {
    if (!window.confirm("Mark this invoice as PAID?")) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/billing/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchData(); // refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // For Demo purposes, let's allow typing an appointment ID to generate an invoice.
  const [genApptId, setGenApptId] = useState('');
  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (!genApptId) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/billing/generate/${genApptId}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setGenApptId('');
      alert('Invoice Generated Successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate invoice');
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 text-white">
              <FileText size={24} />
            </div>
            Billing & Invoicing
          </h2>
          <p className="text-slate-500 font-medium mt-2 ml-1">Manage patient payments, collect dues, and generate smart invoices.</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 animate-[fadeInUp_0.3s_ease-out]">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
          <RefreshCw size={24} className="opacity-80" />
        </div>
        <form onSubmit={handleGenerateInvoice} className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
          <input 
            type="text" 
            placeholder="Enter Completed Appointment ID to Generate Invoice" 
            className="flex-1 p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium text-slate-700"
            value={genApptId}
            onChange={(e) => setGenApptId(e.target.value)}
          />
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 font-bold whitespace-nowrap transition-all duration-300">
            Generate Invoice
          </button>
        </form>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-5 font-bold rounded-tl-[2rem]">Invoice Details</th>
                <th className="p-5 font-bold">Patient</th>
                <th className="p-5 font-bold">Doctor</th>
                <th className="p-5 font-bold text-right">Amount</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-center rounded-tr-[2rem]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 font-medium bg-white/40">No invoices generated yet.</td>
                </tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-slate-800 font-mono">#{inv.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">ID: {inv.id.substring(0, 8)}</p>
                  </td>
                  <td className="p-5 font-bold text-slate-700">
                    {inv.appointment.patient.firstName} {inv.appointment.patient.lastName}
                  </td>
                  <td className="p-5 font-medium text-slate-600">
                    Dr. {inv.appointment.doctor.firstName}
                  </td>
                  <td className="p-5 text-right font-extrabold text-slate-800 text-lg">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide mx-auto ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {inv.status === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => generateInvoicePDF(inv)}
                        className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                      
                      {inv.status === 'UNPAID' && (
                        <button 
                          onClick={() => handleMarkPaid(inv.id)}
                          className="px-4 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                          title="Mark as Paid"
                        >
                          Collect
                        </button>
                      )}
                    </div>
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

export default BillingDashboard;
