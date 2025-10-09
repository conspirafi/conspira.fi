"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useEventCasesStore } from "~/app/store/useEventStore";
import { api } from "~/trpc/react";

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
  const { eventCases, activeEventCase, setActiveEventCase, setEventCases } =
    useEventCasesStore();

  const {
    data: fetchedEvents,
    isLoading,
    isError,
  } = api.pmxMarketRouter.getEvents.useQuery();

  useEffect(() => {
    if (fetchedEvents && eventCases.length === 0) {
      setEventCases(fetchedEvents);
      if (fetchedEvents.length > 0) {
        setActiveEventCase(fetchedEvents[0] ?? null);
      }
    }
  }, [fetchedEvents, eventCases.length, setEventCases, setActiveEventCase]);

  if (isLoading) {
    return (
      <div className="pointer-events-auto flex flex-col gap-3">
        <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
        <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load events.</div>;
  }

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
