# EsportsEdge

Valorant-first esports prediction and analytics platform.

## Phase 1 Scope

- React + Vite frontend
- Express backend
- MongoDB connection helper
- Health-check API
- Frontend to backend health-check call
- Socket.IO server bootstrap for later real-time updates

## Run Locally

1. Install dependencies:

```bash
npm install
npm --prefix client install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally, or leave it offline while testing the API shell.

4. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## Scripts

- `npm run dev`: run frontend and backend together
- `npm run server:dev`: run backend only
- `npm run client:dev`: run frontend only
- `npm run client:build`: build frontend
- `npm test`: run backend tests

