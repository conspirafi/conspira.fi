"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "~/app/providers/VideoProvider";

const VideoPlayerWithEQ: React.FC = () => {
  const { setVideoElement, isMuted } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const savedTimeRef = useRef<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries && entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({
          width: Math.round(width),
          height: Math.round(height),
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoElement(video);

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          savedTimeRef.current = video.currentTime;
          video.pause();
          video.src = "";
          video.load();
        } else {
          video.src = "/3I Atlas optmizide.mp4";
          video.load();
          video.addEventListener(
            "loadedmetadata",
            () => {
              video.currentTime = savedTimeRef.current;
              video.play();
            },
            { once: true },
          );
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        setVideoElement(null);
      };
    }
  }, [setVideoElement]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            width: "calc(100% + 2px)",
            height: "calc(100% + 4px)",
            background: `
              radial-gradient(50.00% 50.00% at 50% 50%,rgba(0, 0, 0, 0) 30%,rgba(0, 0, 0, 1) 100%),
              linear-gradient(to top,    rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%),
              linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%),
              linear-gradient(to left,   rgba(0,0,0,1) 0%, rgba(0,0,0,0) 25%),
              linear-gradient(to right,  rgba(0,0,0,1) 0%, rgba(0,0,0,0) 25%)
            `,
          }}
        ></div>
        <video
          ref={videoRef}
          src="/3I Atlas optmizide.mp4"
          loop
          playsInline
          autoPlay
          muted
          disablePictureInPicture={true}
          className="relative inset-0 top-0.25 left-0.5 h-full object-cover"
          style={{
            zIndex: 1,
            width: "calc(100% - 4px)",
            height: "calc(100% - 4px)",
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayerWithEQ;
