'use client';

import { FC, useState, useCallback, useRef } from 'react';
import { VaultFormData } from '@/app/create/page';
import {
    generateAESKey,
    createEncryptedVaultPackage
} from '@/utils/crypto';

interface Props {
    formData: VaultFormData;
    updateFormData: (updates: Partial<VaultFormData>) => void;
    onNext: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

type ContentType = 'file' | 'text' | 'voice' | 'video';

const StepUploadSecret: FC<Props> = ({ formData, updateFormData, onNext }) => {
    const [activeTab, setActiveTab] = useState<ContentType>('file');
    const [isDragging, setIsDragging] = useState(false);
    const [isEncrypting, setIsEncrypting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [encryptionComplete, setEncryptionComplete] = useState(false);

    // Text content
    const [textContent, setTextContent] = useState('');

    // Voice recording
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Video recording
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const encryptContent = useCallback(async (file: File) => {
        setIsEncrypting(true);
        setError(null);

        try {
            const key = await generateAESKey();
            const { blob, keyBase64 } = await createEncryptedVaultPackage(file, key);

            updateFormData({
                file,
                encryptedBlob: blob,
                aesKeyBase64: keyBase64,
            });

            setEncryptionComplete(true);
        } catch (err) {
            console.error('Encryption failed:', err);
            setError('Failed to encrypt content. Please try again.');
        } finally {
            setIsEncrypting(false);
        }
    }, [updateFormData]);

    // File handling
    const handleFile = useCallback(async (file: File) => {
        setError(null);

        if (file.size > MAX_FILE_SIZE) {
            setError('File too large. Maximum size is 50MB.');
            return;
        }

        updateFormData({ file });
        await encryptContent(file);
    }, [encryptContent, updateFormData]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    // Text handling
    const handleEncryptText = useCallback(async () => {
        if (!textContent.trim()) {
            setError('Please enter some text.');
            return;
        }

        const blob = new Blob([textContent], { type: 'text/plain' });
        const file = new File([blob], 'secret-message.txt', { type: 'text/plain' });
        await encryptContent(file);
    }, [textContent, encryptContent]);

    // Voice recording
    const startVoiceRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Could not access microphone. Please check permissions.');
        }
    }, []);

    const stopVoiceRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const handleEncryptVoice = useCallback(async () => {
        if (!audioBlob) return;

        const file = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        await encryptContent(file);
    }, [audioBlob, encryptContent]);

