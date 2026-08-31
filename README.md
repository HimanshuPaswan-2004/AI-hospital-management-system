# 🏥 MediAI - Advanced AI-Powered Hospital Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

MediAI is a state-of-the-art, production-ready Hospital Management System built with a focus on **Premium UI/UX**, **AI Integration**, and **Dynamic End-to-End Workflows**. It provides dedicated portals for Admins, Doctors, and Patients, all interconnected in real-time through a robust PostgreSQL database.

---

## ✨ Stunning UI/UX Design
- **Pro-Card Glassmorphism**: Beautiful, clean, and modern interface with subtle shadows and rounded corners.
- **Dark Mode Support**: Seamless toggle between light and dark themes across all dashboards.
- **Micro-Animations**: Smooth hover effects, transitions, and loading states for a premium feel.
- **Dynamic Charts**: Interactive analytics powered by `Recharts`.

---

## 🚀 Core Features & Modules

### 1. Robust Role-Based Portals (RBAC)
- **👨‍💼 Admin Portal**: 
  - Dynamic Analytics Dashboard (Revenue, Appointments, Demographics).
  - Manage Users (Doctors, Patients) and Departments.
  - Live System Settings (Hospital Details, Notifications, Security).
  - Real-Time Staff Communication (Live Chat).
- **🩺 Doctor Portal**: 
  - Daily Schedule & Appointments Management (Accept/Cancel/Complete).
  - Digital Prescription Generator (Linked to specific appointments).
  - View Patient Medical Histories.
- **🤒 Patient Portal**: 
  - Browse Doctor Directory and Book Appointments.
  - View Upcoming Schedule and Medical Records.
  - Access Digital Prescriptions and Invoices.

### 2. Advanced AI Capabilities (Google Gemini API)
- **🤖 Floating AI Chatbot**: Context-aware assistant available on all screens to guide users.
- **🩺 AI Symptom Checker**: Patients can describe symptoms and get immediate AI-driven insights and department recommendations.
- **💊 AI Prescription Explainer**: Automatically translates complex medical prescriptions into easy-to-understand layman's terms.

### 3. Real-Time Interconnected Workflows
- **End-to-End Booking**: A patient booking instantly appears on the doctor's schedule and the admin's analytics.
- **Live Chat System**: HTTP polling-based live messaging between Admins and Hospital Staff (Doctors/Receptionists) without page reloads.

---

## 🛠️ Technology Stack

**Frontend (Vite + React)**
- React.js & React Router DOM
- Tailwind CSS (Premium Styling & Dark Mode)
- Zustand (Global State Management)
- Axios (API Calls)
- Lucide React (Iconography)
- Recharts (Data Visualization)

**Backend (Node.js)**
- Express.js (REST API)
- Prisma ORM
- PostgreSQL (Relational Database)
- JSON Web Tokens (JWT) & Bcrypt (Authentication)
- Google Generative AI (Gemini SDK)

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- Git

### 1. Clone & Install
```bash
git clone https://github.com/HimanshuPaswan-2004/AI-hospital-management-system.git
cd AI-hospital-management-system
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/mediai?schema=public"
JWT_SECRET="your_super_secret_key"
GEMINI_API_KEY="your_google_gemini_api_key"
```

Initialize the Database & Seed Data:
```bash
npx prisma migrate dev --name init
node seed.js
node seed_medicines.js
node seed_analytics.js
node seed_users.js
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure Frontend
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

## 🔐 Default Test Credentials

After running `node seed_users.js`, you can log in with the following accounts.  
**Password for all seeded accounts is:** `password123`

**Doctors:**
- `amit.cardio@mediai.com` (Cardiology)
- `neha.neuro@mediai.com` (Neurology)
- `rahul.ortho@mediai.com` (Orthopedics)

**Patients:**
- `ravi.k@example.com`
- `sita.d@example.com`

*(You can also register a new Admin/Patient account directly from the Login/Register screen).*

---

## 📄 License
This project is open-source and available under the MIT License.
