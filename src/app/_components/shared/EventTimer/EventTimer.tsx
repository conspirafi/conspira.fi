"use client";

import React, { useState, useEffect } from "react";

interface EventTimerProps {
  targetDateString: string | undefined;
}

const formatTime = (time: number) => String(time).padStart(2, "0");

const EventTimer: React.FC<EventTimerProps> = ({ targetDateString }) => {
  const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date().getTime();
    const difference = new Date(targetDate).getTime() - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { hours, minutes, seconds };
    }

    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!targetDateString) return { hours: 0, minutes: 0, seconds: 0 };
    return calculateTimeLeft(new Date(targetDateString));
  });

  useEffect(() => {
    if (!targetDateString) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate = new Date(targetDateString);

    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateString]);

  const { hours, minutes, seconds } = timeLeft;

  if (!targetDateString) {
    return null;
  }

  return (
    <div className="font-enhanced-led-board flex w-auto items-start justify-end text-white">
      <div className="mr-8 flex items-center justify-center gap-1">
        <span className="bg-red h-1.5 w-1.5"></span>
        <p className="font-inter text-center text-[12px] opacity-30">Time</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="mr-1 flex flex-col items-center">
          <p className="text-[49px]">{formatTime(hours)}</p>
        </div>
        <p className="text-[49px]">:</p>
        <div className="mx-1 flex flex-col items-center">
          <p className="text-[49px]">{formatTime(minutes)}</p>
        </div>
        <p className="text-[49px]">:</p>
        <div className="ml-1 flex flex-col items-center">
          <p className="text-[49px]">{formatTime(seconds)}</p>
        </div>
      </div>
    </div>
  );
};

export default EventTimer;