    // Video recording
    const startVideoRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            const mediaRecorder = new MediaRecorder(stream);
            videoRecorderRef.current = mediaRecorder;
            videoChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    videoChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
                setVideoBlob(blob);
                setVideoUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            };

            mediaRecorder.start();
            setIsVideoRecording(true);
        } catch (err) {
            setError('Could not access camera/microphone. Please check permissions.');
        }
    }, []);

    const stopVideoRecording = useCallback(() => {
        if (videoRecorderRef.current && isVideoRecording) {
            videoRecorderRef.current.stop();
            setIsVideoRecording(false);
        }
    }, [isVideoRecording]);

    const handleEncryptVideo = useCallback(async () => {
        if (!videoBlob) return;

        const file = new File([videoBlob], 'video-message.webm', { type: 'video/webm' });
        await encryptContent(file);
    }, [videoBlob, encryptContent]);

    const canProceed = encryptionComplete && formData.encryptedBlob && formData.aesKeyBase64;

    const tabs = [
        { id: 'file' as ContentType, label: '📁 File', icon: '📁' },
        { id: 'text' as ContentType, label: '📝 Text', icon: '📝' },
        { id: 'voice' as ContentType, label: '🎤 Voice', icon: '🎤' },
        { id: 'video' as ContentType, label: '🎥 Video', icon: '🎥' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">Upload Your Secret</h2>
                <p className="text-dark-400 text-sm">
                    Choose how you want to store your secret. At least one type is required.
                    Everything is encrypted in your browser.
                </p>
            </div>

            {/* Content Type Tabs */}
            <div className="flex gap-2 p-1 bg-dark-800 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setEncryptionComplete(false);
                            setError(null);
                        }}
                        className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all
              ${activeTab === tab.id
                                ? 'bg-primary-600 text-white'
                                : 'text-dark-400 hover:text-white hover:bg-dark-700'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* File Upload */}
            {activeTab === 'file' && (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${isDragging
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-600 hover:border-dark-500'
                        }
            ${isEncrypting ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
                >
                    {isEncrypting ? (
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-primary-400">Encrypting...</p>
                        </div>
                    ) : encryptionComplete && formData.file ? (
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400">Encrypted!</p>
                            <p className="text-dark-400 text-sm">{formData.file.name}</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 mx-auto bg-dark-700 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-dark-300 mb-2">Drag & drop any file here</p>
                            <p className="text-dark-500 text-sm mb-4">or click to browse (max 50MB)</p>
                            <input type="file" onChange={handleFileInput} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="btn-secondary inline-block cursor-pointer">
                                Choose File
                            </label>
                        </>
                    )}
                </div>
            )}

            {/* Text Input */}
            {activeTab === 'text' && (
                <div className="space-y-4">
                    {encryptionComplete ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400">Text encrypted!</p>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                placeholder="Enter your secret message here..."
                                className="w-full h-40 bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none"
                            />
                            <button
                                onClick={handleEncryptText}
                                disabled={!textContent.trim() || isEncrypting}
                                className={`btn-primary w-full ${!textContent.trim() || isEncrypting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isEncrypting ? 'Encrypting...' : '🔐 Encrypt Text'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Voice Recording */}
            {activeTab === 'voice' && (
                <div className="space-y-4">
                    {encryptionComplete ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400">Voice message encrypted!</p>
                        </div>
                    ) : (
                        <div className="bg-dark-800 rounded-xl p-6 text-center">
                            {audioUrl ? (
                                <div className="space-y-4">
                                    <audio src={audioUrl} controls className="mx-auto" />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                                            className="btn-secondary flex-1"
                                        >
                                            Re-record
                                        </button>
                                        <button
                                            onClick={handleEncryptVoice}
                                            disabled={isEncrypting}
                                            className="btn-primary flex-1"
                                        >
                                            {isEncrypting ? 'Encrypting...' : '🔐 Encrypt'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                                        className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${isRecording
                                                ? 'bg-red-500 animate-pulse'
                                                : 'bg-primary-600 hover:bg-primary-500'
                                            }`}
                                    >
                                        {isRecording ? (
                                            <div className="w-6 h-6 bg-white rounded" />
                                        ) : (
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                            </svg>
                                        )}
                                    </button>
                                    <p className="text-dark-400 mt-4">
                                        {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Video Recording */}
            {activeTab === 'video' && (
                <div className="space-y-4">
                    {encryptionComplete ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400">Video message encrypted!</p>
                        </div>
                    ) : (
                        <div className="bg-dark-800 rounded-xl p-4">
                            <video
                                ref={videoRef}
                                className={`w-full rounded-lg bg-black ${videoUrl || isVideoRecording ? '' : 'hidden'}`}
                                src={videoUrl || undefined}
                                controls={!!videoUrl}
                                muted={isVideoRecording}
                            />
                            {!videoUrl && !isVideoRecording && (
                                <div className="aspect-video bg-dark-900 rounded-lg flex items-center justify-center">
                                    <p className="text-dark-500">Camera preview will appear here</p>
                                </div>
                            )}
                            <div className="flex gap-2 mt-4">
                                {videoUrl ? (
                                    <>
                                        <button
                                            onClick={() => { setVideoBlob(null); setVideoUrl(null); }}
                                            className="btn-secondary flex-1"
                                        >
                                            Re-record
                                        </button>
                                        <button
                                            onClick={handleEncryptVideo}
                                            disabled={isEncrypting}
                                            className="btn-primary flex-1"
                                        >
                                            {isEncrypting ? 'Encrypting...' : '🔐 Encrypt'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={isVideoRecording ? stopVideoRecording : startVideoRecording}
                                        className={`w-full py-3 rounded-lg font-medium transition-all ${isVideoRecording
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'btn-primary'
                                            }`}
                                    >
                                        {isVideoRecording ? '⏹ Stop Recording' : '🎥 Start Recording'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Key backup warning */}
            {encryptionComplete && formData.aesKeyBase64 && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-yellow-400 font-medium mb-1">Save Your Decryption Key!</p>
                            <p className="text-dark-400 text-sm mb-2">
                                This key is required to decrypt your content. Store it safely.
                            </p>
                            <code className="block bg-dark-900 rounded p-2 text-xs text-dark-300 break-all">
                                {formData.aesKeyBase64}
                            </code>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`btn-primary ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next: Set Recipient →
                </button>
            </div>
        </div>
    );
};

export default StepUploadSecret;
