import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CrossIcon } from "../Overlay/BordersSvg";

const DiscoverElement = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleWheel = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [hasScrolled]);

  return (
    <div className="fixed top-1/2 left-1/2 z-20 flex h-[412px] w-full max-w-[661px] -translate-x-1/2 -translate-y-1/2 items-end justify-center">
      <div className="absolute top-0 left-6">
        <CrossIcon />
      </div>
      <div className="absolute top-0 right-6">
        <CrossIcon />
      </div>

      <div className="absolute bottom-0 left-6">
        <CrossIcon />
      </div>
      <div className="absolute right-6 bottom-0">
        <CrossIcon />
      </div>
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-enhanced-led-board mb-20 text-xl">
              Scroll & Discover
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverElement;
