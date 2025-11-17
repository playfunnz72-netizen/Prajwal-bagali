import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from './icons/Icons';

const CameraSearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access the camera. Please check permissions.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                // Simulate search with the image
                console.log("Captured image data URL:", imageDataUrl.substring(0, 50) + "...");
                alert("Simulating search with captured image!");
                handleClose();
            }
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-zinc-900 text-white rounded-2xl w-full max-w-2xl aspect-video flex flex-col shadow-2xl relative overflow-hidden m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
                    <h2 className="text-xl font-semibold">Search with your camera</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/20" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                {error ? (
                    <div className="flex items-center justify-center h-full text-red-400 text-center p-4">{error}</div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                )}

                <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-6 z-10 bg-gradient-to-t from-black/50 to-transparent">
                    <button 
                        onClick={handleCapture}
                        disabled={!!error}
                        className="w-20 h-20 rounded-full bg-white/30 border-4 border-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Capture photo"
                    >
                         <div className="w-16 h-16 rounded-full bg-white"></div>
                    </button>
                </footer>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default CameraSearchModal;