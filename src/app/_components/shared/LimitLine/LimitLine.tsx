"use client";

import React from "react";
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
}

export const LimitLine: React.FC<LimitLineProps> = ({
  limit = 0,
  balance = 0,
  className,
  isDesktop = true,
}) => {
  const balancePercentage =
    limit > 0 ? Math.min((balance / limit) * 100, 100) : 0;
  const limitPercentage = 100 - balancePercentage;

  const gapWidth = 4;

  return (
    <div
      className={`flex w-full max-w-[651px] flex-col items-center text-white ${className}`}
    >
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex items-end justify-between text-lg">
          <p className="w-[100px] text-base">Presale Limit</p>
          <div className="flex flex-col items-center">
            <p className="font-inter mb-2 text-lg font-normal text-white opacity-30">
              Funded
            </p>
            <p className="font-enhanced-led-board text-shadow-glow text-[32px] leading-[50px]">
              {formatCurrency(balance)}
            </p>
          </div>
          <p className="w-[100px] text-end text-base">
            {formatCurrency(limit)}
          </p>
        </div>

        <div className="flex h-2 w-full items-center gap-1">
          {balancePercentage > 0 && (
            <motion.div
              className="relative h-full bg-white"
              style={{
                borderRadius: "9999px",
                boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.5)",
              }}
              initial={{ width: "0%" }}
              animate={{
                width: `calc(${balancePercentage}% - ${balancePercentage === 100 ? 0 : gapWidth / 2}px)`,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}

          {balancePercentage < 100 && (
            <motion.div
              className="h-full rounded-full bg-white opacity-20"
              initial={{ width: "100%" }}
              animate={{
                width: `calc(${limitPercentage}% - ${balancePercentage === 0 ? 0 : gapWidth / 2}px)`,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
