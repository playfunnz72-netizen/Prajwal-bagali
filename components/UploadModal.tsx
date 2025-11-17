import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, UploadIcon, CheckIcon } from './icons/Icons';

interface UploadModalProps {
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isShort, setIsShort] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (!selectedFile) {
            setUploadProgress(0);
            return;
        }

        setUploadProgress(0);

        let startTime: number | undefined;
        // Simulate a duration based on file size: 0.5s per MB, capped between 2s and 5s
        const simulatedDuration = Math.max(2000, Math.min(5000, (selectedFile.size / (1024 * 1024)) * 500));

        const animateProgress = (timestamp: number) => {
            if (startTime === undefined) {
                startTime = timestamp;
            }

            const elapsedTime = timestamp - startTime;
            const t = Math.min(1, elapsedTime / simulatedDuration);
            // Use an ease-out function for a more natural feel
            const easedT = 1 - Math.pow(1 - t, 3);
            const progress = easedT * 100;
            
            setUploadProgress(progress);

            if (elapsedTime < simulatedDuration) {
                animationFrameRef.current = requestAnimationFrame(animateProgress);
            } else {
                 setUploadProgress(100);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animateProgress);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selectedFile]);

    const handleFileValidation = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setError('Please select a valid video file.');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setError(null);
        setSelectedFile(file);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setDescription('');
        setTags('');
        setIsShort(false); // Default to false, may be updated by metadata check

        // Check video metadata to suggest if it's a Short
        const videoUrl = URL.createObjectURL(file);
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
            URL.revokeObjectURL(videoUrl);
            const { videoWidth, videoHeight, duration } = videoElement;

            // Shorts are vertical videos (height > width) up to 60 seconds.
            if (videoHeight > videoWidth && duration <= 60) {
                setIsShort(true);
            }
        };

        videoElement.onerror = () => {
            URL.revokeObjectURL(videoUrl);
            console.error("Error loading video metadata for short detection.");
        };

        videoElement.src = videoUrl;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileValidation(file);
        }
    };

    const handleSelectFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileValidation(file);
        }
    };

    const renderInitialView = () => (
        <div
            className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl space-y-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-zinc-700/50' : 'border-zinc-400 dark:border-zinc-600'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="bg-zinc-100 dark:bg-zinc-700 p-6 rounded-full">
                <UploadIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div className="text-center">
                <p className="text-lg">Drag and drop video files to upload</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Your videos will be private until you publish them.</p>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
            />
            <button
                onClick={handleSelectFileClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
            >
                SELECT FILES
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );

    const renderSelectedFileView = () => (
        <div className="flex flex-col md:flex-row w-full h-full p-8 gap-8 overflow-y-auto">
            {/* Right Column: Video Details Form */}
            <div className="md:w-2/3 flex-1 flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Details</h3>
                <div>
                    <label htmlFor="video-title" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                        Title (required)
                    </label>
                    <input
                        id="video-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a title that describes your video"
                        className="w-full bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                    />
                </div>
                <div>
                    <label htmlFor="video-description" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="video-description"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell viewers about your video"
                        className="w-full bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 resize-none"
                    />
                </div>
                <div>
                    <label htmlFor="is-short" className="flex items-start space-x-3 cursor-pointer bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                        <input
                            id="is-short"
                            type="checkbox"
                            checked={isShort}
                            onChange={(e) => setIsShort(e.target.checked)}
                            className="mt-1 h-5 w-5 flex-shrink-0 rounded bg-white dark:bg-zinc-600 border-zinc-400 dark:border-zinc-500 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-800"
                        />
                        <div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">Categorize as a Short</span>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                Shorts are vertical videos up to 60 seconds long. Enabling this helps viewers discover your content in the Shorts feed.
                            </p>
                        </div>
                    </label>
                </div>
                <div>
                    <label htmlFor="video-tags" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                        Tags
                    </label>
                    <input
                        id="video-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Add tags to help viewers find your video (e.g., react, tutorial, programming)"
                        className="w-full bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Separate tags with commas.</p>
                </div>
            </div>
            {/* Left Column: Upload Progress & File Info */}
            <div className="md:w-1/3 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                    {uploadProgress < 100 ? (
                        'Upload in progress...'
                    ) : (
                        <>
                            <CheckIcon className="w-6 h-6 text-green-500" />
                            <span>Upload complete!</span>
                        </>
                    )}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">
                    {uploadProgress < 100 
                        ? 'Your video is being uploaded. You can edit the details while you wait.' 
                        : 'Your video has been successfully uploaded. You can now publish it.'}
                </p>
                
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2 gap-2">
                        <p className="text-sm font-medium truncate text-left flex-1">{selectedFile?.name}</p>
                        {isShort && (
                            <span className="flex-shrink-0 bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-violet-900 dark:text-violet-300">
                                Short
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-300 ease-out ${uploadProgress < 100 ? 'bg-blue-600' : 'bg-green-500'}`}
                            style={{ width: `${uploadProgress}%` }}>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">{Math.round(uploadProgress)}% uploaded</p>
                </div>

                <button
                    onClick={handleSelectFileClick}
                    className="mt-6 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-zinc-800 dark:text-white font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
                >
                    CHANGE FILE
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                />
            </div>
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl w-full max-w-5xl h-[90vh] max-h-[700px] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 px-6 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold">{selectedFile ? (title || selectedFile.name) : 'Upload videos'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className={`flex-1 flex flex-col overflow-hidden ${selectedFile ? '' : 'items-center justify-center p-8'}`}>
                    {selectedFile ? renderSelectedFileView() : renderInitialView()}
                </main>
                <footer className="flex items-center justify-between px-8 py-4 border-t border-zinc-200 dark:border-zinc-700">
                     <p className="text-xs text-zinc-500 max-w-lg text-left">
                        By submitting your videos to FunsTube, you acknowledge that you agree to FunsTube's Terms of Service and Community Guidelines. Please be sure not to violate others' copyright or privacy rights.
                     </p>
                     <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedFile || uploadProgress < 100 || !title.trim()}
                     >
                        Publish
                     </button>
                </footer>
            </div>
        </div>
    );
};

export default UploadModal;
