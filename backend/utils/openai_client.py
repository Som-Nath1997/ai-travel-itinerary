import os
import json
import re
from openai import OpenAI
from typing import List, Dict, Optional
from dotenv import load_dotenv
import httpx

load_dotenv()

# Lazy initialization of OpenAI client
_client: Optional[OpenAI] = None

def get_openai_client() -> OpenAI:
    """Get or create OpenAI client instance"""
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise Exception("OPENAI_API_KEY not configured in environment variables")
        
        # Create httpx client without proxy settings to avoid conflicts
        try:
            http_client = httpx.Client(
                timeout=60.0,
                # Explicitly don't use proxies
                proxies=None
            )
            _client = OpenAI(
                api_key=api_key,
                http_client=http_client
            )
        except TypeError:
            # If proxies parameter not supported, try without it
            try:
                http_client = httpx.Client(timeout=60.0)
                _client = OpenAI(
                    api_key=api_key,
                    http_client=http_client
                )
            except Exception:
                # Last resort: simple initialization
                _client = OpenAI(api_key=api_key)
    return _client


def generate_itinerary_prompt(destination: str, duration: int, preferences: str = None, budget: str = None) -> str:
    """Generate the prompt for OpenAI to create an itinerary"""
    base_prompt = f"""Create a detailed {duration}-day travel itinerary for {destination}.

Requirements:
- Provide a day-by-day plan with specific activities and locations
- Include a mix of attractions, restaurants, and cultural sites
- Make it realistic and practical
- Include specific place names that can be found on Google Maps

Format the response as JSON with this structure:
{{
  "itinerary": [
    {{
      "day": 1,
      "description": "Detailed description of the day's activities",
      "places": ["Place Name 1", "Place Name 2", "Place Name 3"]
    }},
    {{
      "day": 2,
      "description": "Detailed description of the day's activities",
      "places": ["Place Name 1", "Place Name 2", "Place Name 3"]
    }}
  ]
}}

Important:
- Return ONLY valid JSON, no markdown formatting
- Include 3-5 places per day
- Use specific, real place names that exist in {destination}
- Make descriptions engaging and informative
"""

    if budget:
        base_prompt += f"\n\nBudget Constraint: {budget} - Please suggest activities, restaurants, and accommodations that fit within this budget range."

    if preferences:
        base_prompt += f"\n\nUser Preferences: {preferences}"

    return base_prompt


def parse_ai_response(response_text: str) -> List[Dict]:
    """Parse OpenAI response and extract itinerary data"""
    try:
        # Try to extract JSON from the response
        # Remove markdown code blocks if present
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        # Parse JSON
        data = json.loads(cleaned)
        
        if "itinerary" in data:
            return data["itinerary"]
        else:
            # If structure is different, try to adapt
            return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        # Fallback: try to extract JSON using regex
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
                if "itinerary" in data:
                    return data["itinerary"]
            except:
                pass
        
        # Last resort: return empty list
        return []


async def generate_itinerary_content(
    destination: str, 
    duration: int, 
    preferences: str = None,
    budget: str = None
) -> List[Dict]:
    """
    Generate itinerary content using OpenAI API
    
    Returns:
        List of day plans with descriptions and place names
    """
    try:
        client = get_openai_client()
        prompt = generate_itinerary_prompt(destination, duration, preferences, budget)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini for cost efficiency, can upgrade to gpt-4 if needed
            messages=[
                {
                    "role": "system",
                    "content": "You are a travel planning expert. Create detailed, realistic travel itineraries with specific place names."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        response_text = response.choices[0].message.content
        itinerary_data = parse_ai_response(response_text)
        
        # Ensure we have the right number of days
        if len(itinerary_data) < duration:
            # Pad with additional days if needed
            for day_num in range(len(itinerary_data) + 1, duration + 1):
                itinerary_data.append({
                    "day": day_num,
                    "description": f"Day {day_num} in {destination} - explore local attractions and enjoy the culture.",
                    "places": []
                })
        elif len(itinerary_data) > duration:
            # Trim if too many days
            itinerary_data = itinerary_data[:duration]
        
        return itinerary_data
        
    except Exception as e:
        raise Exception(f"Failed to generate itinerary: {str(e)}")

