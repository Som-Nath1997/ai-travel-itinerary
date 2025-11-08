from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from urllib.parse import quote_plus

from routers import auth, users

# Load environment variables
load_dotenv()

# Database connection
client = None
database = None


def encode_mongodb_uri(uri: str) -> str:
    """
    Encode MongoDB URI credentials if they contain special characters.
    Handles cases where username/password contain @, :, /, etc.
    """
    if not uri or "mongodb+srv://" not in uri:
        return uri
    
    try:
        # Extract parts of the URI
        protocol = "mongodb+srv://"
        rest = uri[len(protocol):]
        
        # Find the @ symbol that separates credentials from host
        if "@" not in rest:
            return uri
        
        # Split credentials and host
        credentials_part, host_part = rest.rsplit("@", 1)
        
        # Split username and password
        if ":" in credentials_part:
            username, password = credentials_part.split(":", 1)
            # URL encode username and password
            encoded_username = quote_plus(username)
            encoded_password = quote_plus(password)
            encoded_credentials = f"{encoded_username}:{encoded_password}"
        else:
            # Only username, no password
            encoded_credentials = quote_plus(credentials_part)
        
        # Reconstruct the URI
        return f"{protocol}{encoded_credentials}@{host_part}"
    except Exception:
        # If encoding fails, return original URI
        return uri


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global client, database
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        # Encode credentials in connection string
        encoded_url = encode_mongodb_uri(database_url)
        client = AsyncIOMotorClient(encoded_url)
        # Extract database name from URL or use default
        db_name = "travelitinerary"
        if "/" in encoded_url.split("@")[-1]:
            # Try to extract from URL
            url_parts = encoded_url.split("/")
            if len(url_parts) > 3:
                db_part = url_parts[-1].split("?")[0]
                if db_part:
                    db_name = db_part
        database = client.get_database(db_name)
        # Test connection
        try:
            await client.admin.command('ping')
            print("✅ MongoDB connection successful")
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
    yield
    # Shutdown
    if client is not None:
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

# Include routers
app.include_router(auth.router)
app.include_router(users.router)


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint that verifies MongoDB connection"""
    try:
        if client is not None and database is not None:
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

