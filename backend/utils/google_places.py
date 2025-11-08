import os
import aiohttp
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place"


async def search_place(place_name: str, location: str = None) -> Optional[Dict]:
    """
    Search for a place using Google Places API Text Search
    
    Args:
        place_name: Name of the place to search
        location: Optional location hint (e.g., "Paris, France")
    
    Returns:
        Place details including coordinates, rating, etc.
    """
    if not GOOGLE_API_KEY:
        raise Exception("GOOGLE_API_KEY not configured")
    
    try:
        # Text Search API
        url = f"{GOOGLE_PLACES_BASE_URL}/textsearch/json"
        params = {
            "query": f"{place_name} {location}" if location else place_name,
            "key": GOOGLE_API_KEY
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("status") == "OK" and data.get("results"):
                        result = data["results"][0]  # Get first result
                        geometry = result.get("geometry", {})
                        location_data = geometry.get("location", {})
                        
                        return {
                            "name": result.get("name", place_name),
                            "lat": location_data.get("lat"),
                            "lng": location_data.get("lng"),
                            "rating": result.get("rating"),
                            "place_id": result.get("place_id"),
                            "types": result.get("types", []),
                            "formatted_address": result.get("formatted_address")
                        }
                    else:
                        # Place not found, return None
                        return None
                else:
                    raise Exception(f"Google Places API error: {response.status}")
                    
    except Exception as e:
        # Log error but don't fail completely
        print(f"Error searching for place '{place_name}': {str(e)}")
        return None


async def get_place_details(place_id: str) -> Optional[Dict]:
    """
    Get detailed information about a place using place_id
    
    Args:
        place_id: Google Places place_id
    
    Returns:
        Detailed place information
    """
    if not GOOGLE_API_KEY:
        raise Exception("GOOGLE_API_KEY not configured")
    
    try:
        url = f"{GOOGLE_PLACES_BASE_URL}/details/json"
        params = {
            "place_id": place_id,
            "fields": "name,geometry,rating,types,formatted_address",
            "key": GOOGLE_API_KEY
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("status") == "OK":
                        result = data.get("result", {})
                        geometry = result.get("geometry", {})
                        location_data = geometry.get("location", {})
                        
                        return {
                            "name": result.get("name"),
                            "lat": location_data.get("lat"),
                            "lng": location_data.get("lng"),
                            "rating": result.get("rating"),
                            "place_id": place_id,
                            "types": result.get("types", []),
                            "formatted_address": result.get("formatted_address")
                        }
                    else:
                        return None
                else:
                    raise Exception(f"Google Places API error: {response.status}")
                    
    except Exception as e:
        print(f"Error getting place details for '{place_id}': {str(e)}")
        return None


async def enrich_places_with_google_data(
    place_names: List[str], 
    destination: str
) -> List[Dict]:
    """
    Enrich a list of place names with Google Places data
    
    Args:
        place_names: List of place names to look up
        destination: Destination city/country for context
    
    Returns:
        List of enriched place data
    """
    enriched_places = []
    
    for place_name in place_names:
        if not place_name.strip():
            continue
            
        place_data = await search_place(place_name, destination)
        
        if place_data:
            # Determine place type from Google types
            types = place_data.get("types", [])
            place_type = None
            if any(t in types for t in ["restaurant", "food", "cafe", "meal_takeaway"]):
                place_type = "restaurant"
            elif any(t in types for t in ["tourist_attraction", "museum", "park", "zoo"]):
                place_type = "attraction"
            elif any(t in types for t in ["lodging", "hotel"]):
                place_type = "hotel"
            else:
                place_type = "attraction"  # Default
            
            enriched_places.append({
                "name": place_data["name"],
                "lat": place_data["lat"],
                "lng": place_data["lng"],
                "rating": place_data.get("rating"),
                "type": place_type,
                "place_id": place_data.get("place_id")
            })
        else:
            # If place not found, still include it with minimal data
            enriched_places.append({
                "name": place_name,
                "lat": None,
                "lng": None,
                "rating": None,
                "type": None,
                "place_id": None
            })
    
    return enriched_places

