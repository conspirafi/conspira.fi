"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface VideoContextType {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  analyserL: AnalyserNode | null;
  analyserR: AnalyserNode | null;
  isMuted: boolean;
  toggleMute: () => void;
  setVideoElement: (element: HTMLVideoElement | null) => void;
}

export const VideoContext = React.createContext<VideoContextType | null>(null);

export const useVideo = () => {
  const context = React.useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyserL, setAnalyserL] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (!videoElement) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAnalyserL(null);
      setAnalyserR(null);
      return;
    }

    const setupAudioGraph = () => {
      if (audioContextRef.current) return;
      const AudioContextCtor =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextCtor();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaElementSource(videoElement);
      const splitter = audioCtx.createChannelSplitter(2);

      const newAnalyserL = audioCtx.createAnalyser();
      const newAnalyserR = audioCtx.createAnalyser();
      newAnalyserL.fftSize = 256;
      newAnalyserR.fftSize = 256;

      setAnalyserL(newAnalyserL);
      setAnalyserR(newAnalyserR);

      source.connect(splitter);
      source.connect(audioCtx.destination);
      splitter.connect(newAnalyserL, 0);
      splitter.connect(newAnalyserR, 1);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setupAudioGraph();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
    };

    const handleLoadedMetadata = () => setDuration(videoElement.duration);
    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    videoElement.volume = 0.5;
    videoElement.muted = isMuted;

    videoElement
      .play()
      .catch((e) => console.error("Autoplay failed in provider:", e));

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, [videoElement, isMuted]);

  const setVideoElementCallback = useCallback(
    (element: HTMLVideoElement | null) => {
      setVideoElement(element);
    },
    [],
  );

  const toggleMute = useCallback(() => {
    if (videoElement) {
      const newMuted = !isMuted;
      videoElement.muted = newMuted;
      setIsMuted(newMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  }, [videoElement, isMuted]);

  const value = {
    duration,
    currentTime,
    isPlaying,
    analyserL,
    analyserR,
    isMuted,
    toggleMute,
    setVideoElement: setVideoElementCallback,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
