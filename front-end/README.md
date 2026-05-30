# TripUnite Frontend

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## Scripts

Run development server:

```bash
npm start
```

Create production build:

```bash
npm run build
```

## Deployment (Vercel)

This folder contains `vercel.json` for SPA routing and static build output.

Before deploying, set:

- `REACT_APP_API_BASE_URL=https://<your-backend-domain>`
