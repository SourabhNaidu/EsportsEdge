# EsportsEdge

Valorant-first esports prediction and analytics platform.

## Current Scope

- React + Vite frontend
- Express backend
- MongoDB connection helper
- Health-check API
- Frontend to backend health-check call
- Socket.IO server bootstrap for later real-time updates
- User registration API
- User login API
- JWT auth middleware
- Protected profile API
- Register/login/profile UI flow

## Run Locally

1. Install dependencies:

```bash
npm install
npm --prefix client install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally for register/login to work.

4. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## Auth Endpoints

- `POST /api/auth/register`: create a user account
- `POST /api/auth/login`: log in and receive a JWT
- `GET /api/auth/profile`: protected profile route, requires `Authorization: Bearer <token>`

## Scripts

- `npm run dev`: run frontend and backend together
- `npm run server:dev`: run backend only
- `npm run client:dev`: run frontend only
- `npm run client:build`: build frontend
- `npm test`: run backend tests
