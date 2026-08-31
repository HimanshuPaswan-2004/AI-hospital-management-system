import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoice) => {
  try {
    const doc = new jsPDF();
    
    // Hospital Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text('MedIAI Hospital', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('123 Healthcare Ave, Medical City, MC 10001', 14, 30);
    doc.text('Phone: +1 (555) 123-4567 | Email: billing@mediai.com', 14, 35);
    
    doc.setLineWidth(0.5);
    doc.line(14, 40, 196, 40);

    // Invoice Details
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', 14, 50);

    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoice.id.split('-')[0].toUpperCase()}`, 14, 60);
    doc.text(`Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`, 14, 66);
    doc.text(`Status: ${invoice.status}`, 14, 72);

    // Patient & Doctor Details
    const patient = invoice.appointment?.patient || { firstName: 'N/A', lastName: '' };
    const doctor = invoice.appointment?.doctor || { firstName: 'N/A', lastName: '' };
    const apptDate = invoice.appointment?.appointmentDate ? new Date(invoice.appointment.appointmentDate).toLocaleDateString() : 'N/A';

    doc.setFontSize(12);
    doc.text('Bill To:', 120, 60);
    doc.setFontSize(10);
    doc.text(`Patient: ${patient.firstName} ${patient.lastName}`, 120, 66);
    doc.text(`Doctor: Dr. ${doctor.firstName} ${doctor.lastName}`, 120, 72);
    doc.text(`Appointment Date: ${apptDate}`, 120, 78);

    // Table Data
    const tableData = [];
    
    // 1. Consultation Fee
    tableData.push([
      'Doctor Consultation Fee',
      `Dr. ${doctor.firstName} ${doctor.lastName}`,
      `$${(invoice.consultationFee || 0).toFixed(2)}`
    ]);

    // 2. Pharmacy Charges
    if (invoice.appointment?.prescription && invoice.appointment.prescription.medicines) {
      // medicines could be a string if JSON is not parsed, but it should be an array.
      let meds = invoice.appointment.prescription.medicines;
      if (typeof meds === 'string') {
        try { meds = JSON.parse(meds); } catch(e) {}
      }
      
      if (Array.isArray(meds)) {
        meds.forEach(med => {
          tableData.push([
            'Medicine (Prescribed)',
            `${med.name} (${med.dosage} - ${med.duration})`,
            'Included in Pharmacy Total'
          ]);
        });
      }
    }

    tableData.push([
      'Pharmacy Total',
      '',
      `$${(invoice.pharmacyCharges || 0).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 90,
      head: [['Description', 'Details', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 80 },
        2: { cellWidth: 32, halign: 'right' }
      }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Total Amount:', 140, finalY);
    doc.text(`$${(invoice.totalAmount || 0).toFixed(2)}`, 175, finalY);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for choosing MedIAI Hospital. Wishing you a speedy recovery!', 105, 280, null, null, 'center');

    // Save PDF
    doc.save(`Invoice_${invoice.id.split('-')[0].toUpperCase()}.pdf`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    toast.error('Error generating PDF: ' + error.message);
  }
};
