# Samsung RAG Intelligence Agent

An advanced local AI agent built for Samsong Electronics, featuring a secure RAG (Retrieval-Augmented Generation) system, dynamic UI, and local LLM integration.

## 🌟 Key Features

*   **Secure Local RAG**: Process and query PDF documents locally using **ChromaDB**.
*   **Private LLM**: Powered by **Gemma 3 (via Ollama)**, ensuring no data leaves the local machine.
*   **Dynamic UI**:
    *   Sophisticated "Roaming" background animations.
    *   Interactive, flashy file upload zone.
    *   High-contrast Emerald Green chat interface.
*   **Tech Stack**:
    *   **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
    *   **Backend**: FastAPI, LangChain, ChromaDB.

## 🛠 Prerequisites

Ensure you have the following installed:

1.  **Python 3.10+**
2.  **Node.js & npm** (LTS version recommended)
3.  **Ollama**: [Download Here](https://ollama.com/)
    *   Run `ollama pull gemma` (or the specific model version configured in `rag_service.py`) before starting.

## 🚀 Quick Start

You can start the entire application using the provided batch script.

1.  Double-click `run_app.bat` in the project root.

**OR**

Run via command line:
```bash
./run_app.bat
```

This script will:
1.  Install Python backend dependencies.
2.  Install Node.js frontend dependencies.
3.  Launch the Backend Server (Port 8000).
4.  Launch the Frontend Server (Port 5173).

## 📂 Project Structure

### Backend (`/backend`)
*   `main.py`: FastAPI entry point.
*   `rag_service.py`: Core logic for PDF ingestion, embedding, and LLM querying.
*   `chroma_db/`: Local storage for vector embeddings.

### Frontend (`/frontend`)
*   `src/App.jsx`: Main application layout with dynamic background animations.
*   `src/components/ChatInterface.jsx`: The chat UI component.
*   `src/components/FileUpload.jsx`: The PDF upload component.
*   `tailwind.config.js`: Custom theme configuration (Animations, Colors).

## 🎨 UI Customization

The UI is built with Tailwind CSS and allows for easy customization in `frontend/tailwind.config.js`.

*   **Animations**: Custom keyframes (`roam-1`, `float-slow`) defined in config.
*   **Colors**: Custom palette (`background`, `primary`, `accent`) extending Tailwind defaults.

---
*Internal Use Only - Samsong Electronics*
