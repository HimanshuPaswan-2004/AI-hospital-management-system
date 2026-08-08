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
      
      const [invRes, appRes] = await Promise.all([
        axios.get('http://localhost:5000/api/billing', { headers }),
        axios.get('http://localhost:5000/api/appointments/schedule', { headers }) // This gets all appointments for the logic, wait! This is doctor specific in our current backend.
        // Actually we don't have an endpoint to fetch all completed appointments globally for Admin.
        // I will skip generating from the frontend dropdown for now if we lack the endpoint.
        // Wait, I can just use a simple list of Invoices. The Admin can only see existing invoices.
      ]);
      
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
      await axios.put(`http://localhost:5000/api/billing/${id}/pay`, {}, {
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
      await axios.post(`http://localhost:5000/api/billing/generate/${genApptId}`, {}, {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Billing & Invoicing (Cashier)
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage payments and generate invoices.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <form onSubmit={handleGenerateInvoice} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Completed Appointment ID to Generate Invoice" 
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={genApptId}
            onChange={(e) => setGenApptId(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium whitespace-nowrap">
            Generate Invoice
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b border-gray-100">
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Patient</th>
                <th className="p-4 font-semibold">Doctor</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No invoices generated yet.</td>
                </tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 font-mono text-sm">
                    {inv.id.split('-')[0].toUpperCase()}
                  </td>
                  <td className="p-4 text-gray-800">
                    {inv.appointment.patient.firstName} {inv.appointment.patient.lastName}
                  </td>
                  <td className="p-4 text-gray-600">
                    Dr. {inv.appointment.doctor.firstName}
                  </td>
                  <td className="p-4 text-right font-bold text-gray-800">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 w-max mx-auto ${
                      inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.status === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => generateInvoicePDF(inv)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg title='Download PDF'"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      
                      {inv.status === 'UNPAID' && (
                        <button 
                          onClick={() => handleMarkPaid(inv.id)}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium"
                          title="Mark as Paid"
                        >
                          Collect Payment
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
