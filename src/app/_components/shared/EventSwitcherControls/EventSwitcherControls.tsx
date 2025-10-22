"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEventCasesStore } from "~/app/store/useEventStore";

const buttonVariants = {
  inactive: {
    backgroundColor: "rgba(255,255,255,0.1)",
    height: "1.5rem",
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  active: {
    backgroundColor: "#FFFFFF",
    height: "2.25rem",
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

const EventSwitcherControls: React.FC = () => {
  const { eventCases, activeEventCase, setActiveEventCase } =
    useEventCasesStore();

  return (
    <div className="pointer-events-auto flex flex-col gap-3">
      {eventCases.map((event) => {
        const key = event.name ?? event.marketSlug;
        const isActive = activeEventCase?.name === event.name;

        return (
          <motion.button
            key={key}
            onClick={() => setActiveEventCase(event)}
            variants={buttonVariants}
            initial="inactive"
            animate={isActive ? "active" : "inactive"}
            whileHover={
              !isActive ? { backgroundColor: "rgba(255,255,255,0.5)" } : {}
            }
            className="pointer-events-auto w-6 cursor-pointer"
            aria-label={`Go to event: ${event.eventTitle}`}
          />
        );
      })}
    </div>
  );
};

export default EventSwitcherControls;
