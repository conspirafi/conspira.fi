"use client";

import React, { useEffect, useRef, useCallback } from "react";
import "./equalizer-stereo.scss";
import { useVideo } from "~/app/providers/VideoProvider";

type Props = {
  barCount?: number;
  className?: string;
};

const EqualizerStereo: React.FC<Props> = ({
  barCount = 12,
  className = "",
}) => {
  const { isPlaying, analyserL, analyserR } = useVideo();
  const rafRef = useRef<number | null>(null);
  const leftBarsRef = useRef<HTMLDivElement[]>([]);
  const rightBarsRef = useRef<HTMLDivElement[]>([]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyserL || !analyserR) {
      stopAnimation();
      return;
    }

    const binCount = analyserL.frequencyBinCount;
    const dataL = new Uint8Array(binCount);
    const dataR = new Uint8Array(binCount);

    const computeLevel = (data: Uint8Array) => {
      let sum = 0;
      for (let b = 0; b < data.length; b++) sum += data[b];
      return sum / (data.length * 255);
    };

    const update = () => {
      analyserL.getByteFrequencyData(dataL);
      analyserR.getByteFrequencyData(dataR);

      const levelL = computeLevel(dataL);
      const levelR = computeLevel(dataR);

      const activeL = Math.round(levelL * barCount);
      const activeR = Math.round(levelR * barCount);

      for (let i = 0; i < barCount; i++) {
        const lEl = leftBarsRef.current[i];
        const rEl = rightBarsRef.current[i];
        if (lEl) lEl.style.opacity = i < activeL ? "1" : "0.3";
        if (rEl) rEl.style.opacity = i < activeR ? "1" : "0.3";
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      stopAnimation();
    };
  }, [isPlaying, analyserL, analyserR, barCount, stopAnimation]);

  const renderColumn = (side: "left" | "right") => {
    const refs = side === "left" ? leftBarsRef : rightBarsRef;
    refs.current = Array.from(
      { length: barCount },
      (_, i) => refs.current[i] ?? (null as any),
    );
    const label = side === "left" ? "L" : "R";

    return (
      <div className={`eq-column-wrapper eq-column-${side}`}>
        <div className="eq-bars">
          {Array.from({ length: barCount }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) refs.current[i] = el;
              }}
              className="eq-bar"
            />
          ))}
        </div>
        <div className={`eq-label eq-label-${side}`}>{label}</div>
      </div>
    );
  };

  return (
    <div className={`equalizer-stereo ${className}`}>
      {renderColumn("left")}
      {renderColumn("right")}
    </div>
  );
};

export default EqualizerStereo;
