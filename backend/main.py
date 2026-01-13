from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from database import SessionLocal, init_db, ChatMessage
import rag_service
from ollama_client import init_ollama_client

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

# Startup event: Initialize Ollama client when FastAPI starts
@app.on_event("startup")
async def startup_event():
    """FastAPI 시작 시 Ollama 클라이언트를 초기화합니다."""
    try:
        init_ollama_client()
        print("FastAPI startup: Ollama client initialized successfully.")
    except Exception as e:
        print(f"Warning: Failed to initialize Ollama client during startup: {e}")
        print("Ollama client will be initialized on first use.")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    message: str
    source_filter: str = "All Documents"

class ChatResponse(BaseModel):
    response: str

class MessageHistory(BaseModel):
    role: str
    content: str
    timestamp: str

    class Config:
        orm_mode = True

@app.post("/upload")
def upload_documents(files: List[UploadFile] = File(...)):
    total_chunks = 0
    processed_files = []
    
    for file in files:
        filename = file.filename.lower()
        if not (filename.endswith('.pdf') or filename.endswith('.txt')):
            continue # Skip unsupported, or raise error? Let's skip for now or better warn.
        
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        try:
            num_chunks = rag_service.ingest_document(temp_file_path, file.filename)
            total_chunks += num_chunks
            processed_files.append(file.filename)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            
    return {"status": "success", "processed_files": processed_files, "total_chunks": total_chunks}

@app.get("/stats")
def get_stats():
    return {
        "count": rag_service.get_document_count(),
        "sources": rag_service.get_unique_sources()
    }

@app.post("/reset")
def reset_db(db: Session = Depends(get_db)):
    rag_service.reset_database()
    db.query(ChatMessage).delete()
    db.commit()
    return {"status": "Database Reset"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Save User Message
    user_msg = ChatMessage(role="user", content=request.message)
    db.add(user_msg)
    db.commit()
    
    # 2. Get RAG Response
    try:
        ai_text = rag_service.query_rag(request.message, request.source_filter)
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
