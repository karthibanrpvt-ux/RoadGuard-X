import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Play, Pause, Terminal as TerminalIcon, Activity, ShieldCheck } from 'lucide-react';

type Severity = 'Low' | 'Medium' | 'High';

interface DetectionBBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface VideoDetection {
  damage_class: string;
  severity: Severity;
  confidence: number;
  frame_index: number;
  frame_width: number;
  frame_height: number;
  fps: number;
  bbox: DetectionBBox;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';
const MAX_VISIBLE_BOXES = 20;

const EdgeSimulation: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [detections, setDetections] = useState<VideoDetection[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sourceFps = detections[0]?.fps || 30;

  const nearestDetectionFrame = useMemo(() => {
    if (detections.length === 0) {
      return null;
    }
    const uniqueFrames = Array.from(new Set(detections.map((d) => d.frame_index))).sort((a, b) => a - b);
    let nearest = uniqueFrames[0];
    let nearestDistance = Math.abs(uniqueFrames[0] - currentFrame);
    for (let i = 1; i < uniqueFrames.length; i += 1) {
      const distance = Math.abs(uniqueFrames[i] - currentFrame);
      if (distance < nearestDistance) {
        nearest = uniqueFrames[i];
        nearestDistance = distance;
      }
    }
    return nearest;
  }, [detections, currentFrame]);

  const currentFrameDetections = useMemo(() => {
    if (nearestDetectionFrame === null) {
      return [];
    }
    return detections
      .filter((d) => d.frame_index === nearestDetectionFrame)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_VISIBLE_BOXES);
  }, [detections, nearestDetectionFrame]);

  const severityCount = useMemo(
    () => ({
      High: currentFrameDetections.filter((d) => d.severity === 'High').length,
      Medium: currentFrameDetections.filter((d) => d.severity === 'Medium').length,
      Low: currentFrameDetections.filter((d) => d.severity === 'Low').length,
    }),
    [currentFrameDetections]
  );

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const pushLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const runProcessingAnimation = () => {
    const steps = [
      'Uploading video stream to edge gateway...',
      'Decoding frames and initializing model context...',
      'Running quantized YOLOv8 inference...',
      'Generating frame-synced overlays...',
      'Finalizing telemetry payload...',
    ];

    let stepIdx = 0;
    setProcessingStep(steps[0]);

    const id = window.setInterval(() => {
      setProcessingProgress((prev) => {
        const next = Math.min(prev + Math.random() * 8, 92);
        if (stepIdx < steps.length - 1 && next >= (stepIdx + 1) * 18) {
          stepIdx += 1;
          setProcessingStep(steps[stepIdx]);
        }
        return next;
      });
    }, 180);

    return id;
  };

  const processVideo = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(4);
    setProcessingStep('Preparing inference pipeline...');
    setDetections([]);
    setCurrentFrame(0);
    setIsPlaying(false);

