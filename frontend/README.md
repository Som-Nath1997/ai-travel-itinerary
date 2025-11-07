# Frontend - AI Travel Itinerary Generator

Next.js frontend for the AI Travel Itinerary Generator application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL:
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Health Check

Visit `http://localhost:3000/health` to check the status of both frontend and backend.

## Project Structure

```
frontend/
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   ├── health/      # Health check page
│   └── globals.css  # Global styles
├── components/       # React components (to be added)
├── lib/             # Utility functions (to be added)
└── public/          # Static assets
```

## Next Steps

- Install shadcn/ui components
- Set up React Context for state management
- Create authentication pages
- Integrate Google Maps

