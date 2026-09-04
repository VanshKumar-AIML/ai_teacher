AI Teacher: Human‑Like Virtual Educator

An AI‑powered virtual teacher that understands uploaded educational content or any user‑provided topic, generates personalised lessons, and delivers them through a human‑like AI avatar video. The system supports multilingual teaching, interactive questioning, misconception detection, adaptive teaching, and final assessment with feedback.

✨ Features :

📚 Learn from uploaded materials – PDF, DOCX, PPTX, TXT.

🧠 Topic‑based teaching – No material needed; teach any subject.

📝 Structured lesson plans – Objectives, concepts, examples, questions, summary, quiz.

👤 Personalised teaching – Adapts to learner’s level (beginner/intermediate/advanced), available time, and preferred language.

🗣️ Multilingual – Teach in English, Hindi, Spanish, French, and more; switch languages mid‑lesson.

🎥 AI‑generated video – Human‑like avatar with natural voice, subtitles, and on‑screen text.

💬 Interactive Q&A – Ask questions during the lesson, evaluate responses, and adapt on the fly.

🔄 Misconception detection – Identify wrong answers and provide alternative explanations.

📊 Assessment & feedback – End‑of‑lesson quiz, score, strengths/weaknesses, and personalised revision suggestions.

📈 Learning profile – Tracks progress, weak areas, and recommends next topics (future enhancement).

🛠️ Tech Stack
Component	Technology
Backend	Python 3.10, FastAPI, Uvicorn
LLM	OpenAI GPT‑4 (or GPT‑3.5‑Turbo)
RAG	ChromaDB, LangChain
Text Extraction	PyPDF2, python‑docx, python‑pptx
Video Generation	D‑ID API (talking avatar)

TTS	D‑ID built‑in / Microsoft Azure
Frontend	React, Tailwind CSS, Video.js
Real‑time	WebSockets (native)
Deployment	Docker, Nginx

🏗️ Architecture Overview
```
┌─────────────────┐     ┌─────────────────────────────────────────────────┐
│   Frontend      │────▶│   Backend (FastAPI)                            │
│  (React +      │     │  - File Upload & Text Extraction               │
│   Video.js)    │     │  - RAG Pipeline (ChromaDB + OpenAI)            │
└─────────────────┘     │  - Lesson Planner (LLM)                       │
                        │  - Interactive Chat (WebSocket)               │
                        │  - Video Generator (D‑ID API)                 │
                        │  - Assessment Engine                          │
                        └─────────────────────────────────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │  External Services       │
                        │  - OpenAI API            │
                        │  - D‑ID API              │
                        └─────────────────────────┘
```
🚀 Getting Started
Prerequisites
Python 3.10+

Node.js 16+

Docker & Docker Compose (optional but recommended)

OpenAI API key

D‑ID API key (for video generation)

Environment Variables
Create a .env file in the backend/ folder:

env
OPENAI_API_KEY=sk-...
DID_API_KEY=...
For the frontend, you can set REACT_APP_API_BASE if needed (defaults to http://localhost:8000/api).

Running with Docker (recommended)
bash
docker-compose up --build
This starts:

Backend at http://localhost:8000

Frontend at http://localhost:3000

Running Locally (without Docker)
Backend

bash
cd backend
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn app.main:app --reload --port 8000
Frontend

bash
cd frontend
npm install
npm start   # runs on http://localhost:3000
📖 Usage
Upload a file (PDF, DOCX, PPTX, TXT) or enter a topic (e.g., "Machine Learning").

Configure the lesson:

Learner level (beginner / intermediate / advanced)

Available time (5–120 minutes)

Preferred language (English, Hindi, Spanish, French)

Generate the lesson plan & video – the AI Teacher creates a structured lesson and an avatar video.

Watch the video and interact – after each concept, the teacher asks a question. Type your answer in the chat.

Adaptation – if you answer incorrectly, the teacher provides an alternative explanation and re‑asks a similar question.

Assessment – a final quiz evaluates your understanding; get a score, weak areas, and personalised revision suggestions.

📡 API Endpoints

Endpoint	Method	Description :

/api/upload	POST	-> Upload a file and extract text
/api/lesson	POST ->	Generate a lesson plan from file/topic + settings
/api/video	POST -> Generate an AI avatar video from the lesson plan
/api/assessment	POST -> Evaluate quiz answers and return feedback
/api/ws/{session_id} -> WebSocket	Real‑time Q&A during the lesson

🧪 Testing
Backend tests (placeholders for future):
bash
cd backend
pytest

📁 Project Structure
```
ai-teacher/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── rag.py
│   │   │   ├── llm.py
│   │   │   ├── video_generator.py
│   │   │   └── assessment.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── upload.py
│   │   │   ├── lesson.py
│   │   │   ├── video.py
│   │   │   └── interaction.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── file_parser.py
│   │       └── language.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── context/
│   │   │   └── ThemeContext.js          # dark mode context
│   │   └── components/
│   │       ├── Upload.js                
│   │       ├── LessonSettings.js        
│   │       ├── VideoPlayer.js           
│   │       ├── ChatInterface.js         
│   │       └── Assessment.js            
│   ├── package.json
│   ├── tailwind.config.js               # darkMode: 'class'
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml
└── README.md
```
🎥 Demo Video
Watch the 5‑minute walkthrough

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙏 Acknowledgements
OpenAI – LLM and embeddings
D‑ID – AI avatar video generation
LangChain – RAG orchestration
ChromaDB – vector store
