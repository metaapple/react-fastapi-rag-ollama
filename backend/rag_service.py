import chromadb
from chromadb.utils import embedding_functions
import ollama
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import uuid

# Initialize ChromaDB
# Using persistent client to save data
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Using basic sentence transformer or ollama embeddings?
# Let's use Ollama embeddings for consistency if possible, or a default sentence transformer.
# For simplicity and speed without extra heavy model downloads (unless ollama does it), 
# let's try to use Ollama's embedding or a lightweight huggingface one.
# Defaulting to a standard consistent embedding model is safer for local dev.
# "all-MiniLM-L6-v2" is common and light.
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

collection = chroma_client.get_or_create_collection(name="samsung_docs", embedding_function=sentence_transformer_ef)

TEXT_SPLITTER = RecursiveCharacterTextSplitter(chunk_size=250, chunk_overlap=100)

MODEL_NAME = "gemma3:1b" # As requested by user

def ingest_pdf(file_path: str):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    
    chunks = TEXT_SPLITTER.split_text(text)
    
    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [{"source": os.path.basename(file_path)} for _ in chunks]
    
    collection.add(
        documents=chunks,
        ids=ids,
        metadatas=metadatas
    )
    return len(chunks)

def query_rag(query_text: str):
    # 1. Retrieve relevant docs
    results = collection.query(
        query_texts=[query_text],
        n_results=3
    )
    
    context_text = "\n\n".join(results['documents'][0])
    
    # 2. Construct Prompt
    prompt = f"""
    You are a helpful assistant for Samsung Electronics employees.
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know.
    
    Context:
    {context_text}
    
    Question: {query_text}
    
    Answer:
    """
    
    try:
        response = ollama.chat(model=MODEL_NAME, messages=[
            {'role': 'user', 'content': prompt},
        ])
        return response['message']['content']
    except Exception as e:
        return f"Error communicating with Ollama: {str(e)}"
