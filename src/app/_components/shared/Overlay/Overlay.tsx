"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./Overlay.scss";

import { useEventCasesStore } from "~/app/store/useEventStore";
import { useViewport } from "~/app/providers/ViewportProvider";

import type { OverlayProps } from "~/app/interfaces/overlay-interfaces";

import OverlayMobile from "./OverlayMobile/OverlayMobile";
import OverlayDesktop from "./OverlayDecktop/OverlayDesktop";

const Overlay: React.FC<OverlayProps> = (props) => {
  const { isMobile, isDesktop } = useViewport();
  const activeEventCase = useEventCasesStore((state) => state.activeEventCase);

  return (
    <div className="overlay pointer-events-none relative z-0 flex h-screen w-screen items-center justify-center p-[15px]">
      {isMobile && (
        <OverlayMobile
          data={props.data}
          marketFees={props.marketFees}
        ></OverlayMobile>
      )}

      {isDesktop && <OverlayDesktop data={props.data}></OverlayDesktop>}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEventCase?.name || "initial"}
          className="pointer-events-auto relative flex flex-col"
        >
          {props.children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Overlay;
