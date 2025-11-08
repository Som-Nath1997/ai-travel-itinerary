# AI Travel Itinerary Generator

A full-stack web application that generates personalized travel itineraries using AI (Google Gemini/OpenAI) and Google Places API.

## Features

- 🤖 AI-powered itinerary generation based on destination, budget, days, and preferences
- 🗺️ Interactive Google Maps integration with location pins
- 👤 User authentication with JWT
- ✏️ Full CRUD operations for itineraries
- 💰 Budget-aware suggestions
- 📱 Responsive design

## Tech Stack

### Backend
- FastAPI (Python 3.12)
- MongoDB Atlas
- Google Gemini API (free) / OpenAI API
- Google Places API
- JWT Authentication

### Frontend
- Next.js 15 (TypeScript)
- Tailwind CSS
- Google Maps JavaScript API
- React Context API

## Quick Start

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_places_api_key
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
CORS_ORIGINS=http://localhost:3000
```

5. Run server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Run development server:
```bash
npm run dev
```

## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL`
   - `GOOGLE_GEMINI_API_KEY` (or `OPENAI_API_KEY`)
   - `GOOGLE_API_KEY`
   - `SECRET_KEY`
   - `ALGORITHM=HS256`
   - `CORS_ORIGINS=https://your-frontend.vercel.app`

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Deploy

## API Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user
- `POST /api/v1/itineraries/generate` - Generate itinerary
- `GET /api/v1/itineraries` - List itineraries
- `GET /api/v1/itineraries/{id}` - Get itinerary
- `PUT /api/v1/itineraries/{id}` - Update itinerary
- `DELETE /api/v1/itineraries/{id}` - Delete itinerary
- `GET /api/v1/health` - Health check

## License

MIT
