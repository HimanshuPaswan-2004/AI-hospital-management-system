# 🔐 Test Account Credentials

Use these credentials to log in and test different roles in the MediAI application.
**Default Password for ALL accounts:** `password123`

---

## 🛡️ Admin Account
*Has access to Pharmacy Inventory & Billing/Invoicing.*

| Name | Email (Login ID) | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@example.com` | `password123` |

---

## 🩺 Doctor Accounts
*Can view their schedule, approve appointments, and write digital prescriptions.*

| Name | Specialization | Email (Login ID) | Password |
| :--- | :--- | :--- | :--- |
| **Dr. John Smith** | Cardiologist | `d | `password123` |
| **Dr. Sarah Jones** | Dermatologist | `dr.jones@example.com` | `password123` |
| **Dr. Raj Patel** | Neurologist | `dr.smith@example.com`r.patel@example.com` | `password123` |
| **Dr. Emily Lee** | Pediatrician | `dr.lee@example.com` | `password123` |
| **Dr. Carlos Garcia**| Orthopedic | `dr.garcia@example.com` | `password123` |
| **Dr. Amanda Wilson**| Psychiatrist | `dr.wilson@example.com` | `password123` |
| **Dr. David Brown** | General Physician | `dr.brown@example.com` | `password123` |

---

## 🤒 Patient Accounts
*Can browse the doctor directory, book appointments, and upload lab reports.*

| Name | Email (Login ID) | Password |
| :--- | :--- | :--- |
| **Alice Johnson** | `patient1@example.com` | `password123` |
| **Bob Williams** | `patient2@example.com` | `password123` |
| **Charlie Davis** | `patient3@example.com` | `password123` |
| **Diana Miller** | `patient4@example.com` | `password123` |
| **Ethan Moore** | `patient5@example.com` | `password123` |

---

## 🚀 Suggested Testing Flow:
1. **Patient:** Log in as `patient1@example.com` and book an appointment with Dr. John Smith.
2. **Doctor:** Log out, then log in as `dr.smith@example.com`. Find the pending appointment, click **Approve**, then click **Complete** and write a prescription.
3. **Admin:** Log out, then log in as `admin@example.com`. Go to the Billing section, generate an invoice for the completed appointment, and download the PDF!
