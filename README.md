# 🏥 MediAI - AI-Powered Hospital Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

MediAI is an advanced, production-grade Hospital Management System designed to streamline hospital operations while augmenting medical capabilities with Artificial Intelligence. This project is built with a modern tech stack ensuring high performance, scalability, and robust security. It represents a comprehensive **Final Project** showcasing full-stack development, AI integration, and complex role-based access control.

---

## 🌐 Live Deployment Links

- **Frontend (Live Website):** [https://ai-hospital-management-system-kpnjeg072.vercel.app/login](https://ai-hospital-management-system-kpnjeg072.vercel.app/login)
- **Backend API:** [https://ai-hospital-management-system-jqq7.onrender.com](https://ai-hospital-management-system-jqq7.onrender.com)

---

## 🔐 Test Account Credentials

Use these credentials to log in and test different roles in the MediAI application.
**Default Password for ALL accounts:** `password123`

### 🛡️ Admin Account
*Has access to Pharmacy Inventory & Billing/Invoicing.*
- **System Admin:** `admin@example.com`

### 🩺 Doctor Accounts
*Can view their schedule, approve appointments, and write digital prescriptions.*
- **Dr. John Smith (Cardiologist):** `dr.smith@example.com`
- **Dr. Sarah Jones (Dermatologist):** `dr.jones@example.com`
- **Dr. Raj Patel (Neurologist):** `dr.raj.patel@example.com`
- **Dr. Emily Lee (Pediatrician):** `dr.lee@example.com`
- **Dr. Carlos Garcia (Orthopedic):** `dr.garcia@example.com`
- **Dr. Amanda Wilson (Psychiatrist):** `dr.wilson@example.com`
- **Dr. David Brown (General Physician):** `dr.brown@example.com`

### 🧑‍⚕️ Patient Accounts
*Can browse the doctor directory, book appointments, and use AI features.*
- **Alice Johnson:** `patient1@example.com`
- **Bob Williams:** `patient2@example.com`
- **Charlie Davis:** `patient3@example.com`

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

### 3. Advanced AI Capabilities (Powered by Google Gemini)
- **AI Symptom Checker**: Analyzes patient symptoms and suggests potential medical issues.
- **AI Medical Report Summarizer**: Extracts and summarizes complex lab reports (PDF/Image) into layman's terms.
- **Smart Chatbot**: Context-aware floating assistant to guide users across the platform.

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
  GEMINI_API_KEY="your_google_gemini_api_key"
  ```
- Initialize the database and run the seeder:
  ```bash
  npx prisma migrate dev --name init
  node seed.js
  node seed_medicines.js
  node seed_analytics.js
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

## 🌍 Deployment Guide

### Backend Deployment (Render.com)
1. Go to **Render.com** and create a New Web Service connected to this GitHub repo.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables: `DATABASE_URL` (Postgres URL), `JWT_SECRET`, `GEMINI_API_KEY`.
6. Deploy! (Note: Free tier spins down after 15 mins. A self-ping cron is included in `index.js` to keep it awake).

### Frontend Deployment (Vercel)
1. Go to **Vercel.com** and import this GitHub repo.
2. Framework Preset will auto-detect `Vite`.
3. Set Root Directory to `frontend`.
4. Add Environment Variable: `VITE_API_URL = https://your-render-backend-url.onrender.com`
5. Deploy!

---

## 🎓 Interview & Study Guide (Project Post-Mortem)

**Q: What is the main tech stack and why?**
*Answer:* The **MERN Stack** (MongoDB/PostgreSQL, Express, React, Node) was chosen because it allows end-to-end development using a single language (JavaScript). **Zustand** was used instead of Redux for global state management due to its lightweight nature and minimal boilerplate. **TailwindCSS** was chosen over pure CSS/Bootstrap for faster, utility-first UI development resulting in a modern glassmorphism design.

**Q: How does the AI Integration work?**
*Answer:* When a patient types symptoms or uploads a lab report, the React frontend sends an HTTP POST request via Axios to the Express backend. The backend constructs a structured prompt and sends it to the **Google Gemini AI API (gemini-1.5-flash)**. The JSON response is parsed and sent back to the frontend to be displayed beautifully to the user.

**Q: How did you handle file uploads?**
*Answer:* We used **Multer** on the Node.js backend to handle `multipart/form-data`. Uploaded files (like lab reports) are saved locally in an `uploads/` directory, and their paths are stored in the PostgreSQL database. The backend serves these static files directly to the frontend.

**Q: What was the biggest challenge?**
*Answer:* Synchronizing frontend UI states with complex backend logic, especially handling role-based routing (Admin vs Doctor vs Patient) without exposing unauthorized routes. Integrating the Gemini AI while ensuring API Rate Limits (429 Too Many Requests) didn't crash the app was another significant hurdle, solved by proper error handling and model selection.

---

## 📄 License
This project is open-source and available under the MIT License.
