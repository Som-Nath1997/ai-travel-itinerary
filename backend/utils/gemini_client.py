import os
import json
import re
from typing import List, Dict, Optional
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


def generate_itinerary_prompt(destination: str, duration: int, preferences: str = None, budget: str = None) -> str:
    """Generate the prompt for AI to create an itinerary"""
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
    """Parse AI response and extract itinerary data"""
    try:
        # Try to extract JSON from the response
        cleaned = response_text.strip()
        
        # Remove markdown code blocks if present
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
        
        return []


async def generate_itinerary_content(
    destination: str, 
    duration: int, 
    preferences: str = None,
    budget: str = None
) -> List[Dict]:
    """
    Generate itinerary content using Google Gemini API (FREE)
    
    Returns:
        List of day plans with descriptions and place names
    """
    try:
        api_key = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        
        if not api_key:
            raise Exception("GOOGLE_GEMINI_API_KEY or GOOGLE_API_KEY not configured. Get a free key at https://makersuite.google.com/app/apikey")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Use Gemini 2.0 Flash (free tier, fast and available)
        # Try newer models first, fallback to older if needed
        model = None
        model_names = [
            'gemini-2.0-flash',      # Latest free model (recommended)
            'gemini-2.5-flash',      # Alternative free model
            'gemini-1.5-flash',      # Older but still available
            'gemini-1.5-pro',        # Pro version if available
        ]
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                break  # Success, use this model
            except Exception:
                continue  # Try next model
        
        if model is None:
            raise Exception("No available Gemini model found. Please check your API access.")
        
        prompt = generate_itinerary_prompt(destination, duration, preferences, budget)
        
        # Generate content (run in executor since Gemini API is synchronous)
        import asyncio
        
        def generate_sync():
            return model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 2000,
                }
            )
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, generate_sync)
        response_text = response.text
        itinerary_data = parse_ai_response(response_text)
        
        # Ensure we have the right number of days
        if len(itinerary_data) < duration:
            for day_num in range(len(itinerary_data) + 1, duration + 1):
                itinerary_data.append({
                    "day": day_num,
                    "description": f"Day {day_num} in {destination} - explore local attractions and enjoy the culture.",
                    "places": []
                })
        elif len(itinerary_data) > duration:
            itinerary_data = itinerary_data[:duration]
        
        return itinerary_data
        
    except Exception as e:
        raise Exception(f"Failed to generate itinerary with Gemini: {str(e)}")

