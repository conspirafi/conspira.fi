"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOnboardingStore } from "~/app/store/onboardingStore";
import { useViewport } from "~/app/providers/ViewportProvider";

const SkipIntroHint = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdStartRef = useRef<number | null>(null);
  const { finishOnboarding } = useOnboardingStore();
  const { isMobile } = useViewport();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isHolding) {
        setIsHolding(true);
        holdStartRef.current = performance.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsHolding(false);
        setProgress(0);
        holdStartRef.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isHolding]);

  useEffect(() => {
    let raf: number;

    const update = (now: number) => {
      if (isHolding && holdStartRef.current !== null) {
        const elapsed = now - holdStartRef.current;
        const newProgress = Math.min(elapsed / 2000, 1);
        setProgress(newProgress);

        if (newProgress >= 1) {
          finishOnboarding();
          setIsHolding(false);
          holdStartRef.current = null;
        } else {
          raf = requestAnimationFrame(update);
        }
      }
    };

    if (isHolding) raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [isHolding, finishOnboarding]);

  const handlePointerDown = (e: React.PointerEvent | PointerEvent) => {
    e.preventDefault();
    if (!isHolding) {
      setIsHolding(true);
      holdStartRef.current = performance.now();
    }
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent | PointerEvent) => {
    e.preventDefault();
    if (isHolding) {
      setIsHolding(false);
      setProgress(0);
      holdStartRef.current = null;
    }
  };

  useEffect(() => {
    if (!isMobile) return;

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUpOrLeave);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUpOrLeave);
    };
  }, [isHolding, isMobile]);

  const text = isMobile
    ? "Hold HERE to skip intro"
    : "Hold SPACE to skip intro";

  return (
    <div
      className={`fixed ${isMobile ? "bottom-[47px]" : "bottom-[21px]"} left-1/2 flex -translate-x-1/2 flex-col items-center gap-3.5`}
    >
      <p
        className={`font-inter text-[23px] ${isHolding ? "text-white" : "text-white/30"} select-none`}
        style={{ letterSpacing: "0.5px" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
      >
        {text}
      </p>
      <div className="relative h-[1px] w-[268px] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute top-0 left-1/2 h-full -translate-x-1/2 bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear", duration: 0 }}
        />
      </div>
    </div>
  );
};

export default SkipIntroHint;
