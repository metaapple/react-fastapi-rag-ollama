import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:8000';

export default function ChatInterface() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello. I am the Samsung RAG Agent. Upload a document to start querying, or ask me anything.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        fetchHistory();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, { message: userMessage.content });
            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the agent." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">

            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-surfaceHighlight/50">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white tracking-wide">RAG AGENT <span className="text-primary text-xs ml-1">v1.0</span></h2>
                    <p className="text-xs text-textMuted">Powered by Gemma 3 & ChromaDB</p>
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
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surfaceHighlight text-accent'}
              `}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`
                p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-lg
                ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-surfaceHighlight text-gray-200 rounded-tl-none border border-white/5'}
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
                        className="flex items-center gap-2 text-xs text-textMuted ml-12"
                    >
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span>Thinking...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-surfaceHighlight/30 border-t border-white/5">
                <div className="flex items-center bg-surface border border-white/10 rounded-xl px-4 py-2 focus-within:border-primary/50 transition-colors shadow-inner">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your documents..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-textMuted py-2"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 ml-2 bg-primary/90 hover:bg-primary text-white rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
