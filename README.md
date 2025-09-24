# Adam Painter Booking (Monorepo)

Minimal scheduling system where painters define availability and customers request a time window. The backend auto-assigns an available painter.

- Backend: Express + TypeScript + Prisma + PostgreSQL (`backend/`)
- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui (`frontend/`)

## Project Structure

```
.
├── backend/   # API, Prisma schema, Docker setup
└── frontend/  # React UI (painter & customer flows)
```

## Prerequisites

- Node.js 18+
- npm
- Docker (optional for Postgres)

## Quick Start

1) Backend
```bash
cd backend
npm install
# Start Postgres (optional)
docker compose up postgres -d
# Migrate & generate client
npx prisma migrate dev --name init
npm run db:generate
# Seed demo users and availability
npm run db:seed
# Run API
npm run dev
```

2) Frontend
```bash
cd ../frontend
npm install
npm run dev
```

- API base: `http://localhost:3001`
- Health: `GET http://localhost:3001/health`

## Environment
Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/painter_booking"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:5173,http://localhost:8080"
```

## Authentication (Demo)
No manual signup needed. Click a role in the UI and it will call:
- `POST /auth/demo-login` with body `{ role: 'painter' | 'customer' }`
This returns a JWT; the frontend stores it and includes `Authorization: Bearer <token>` on all requests.

## Core Endpoints
- Painter Availability
  - POST `/availability`
  - GET `/availability/me`
  - DELETE `/availability/:id`
- Customer Booking
  - POST `/booking-request`
  - GET `/bookings/me`

## How to Demo
1) Choose “I’m a Painter” → add availability.
2) Switch to “I’m a Customer” → request a booking that overlaps a painter slot.
3) See assigned booking in customer view; painter can view bookings.

## Notes
- No `/api` prefix; endpoints are mounted at root.
- Prisma enforces one-to-one between `Booking` and `Availability`.
- CORS allows multiple origins; adjust `CORS_ORIGIN` if needed.

## Bonus Ideas (optional)
- Recommend closest available slot when none match.
- Smarter painter prioritization considering rating, workload, specialty.
