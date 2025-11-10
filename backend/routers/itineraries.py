from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import List

from models.itinerary import (
    ItineraryCreate,
    ItineraryResponse,
    ItineraryListItem,
    ItineraryUpdate,
    DayPlan,
    Location
)
from routers.auth import get_current_user
# Use Gemini (free) as primary, with OpenAI as fallback
import os
from dotenv import load_dotenv
load_dotenv()

# Check which AI service to use (Gemini is free!)
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if GEMINI_API_KEY:
    from utils.gemini_client import generate_itinerary_content
    AI_SERVICE = "Gemini (Free)"
else:
    from utils.openai_client import generate_itinerary_content
    AI_SERVICE = "OpenAI"
from utils.google_places import enrich_places_with_google_data

router = APIRouter(prefix="/api/v1/itineraries", tags=["itineraries"])


# Dependency to get database
async def get_database():
    import main
    if main.database is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available"
        )
    return main.database


@router.post("/generate", response_model=ItineraryResponse, status_code=status.HTTP_201_CREATED)
async def generate_itinerary(
    itinerary_data: ItineraryCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Generate a new AI-powered travel itinerary
    
    This endpoint:
    1. Calls OpenAI to generate itinerary structure
    2. Enriches place names with Google Places data
    3. Saves the complete itinerary to database
    """
    user_id = current_user["id"]
    
    # Check max 5 itineraries limit
    existing_count = await db.itineraries.count_documents({"user_id": user_id})
    if existing_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum of 5 itineraries allowed per user"
        )
    
    try:
        # Step 1: Generate itinerary content using AI (Gemini/OpenAI)
        ai_itinerary = await generate_itinerary_content(
            destination=itinerary_data.destination,
            duration=itinerary_data.duration,
            preferences=itinerary_data.preferences,
            budget=itinerary_data.budget
        )
        
        # Step 2: Enrich places with Google Places data
        day_plans = []
        for day_data in ai_itinerary:
            day_number = day_data.get("day", len(day_plans) + 1)
            description = day_data.get("description", f"Day {day_number} activities")
            places = day_data.get("places", [])
            
            # Enrich places with Google data
            enriched_locations = await enrich_places_with_google_data(
                place_names=places,
                destination=itinerary_data.destination
            )
            
            # Convert to Location models (handle None coordinates)
            locations = [
                Location(
                    name=loc["name"],
                    lat=loc.get("lat"),  # Can be None if place not found
                    lng=loc.get("lng"),  # Can be None if place not found
                    rating=loc.get("rating"),
                    type=loc.get("type"),
                    place_id=loc.get("place_id")
                )
                for loc in enriched_locations
            ]
            
            day_plans.append({
                "day_number": day_number,
                "description": description,
                "locations": [loc.dict() for loc in locations]
            })
        
        # Step 3: Calculate dates if provided
        start_date = itinerary_data.start_date
        end_date = itinerary_data.end_date
        
        # Step 4: Save to database
        itinerary_doc = {
            "user_id": user_id,
            "destination": itinerary_data.destination,
            "duration": itinerary_data.duration,
            "start_date": start_date.isoformat() if start_date else None,
            "end_date": end_date.isoformat() if end_date else None,
            "budget": itinerary_data.budget,
            "preferences": itinerary_data.preferences,
            "day_plans": day_plans,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.itineraries.insert_one(itinerary_doc)
        itinerary_id = str(result.inserted_id)
        
        # Step 5: Return response
        return ItineraryResponse(
            id=itinerary_id,
            user_id=user_id,
            destination=itinerary_data.destination,
            duration=itinerary_data.duration,
            start_date=start_date,
            end_date=end_date,
            budget=itinerary_data.budget,
            day_plans=[DayPlan(**dp) for dp in day_plans],
            created_at=itinerary_doc["created_at"],
            updated_at=itinerary_doc["updated_at"]
        )
        
    except Exception as e:
        error_message = str(e)
        
        # Check for quota/rate limit errors (works for both Gemini and OpenAI)
        if "insufficient_quota" in error_message or "429" in error_message or "quota" in error_message.lower():
            service_name = AI_SERVICE
            if "Gemini" in service_name:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="Google Gemini API quota exceeded. Please check your Google Cloud Console billing and API quotas, or wait a few minutes and try again."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="OpenAI API quota exceeded. Please check your OpenAI account billing and add credits."
                )
        elif "invalid_api_key" in error_message.lower() or "401" in error_message or "api key" in error_message.lower():
            service_name = AI_SERVICE
            if "Gemini" in service_name:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Google Gemini API key is invalid. Please check your GOOGLE_GEMINI_API_KEY configuration."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="OpenAI API key is invalid. Please check your API key configuration."
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate itinerary with {AI_SERVICE}: {error_message}"
            )


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(
    itinerary_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific itinerary by ID"""
    user_id = current_user["id"]
    
    # Validate ObjectId
    if not ObjectId.is_valid(itinerary_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid itinerary ID"
        )
    
    # Find itinerary
    itinerary = await db.itineraries.find_one({
        "_id": ObjectId(itinerary_id),
        "user_id": user_id
    })
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    # Convert to response model
    return ItineraryResponse(
        id=str(itinerary["_id"]),
        user_id=itinerary["user_id"],
        destination=itinerary["destination"],
        duration=itinerary["duration"],
        start_date=datetime.fromisoformat(itinerary["start_date"]).date() if itinerary.get("start_date") else None,
        end_date=datetime.fromisoformat(itinerary["end_date"]).date() if itinerary.get("end_date") else None,
        budget=itinerary.get("budget"),
        day_plans=[DayPlan(**dp) for dp in itinerary.get("day_plans", [])],
        created_at=itinerary["created_at"],
        updated_at=itinerary["updated_at"]
    )


@router.get("", response_model=List[ItineraryListItem])
async def list_itineraries(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """List all itineraries for the current user"""
    user_id = current_user["id"]
    
    # Find all user itineraries, sorted by created_at descending
    cursor = db.itineraries.find({"user_id": user_id}).sort("created_at", -1)
    itineraries = await cursor.to_list(length=10)  # Limit to 10 for now
    
    return [
        ItineraryListItem(
            id=str(it["_id"]),
            destination=it["destination"],
            duration=it["duration"],
            start_date=datetime.fromisoformat(it["start_date"]).date() if it.get("start_date") else None,
            end_date=datetime.fromisoformat(it["end_date"]).date() if it.get("end_date") else None,
            created_at=it["created_at"],
            updated_at=it["updated_at"]
        )
        for it in itineraries
    ]


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
async def update_itinerary(
    itinerary_id: str,
    itinerary_update: ItineraryUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update an existing itinerary"""
    user_id = current_user["id"]
    
    # Validate ObjectId
    if not ObjectId.is_valid(itinerary_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid itinerary ID"
        )
    
    # Find itinerary and verify ownership
    itinerary = await db.itineraries.find_one({
        "_id": ObjectId(itinerary_id),
        "user_id": user_id
    })
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    # Validate dates if both provided
    if itinerary_update.start_date and itinerary_update.end_date:
        if itinerary_update.start_date > itinerary_update.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date must be before end date"
            )
    
    # Build update document (only include fields that are provided)
    update_doc = {"updated_at": datetime.utcnow()}
    
    if itinerary_update.destination is not None:
        update_doc["destination"] = itinerary_update.destination
    
    if itinerary_update.start_date is not None:
        update_doc["start_date"] = itinerary_update.start_date.isoformat()
    elif itinerary_update.start_date is None and "start_date" in itinerary_update.model_dump(exclude_unset=True):
        update_doc["start_date"] = None
    
    if itinerary_update.end_date is not None:
        update_doc["end_date"] = itinerary_update.end_date.isoformat()
    elif itinerary_update.end_date is None and "end_date" in itinerary_update.model_dump(exclude_unset=True):
        update_doc["end_date"] = None
    
    if itinerary_update.budget is not None:
        update_doc["budget"] = itinerary_update.budget
    elif itinerary_update.budget is None and "budget" in itinerary_update.model_dump(exclude_unset=True):
        update_doc["budget"] = None
    
    if itinerary_update.preferences is not None:
        update_doc["preferences"] = itinerary_update.preferences
    elif itinerary_update.preferences is None and "preferences" in itinerary_update.model_dump(exclude_unset=True):
        update_doc["preferences"] = None
    
    # Update itinerary
    result = await db.itineraries.update_one(
        {"_id": ObjectId(itinerary_id), "user_id": user_id},
        {"$set": update_doc}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    # Fetch updated itinerary
    updated_itinerary = await db.itineraries.find_one({"_id": ObjectId(itinerary_id)})
    
    return ItineraryResponse(
        id=str(updated_itinerary["_id"]),
        user_id=updated_itinerary["user_id"],
        destination=updated_itinerary["destination"],
        duration=updated_itinerary["duration"],
        start_date=datetime.fromisoformat(updated_itinerary["start_date"]).date() if updated_itinerary.get("start_date") else None,
        end_date=datetime.fromisoformat(updated_itinerary["end_date"]).date() if updated_itinerary.get("end_date") else None,
        budget=updated_itinerary.get("budget"),
        day_plans=[DayPlan(**dp) for dp in updated_itinerary.get("day_plans", [])],
        created_at=updated_itinerary["created_at"],
        updated_at=updated_itinerary["updated_at"]
    )


@router.delete("/{itinerary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_itinerary(
    itinerary_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete an itinerary"""
    user_id = current_user["id"]
    
    # Validate ObjectId
    if not ObjectId.is_valid(itinerary_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid itinerary ID"
        )
    
    # Find itinerary and verify ownership
    itinerary = await db.itineraries.find_one({
        "_id": ObjectId(itinerary_id),
        "user_id": user_id
    })
    
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    # Delete itinerary (day plans are stored within, so they'll be deleted too)
    result = await db.itineraries.delete_one({
        "_id": ObjectId(itinerary_id),
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    
    return None

