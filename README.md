# WeatherDash

Weather dashboard with multi-city tracking and caching.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Backend**: Express.js, Prisma, PostgreSQL, Redis
- **Infrastructure**: Docker Compose

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenWeatherMap API key

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start services with Docker**
   ```bash
   docker-compose up -d
   ```
   Runs PostgreSQL (5432) and Redis (6379)

3. **Environment setup**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   ```
   
   Edit `backend/.env`:
   ```env
   DATABASE_URL="postgresql://weatheruser:weatherpass@localhost:5432/weatherdash"
   REDIS_URL="redis://localhost:6379"
   OPENWEATHER_API_KEY="your_api_key"
   ```

   ```bash
   # Frontend
   cd frontend
   cp env.local.example .env.local
   ```

4. **Database setup**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development**
   ```bash
   npm run dev
   ```

## Access

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Docker Services

- **PostgreSQL**: Stores user data, cities, and weather cache
- **Redis**: Primary caching layer for weather data
- **Fallback**: App uses memory cache if Redis/database unavailable

## Commands

```bash
npm run dev              # Start both frontend and backend
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run db:migrate       # Run database migrations
npm run build           # Build for production
```
