# Visit Nepal Backend (`website/backend`)

Node.js + Express + TypeScript + PostgreSQL API server for the Visit Nepal web platform, aligned with `../../schema.sql` and `../../.env.example`.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Initialize PostgreSQL using the root `schema.sql`:
   ```bash
   psql "$DATABASE_URL" -f ../../schema.sql
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The API listens on `http://localhost:8080`.

## Endpoints

- `GET /api/health` — API + PostgreSQL connection status
- `POST /api/auth/login` — Role-aware JWT login
- `POST /api/auth/register` — Account registration
- `GET /api/auth/me` — Current authenticated user (Bearer JWT)
- `GET /api/destinations` — List/filter destinations (`?category=&q=`)
- `GET /api/destinations/:id` — Destination details
- `GET /api/services/hotels` | `/guides` | `/butlers` | `/permits`
- `GET /api/bookings` | `POST /api/bookings` | `PATCH /api/bookings/:id/cancel`
- `GET /api/community/posts` | `POST /api/community/posts`
- `GET /api/portals/admin` | `PATCH /api/portals/admin/businesses/:id/approve` | `PATCH /api/portals/admin/permits/:id/approve`

