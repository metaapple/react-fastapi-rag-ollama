from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from database import SessionLocal, init_db, ChatMessage
import rag_service

app = FastAPI(title="Samsung RAG Agent", description="RAG Chatbot with Black Theme")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB
init_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class MessageHistory(BaseModel):
    role: str
    content: str
    timestamp: str

    class Config:
        orm_mode = True

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        num_chunks = rag_service.ingest_pdf(temp_file_path)
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {"filename": file.filename, "chunks_ingested": num_chunks, "status": "success"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Save User Message
    user_msg = ChatMessage(role="user", content=request.message)
    db.add(user_msg)
    db.commit()
    
    # 2. Get RAG Response
    try:
        ai_text = rag_service.query_rag(request.message)
    except Exception as e:
        ai_text = "Sorry, I encountered an error processing your request."
        print(f"RAG Error: {e}")

    # 3. Save AI Message
    ai_msg = ChatMessage(role="assistant", content=ai_text)
    db.add(ai_msg)
    db.commit()
    
    return {"response": ai_text}

@app.get("/history", response_model=List[MessageHistory])
async def get_history(db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).order_by(ChatMessage.timestamp).all()
    # Manual mapping to simple dicts/pydantic to avoid datetime issues if any, ensuring string format
    return [
        MessageHistory(
            role=m.role, 
            content=m.content, 
            timestamp=m.timestamp.isoformat()
        ) for m in messages
    ]

@app.get("/")
def read_root():
    return {"message": "Samsung RAG Agent Backend Running"}
