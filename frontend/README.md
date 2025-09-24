# Painter Booking Frontend

React + Vite + TypeScript UI for the Adam Painter Booking assignment.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Backend expected at `http://localhost:3001` (configured in `src/services/api.ts`).

## Features

- Role selection (Painter / Customer) with auto demo-login
- Painter: add availability, list my availability, delete slot
- Customer: request booking, list my bookings

## Demo authentication

- No manual signup/login needed.
- Selecting a role triggers `POST /auth/demo-login` and stores the JWT.
- All subsequent requests include `Authorization: Bearer <token>` automatically.

## API endpoints used

- POST `/auth/demo-login` { role }
- POST `/availability`
- GET `/availability/me`
- DELETE `/availability/:id`
- POST `/booking-request`
- GET `/bookings/me`

## Troubleshooting

- CORS: ensure backend `CORS_ORIGIN` includes your frontend origin (e.g. `http://localhost:5173`).
- 401 errors: re-select a role to refresh the demo token.
- No available painters: create a painter slot that overlaps the requested time window.
