import openai
import os
import json
from typing import List, Dict, Any

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_lesson_plan(
    topic: str,
    context: str,
    level: str,
    time_minutes: int,
    language: str,
    teaching_style: str = None
) -> Dict[str, Any]:
    prompt = f"""
You are an expert teacher. Create a detailed lesson plan for the topic: "{topic}".
Use the following context from learning material (if provided):
{context[:3000]}

Learner level: {level} (beginner/intermediate/advanced)
Time available: {time_minutes} minutes
Teaching language: {language}
{teaching_style and f"Teaching style: {teaching_style}" or ""}

Generate a JSON object with the following keys:
- "introduction": a brief introduction to the topic.
- "concepts": a list of objects, each with "title", "explanation", "example", and "question" (a question to ask the student after this concept).
- "summary": a short summary.
- "quiz": a list of 3-5 questions, each with "question", "options" (list of strings, optional), and "correct_answer" (string).

Keep explanations concise but thorough, and tailor difficulty to the learner's level.
The total lesson (including questions) should fit within the given time.
"""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000,
    )
    content = response.choices[0].message.content
    # Extract JSON from response (may contain markdown)
    try:
        # Find the first { and last }
        start = content.find("{")
        end = content.rfind("}") + 1
        json_str = content[start:end]
        return json.loads(json_str)
    except:
        # Fallback: attempt to parse entire content
        return json.loads(content)

def evaluate_answer(student_answer: str, question: str, correct_answer: str = None) -> dict:
    prompt = f"""
You are a teacher evaluating a student's answer.
Question: {question}
Student's answer: {student_answer}
Correct answer (if available): {correct_answer or "Not provided"}

Determine if the student's answer is essentially correct. Provide a brief feedback and a boolean "correct".
Return JSON with keys: "correct" (boolean), "feedback" (string).
"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=200,
    )
    content = response.choices[0].message.content
    try:
        start = content.find("{")
        end = content.rfind("}") + 1
        return json.loads(content[start:end])
    except:
        return {"correct": False, "feedback": "Could not evaluate. Please try again."}

def generate_alternative_explanation(concept: str, wrong_answer: str) -> str:
    prompt = f"""
A student gave this answer to a question about "{concept}": "{wrong_answer}".
Provide a clear, simplified alternative explanation of the concept to help the student understand correctly.
"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=300,
    )
    return response.choices[0].message.content.strip()