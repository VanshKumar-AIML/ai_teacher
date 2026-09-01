import os
import requests
import time
import json
from typing import List, Dict, Any

DID_API_KEY = os.getenv("DID_API_KEY")
DID_API_URL = "https://api.d-id.com/talks"

def generate_video(lesson_plan: Dict[str, Any], language: str = "en", avatar_id: str = None) -> str:
    """
    Generates a video using D-ID API.
    Returns the URL to the generated video.
    """
    if not DID_API_KEY:
        raise ValueError("DID_API_KEY not set")

    # Build script from lesson plan
    script_text = f"{lesson_plan['introduction']}\n\n"
    for concept in lesson_plan["concepts"]:
        script_text += f"{concept['title']}: {concept['explanation']}\n\n"
        script_text += f"Example: {concept['example']}\n\n"
    script_text += f"Summary: {lesson_plan['summary']}"

    # Choose voice based on language
    voice_id = "en-US-JennyNeural" if language == "en" else "hi-IN-SwaraNeural"
    if language == "es":
        voice_id = "es-ES-ElviraNeural"
    # Add more mappings as needed

    payload = {
        "script": {
            "type": "text",
            "subtitles": True,
            "provider": {
                "type": "microsoft",
                "voice_id": voice_id
            },
            "input": script_text
        },
        "config": {
            "fluent": True,
            "stitch": True
        },
        "avatar_id": avatar_id or "c39e9a41-519c-4b2a-bcda-1d337886583d"
    }
    headers = {
        "Authorization": f"Basic {DID_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(DID_API_URL, json=payload, headers=headers)
    if response.status_code != 201:
        raise Exception(f"D-ID API error: {response.text}")
    talk_id = response.json()["id"]

    # Poll for completion (simplified - could use webhooks)
    for _ in range(30):
        time.sleep(2)
        status_response = requests.get(f"{DID_API_URL}/{talk_id}", headers=headers)
        if status_response.status_code == 200:
            data = status_response.json()
            if data.get("status") == "done":
                return data.get("result_url")
            elif data.get("status") == "error":
                raise Exception(f"Video generation error: {data}")
    raise TimeoutError("Video generation timed out")