from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class Location(BaseModel):
    """Location within a day plan"""
    name: str
    lat: Optional[float] = None  # Optional - may not have coordinates if place not found
    lng: Optional[float] = None  # Optional - may not have coordinates if place not found
    rating: Optional[float] = None
    type: Optional[str] = None  # e.g., "restaurant", "attraction", "hotel"
    place_id: Optional[str] = None


class DayPlan(BaseModel):
    """Day plan within an itinerary"""
    day_number: int = Field(ge=1, description="Day number (1-indexed)")
    description: str = Field(description="AI-generated description for the day")
    locations: List[Location] = Field(default_factory=list, description="Locations for this day")


class ItineraryBase(BaseModel):
    """Base itinerary model"""
    destination: str = Field(description="Travel destination")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration: int = Field(ge=1, le=14, description="Number of days (1-14)")
    budget: Optional[str] = None  # Budget range (e.g., "budget-friendly", "$500-1000", "luxury")


class ItineraryCreate(ItineraryBase):
    """Model for creating an itinerary"""
    preferences: Optional[str] = None  # User preferences for itinerary generation


class ItineraryUpdate(BaseModel):
    """Model for updating an itinerary"""
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[str] = None
    preferences: Optional[str] = None


class ItineraryResponse(ItineraryBase):
    """Response model for itinerary"""
    id: str
    user_id: str
    day_plans: List[DayPlan] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class ItineraryListItem(BaseModel):
    """Simplified itinerary model for list views"""
    id: str
    destination: str
    duration: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

