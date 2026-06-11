# 🗳️ VaadaTrack — Election Manifesto & Promise Tracker

A full-stack MERN + AI project that tracks Indian political party manifestos,
extracts promises using Claude AI, and lets users verify whether promises were kept.

**Tech Stack:** MongoDB · Express · React · Node.js · Tailwind CSS · Claude AI (Anthropic) · RAG (TF-IDF)

---

## 📁 Folder Structure

```
vaadatrack/
├── backend/
│   ├── config/          db.js
│   ├── controllers/     authController, partyController, promiseController,
│   │                    manifestoController, aiController
│   ├── middleware/       auth.js
│   ├── models/          User, Party, Promise, Manifesto
│   ├── routes/          authRoutes, partyRoutes, promiseRoutes,
│   │                    manifestoRoutes, aiRoutes
│   ├── services/        aiService.js (Anthropic SDK)
│   │                    ragService.js (TF-IDF RAG)
│   ├── utils/           seed.js
│   ├── .env             ← YOU MUST FILL THIS
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/  Navbar, Footer, PartyCard, PromiseCard, common UI
        ├── context/     AuthContext.js
        ├── pages/       Home, Parties, PartyDetail, Promises, PromiseDetail,
        │                Manifestos, Chat (AI), Compare, Login, Register, Admin
        └── services/    api.js (all Axios calls)
```

---

## ✅ STEP 1 — Prerequisites (Install these first)

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| Git | https://git-scm.com |
| VS Code | https://code.visualstudio.com |

> After installing MongoDB, start it:
> - **Windows:** MongoDB runs as a service automatically after install
> - **Mac:** `brew services start mongodb-community`
> - **Linux:** `sudo systemctl start mongod`

---

## ✅ STEP 2 — Open in VS Code

1. Open VS Code
2. File → Open Folder → select the `vaadatrack` folder
3. Open Terminal in VS Code: `Ctrl + `` ` (backtick)

---

## ✅ STEP 3 — Set your API Keys

Open `backend/.env` and fill in:

```env
MONGODB_URI=mongodb://localhost:27017/vaadatrack
JWT_SECRET=vaadatrack_super_secret_2024_change_me
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx   ← Get from console.anthropic.com
PORT=5000
NODE_ENV=development
```

> Get your Anthropic API key at: https://console.anthropic.com/

---

## ✅ STEP 4 — Install Dependencies

In the VS Code terminal, run these ONE BY ONE:

```bash
# Root
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

---

## ✅ STEP 5 — Seed Sample Data (Recommended)

This adds BJP, INC, AAP, SP, BSP with ~12 sample promises:

```bash
cd backend
node utils/seed.js
cd ..
```

Expected output:
```
Connected to MongoDB
Admin created: admin@vaadatrack.com / admin123
Created 5 parties
Created 12 promises
Party stats updated
✅ Seed complete!
```

**Admin login:** `admin@vaadatrack.com` / `admin123`

---

## ✅ STEP 6 — Run the App (Development)

Open **two terminals** in VS Code:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
You'll see: `Server running on port 5000` and `MongoDB Connected`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
Browser opens at **http://localhost:3000** automatically.

> OR from the root folder, run both together:
> ```bash
> npm run dev
> ```

---

## ✅ STEP 7 — Use the App

### As a regular user:
1. Browse parties at `/parties`
2. Click a party to see its promise fulfillment stats
3. Go to `/promises` to filter by category, status, party
4. Go to `/chat` for AI-powered Q&A about Indian politics

### As admin (admin@vaadatrack.com / admin123):
1. Login and go to `/admin`
2. **Parties tab** — Add/edit/delete parties
3. **Promises tab** — Add promises manually, update their status
4. **Extract AI tab** — Select an indexed manifesto → AI extracts all promises automatically
5. **Analyze AI tab** — AI analyzes each promise and sets fulfillment status

### Upload a Manifesto (Admin):
1. Go to `/manifestos`
2. Click "Add Manifesto"
3. Paste the manifesto text (copy from party website or PDF)
4. Select party, election name, year
5. Click Submit — AI will index it in the background (~30 seconds)
6. Once status shows "indexed", you can ask AI questions about it

---

## 🤖 AI Features

| Feature | Where | What it does |
|---------|-------|-------------|
| General Chat | `/chat` | Talk to VaadaBot about any political topic |
| RAG Q&A | `/chat` (RAG mode) | Ask questions answered FROM the actual manifesto text |
| AI Extract | Admin → Extract AI | Reads manifesto, extracts 10-20 promises, saves to DB |
| AI Analyze | Admin → Analyze AI | Reads promise + evidence, sets Fulfilled/Broken/etc. |
| Compare Manifestos | `/compare` | AI compares two party manifestos on a topic |

---

## 🚀 DEPLOY — Option A: Render + MongoDB Atlas (Free)

### Step A1: MongoDB Atlas (Free Cloud DB)
1. Go to https://cloud.mongodb.com
2. Create free account → Create free cluster (M0)
3. Database Access → Add user (username + password)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Connect → Get connection string like:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/vaadatrack
   ```

### Step A2: Push to GitHub
```bash
# In the vaadatrack root folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vaadatrack.git
git push -u origin main
```

### Step A3: Deploy Backend on Render
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://...  (your Atlas URI)
   JWT_SECRET  = vaadatrack_super_secret_2024
   ANTHROPIC_API_KEY = sk-ant-...
   NODE_ENV = production
   PORT = 10000
   ```
5. Click Deploy — note the URL like `https://vaadatrack-api.onrender.com`

### Step A4: Deploy Frontend on Render (or Vercel)

**Option: Render Static Site**
1. New → Static Site → same repo
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
3. Add env variable:
   ```
   REACT_APP_API_URL = https://vaadatrack-api.onrender.com/api
   ```

**Option: Vercel (easier)**
1. Go to https://vercel.com → Import Git Repo
2. Set Root Directory to `frontend`
3. Add env: `REACT_APP_API_URL = https://vaadatrack-api.onrender.com/api`
4. Deploy

### Step A5: Update frontend API base URL

In `frontend/src/services/api.js`, change:
```js
const api = axios.create({ baseURL: '/api' });
```
to:
```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
});
```

---

## 🚀 DEPLOY — Option B: Railway (Easiest, everything in one)

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add two services: `backend` (Node) and `frontend` (Static/Node)
4. Set env variables same as Render above
5. Railway gives you a single dashboard for both

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `MongoDB connection refused` | Start MongoDB locally: `mongod` or use Atlas |
| `Cannot GET /api/...` | Backend not running — run `npm run dev` in backend |
| `ANTHROPIC_API_KEY is invalid` | Check your key in `backend/.env`, no extra spaces |
| `Module not found` | Run `npm install` in both backend and frontend |
| Frontend shows blank page | Check browser console, likely API URL mismatch |
| `nodemon not found` | `cd backend && npm install` |
| Manifesto stuck at "processing" | Check backend terminal for errors — usually API key issue |

---

## 📝 What's Left to Add (Future)

- PDF upload via multer (wiring for actual file upload is ready, just needs frontend UI)
- Evidence URLs for each promise
- News article scraping to auto-verify promises
- Twitter/X mentions tracker for party accountability
- State-level election tracking
- Mobile app (React Native)

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vaadatrack.com | admin123 |

> Change these after first login in production!
