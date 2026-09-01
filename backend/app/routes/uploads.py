from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_parser import extract_text
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text(content, file.filename)
        # Optionally store in RAG here; we'll store in memory for now
        return {"filename": file.filename, "text": text[:500], "full_text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))