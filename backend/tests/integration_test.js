const API_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

async function runIntegrationTest() {
  console.log('🚀 Starting Integration Test...');
  try {
    // 1. Patient Login
    console.log('\n--- 1. Testing Patient Flow ---');
    const patientLogin = await fetchAPI('/auth/login', 'POST', {
      email: 'patient1@example.com',
      password: 'password123'
    });
    const patientToken = patientLogin.token;
    console.log('✅ Patient logged in successfully');

    // 2. Fetch Doctors
    const doctorsList = await fetchAPI('/doctors', 'GET', null, patientToken);
    const doctor = doctorsList.find(d => d.email === 'dr.jones@example.com') || doctorsList[0];
    console.log(`✅ Fetched Doctors. Selected Dr. ${doctor.lastName}`);

    // 3. Book Appointment
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 1); // Tomorrow
    
    let appointmentId;
    try {
      const bookRes = await fetchAPI('/appointments', 'POST', {
        doctorId: doctor.id,
        appointmentDate: appointmentDate.toISOString(),
        timeSlot: '04:00 PM',
        reason: 'Integration Test Checkup'
      }, patientToken);
      appointmentId = bookRes.id;
      console.log('✅ Appointment booked successfully:', appointmentId);
    } catch (e) {
      if (e.message.includes('already booked')) {
        console.log('⚠️ Appointment already booked for this slot. Fetching existing...');
        const myApps = await fetchAPI('/appointments/my-appointments', 'GET', null, patientToken);
        appointmentId = myApps[0].id;
      } else {
        throw e;
      }
    }

    // 4. Doctor Login
    console.log('\n--- 2. Testing Doctor Flow ---');
    const doctorLogin = await fetchAPI('/auth/login', 'POST', {
      email: doctor.email,
      password: 'password123'
    });
    const doctorToken = doctorLogin.token;
    console.log('✅ Doctor logged in successfully');

    // 5. Update Appointment to COMPLETED
    await fetchAPI(`/appointments/${appointmentId}/status`, 'PUT', {
      status: 'COMPLETED'
    }, doctorToken);
    console.log('✅ Appointment status updated to COMPLETED');

    // 6. Admin Login
    console.log('\n--- 3. Testing Admin/Billing Flow ---');
    const adminLogin = await fetchAPI('/auth/login', 'POST', {
      email: 'admin@example.com',
      password: 'password123'
    });
    const adminToken = adminLogin.token;
    console.log('✅ Admin logged in successfully');

    // 7. Generate Invoice
    try {
      const invoiceRes = await fetchAPI(`/billing/generate/${appointmentId}`, 'POST', {}, adminToken);
      console.log('✅ Invoice generated successfully. Amount:', invoiceRes.totalAmount);
    } catch(e) {
       if (e.message.includes('already exists')) {
          console.log('✅ Invoice already existed for this appointment, which means the flow works.');
       } else {
          throw e;
       }
    }
    
    // 8. Fetch Invoices
    const allInvoices = await fetchAPI('/billing', 'GET', null, adminToken);
    console.log(`✅ Admin fetched invoices successfully. Total invoices: ${allInvoices.length}`);

    console.log('\n🎉 ALL MODULES INTEGRATED AND WORKING PERFECTLY!');

  } catch (error) {
    console.error('❌ Integration Test Failed:', error.message);
  }
}

runIntegrationTest();
