'use client';

import { FC, useState, useCallback, useRef } from 'react';
import { VaultFormData } from '@/app/create/page';
import {
    createPasswordProtectedVaultPackage
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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
        if (!password) {
            setError('Please enter a password for your vault.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsEncrypting(true);
        setError(null);

        try {
            // Create password protected package
            const { blob } = await createPasswordProtectedVaultPackage(file, password);

            updateFormData({
                file,
                encryptedBlob: blob,
                // We no longer need to store raw key
                aesKeyBase64: 'password-protected',
            });

            setEncryptionComplete(true);
        } catch (err) {
            console.error('Encryption failed:', err);
            setError('Failed to encrypt content. Please try again.');
        } finally {
            setIsEncrypting(false);
        }
    }, [password, confirmPassword, updateFormData]);

    // File handling
    const handleFile = useCallback(async (file: File) => {
        setError(null);
        if (file.size > MAX_FILE_SIZE) {
            setError('File too large. Maximum size is 50MB.');
            return;
        }
        updateFormData({ file });
        // Don't encrypt immediately, waiting for password
    }, [updateFormData]);

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

    // Trigger encryption manually
    const handleEncryptCurrentContent = async () => {
        let fileToEncrypt: File | null = null;

        if (activeTab === 'file') {
            fileToEncrypt = formData.file;
        } else if (activeTab === 'text') {
            if (!textContent.trim()) { setError('Please enter some text.'); return; }
            const blob = new Blob([textContent], { type: 'text/plain' });
            fileToEncrypt = new File([blob], 'secret-message.txt', { type: 'text/plain' });
        } else if (activeTab === 'voice') {
            if (!audioBlob) { setError('Please record a message.'); return; }
            fileToEncrypt = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        } else if (activeTab === 'video') {
            if (!videoBlob) { setError('Please record a video.'); return; }
            fileToEncrypt = new File([videoBlob], 'video-message.webm', { type: 'video/webm' });
        }

        if (fileToEncrypt) {
            await encryptContent(fileToEncrypt);
        } else {
            setError('Please select/create content first.');
        }
    };

    // Voice recording
    const startVoiceRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch { setError('Could not access microphone.'); }
    }, []);

    const stopVoiceRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    // Video recording
    const startVideoRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
            const mediaRecorder = new MediaRecorder(stream);
            videoRecorderRef.current = mediaRecorder;
            videoChunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => videoChunksRef.current.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
                setVideoBlob(blob);
                setVideoUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
                if (videoRef.current) videoRef.current.srcObject = null;
            };
            mediaRecorder.start();
            setIsVideoRecording(true);
        } catch { setError('Could not access camera.'); }
    }, []);

    const stopVideoRecording = useCallback(() => {
        if (videoRecorderRef.current && isVideoRecording) {
            videoRecorderRef.current.stop();
            setIsVideoRecording(false);
        }
    }, [isVideoRecording]);

    const canProceed = encryptionComplete && formData.encryptedBlob;

    const tabs = [
        { id: 'file' as ContentType, label: '📁 File' },
        { id: 'text' as ContentType, label: '📝 Text' },
        { id: 'voice' as ContentType, label: '🎤 Voice' },
        { id: 'video' as ContentType, label: '🎥 Video' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">Upload & Protect Secret</h2>
                <p className="text-dark-400 text-sm">
                    Content is encrypted with your password. We cannot recover it if lost.
                </p>
            </div>

            {/* Content Type Tabs */}
            {!encryptionComplete && (
                <div className="flex gap-2 p-1 bg-dark-800 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setError(null);
                                setEncryptionComplete(false);
                            }}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Areas - Only show if not complete */}
            {!encryptionComplete && (
                <div className="min-h-[200px]">
                    {activeTab === 'file' && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-dark-500'}`}
                        >
                            {formData.file ? (
                                <div className="space-y-3">
                                    <div className="w-12 h-12 mx-auto bg-primary-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                    <p className="text-white">{formData.file.name}</p>
                                    <button onClick={() => updateFormData({ file: null })} className="text-sm text-red-400 hover:underline">Remove</button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-dark-300 mb-2">Drag & drop content</p>
                                    <label htmlFor="file-upload" className="btn-secondary inline-block cursor-pointer">Choose File</label>
                                    <input type="file" onChange={handleFileInput} className="hidden" id="file-upload" />
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="Enter secret message..."
                            className="w-full h-40 bg-dark-900 border border-dark-600 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    )}

                    {activeTab === 'voice' && (
                        <div className="bg-dark-800 rounded-xl p-6 text-center">
                            {audioUrl ? (
                                <div className="space-y-4">
                                    <audio src={audioUrl} controls className="mx-auto" />
                                    <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} className="btn-secondary">Re-record</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={isRecording ? stopVoiceRecording : startVoiceRecording} className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary-600'}`}>
                                        {isRecording ? '⏹' : '🎤'}
                                    </button>
                                    <p className="mt-2 text-sm text-dark-400">{isRecording ? 'Recording...' : 'Click to record'}</p>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div className="bg-dark-800 rounded-xl p-4 text-center">
                            <video ref={videoRef} className={`w-full rounded-lg bg-black ${videoUrl || isVideoRecording ? '' : 'hidden'}`} src={videoUrl || undefined} controls={!!videoUrl} muted={isVideoRecording} />
                            {!videoUrl && !isVideoRecording && <div className="aspect-video bg-dark-900 rounded-lg flex items-center justify-center text-dark-500">Preview</div>}
                            <div className="mt-4">
                                {videoUrl ? (
                                    <button onClick={() => { setVideoBlob(null); setVideoUrl(null); }} className="btn-secondary">Re-record</button>
                                ) : (
                                    <button onClick={isVideoRecording ? stopVideoRecording : startVideoRecording} className={`w-full py-2 rounded-lg ${isVideoRecording ? 'bg-red-500' : 'btn-primary'}`}>
                                        {isVideoRecording ? 'Stop' : 'Start Camera'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Password Protection Section */}
            {!encryptionComplete && (
                <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 space-y-4">
                    <h3 className="font-medium text-white">🔒 Set Vault Password</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-white"
                                placeholder="********"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-white"
                                placeholder="********"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-yellow-500">
                        ⚠️ Important: You must share this password with your recipient. We cannot reset it.
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            {!encryptionComplete ? (
                <button
                    onClick={handleEncryptCurrentContent}
                    disabled={isEncrypting}
                    className="btn-primary w-full py-3 text-lg font-bold shadow-lg shadow-primary-500/20"
                >
                    {isEncrypting ? 'Encrypting...' : '🔒 Encrypt & Protect'}
                </button>
            ) : (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-green-400 font-bold text-lg mb-2">Content Protected!</h3>
                    <p className="text-dark-300 text-sm mb-4">
                        Your vault is now encrypted with your password.
                    </p>
                    <div className="bg-dark-900 rounded p-3 text-left">
                        <p className="text-xs text-dark-400 mb-1">Password Check:</p>
                        <p className="font-mono text-sm text-white">
                            {password.replace(/./g, '•')}
                        </p>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                    {error}
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
