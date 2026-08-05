# MediAI - AI-Powered Hospital Management System

MediAI is an advanced, production-grade Hospital Management System designed to streamline hospital operations while augmenting medical capabilities with Artificial Intelligence. This project is built with a modern tech stack ensuring high performance, scalability, and robust security.

---

## 🚀 Key Features

### 1. Robust Role-Based Access Control (RBAC)
- **Admin**: Full control over users, doctors, departments, and system billing.
- **Doctor**: Can manage their own schedule, view assigned patient records, write prescriptions, and request lab tests.
- **Patient**: Can view their medical history, book and track appointments, and use AI features.

### 2. Core Modules
- **Patient Management (EHR)**: Detailed Electronic Health Records tracking vitals, allergies, and chronic conditions.
- **Appointment Scheduling**: Real-time slot booking and availability management for doctors and patients.
- **Pharmacy & Lab**: Integrated modules for medicine inventory, test requests, and PDF result generation.
- **Billing**: Automated invoice generation and payment tracking.

### 3. Advanced AI Capabilities (Powered by Google AI Studio - Gemini)
- **AI Symptom Checker**: Analyzes patient symptoms and suggests potential medical issues.
- **AI Medical Report Summarizer**: Extracts and summarizes complex lab reports (PDF/Image) into layman's terms.
- **AI Prescription Explainer**: Simplifies doctor notes and prescriptions for patients to easily understand.
- **AI Chatbot**: A 24/7 virtual assistant for general hospital FAQs and navigation.

---

## 🛠️ Technology Stack

**Frontend**
- React.js (with Vite)
- TypeScript
- React Router DOM
- Axios

**Backend**
- Node.js & Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Database)
- JWT (Authentication) & Bcrypt (Password Hashing)

**AI Integration**
- Google AI Studio API (Gemini)

---

## 📁 Project Structure

```text
AI-hospital-management-system/
├── frontend/             # React + Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Node.js + Express backend
│   ├── src/
│   ├── prisma/           # Database schema and migrations
│   ├── package.json
│   └── tsconfig.json
├── docs/                 # Documentation (SRS, ER Diagrams)
└── README.md             # This file
```

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
- Add your PostgreSQL connection string:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/mediai?schema=public"
  ```
- Initialize the database:
  ```bash
  npx prisma migrate dev --name init
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
