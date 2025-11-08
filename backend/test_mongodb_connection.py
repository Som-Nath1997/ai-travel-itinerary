#!/usr/bin/env python3
"""
Test MongoDB connection script
Run this to diagnose connection issues
"""
import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus

load_dotenv()

def encode_mongodb_uri(uri: str) -> str:
    """Encode MongoDB URI credentials"""
    if not uri or "mongodb+srv://" not in uri:
        return uri
    
    try:
        protocol = "mongodb+srv://"
        rest = uri[len(protocol):]
        
        if "@" not in rest:
            return uri
        
        credentials_part, host_part = rest.rsplit("@", 1)
        
        if ":" in credentials_part:
            username, password = credentials_part.split(":", 1)
            encoded_username = quote_plus(username)
            encoded_password = quote_plus(password)
            encoded_credentials = f"{encoded_username}:{encoded_password}"
        else:
            encoded_credentials = quote_plus(credentials_part)
        
        return f"{protocol}{encoded_credentials}@{host_part}"
    except Exception:
        return uri

async def test_connection():
    """Test MongoDB connection"""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found in .env file")
        return
    
    print("📋 Connection Details:")
    print(f"   Original URI: {database_url[:50]}...")
    
    # Encode the URI
    encoded_url = encode_mongodb_uri(database_url)
    print(f"   Encoded URI: {encoded_url[:50]}...")
    print()
    
    # Extract username for display
    try:
        if "mongodb+srv://" in database_url:
            rest = database_url[len("mongodb+srv://"):]
            if "@" in rest:
                creds = rest.split("@")[0]
                if ":" in creds:
                    username = creds.split(":")[0]
                    print(f"   Username: {username}")
    except:
        pass
    
    print()
    print("🔌 Attempting connection...")
    
    try:
        client = AsyncIOMotorClient(encoded_url, serverSelectionTimeoutMS=5000)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        print()
        
        # Get database info
        db = client.get_database()
        print(f"📊 Database name: {db.name}")
        
        # List collections
        collections = await db.list_collection_names()
        print(f"📁 Collections: {collections if collections else 'None (empty database)'}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed!")
        print(f"   Error: {e}")
        print()
        print("🔍 Troubleshooting steps:")
        print("   1. Verify username and password in MongoDB Atlas → Database Access")
        print("   2. Check Network Access → Whitelist your IP (or allow 0.0.0.0/0 for dev)")
        print("   3. Make sure cluster is running (not paused)")
        print("   4. Try creating a new database user without special characters")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())

