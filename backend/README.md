# Backend - AI Travel Itinerary Generator

FastAPI backend for the AI Travel Itinerary Generator application.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your actual credentials:
- `DATABASE_URL`: MongoDB Atlas connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_API_KEY`: Your Google Places API key
- `SECRET_KEY`: A secret key for JWT token signing
- `ALGORITHM`: JWT algorithm (default: HS256)

## Running the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Health Check

Test the health endpoint:
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

