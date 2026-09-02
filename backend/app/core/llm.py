import os
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def call_ollama(prompt: str, temperature: float = 0.7, max_tokens: int = 2000) -> str:
    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        },
        timeout=180
    )

    response.raise_for_status()

    data = response.json()
    return data["response"].strip()


def parse_json_response(content: str) -> Dict[str, Any]:
    try:
        start = content.find("{")
        end = content.rfind("}") + 1

        if start != -1 and end > start:
            return json.loads(content[start:end])

        return json.loads(content)

    except Exception:
        raise ValueError(
            f"Model did not return valid JSON. Response: {content}"
        )


def generate_lesson_plan(
    topic: str,
    context: str,
    level: str,
    time_minutes: int,
    language: str,
    teaching_style: str = None
) -> Dict[str, Any]:

    prompt = f"""
You are an expert teacher.

Create a detailed lesson plan for the topic: "{topic}".

Use the following context from learning material if provided:
{context[:3000]}

Learner level: {level}
Time available: {time_minutes} minutes
Teaching language: {language}
Teaching style: {teaching_style or "interactive"}

Return ONLY valid JSON.

The JSON must have exactly these keys:

{{
  "introduction": "brief introduction",
  "concepts": [
    {{
      "title": "concept title",
      "explanation": "clear explanation",
      "example": "simple example",
      "question": "question to ask the student"
    }}
  ],
  "summary": "short summary",
  "quiz": [
    {{
      "question": "question",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correct_answer": "correct option"
    }}
  ]
}}

Create 3-5 quiz questions.

Keep explanations concise but thorough and appropriate for the learner's level.
The total lesson should fit within the given time.
"""

    content = call_ollama(
        prompt,
        temperature=0.7,
        max_tokens=2000
    )

    return parse_json_response(content)


def evaluate_answer(
    student_answer: str,
    question: str,
    correct_answer: str = None
) -> dict:

    prompt = f"""
You are a teacher evaluating a student's answer.

Question:
{question}

Student's answer:
{student_answer}

Correct answer:
{correct_answer or "Not provided"}

Determine whether the student's answer is essentially correct.

Return ONLY valid JSON:

{{
  "correct": true,
  "feedback": "brief feedback"
}}
"""

    content = call_ollama(
        prompt,
        temperature=0.3,
        max_tokens=200
    )

    try:
        return parse_json_response(content)

    except Exception:
        return {
            "correct": False,
            "feedback": "Could not evaluate. Please try again."
        }


def generate_alternative_explanation(
    concept: str,
    wrong_answer: str
) -> str:

    prompt = f"""
A student gave this answer to a question about "{concept}":

"{wrong_answer}"

Provide a clear, simplified alternative explanation of the concept to help the student understand correctly.

Return only the explanation, without JSON.
"""

    return call_ollama(
        prompt,
        temperature=0.7,
        max_tokens=300
    )