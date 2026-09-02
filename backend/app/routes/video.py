from fastapi import APIRouter, HTTPException
from app.models.schema import VideoRequest
from app.core.video_generator import generate_video
import uuid

router = APIRouter()
sessions = {}  # store video URLs and lesson plans

@router.post("/video")
async def create_video(request: VideoRequest):
    try:
        lesson_plan = request.lesson_plan.dict()
        video_url = generate_video(
            lesson_plan,
            language=request.language,
            avatar_id=request.avatar_id
        )
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "video_url": video_url,
            "lesson_plan": lesson_plan,
            "language": request.language
        }
        return {"session_id": session_id, "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))