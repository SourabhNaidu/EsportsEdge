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
- Public match browsing API with search and status filters
- Match board UI with selectable match details
- Prediction API with one prediction per user per match
- Prediction UI for winner, scoreline, top fragger, and first map winner
- Admin match result entry
- Automatic prediction scoring after a result is submitted
- Leaderboard API and UI
- Rule-based match analytics API and UI
- Socket.IO live notifications for completed matches and leaderboard updates

## Run Locally

1. Install dependencies:

```bash
npm install
npm --prefix client install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally for register/login/admin data to work.

```bash
docker compose up -d mongo
```

4. Set an `ADMIN_INVITE_CODE` in `.env` if you want to create an admin account.

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

To create an admin user locally, enter the same `ADMIN_INVITE_CODE` while registering.

6. Add realistic Valorant seed data:

```bash
npm run seed
```

The seed adds real Valorant-style teams, notable player handles, tournaments,
matches, agents, maps, and demo leaderboard users. Demo user password:
`Valorant123!`.

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
- `POST /api/admin/matches/:id/result`
- `GET /api/admin/maps`
- `POST /api/admin/maps`
- `GET /api/admin/agents`
- `POST /api/admin/agents`

## Match Endpoints

- `GET /api/matches`: list matches, supports `status` and `q` query params
- `GET /api/matches/:id`: view match details

When MongoDB is offline, the match list returns demo fixtures so the frontend still works as a deployable preview.

## Prediction Endpoints

- `POST /api/predictions`: create a match prediction, requires login
- `GET /api/predictions/matches/:matchId/me`: view your prediction for a match
- `GET /api/predictions/matches/:matchId/percentages`: view prediction crowd percentages

## Analytics And Leaderboard

- `GET /api/analytics/matches/:matchId`: rule-based momentum, map advantage, and upset alert
- `GET /api/leaderboard`: ranked users by prediction points

## MVP Flow

1. Register with `ADMIN_INVITE_CODE` to create an admin.
2. Use Admin to create teams, a tournament, and a match.
3. Register or login as a normal user.
4. Pick a match winner, scoreline, top fragger, and first map winner.
5. Login as admin and complete the match result.
6. Predictions are scored and leaderboard updates.

## Scripts

- `npm run dev`: run frontend and backend together
- `npm run server:dev`: run backend only
- `npm run client:dev`: run frontend only
- `npm run client:build`: build frontend
- `npm run seed`: add realistic Valorant demo data to MongoDB
- `npm test`: run backend tests
