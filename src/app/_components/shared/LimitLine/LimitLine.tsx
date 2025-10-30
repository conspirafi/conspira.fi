"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface LimitLineProps {
  limit: number | undefined;
  balance: number | undefined;
  className?: string;
  isDesktop?: boolean;
  isFundingState?: boolean;
}

export const LimitLine: React.FC<LimitLineProps> = ({
  limit = 0,
  balance = 0,
  className,
  isFundingState,
}) => {
  balance = 2500;

  const balancePercentage =
    limit > 0 ? Math.min((balance / limit) * 100, 100) : 0;

  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(100);
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    const updateSizes = () => {
      if (boxRef.current && containerRef.current) {
        setBoxWidth(boxRef.current.offsetWidth);
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateSizes();
    setTimeout(updateSizes, 100);
  }, [balance]);

  // Calculate clamped position to keep box within bounds
  const getClampedPosition = () => {
    const halfBoxWidth = boxWidth / 2;
    const minPixels = halfBoxWidth;
    const maxPixels = containerWidth - halfBoxWidth;
    const targetPixels = (balancePercentage / 100) * containerWidth;

    const clampedPixels = Math.max(
      minPixels,
      Math.min(maxPixels, targetPixels),
    );
    const clampedPercent = (clampedPixels / containerWidth) * 100;

    return clampedPercent;
  };

  const clampedPosition = getClampedPosition();
  const gapSize = 6;

  return (
    <div
      className={`mt-8 flex w-full max-w-[651px] items-center text-white ${className}`}
    >
      {/* Presale Limit text */}
      <p className="mr-[17px] flex-shrink-0 text-[12px]">Presale Limit</p>

      {/* Progress bar container */}
      <div ref={containerRef} className="relative flex h-2 flex-1 items-center">
        {/* Left progress bar (filled) */}
        {clampedPosition > 0 && (
          <motion.div
            className="absolute left-0 h-full rounded-full bg-white"
            style={{
              boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.5)",
            }}
            initial={{ width: "0px" }}
            animate={{
              width: `calc(${clampedPosition}% - ${boxWidth / 2}px - ${gapSize}px)`,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}

        {/* Balance indicator box */}
        <motion.div
          ref={boxRef}
          className="absolute z-10 flex h-8 items-center justify-center rounded-xl bg-white px-2.5"
          initial={{
            left: "0%",
            transform: "translateX(-50%)",
          }}
          animate={{
            left: `${clampedPosition}%`,
            transform: "translateX(-50%)",
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <p className="font-enhanced-led-board text-shadow-glow pb-0.5 text-[17px] font-normal whitespace-nowrap text-black">
            {formatCurrency(balance)}
          </p>
        </motion.div>

        {/* Right progress bar (unfilled) */}
        {clampedPosition < 100 && (
          <motion.div
            className="absolute right-0 h-full rounded-full bg-white opacity-20"
            initial={{
              width: "100%",
            }}
            animate={{
              width: `calc(${100 - clampedPosition}% - ${boxWidth / 2}px - ${gapSize}px)`,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Limit amount */}
      <p className="ml-[17px] flex-shrink-0 text-[12px]">
        {formatCurrency(limit)}
      </p>

      {/* Status text below */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-inter text-sm font-normal whitespace-nowrap text-white opacity-30">
          {isFundingState ? "Funded" : "Funded, awaiting market open"}
        </p>
      </div>
    </div>
  );
};
