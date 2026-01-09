import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:8000';

export default function ChatInterface({ refreshTrigger }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '안녕하세요. Samsung RAG 에이전트입니다. 문서를 업로드하고 질문을 시작하거나, 무엇이든 물어보세요.' }
    ]);
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState('전체 문서');
    const [docCount, setDocCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load history on mount (optional, if backend supports persisting between refreshes)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/history`);
                if (res.data && res.data.length > 0) {
                    // Merge or set? Let's just append if empty, or just trust history
                    // For now, let's keep the welcome message and append history if any
                    if (res.data.length > 0) setMessages(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch history", e);
            }
        }


        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/stats`);
                if (res.data) {
                    setDocCount(res.data.count);
                    setSources(['전체 문서', ...res.data.sources]);
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        }

        fetchHistory();
        fetchStats();
    }, [refreshTrigger]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message: userMessage.content,
                source_filter: selectedSource
            });
            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "구동 실패. 에이전트에 연결할 수 없습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">

            {/* Header */}
            <div className="p-4 border-b border-emerald-200 flex items-center gap-3 bg-emerald-100/50">
                <div className="p-2 bg-emerald-200/50 rounded-lg">
                    <Cpu className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-emerald-900 tracking-wide flex items-center gap-2">
                        SAMSUNG AGENT
                        <span className="text-emerald-600 text-xs font-normal border border-emerald-200 px-1 rounded">v2.0</span>
                    </h2>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-2">
                        <span>📚 {docCount}개 문서 색인됨</span>
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-100'}
              `}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`
                p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-md font-medium
                ${msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                    : 'bg-white text-emerald-800 rounded-tl-none border border-emerald-100'}
              `}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-xs text-emerald-600 font-semibold ml-12"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span>생각 중...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-emerald-100/30 border-t border-emerald-200">
                <div className="flex items-center bg-white border border-emerald-200 rounded-xl px-4 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all shadow-sm">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="문서에 대해 물어보세요..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-emerald-900 placeholder-emerald-400 py-2"
                    />

                    {/* Source Filter Dropdown */}
                    <div className="relative group">
                        <select
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="bg-emerald-50 text-xs text-emerald-700 border border-emerald-200 rounded-lg py-1 px-2 outline-none focus:border-emerald-500 cursor-pointer max-w-[150px] truncate"
                        >
                            {sources.map(src => (
                                <option key={src} value={src}>{src}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 ml-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
