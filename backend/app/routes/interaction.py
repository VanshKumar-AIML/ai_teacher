from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from app.core.llm import evaluate_answer, generate_alternative_explanation
from app.core.assessment import generate_assessment
from app.models.schema import AssessmentRequest
import json

router = APIRouter()

# Store active WebSocket connections
active_connections = {}


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket

    try:
        # Get lesson data from session store
        from app.routes.video import sessions

        session_data = sessions.get(session_id)

        if not session_data:
            await websocket.send_text(
                json.dumps({
                    "type": "error",
                    "content": "Invalid session"
                })
            )
            await websocket.close()
            return

        lesson_plan = session_data["lesson_plan"]

        # Send introduction
        await websocket.send_text(
            json.dumps({
                "type": "explain",
                "content": lesson_plan["introduction"]
            })
        )

        # Iterate through concepts
        for concept in lesson_plan.get("concepts", []):

            # Send concept explanation
            await websocket.send_text(
                json.dumps({
                    "type": "explain",
                    "content": (
                        f"Now, let's learn about {concept['title']}.\n"
                        f"{concept['explanation']}\n\n"
                        f"Example: {concept['example']}"
                    )
                })
            )

            # Ask concept question
            await websocket.send_text(
                json.dumps({
                    "type": "question",
                    "content": concept["question"]
                })
            )

            # Receive student's answer
            try:
                response = await websocket.receive_text()
                student_ans = json.loads(response).get("answer", "").strip()

                # Give the evaluator enough context to judge the answer
                evaluation_context = f"""
Question:
{concept["question"]}

Concept:
{concept["title"]}

Explanation:
{concept["explanation"]}

Example:
{concept["example"]}

Student's Answer:
{student_ans}

Evaluate whether the student's answer is correct based on the concept,
explanation, and question. Accept semantically correct answers even if
they use different wording.
"""

                # Evaluate answer
                eval_result = evaluate_answer(
                    student_ans,
                    evaluation_context
                )

                if eval_result.get("correct"):
                    await websocket.send_text(
                        json.dumps({
                            "type": "feedback",
                            "content": "✅ Correct! Well done."
                        })
                    )

                else:
                    alt_explanation = generate_alternative_explanation(
                        concept["title"],
                        student_ans
                    )

                    await websocket.send_text(
                        json.dumps({
                            "type": "feedback",
                            "content": (
                                "❌ Not quite. Let me explain differently:\n"
                                f"{alt_explanation}"
                            )
                        })
                    )

            except json.JSONDecodeError:
                await websocket.send_text(
                    json.dumps({
                        "type": "feedback",
                        "content": "Please send a valid answer."
                    })
                )

        # Send summary
        await websocket.send_text(
            json.dumps({
                "type": "explain",
                "content": f"Summary: {lesson_plan['summary']}"
            })
        )

        # Start assessment
        quiz = lesson_plan.get("quiz", [])

        await websocket.send_text(
            json.dumps({
                "type": "assessment_start",
                "content": (
                    "Now, let's take a quick quiz "
                    "to check your understanding."
                ),
                "quiz": quiz
            })
        )

        # Keep WebSocket open for follow-up questions
        while True:
            data = await websocket.receive_text()

            await websocket.send_text(
                json.dumps({
                    "type": "reply",
                    "content": "I'm here to help. Please ask your question."
                })
            )

    except WebSocketDisconnect:
        active_connections.pop(session_id, None)

    except Exception as e:
        active_connections.pop(session_id, None)

        try:
            await websocket.send_text(
                json.dumps({
                    "type": "error",
                    "content": str(e)
                })
            )
            await websocket.close()
        except Exception:
            pass


# Assessment endpoint
@router.post("/assessment")
async def submit_assessment(request: AssessmentRequest):
    from app.routes.video import sessions

    session_data = sessions.get(request.session_id)

    if not session_data:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    lesson_plan = session_data["lesson_plan"]

    result = generate_assessment(
        lesson_plan,
        request.answers
    )

    return result