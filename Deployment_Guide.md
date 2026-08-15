# 🚀 AI Hospital Management System - Deployment Guide

MERN Stack (React + Node + Express + MongoDB) project ko duniya ke samne live (deploy) karne ke liye hum frontend aur backend ko alag-alag host karte hain. Ye step-by-step guide tumhe bataegi ki ise free aur best tarike se kaise deploy karna hai.

---

## 🛠️ Step 1: Preparation (Local Changes)
Deploy karne se pehle humein apne code me thode changes karne padenge kyunki production me hum `localhost:5000` ka use nahi kar sakte.

### 1. Backend me Port Setup:
Backend ke `src/index.js` me ensure karo ki `PORT` environment variable se liya ja raha hai:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
*Saath hi `package.json` me ek start script zaroor honi chahiye:*
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

### 2. Frontend me API URL Change:
Frontend me jahan-jahan tumne `http://localhost:5000` likha hai (jaise `axios.get`), use ek **Environment Variable** se replace karna hoga.
Root me `.env` file banao:
`VITE_API_URL=https://tumhara-backend-url.onrender.com`

Code me isko aise use karo:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const res = await axios.get(`${API_URL}/api/appointments`);
```
*Note: Iske baad dono changes ko GitHub par push kar dena (`git add .`, `git commit`, `git push`).*

---

## 🗄️ Step 2: Database (MongoDB Atlas)
Agar tumhara MongoDB abhi tumhare computer (localhost) me hai, toh tumhe use Cloud par dalna hoga.
1. **MongoDB Atlas** () par jao aur free account banao.https://www.mongodb.com/cloud/atlas
2. Naya cluster (database) create karo.
3. Network Access me jakar IP Address me `0.0.0.0/0` (Allow all) add karo taaki tumhara server database se connect ho sake.
4. "Connect" par click karke connection string copy karo:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/hospital_db`
   *(Ise save karke rakh lo, ye backend deploy me kaam aayega).*

---

## ⚙️ Step 3: Backend Deployment (Render.com par)
Backend host karne ke liye **Render** ek best aur free platform hai.

1. **Render.com** par jao aur GitHub se login karo.
2. New -> **Web Service** select karo.
3. Apna GitHub repository connect karo.
4. Settings aise rakho:
   - **Root Directory:** `backend` (kyunki tumhara backend folder is naam se hai)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables** add karo (Bohot Zaroori):
   - `MONGO_URI` = (Atlas wali connection string)
   - `JWT_SECRET` = (Koi bhi secret password)
   - `GEMINI_API_KEY` = (Google Gemini AI ki api key)
   - `PORT` = `5000`
6. **Deploy** par click karo. Kuch minute me tumhara backend live ho jayega aur tumhe ek link milega (e.g. `https://hospital-api-xyz.onrender.com`).

---

## 🎨 Step 4: Frontend Deployment (Vercel par)
Frontend (React/Vite) host karne ke liye **Vercel** sabse accha aur fast platform hai.

1. **Vercel.com** par jao aur GitHub se login karo.
2. "Add New Project" par click karo aur apna GitHub repo import karo.
3. **Framework Preset** me automatically `Vite` select ho jayega.
4. **Root Directory:** `frontend` set karo (kyunki tumhara frontend code wahan hai).
5. **Environment Variables** me ye add karo:
   - `VITE_API_URL` = (Jo backend ka link tumne abhi Render se liya hai, bina last ke '/' ke).
6. **Deploy** par click karo.
7. 2-3 minute me Vercel tumhari website live kar dega aur tumhe ek public URL (e.g. `https://ai-hospital.vercel.app`) de dega!

---

## 🎉 Final Step: Live Testing
Apni Vercel ki live link ko kisi bhi device ya mobile par open karo. Register karo, aur dekho ki frontend aur backend cloud par ek dusre ke sath properly kaam kar rahe hain. 

**Congratulations! Tumhara project ab global internet par live hai aur kisi ko bhi showoff karne ke liye taiyar hai! 🚀**
