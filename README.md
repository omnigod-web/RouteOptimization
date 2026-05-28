# Fuel Route Optimization

Fuel Route Optimization is a full-stack web app for planning fuel stops between two Indian cities. The frontend lets users enter a start and destination city, then the backend calculates an optimized route with fuel stops, estimated distance, estimated cost, and map coordinates.

## Live Links

- Frontend: https://route-optimization-nishant.vercel.app
- Backend API: https://route-optimization-api.vercel.app
- Health check: https://route-optimization-api.vercel.app/health

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, Leaflet, React Leaflet
- Backend: Node.js, Express, csvtojson
- Deployment: Vercel

## Project Structure

```text
FuelOptimizationApi/
|-- Backend/
|   |-- data/
|   |-- src/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   `-- services/
|   |-- package.json
|   `-- vercel.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   `-- App.jsx
|   |-- package.json
|   `-- vercel.json
`-- vercel.json
```

## Backend API

### Health Check

```http
GET /health
```

Example:

```bash
curl https://route-optimization-api.vercel.app/health
```

### Plan Route

```http
POST /api/route
Content-Type: application/json
```

Request body:

```json
{
  "start": "Delhi",
  "end": "Mumbai"
}
```

Example:

```bash
curl -X POST https://route-optimization-api.vercel.app/api/route \
  -H "Content-Type: application/json" \
  -d "{\"start\":\"Delhi\",\"end\":\"Mumbai\"}"
```

## Local Development

### Backend

```bash
cd Backend
npm install
npm start
```

The backend runs locally on:

```text
http://localhost:3000
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

## Deployment

This repository is deployed as two separate Vercel projects.

### Backend Project

- Vercel project: `route-optimization-api`
- Root directory: `Backend`
- Production URL: https://route-optimization-api.vercel.app

Manual deploy:

```bash
cd Backend
npx vercel --prod
```

### Frontend Project

- Vercel project: `route-optimization`
- Root directory: `frontend`
- Production URL: https://route-optimization-nishant.vercel.app

The frontend must have this Vercel environment variable:

```env
VITE_API_URL=https://route-optimization-api.vercel.app
```

Manual deploy:

```bash
cd frontend
npx vercel --prod
```

## Auto Deploy

After connecting both Vercel projects to GitHub, pushing changes to GitHub will automatically redeploy the app.

```bash
git add .
git commit -m "add new feature"
git push
```

## Notes

- Do not commit `.env`, `.env.local`, or `.vercel` folders.
- Keep production environment variables in the Vercel dashboard.
- Use city names that exist in `Backend/data/geocoded_stations.json`.
