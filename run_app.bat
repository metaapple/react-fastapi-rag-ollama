@echo off
echo ===================================================
echo   Samsung RAG Agent - Setup & Launch
echo ===================================================
echo ===================================================


echo [1/4] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b
)

echo [2/4] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b
)

echo [3/4] Starting Servers...
echo Starting Backend on port 8000...
start "Samsung Agent Backend" cmd /k "cd ../backend && uvicorn main:app --reload"

echo Starting Frontend...
start "Samsung Agent Frontend" cmd /k "npm run dev"

echo [4/4] Done! App should open on port 5173 or similar.
echo Ensure Ollama is running: 'ollama serve'
pause
