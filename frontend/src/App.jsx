import React from 'react';
import { Sparkles, Heart, Sun, Cloud, Star, Zap } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';

function App() {
    const [lastUpdated, setLastUpdated] = React.useState(Date.now());

    const handleUploadSuccess = () => {
        setLastUpdated(Date.now());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-200 text-textMain relative selection:bg-blue-500/30 selection:text-blue-900 overflow-x-hidden">

            {/* Dynamic Background with High Visibility Animations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Vivid Purple Blob - Top Left */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/40 rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply" />

                {/* Deep Blue Blob - Bottom Right */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-700/40 rounded-full blur-[80px] animate-pulse-slow [animation-delay:2s] mix-blend-multiply" />

                {/* Bright Cyan Blob - Center/Top */}
                <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-cyan-500/30 rounded-full blur-[60px] animate-pulse-slow [animation-delay:3s] mix-blend-overlay" />

                {/* Extra splash of Pink for dynamic contrast */}
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-pink-500/30 rounded-full blur-[60px] animate-pulse-slow [animation-delay:1.5s] mix-blend-multiply" />

                {/* Decorative Icons */}
                <Sparkles className="absolute top-20 left-[10%] w-12 h-12 text-primary/20 animate-bounce" style={{ animationDuration: '3s' }} />
                <Heart className="absolute top-40 right-[15%] w-10 h-10 text-accent/20 animate-pulse" style={{ animationDuration: '4s' }} />
                <Sun className="absolute bottom-32 left-[20%] w-16 h-16 text-yellow-500/20 animate-spin" style={{ animationDuration: '10s' }} />
                <Cloud className="absolute top-1/3 right-[5%] w-20 h-20 text-blue-400/10 animate-pulse" style={{ animationDuration: '5s' }} />
                <Star className="absolute bottom-20 right-[25%] w-8 h-8 text-yellow-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                <Zap className="absolute top-10 right-[30%] w-6 h-6 text-yellow-500/20 -rotate-12" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-12 flex flex-col items-center gap-10">

                {/* Header */}
                <div className="text-center space-y-6">

                    <div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tighter">
                            Samsong <span className="text-secondary">Intelligence</span>
                        </h1>
                        <p className="text-textMuted text-lg max-w-2xl mx-auto mt-4">
                            로컬 Gemma 3 & ChromaDB 기반 보안 RAG 에이전트
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
                    <div className="space-y-8">
                        {/* Highlighting the card with a gradient border and subtle background gradient */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white ring-1 ring-gray-900/5 rounded-2xl leading-none flex items-top justify-start space-x-6">
                                <div className="w-full bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100">
                                    <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                                        지식 베이스
                                    </h3>
                                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                                    <DocumentList refreshTrigger={lastUpdated} />
                                    <div className="mt-6 text-xs text-slate-500 leading-relaxed bg-white/50 p-3 rounded-lg border border-blue-100">
                                        <p className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                            사용법:
                                        </p>
                                        <ul className="list-disc pl-4 space-y-1 marker:text-blue-500">
                                            <li>Samsung 내부 문서를 여기에 업로드하세요.</li>
                                            <li>에이전트가 문서를 로컬 벡터 DB에 등록합니다.</li>
                                            <li>채팅 패널에서 질문하세요.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <ChatInterface refreshTrigger={lastUpdated} />
                    </div>
                </div>

                <footer className="mt-12 text-center text-xs text-textMuted/50">
                    &copy; 2026 Samsung Electronics · 사내용 · 로컬 AI 에이전트
                </footer>
            </div>
        </div>
    );
}

export default App;
