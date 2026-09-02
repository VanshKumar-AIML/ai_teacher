from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from app.core.llm import evaluate_answer, generate_alternative_explanation
from app.core.assessment import generate_assessment
from app.models.schema import AssessmentRequest
import json
import asyncio

router = APIRouter()

# Store active websocket connections and session data
active_connections = {}

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    try:
        # Get lesson plan from video session store (we need to pass it)
        # For demo, assume lesson plan is stored in a global dict
        from app.routes.video import sessions
        session_data = sessions.get(session_id)
        if not session_data:
            await websocket.send_text(json.dumps({"type": "error", "content": "Invalid session"}))
            await websocket.close()
            return
        lesson_plan = session_data["lesson_plan"]
        language = session_data.get("language", "en")

        # Send introduction
        await websocket.send_text(json.dumps({"type": "explain", "content": lesson_plan["introduction"]}))

        # Iterate concepts
        for idx, concept in enumerate(lesson_plan["concepts"]):
            # Explain concept
            await websocket.send_text(json.dumps({
                "type": "explain",
                "content": f"Now, let's learn about {concept['title']}.\n{concept['explanation']}\n\nExample: {concept['example']}"
            }))
            # Ask question
            await websocket.send_text(json.dumps({
                "type": "question",
                "content": concept["question"]
            }))
            # Wait for student response
            try:
                response = await websocket.receive_text()
                student_ans = json.loads(response).get("answer", "")
                # Evaluate
                eval_result = evaluate_answer(student_ans, concept["question"])
                if eval_result.get("correct"):
                    await websocket.send_text(json.dumps({
                        "type": "feedback",
                        "content": "✅ Correct! Well done."
                    }))
                else:
                    alt_explanation = generate_alternative_explanation(concept["title"], student_ans)
                    await websocket.send_text(json.dumps({
                        "type": "feedback",
                        "content": f"❌ Not quite. Let me explain differently:\n{alt_explanation}"
                    }))
                    # Ask a simpler follow-up question
                    # For brevity, we skip
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"type": "feedback", "content": "Please send a valid answer."}))

        # Summary
        await websocket.send_text(json.dumps({"type": "explain", "content": f"Summary: {lesson_plan['summary']}"}))

        # Assessment
        quiz = lesson_plan.get("quiz", [])
        await websocket.send_text(json.dumps({
            "type": "assessment_start",
            "content": "Now, let's take a quick quiz to check your understanding.",
            "quiz": quiz
        }))
        # Collect answers (in a real implementation, we'd handle them)
        # For demo, we'll just send a placeholder

        # Keep connection open for follow-up
        while True:
            data = await websocket.receive_text()
            # Handle general questions
            await websocket.send_text(json.dumps({
                "type": "reply",
                "content": "I'm here to help. Please ask your question."
            }))

    except WebSocketDisconnect:
        del active_connections[session_id]
    except Exception as e:
        await websocket.send_text(json.dumps({"type": "error", "content": str(e)}))
        await websocket.close()

# Assessment endpoint (HTTP)
@router.post("/assessment")
async def submit_assessment(request: AssessmentRequest):
    from app.routes.video import sessions
    session_data = sessions.get(request.session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    lesson_plan = session_data["lesson_plan"]
    result = generate_assessment(lesson_plan, request.answers)
    return result