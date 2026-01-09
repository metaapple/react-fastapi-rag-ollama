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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
          relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300
          flex flex-col items-center justify-center gap-4 group overflow-hidden bg-white
          ${isDragging
                        ? 'border-blue-500 bg-blue-50 shadow-[0_0_40px_rgba(59,130,246,0.3)]'
                        : 'border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100'}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />

                {/* Animated Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`
                        p-4 rounded-full mb-3 transition-all duration-300 shadow-md group-hover:shadow-blue-200 group-hover:scale-110
                        ${isDragging ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}
                    `}>
                        {uploadStatus === 'uploading' ? (
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        ) : uploadStatus === 'success' ? (
                            <CheckCircle className="w-10 h-10 text-green-500 drop-shadow-sm" />
                        ) : uploadStatus === 'error' ? (
                            <AlertCircle className="w-10 h-10 text-red-500 drop-shadow-sm" />
                        ) : (
                            <Upload className="w-10 h-10 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {uploadStatus === 'uploading' ? 'Processing PDF...' : 'Upload PDF'}
                    </h3>
                    <p className="text-sm text-slate-500 text-center mt-1 font-medium group-hover:text-blue-500/80 transition-colors">
                        Drag & drop or Click to Browse
                    </p>
                </div>
            </motion.div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-3 rounded-lg text-sm text-center border ${uploadStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                            uploadStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
                                'bg-surfaceHighlight border-black/5 text-textMuted'
                            }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
