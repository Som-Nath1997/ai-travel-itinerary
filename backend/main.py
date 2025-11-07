from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Database connection
client = None
database = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global client, database
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        client = AsyncIOMotorClient(database_url)
        database = client.get_database()
        # Test connection
        try:
            await client.admin.command('ping')
            print("✅ MongoDB connection successful")
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
    yield
    # Shutdown
    if client:
        client.close()


app = FastAPI(
    title="AI Travel Itinerary Generator API",
    description="Backend API for AI Travel Itinerary Generator",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint that verifies MongoDB connection"""
    try:
        if client and database:
            # Test MongoDB connection
            await client.admin.command('ping')
            return {
                "status": "ok",
                "database": "connected",
                "message": "Backend and database are operational"
            }
        else:
            return {
                "status": "ok",
                "database": "not_configured",
                "message": "Backend is operational but database not configured"
            }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "message": f"Database connection error: {str(e)}"
        }


@app.get("/")
async def root():
    return {"message": "AI Travel Itinerary Generator API"}

