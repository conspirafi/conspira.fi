"use client";

import { motion } from "framer-motion";
import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";
import { useVideo } from "~/app/providers/VideoProvider";
import { useState } from "react";

export default function OverlaySoundBtn({ className }: { className?: string }) {
  const { isMuted, toggleMute } = useVideo();
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    setFlash(true);
    toggleMute();
    setTimeout(() => setFlash(false), 200);
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`relative flex h-[52px] w-[52px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/30 ${className}`}
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

      <span className="relative z-10">
        {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
      </span>
    </motion.div>
  );
}
