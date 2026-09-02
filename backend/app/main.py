from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import uploads, lesson, video, interaction

app = FastAPI(title="AI Teacher", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router, prefix="/api")
app.include_router(lesson.router, prefix="/api")
app.include_router(video.router, prefix="/api")
app.include_router(interaction.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AI Teacher API is running"}