from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LessonSettings(BaseModel):
    topic: Optional[str] = None
    level: str = "beginner"  # beginner, intermediate, advanced
    time_minutes: int = 20
    language: str = "en"
    teaching_style: Optional[str] = None
    file_content: Optional[str] = None  # extracted text

class Concept(BaseModel):
    title: str
    explanation: str
    example: str
    question: str

class LessonPlan(BaseModel):
    introduction: str
    concepts: List[Concept]
    summary: str
    quiz: List[Dict[str, Any]]

class VideoRequest(BaseModel):
    lesson_plan: LessonPlan
    language: str = "en"
    avatar_id: Optional[str] = None

class AssessmentRequest(BaseModel):
    session_id: str
    answers: List[str]

class AssessmentResult(BaseModel):
    score: float
    strengths: List[str]
    weaknesses: List[str]
    recommendation: str