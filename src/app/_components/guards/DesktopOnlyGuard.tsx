"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

interface DesktopOnlyGuardProps {
  children: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;

const titles = [
  "TERMINAL REQUIRED",
  "ACCESS DENIED",
  "DESKTOP ONLY",
  "SIGNAL LOCKED",
];
const bodies = [
  {
    line1: "This system needs a larger screen.",
    line2: "Open on a desktop terminal to process the full signal.",
  },
  {
    line1: "Mobile cannot sustain the feed.",
    line2: "Return on desktop to view the live market and swarm.",
  },
  {
    line1: "Switch to a desktop to decode the signal.",
    line2: "Powered by Agent $MOCK",
  },
  {
    line1: "The transmission you're seeking isn't available on mobile... yet.",
    line2: "",
  },
];

const MobileMessage = () => {
  const [content, setContent] = useState({
    title: titles[0],
    body: bodies[0],
  });

  useEffect(() => {
    const pick = Math.floor(Math.random() * titles.length);
    setContent({
      title: titles[pick] ?? titles[0],
      body: bodies[pick] ?? bodies[0],
    });
  }, []);

  const isSignalLocked = content.title === "SIGNAL LOCKED";

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#06080A] p-6 text-center text-[#E6EEF6]">
      <div className="relative mb-8 h-48 w-48">
        <Image
          src="/mock-ticker.png"
          alt="Agent Mock"
          fill
          quality={100}
          sizes="192px"
          className="object-contain"
        />
      </div>
      <h2 className="font-enhanced-led-board mb-4 text-lg tracking-[.12em]">
        {content.title}
      </h2>
      <p
        className={`font-inter max-w-xs text-sm text-[#98A2AF] ${
          isSignalLocked ? "font-mono-manual" : "font-inter"
        }`}
      >
        {content.body?.line1}
      </p>
      <p
        className={`font-inter mt-2 max-w-xs text-sm text-[#98A2AF] ${
          isSignalLocked ? "font-mono-manual" : "font-inter"
        }`}
      >
        {content.body?.line2}
      </p>
    </div>
  );
};

const DesktopOnlyGuard: React.FC<DesktopOnlyGuardProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  if (isMobile) {
    return <MobileMessage />;
  }

  return <>{children}</>;
};

export default DesktopOnlyGuard;
