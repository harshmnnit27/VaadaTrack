# VaadaTrack 🗳️
> Hold Indian politicians accountable — track election promises, verify fulfillment, demand transparency.

A full-stack **MERN + AI** web application that indexes election manifestos, extracts party promises using AI, and lets users verify whether those promises were kept.

## Screenshots

### Home Page
<img width="1467" height="800" alt="Screenshot 2026-06-14 at 11 37 45 PM" src="https://github.com/user-attachments/assets/9d0cf7b8-dcd9-4d2f-ad46-451858a9d486" />

### Parties & Fulfillment Stats
<!-- Add screenshot here -->

### Promise Tracker
<!-- Add screenshot here -->

### AI Chat (VaadaBot)
<!-- Add screenshot here -->

### Manifesto Q&A (RAG)
<!-- Add screenshot here -->

### Compare Parties
<!-- Add screenshot here -->

### Admin Panel
<!-- Add screenshot here -->

---

## Features

- **Promise Tracker** — Filter promises by party, category, status, and election year
- **Manifesto Archive** — Upload manifesto text; AI auto-indexes every promise
- **RAG-based Q&A** — Ask questions answered directly from the manifesto text (no hallucination)
- **AI Chat (VaadaBot)** — General political Q&A powered by LLaMA 3.3 70B via Groq
- **Party Comparison** — AI compares two parties on any topic using manifesto excerpts
- **Community Voting** — Users vote on whether a promise was fulfilled
- **Admin Panel** — Manage parties, promises; bulk AI extraction and analysis
- **JWT Auth** — Role-based access (admin / user)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| AI | Groq API — LLaMA 3.3 70B (free) |
| RAG | Custom TF-IDF embeddings + Cosine Similarity |
| Auth | JWT + bcrypt |

---

## Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/harshmnnit27/VaadaTrack.git
cd VaadaTrack

# 2. Install dependencies
cd backend && npm install && cd ../frontend && npm install

# 3. Configure environment — create backend/.env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=any_random_string
GROQ_API_KEY=gsk_...         # free at console.groq.com
PORT=8000

# 4. Seed sample data (5 parties, 12 promises, 10 manifestos)
cd backend
node utils/seed.js
node utils/seedManifestos.js

# 5. Run (open two terminals)
cd backend && npm start       # Terminal 1
cd frontend && npm start      # Terminal 2
```

App runs at `http://localhost:3000`  
Admin login: `admin@vaadatrack.com` / `admin123`

---

## Project Structure

```
VaadaTrack/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # MongoDB schemas (User, Party, Promise, Manifesto)
│   ├── routes/          # REST API endpoints
│   ├── services/        # aiService.js (Groq), ragService.js (TF-IDF)
│   └── utils/           # seed.js, seedManifestos.js, reindexManifestos.js
└── frontend/
    └── src/
        ├── components/  # Navbar, Cards, common UI
        ├── pages/       # Home, Parties, Promises, Chat, Compare, Admin
        └── services/    # api.js (all Axios calls)
```

---

## How RAG Works

1. Manifesto text is split into 100-word chunks with 20-word overlap
2. Each chunk is vectorized using TF-IDF
3. User query is vectorized the same way
4. Cosine similarity finds the top-5 most relevant chunks
5. Chunks are passed as context to Groq LLM → grounded, accurate answer

---

## Deploy

- **Database:** MongoDB Atlas (free M0 cluster)
- **Backend:** Render.com → root dir: `backend`, start: `node server.js`
- **Frontend:** Vercel → root dir: `frontend`

Add env variables on Render: `MONGODB_URI`, `GROQ_API_KEY`, `JWT_SECRET`, `PORT=10000`
