import json
from typing import List, Dict, Any

def generate_assessment(lesson_plan: Dict[str, Any], student_answers: List[str]) -> Dict[str, Any]:
    """
    Evaluate quiz answers against the correct ones.
    Returns score, strengths, weaknesses, recommendation.
    """
    quiz = lesson_plan.get("quiz", [])
    if not quiz:
        return {"score": 0, "strengths": [], "weaknesses": [], "recommendation": "No quiz available."}

    correct = 0
    total = len(quiz)
    strengths = []
    weaknesses = []
    for i, q in enumerate(quiz):
        student_ans = student_answers[i] if i < len(student_answers) else ""
        # Simple exact match for now; in production use LLM evaluation
        if student_ans.lower().strip() == q.get("correct_answer", "").lower().strip():
            correct += 1
            strengths.append(q.get("question", "Question"))
        else:
            weaknesses.append(q.get("question", "Question"))

    score = (correct / total) * 100
    recommendation = ""
    if score >= 80:
        recommendation = "Great job! You may proceed to the next topic."
    elif score >= 50:
        recommendation = "Review the weak areas and try again."
    else:
        recommendation = "Consider revising the entire lesson before moving on."

    return {
        "score": score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendation": recommendation
    }