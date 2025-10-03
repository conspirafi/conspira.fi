import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CrossIcon } from "../Overlay/BordersSvg";
import { useViewport } from "~/app/providers/ViewportProvider";
import { cn } from "@sglara/cn";

const DiscoverElement = () => {
  const { isMobile, isDesktop } = useViewport();
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
    <div
      className={cn(
        "fixed top-1/2 left-1/2 z-20 flex w-full -translate-x-1/2 -translate-y-1/2 items-end justify-center",
        {
          "h-[326px] max-w-[326px]": isMobile,
          "h-[412px] max-w-[661px]": isDesktop,
        },
      )}
    >
      <div className="absolute top-2 left-0">
        <CrossIcon size={isMobile ? "24" : "39"} />
      </div>
      <div className="absolute top-2 right-0">
        <CrossIcon size={isMobile ? "24" : "39"} />
      </div>

      <div className="absolute bottom-2 left-0">
        <CrossIcon size={isMobile ? "24" : "39"} />
      </div>
      <div className="absolute right-0 bottom-2">
        <CrossIcon size={isMobile ? "24" : "39"} />
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
