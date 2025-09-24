# Painter Booking Backend

Express + TypeScript + Prisma backend for the Adam Painter Booking app.

## Quick Start

1. Install deps
   ```bash
   npm install
   ```
2. Start Postgres via Docker (optional)
   ```bash
   docker-compose up postgres -d
   ```
3. Migrate and generate client
   ```bash
   npx prisma migrate dev --name init
   npm run db:generate
   ```
4. Seed
   ```bash
   npm run db:seed
   ```
5. Run dev server
   ```bash
   npm run dev
   ```

Health check: `GET /health`

## Environment

Create `.env` in `backend/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/painter_booking"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:5173,http://localhost:8080"
```

## API Overview

- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/demo-login` { role: 'painter' | 'customer' }
- POST `/availability` (painter)
- GET `/availability/me` (painter)
- DELETE `/availability/:id` (painter)
- POST `/booking-request` (customer)
- GET `/bookings/me` (any, role-scoped)
- GET `/painter/bookings` (painter)
- GET `/customer/bookings` (customer)


Notes
- Use `/auth/demo-login` to auto-generate and login as a demo `painter` or `customer` without a signup flow.
- No `/api` prefix is used; endpoints are mounted at root.

