"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useVideo } from "~/app/providers/VideoProvider";

const SECONDS_SPACING = 32;

const VideoTimeline: React.FC = () => {
  const { duration, isPlaying } = useVideo();

  const allSeconds = useMemo(() => {
    if (duration === 0) return [];
    return Array.from(
      { length: Math.ceil(duration) + 1 },
      (_, i) => Math.ceil(duration) - i,
    );
  }, [duration]);

  if (allSeconds.length === 0) {
    return null;
  }

  const viewportHeight = 160;
  const totalAnimationHeight = allSeconds.length * SECONDS_SPACING;

  const Tick = ({ second }: { second: number }) => {
    const isMajorTick = second % 5 === 0 && second > 0;
    return (
      <div key={second} className="flex h-6 items-center justify-start gap-3">
        <div className="h-0.5 w-7 bg-white" />
        <p
          className={`font-enhanced-led-board text-[21px] ${isMajorTick ? "text-white opacity-100" : "opacity-0"}`}
        >
          {second}
        </p>
      </div>
    );
  };

  return (
    <div className="relative flex justify-end">
      <div
        className="ml-4 overflow-hidden"
        style={{
          height: `${viewportHeight}px`,
          maskImage:
            "linear-gradient(to bottom, transparent, black 50%, black 75%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 50%, black 75%, transparent)",
        }}
      >
        <motion.div
          animate={{ y: [0, -totalAnimationHeight] }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          {allSeconds.map((second) => (
            <Tick key={`a-${second}`} second={second} />
          ))}
          {allSeconds.map((second) => (
            <Tick key={`b-${second}`} second={second} />
          ))}
        </motion.div>
      </div>

      {/* <div className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2">
        <div className="ml-4 h-full w-8 bg-white" />
      </div> */}
    </div>
  );
};

export default VideoTimeline;
