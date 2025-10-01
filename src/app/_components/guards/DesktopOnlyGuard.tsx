"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

interface DesktopOnlyGuardProps {
  children: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;

const MobileMessage = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-black p-8 text-center font-sans text-white">
    <p className="text-red relative z-10 mt-[15vh] mb-12 text-[2.5vh]">
      OPTIMIZED FOR DESKTOP
    </p>
    <p className="text-red relative z-10 text-[1.5vh]">
      This experience is designed for larger screens. <br></br> Please open on a
      desktop or laptop <br></br> for the best viewing experience.<br></br> It&apos;s
      too early for you here.
    </p>
    <Image
      src={"/mobile_screen.png"}
      alt={"background"}
      fill
      quality={100}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-contain"
    />
  </div>
);

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
