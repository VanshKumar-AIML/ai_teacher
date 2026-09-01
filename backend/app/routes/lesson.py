from fastapi import APIRouter, HTTPException
from app.models.schemas import LessonSettings, LessonPlan
from app.core.llm import generate_lesson_plan
from app.core.rag import RAGEngine
import os

router = APIRouter()
rag_engine = RAGEngine()

@router.post("/lesson", response_model=LessonPlan)
async def create_lesson(settings: LessonSettings):
    try:
        topic = settings.topic
        context = settings.file_content or ""
        # If file content is provided, index it for RAG
        if settings.file_content:
            rag_engine.index_document(settings.file_content, metadata={"source": "upload"})
            # Retrieve relevant context for the topic
            if topic:
                context += "\n\n" + rag_engine.get_context(topic)
        # If no topic, infer from file content
        if not topic and settings.file_content:
            # Use LLM to extract a topic from content
            # For simplicity, we'll just use a default
            topic = "the uploaded material"

        lesson_plan_dict = generate_lesson_plan(
            topic=topic,
            context=context,
            level=settings.level,
            time_minutes=settings.time_minutes,
            language=settings.language,
            teaching_style=settings.teaching_style
        )
        return lesson_plan_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))