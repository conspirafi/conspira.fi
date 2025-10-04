"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface OverlaySocialBtnProps {
  icon: React.ReactNode;
  href: string;
  className?: string;
}

export default function OverlaySocialBtn({
  icon,
  href,
  className,
}: OverlaySocialBtnProps) {
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      window.open(href, "_blank");
    }, 200);
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/30 ${className}`}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      role="button"
      tabIndex={0}
      variants={{
        rest: {
          scale: 1,
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.3)",
        },
        hover: {
          scale: 1.1,
          borderWidth: 6,
          borderColor: "rgba(255,255,255,1)",
          transition: { duration: 0.3 },
        },
        tap: {
          scale: 1.1,
          transition: { duration: 0.2 },
        },
      }}
    >
      {flash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-white"
        />
      )}

      <span className="relative z-10">{icon}</span>
    </motion.div>
  );
}
