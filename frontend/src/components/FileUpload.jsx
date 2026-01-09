import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:8000';

export default function FileUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        if (file.type !== 'application/pdf') {
            setUploadStatus('error');
            setMessage('Only PDF files are allowed.');
            return;
        }

        setUploadStatus('uploading');
        setMessage(`Uploading ${file.name}...`);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadStatus('success');
            setMessage(`Successfully ingested ${response.data.chunks_ingested} chunks from ${file.name}`);
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setMessage('Upload failed. Is the backend running?');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <motion.div
                layout
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300
          flex flex-col items-center justify-center gap-4 group overflow-hidden
          ${isDragging
                        ? 'border-primary bg-primary/10 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`p-4 rounded-full bg-surfaceHighlight mb-2 transition-transform duration-300 group-hover:scale-110 ${uploadStatus === 'uploading' ? 'animate-pulse' : ''}`}>
                        {uploadStatus === 'uploading' ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : uploadStatus === 'success' ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : uploadStatus === 'error' ? (
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        ) : (
                            <Upload className="w-8 h-8 text-primary" />
                        )}
                    </div>

                    <h3 className="text-lg font-medium text-textMain">
                        {uploadStatus === 'uploading' ? 'Processing PDF...' : 'Upload Knowledge Base'}
                    </h3>
                    <p className="text-sm text-textMuted text-center mt-1">
                        Drag & drop a Samsung PDF here, or click to browse
                    </p>
                </div>

                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-3 rounded-lg text-sm text-center border ${uploadStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                                uploadStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
                                    'bg-surfaceHighlight border-white/5 text-textMuted'
                            }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
