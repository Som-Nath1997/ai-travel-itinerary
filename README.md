# AI Travel Itinerary Generator

A web-based application that generates personalized, day-by-day travel plans using AI (OpenAI API) and real-world data (Google Places API).

## Project Structure

```
PRD/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── public/       # Static assets
├── backend/          # FastAPI backend application
│   ├── main.py       # FastAPI application entry point
│   └── requirements.txt
├── Development plan  # Development plan document
└── Refined prd       # Product requirements document
```

## Technology Stack

### Frontend
- **Framework**: Next.js (v15.x)
- **UI Library**: shadcn/ui (to be integrated)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Communication**: Axios

### Backend
- **Language**: Python (v3.12.x)
- **Framework**: FastAPI (v0.116.x)
- **Runtime**: Uvicorn (ASGI server)
- **Authentication**: JWT via python-jose
- **Data Validation**: Pydantic v2.x

### Database
- **DBaaS**: MongoDB Atlas (Free Tier)
- **ODM**: Motor / PyMongo

### External Integrations
- **OpenAI API**: For itinerary content generation
- **Google Places API**: For verifying points of interest & map pinning

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.12.x)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- Google Places API key

### Backend Setup

1. Navigate to backend directory:
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
# Copy the example and fill in your values
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
SECRET_KEY=your_secret_key_for_jwt_here
ALGORITHM=HS256
```

5. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
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
```

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Health Check

### Backend Health Check
```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "message": "Backend and database are operational"
}
```

### Frontend Health Check
Visit `http://localhost:3000/health` in your browser to see the status of both frontend and backend.

## API Documentation

Once the backend is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Development Status

### Sprint 0: Groundwork & Scaffolding ✅
- [x] Project structure created
- [x] Backend setup (FastAPI)
- [x] Frontend setup (Next.js)
- [x] Health check endpoints
- [x] Basic documentation

### Sprint 1: Core User Identity & Authentication (Next)
- [ ] User registration
- [ ] User login
- [ ] JWT authentication
- [ ] Protected routes

## Deployment

### Frontend: Vercel
- Connect to GitHub repository
- Configure environment variables
- Auto-deploy on push

### Backend: Render
- Connect to GitHub repository
- Configure environment variables (DATABASE_URL, OPENAI_API_KEY, GOOGLE_API_KEY)
- Auto-deploy on push

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key
- `GOOGLE_API_KEY`: Google Places API key
- `SECRET_KEY`: Secret key for JWT token signing
- `ALGORITHM`: JWT algorithm (default: HS256)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## License

This project is part of the AI Travel Itinerary Generator development plan.

