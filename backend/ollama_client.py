"""
Ollama 클라이언트 싱글톤 모듈
FastAPI 시작 시 초기화되고 여러 모듈에서 공유되는 Ollama 클라이언트를 제공합니다.
"""
import ollama
from typing import Optional

# 전역 Ollama 클라이언트 객체
_ollama_client: Optional[ollama.Client] = None
MODEL_NAME = "gemma3:1b"


def init_ollama_client(base_url: str = "http://localhost:11434") -> ollama.Client:
    """
    Ollama 클라이언트를 초기화합니다.
    
    Args:
        base_url: Ollama 서버의 기본 URL (기본값: http://localhost:11434)
    
    Returns:
        초기화된 Ollama 클라이언트 객체
    """
    global _ollama_client
    if _ollama_client is None:
        print(f"Initializing Ollama client (base_url: {base_url})...")
        _ollama_client = ollama.Client(host=base_url)
        print("Ollama client initialized successfully.")
    return _ollama_client


def get_ollama_client() -> ollama.Client:
    """
    전역 Ollama 클라이언트를 반환합니다.
    초기화되지 않은 경우 기본 설정으로 초기화합니다.
    
    Returns:
        Ollama 클라이언트 객체
    
    Raises:
        RuntimeError: Ollama 클라이언트가 초기화되지 않은 경우
    """
    global _ollama_client
    if _ollama_client is None:
        raise RuntimeError(
            "Ollama client not initialized. Please call init_ollama_client() first, "
            "or ensure FastAPI startup event has run."
        )
    return _ollama_client


def is_initialized() -> bool:
    """
    Ollama 클라이언트가 초기화되었는지 확인합니다.
    
    Returns:
        초기화 여부
    """
    return _ollama_client is not None
