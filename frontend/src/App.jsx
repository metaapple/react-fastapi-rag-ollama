import React from 'react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

function App() {
    return (
        <div className="min-h-screen bg-background text-textMain relative selection:bg-primary/30 selection:text-white">

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow [animation-delay:2s]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col items-center gap-10">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-textMuted bg-clip-text text-transparent tracking-tighter">
                        Samsung <span className="text-primary">Intelligence</span>
                    </h1>
                    <p className="text-textMuted text-lg max-w-2xl mx-auto">
                        Secure RAG Agent backed by Local Gemma 3 & ChromaDB
                    </p>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
                    <div className="lg:sticky lg:top-8 space-y-8">
                        <div className="bg-surface/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                            <h3 className="text-lg font-semibold mb-4 text-white">Knowledge Base</h3>
                            <FileUpload />
                            <div className="mt-6 text-xs text-textMuted leading-relaxed">
                                <p className="font-semibold text-white/80 mb-2">Instructions:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Upload Samsung internal PDF documents here.</li>
                                    <li>The agent will ingest them into the local Vector DB.</li>
                                    <li>Ask questions in the chat panel.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <ChatInterface />
                    </div>
                </div>

                <footer className="mt-12 text-center text-xs text-textMuted/50">
                    &copy; 2026 Samsung Electronics · Internal Use Only · Local AI Agent
                </footer>
            </div>
        </div>
    );
}

export default App;
