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
- Admin-only APIs for teams, players, tournaments, matches, maps, and agents
- Admin panel UI for creating and listing core esports data

## Run Locally

1. Install dependencies:

```bash
npm install
npm --prefix client install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally for register/login/admin data to work.

4. Set an `ADMIN_INVITE_CODE` in `.env` if you want to create an admin account.

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

To create an admin user locally, enter the same `ADMIN_INVITE_CODE` while registering.

## Auth Endpoints

- `POST /api/auth/register`: create a user account
- `POST /api/auth/login`: log in and receive a JWT
- `GET /api/auth/profile`: protected profile route, requires `Authorization: Bearer <token>`

## Admin Endpoints

All admin endpoints require an admin JWT.

- `GET /api/admin/teams`
- `POST /api/admin/teams`
- `GET /api/admin/players`
- `POST /api/admin/players`
- `GET /api/admin/tournaments`
- `POST /api/admin/tournaments`
- `GET /api/admin/matches`
- `POST /api/admin/matches`
- `GET /api/admin/maps`
- `POST /api/admin/maps`
- `GET /api/admin/agents`
- `POST /api/admin/agents`

## Scripts

- `npm run dev`: run frontend and backend together
- `npm run server:dev`: run backend only
- `npm run client:dev`: run frontend only
- `npm run client:build`: build frontend
- `npm test`: run backend tests
