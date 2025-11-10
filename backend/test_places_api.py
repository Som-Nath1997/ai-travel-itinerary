#!/usr/bin/env python3
"""
Test script to diagnose Google Places API issues
"""
import asyncio
import aiohttp
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv

load_dotenv()

async def test_places_api():
    """Test Google Places API with a known place"""
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment")
        print("   Check backend/.env file")
        return
    
    print(f"✅ GOOGLE_API_KEY found (length: {len(api_key)})")
    print(f"   Key preview: {api_key[:15]}...")
    
    # Test with Colosseum
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": "Colosseum Rome Italy",
        "key": api_key
    }
    
    print("\n🔍 Testing Google Places API...")
    print(f"   URL: {url}")
    print(f"   Query: {params['query']}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                print(f"\n📡 HTTP Response Status: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    api_status = data.get("status")
                    print(f"   API Status: {api_status}")
                    
                    if api_status == "OK" and data.get("results"):
                        result = data["results"][0]
                        location = result.get("geometry", {}).get("location", {})
                        
                        print("\n✅ SUCCESS! Place found:")
                        print(f"   Name: {result.get('name')}")
                        print(f"   Coordinates: {location.get('lat')}, {location.get('lng')}")
                        print(f"   Rating: {result.get('rating')}")
                        print(f"   Place ID: {result.get('place_id')}")
                        print("\n✅ Google Places API is working correctly!")
                        
                    elif api_status == "REQUEST_DENIED":
                        error_msg = data.get("error_message", "No error message")
                        print(f"\n❌ REQUEST DENIED")
                        print(f"   Error: {error_msg}")
                        print("\n   Possible causes:")
                        print("   1. API key is invalid or expired")
                        print("   2. Places API is not enabled in Google Cloud Console")
                        print("   3. API key restrictions are blocking the request")
                        print("   4. Billing is not enabled (required even for free tier)")
                        print("\n   Fix:")
                        print("   - Go to: https://console.cloud.google.com/")
                        print("   - APIs & Services → Library → Search 'Places API' → Enable")
                        print("   - APIs & Services → Credentials → Check API key restrictions")
                        print("   - Billing → Ensure billing account is active")
                        
                    elif api_status == "ZERO_RESULTS":
                        print("\n❌ ZERO RESULTS - Place not found")
                        print("   This shouldn't happen for 'Colosseum Rome Italy'")
                        print("   Check if the query format is correct")
                        
                    elif api_status == "OVER_QUERY_LIMIT":
                        print("\n❌ OVER QUERY LIMIT")
                        print("   API quota exceeded")
                        print("   Check Google Cloud Console → APIs & Services → Dashboard")
                        
                    else:
                        error_msg = data.get("error_message", "No error message")
                        print(f"\n❌ API returned status: {api_status}")
                        print(f"   Error: {error_msg}")
                        
                elif response.status == 403:
                    print("\n❌ HTTP 403 Forbidden")
                    print("   API key is invalid or doesn't have permission")
                    print("   Check:")
                    print("   1. API key is correct")
                    print("   2. Places API is enabled")
                    print("   3. API key restrictions allow this request")
                    
                elif response.status == 400:
                    text = await response.text()
                    print(f"\n❌ HTTP 400 Bad Request")
                    print(f"   Response: {text[:200]}")
                    
                else:
                    text = await response.text()
                    print(f"\n❌ HTTP Error {response.status}")
                    print(f"   Response: {text[:500]}")
                    
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_places_api())