    pushLog('[SYSTEM] Video received. Starting backend processing...');
    const animationId = runProcessingAnimation();

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await fetch(`${API_BASE_URL}/inference/video`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson?.detail || 'Inference request failed');
      }

      const result = await res.json();
      const backendDetections: VideoDetection[] = result.detections || [];
      setDetections(backendDetections);

      setProcessingStep('Processing complete. Rendering output...');
      setProcessingProgress(100);
      pushLog(`[SUCCESS] Processing complete. ${result.detections_count} detections generated.`);
      pushLog('[SYSTEM] Video ready with frame-synced pothole overlays.');
    } catch (err) {
      pushLog(`[ERROR] ${String(err)}`);
      setProcessingStep('Processing failed. Please retry with another video.');
      setProcessingProgress(0);
    } finally {
      window.clearInterval(animationId);
      window.setTimeout(() => setIsProcessing(false), 300);
    }
  };

  const setSelectedVideo = async (file: File) => {
    if (!(file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4'))) {
      pushLog(`[ERROR] Only MP4 files supported. Got: ${file.type || 'unknown'}`);
      return;
    }

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(objectUrl);
    pushLog(`[SYSTEM] Loaded video: ${file.name}`);

    await processVideo(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await setSelectedVideo(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await setSelectedVideo(files[0]);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) {
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setDetections([]);
    setCurrentFrame(0);
    setIsPlaying(false);
    setProcessingProgress(0);
    setProcessingStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            className="cyber-card rounded-3xl overflow-hidden relative aspect-video bg-black/40 flex items-center justify-center border border-white/5 group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept=".mp4,video/mp4" onChange={handleFileInput} className="hidden" />

            {!videoFile && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-full flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${isDragging ? 'bg-cyan-500/10 border-2 border-dashed border-cyan-500' : ''}`}
              >
                <div className="p-6 bg-cyan-500/5 rounded-full border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12 text-cyan-500" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-white uppercase tracking-tighter mb-2">Drop Dashcam Footage or Click</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Auto Processing Starts Immediately</p>
                </div>
              </div>
            )}

            {videoFile && isProcessing && (
              <div className="absolute inset-0 bg-[#02040a]/95 flex items-center justify-center px-10">
                <div className="w-full max-w-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-cyan-300 text-xs font-black uppercase tracking-[0.25em]">Edge Processing</p>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3">Analyzing Road Surface Frames</h3>
                  <p className="text-slate-400 text-sm mb-8">{processingStep || 'Preparing...'}</p>

                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${processingProgress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.2 }}
                      className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400"
                    />
                  </div>

                  <p className="text-cyan-300 text-xs font-black tracking-widest">{Math.round(processingProgress)}% COMPLETE</p>

                  <div className="mt-8 grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="h-1.5 rounded bg-cyan-400/80"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {videoFile && !isProcessing && videoUrl && (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  onTimeUpdate={(e) => setCurrentFrame(Math.floor(e.currentTarget.currentTime * sourceFps))}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {currentFrameDetections.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {currentFrameDetections.map((detection, idx) => {
                      const frameWidth = detection.frame_width || 1920;
                      const frameHeight = detection.frame_height || 1080;
                      const bbox = detection.bbox;
                      const confidence = `${(detection.confidence * 100).toFixed(1)}%`;

                      const borderColor =
                        detection.severity === 'High'
                          ? 'border-rose-500'
                          : detection.severity === 'Medium'
                            ? 'border-amber-400'
                            : 'border-cyan-400';

                      const labelBg =
                        detection.severity === 'High'
                          ? 'bg-rose-600'
                          : detection.severity === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-cyan-600';

                      return (
                        <motion.div
                          key={`${nearestDetectionFrame}-${idx}-${bbox.x1}-${bbox.y1}`}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.15 }}
                          className="absolute min-w-[40px] min-h-[26px]"
                          style={{
                            left: `${(bbox.x1 / frameWidth) * 100}%`,
                            top: `${(bbox.y1 / frameHeight) * 100}%`,
                            width: `${((bbox.x2 - bbox.x1) / frameWidth) * 100}%`,
                            height: `${((bbox.y2 - bbox.y1) / frameHeight) * 100}%`,
                          }}
                        >
                          <div className={`w-full h-full border-2 ${borderColor} shadow-[0_0_16px_rgba(0,0,0,0.35)]`}>
                            <div className={`${labelBg} text-white text-[9px] font-black px-2 py-1 inline-flex items-center gap-2 whitespace-nowrap`}>
                              <span>{detection.damage_class}</span>
                              <span className="bg-black/20 rounded px-1.5 py-0.5">{confidence}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className="bg-black/65 backdrop-blur-md border border-cyan-400/30 rounded-xl p-3 min-w-[165px]">
                    <p className="text-cyan-300 text-[10px] font-black uppercase tracking-widest">Frame {currentFrame}</p>
                    <p className="mt-2 text-white text-[11px] font-black">Visible: {currentFrameDetections.length}</p>
                    <div className="mt-2 space-y-1 text-[10px] font-black uppercase tracking-widest">
                      <div className="text-rose-400">High: {severityCount.High}</div>
                      <div className="text-amber-300">Medium: {severityCount.Medium}</div>
                      <div className="text-cyan-300">Low: {severityCount.Low}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button onClick={togglePlay} className="p-4 bg-cyan-500 rounded-2xl text-black hover:scale-110 transition-transform">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={clearVideo}
                        className="px-6 py-3 rounded-2xl bg-slate-500 text-white font-bold text-sm transition-all hover:bg-slate-600"
                      >
                        Clear Video
                      </button>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <ShieldCheck className="w-4 h-4 text-cyan-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">YOLOv8-X</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <TerminalIcon className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Live Telemetry</h3>
                <p className="text-xs font-bold text-white">Edge Node Stream</p>
              </div>
            </div>

            <div
              ref={terminalRef}
              className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-[10px] overflow-y-auto space-y-2 border border-white/5"
            >
              {logs.length === 0 && <p className="text-slate-700 italic">Waiting for video input...</p>}
              {logs.map((log, i) => (
                <div key={`${log}-${i}`} className="flex gap-3">
                  <span className="text-cyan-500/30">[{new Date().toLocaleTimeString()}]</span>
                  <span
                    className={
                      log.includes('[ERROR]')
                        ? 'text-rose-400 font-bold'
                        : log.includes('[SUCCESS]')
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-300'
                    }
                  >
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {detections.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <Activity className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Detection Results</h3>
              <p className="text-xs font-bold text-white">{detections.length} Total Objects Across Video</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Auto mode enabled: video starts processing immediately after drop and shows overlays only after processing completes.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EdgeSimulation;
