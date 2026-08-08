# MediAI - AI-Powered Hospital Management System

MediAI is an advanced, production-grade Hospital Management System designed to streamline hospital operations while augmenting medical capabilities with Artificial Intelligence. This project is built with a modern tech stack ensuring high performance, scalability, and robust security.

---

## 🚀 Current Status (Development in Progress)

- **Phase 1 (Day 1 - 6) - COMPLETED**: 
  - Project architecture & Database Setup (Prisma + PostgreSQL)
  - Full Authentication Module (Backend APIs + JWT, Frontend Login/Signup + Global State)
  - Main Dashboard Layout with Role-based Responsive Sidebar (Admin, Doctor, Patient) & Navbar

- **Phase 2 (Day 7 - 9) - COMPLETED**:
  - Doctor Directory & Appointment Booking System (Patients can select slots)
  - Doctor Dashboard (View schedule, Approve/Decline meetings)
  - Patient Profiles and Basic EMR layout

- **Phase 3 (Day 10 - 11) - COMPLETED**:
  - Medical Records (Lab reports upload via Multer, Digital Prescriptions)
  - Pharmacy Dashboard (Inventory tracking, low-stock alerts)
  - Billing & Invoicing (Automatic calculation, PDF generation via jsPDF)
  - Route Refactoring (Real URL routing for all sub-dashboards)

- **Phase 4 (Day 12 - 13) - UPCOMING**:
  - AI Symptom Checker & Summarizer (Gemini Integration)

---

## 🚀 Key Features

### 1. Robust Role-Based Access Control (RBAC)
- **Admin**: Full control over Pharmacy inventory, tracking low-stock medicines, generating billing invoices, and collecting payments.
- **Doctor**: Can manage their own schedule (Approve/Decline appointments), view patient medical records, and write digital prescriptions.
- **Patient**: Can browse the Doctor Directory, book appointments, upload Lab Reports, and view their medical history/prescriptions.

### 2. Core Modules
- **Patient Management (EHR)**: Electronic Health Records tracking appointments, prescriptions, and uploaded files.
- **Appointment Scheduling**: Real-time slot booking ensuring no double-booking overlaps.
- **Pharmacy & Lab**: Integrated modules for medicine inventory, secure file uploads for test reports.
- **Billing**: Automated invoice generation (Consultation + Pharmacy fees) with one-click PDF downloads.

### 3. Advanced AI Capabilities (Powered by Google Gemini) *(Coming Soon)*
- **AI Symptom Checker**: Analyzes patient symptoms and suggests potential medical issues.
- **AI Medical Report Summarizer**: Extracts and summarizes complex lab reports (PDF/Image) into layman's terms.

---

## 🛠️ Technology Stack

**Frontend**
- React.js (with Vite)
- Tailwind CSS (Styling)
- React Router DOM (Routing)
- Zustand (Global State Management)
- Axios (API Calls)
- jsPDF (Invoice PDF Generation)

**Backend**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL (Database)
- JWT (Authentication) & Bcrypt (Password Hashing)
- Multer (File Uploads)

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- Git

### 1. Clone the repository
```bash
git clone https://github.com/HimanshuPaswan-2004/AI-hospital-management-system.git
cd AI-hospital-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory.
- Add your PostgreSQL connection string & JWT Secret:
  ```env
  PORT=5000
  DATABASE_URL="postgresql://user:password@localhost:5432/mediai?schema=public"
  JWT_SECRET="your_super_secret_key"
  ```
- Initialize the database and run the seeder (loads test users/doctors/medicines):
  ```bash
  npx prisma migrate dev --name init
  node seed.js
  node seed_medicines.js
  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### 3. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The application will now be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📄 License
This project is open-source and available under the MIT License.
