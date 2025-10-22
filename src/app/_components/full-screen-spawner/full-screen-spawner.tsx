"use client";

import React, { useEffect, useRef, useState } from "react";
import TwitterCard from "../twitter-card/twitter-card";
import { useEventCasesStore } from "~/app/store/useEventStore";
import type { ITweetFullData } from "~/server/lib/twitterApi";

interface CardInstance {
  data: ITweetFullData;
  key: number;
  progress: number;
  style: React.CSSProperties;
  isPaused?: boolean;
}

export default function FullScreenSpawner() {
  const { activeEventCase } = useEventCasesStore();
  const [activeCards, setActiveCards] = useState<CardInstance[]>([]);
  const hoveredCardKey = useRef<number | null>(null);
  const cardKey = useRef(0);
  const tweets = activeEventCase?.tweets ?? [];

  // Debug: Log tweets when component mounts or activeEventCase changes
  useEffect(() => {
    console.log(
      "[FullScreenSpawner] Active event case:",
      activeEventCase?.name,
    );
    console.log("[FullScreenSpawner] Tweets available:", tweets.length);
    console.log(
      "[FullScreenSpawner] Tweet search phrase:",
      activeEventCase?.tweetSearchPhrase,
    );
  }, [activeEventCase, tweets.length]);

  const availableTweets = useRef<Set<string>>(new Set());
  const recentlyShownTweets = useRef<Map<string, number>>(new Map()); // Track when tweets were last shown
  const pendingSpawns = useRef<number[]>([]);
  const lastSpawnTime = useRef(0);
  const velocity = useRef(0);
  const targetVelocity = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const lastTouchTime = useRef<number | null>(null);
  const touchVelocity = useRef(0);
  const BASE_AUTOPLAY_VELOCITY = 0.0008; // Further reduced for even more reading time

  const spawnCard = (initialProgress: 0 | 1) => {
    if (availableTweets.current.size === 0 || tweets.length === 0) return;

    // Filter out tweets that were shown in the last 30 seconds
    const now = Date.now();
    const cooldownPeriod = 30000; // 30 seconds
    const availableIds = Array.from(availableTweets.current).filter((id) => {
      const lastShown = recentlyShownTweets.current.get(id);
      return !lastShown || now - lastShown > cooldownPeriod;
    });

    // If no tweets available after cooldown filter, use all available
    const ids =
      availableIds.length > 0
        ? availableIds
        : Array.from(availableTweets.current);

    const randomId = ids[Math.floor(Math.random() * ids.length)];
    if (!randomId) return;

    const tweet = tweets.find((t: ITweetFullData) => t.id === randomId);
    if (!tweet) return;

    availableTweets.current.delete(randomId);
    recentlyShownTweets.current.set(randomId, now);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const offsetX = (Math.random() - 0.5) * viewportWidth * 0.56;
    const offsetY = (Math.random() - 0.5) * viewportHeight * 0.4;

    const key = cardKey.current++;
    const initialStyle: React.CSSProperties = {
      position: "absolute",
      left: `${centerX + offsetX - 160.5}px`,
      top: `${centerY + offsetY - 100}px`,
    };

    setActiveCards((prev) => [
      ...prev,
      { data: tweet, key, progress: initialProgress, style: initialStyle },
    ]);
  };

  useEffect(() => {
    if (tweets.length === 0) {
      setActiveCards([]);
      return;
    }

    setActiveCards([]);
    cardKey.current = 0;
    availableTweets.current = new Set(tweets.map((t: ITweetFullData) => t.id));
    recentlyShownTweets.current.clear(); // Clear cooldown tracking on event change
    velocity.current = 0;
    targetVelocity.current = 0;
    pendingSpawns.current.forEach(clearTimeout);
    pendingSpawns.current = [];

    const initialSpawnTimeout = setTimeout(() => spawnCard(0), 100);

    const animate = () => {
      const smoothingFactor = 0.1;
      velocity.current +=
        (targetVelocity.current - velocity.current) * smoothingFactor;
      targetVelocity.current *= 0.9;

      const effectiveVelocity = BASE_AUTOPLAY_VELOCITY + velocity.current;

      if (Math.abs(velocity.current) < 0.0001) {
        velocity.current = 0;
      }

      setActiveCards((prev) => {
        const updatedCards = prev.map((card) => {
          // If card is hovered, freeze it within safe boundaries
          if (card.key === hoveredCardKey.current) {
            // Clamp to safe range so it doesn't get removed
            const safeProgress = Math.max(0.01, Math.min(0.99, card.progress));
            return { ...card, progress: safeProgress };
          }
          // Otherwise update normally
          return {
            ...card,
            progress: Math.max(
              0,
              Math.min(1, card.progress + effectiveVelocity),
            ),
          };
        });

        const removed = updatedCards.filter(
          (card) => card.progress <= 0 || card.progress >= 1,
        );
        removed.forEach((card) => {
          availableTweets.current.add(card.data.id);
          // Clean up old cooldown entries (older than 60 seconds)
          const now = Date.now();
          recentlyShownTweets.current.forEach((timestamp, id) => {
            if (now - timestamp > 60000) {
              recentlyShownTweets.current.delete(id);
            }
          });
        });

        const newCards = updatedCards.filter(
          (card) => card.progress > 0 && card.progress < 1,
        );

        const now = Date.now();
        if (
          newCards.length < 3 &&
          availableTweets.current.size > 0 &&
          now - lastSpawnTime.current > 1500 // Even more spacing between spawns
        ) {
          const latestCard = newCards[newCards.length - 1];
          const spawnConditionForward =
            latestCard && latestCard.progress > 0.45 + Math.random() * 0.2; // Wait until card is further along
          const spawnConditionBackward =
            latestCard && latestCard.progress < 0.55 - Math.random() * 0.2; // More conservative backward spawn

          if (effectiveVelocity > 0 && spawnConditionForward) {
            const delay = Math.random() * 2500 + 1500; // Longer delays: 1500-4000ms
            const timeoutId = window.setTimeout(() => spawnCard(0), delay);
            pendingSpawns.current.push(timeoutId);
            lastSpawnTime.current = now + delay;
          } else if (effectiveVelocity < 0 && spawnConditionBackward) {
            const delay = Math.random() * 2500 + 1500; // Longer delays: 1500-4000ms
            const timeoutId = window.setTimeout(() => spawnCard(1), delay);
            pendingSpawns.current.push(timeoutId);
            lastSpawnTime.current = now + delay;
          }
        }

        if (newCards.length < 1 && availableTweets.current.size > 0) {
          spawnCard(effectiveVelocity > 0 ? 0 : 1);
        }

        return newCards;
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY / 500;
      if (delta === 0) return;
      targetVelocity.current += delta * 0.1;
      targetVelocity.current = Math.max(
        -0.05,
        Math.min(0.05, targetVelocity.current),
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      lastTouchY.current = touch.clientY;
      lastTouchTime.current = Date.now();
      touchVelocity.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || lastTouchY.current === null) return;
      const touch = e.touches[0];
      if (!touch) return;
      const currentY = touch.clientY;
      const currentTime = Date.now();
      if (lastTouchTime.current !== null) {
        const timeDelta = currentTime - lastTouchTime.current;
        if (timeDelta > 0) {
          const distance = currentY - lastTouchY.current;
          touchVelocity.current = distance / timeDelta;
        }
      }
      const totalDistance = currentY - touchStartY.current;
      const normalizedDistance = totalDistance / 300;
      targetVelocity.current = -normalizedDistance * 0.02;
      targetVelocity.current = Math.max(
        -0.05,
        Math.min(0.05, targetVelocity.current),
      );
      lastTouchY.current = currentY;
      lastTouchTime.current = currentTime;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current === null || touchStartTime.current === null)
        return;
      const currentTime = Date.now();
      const timeDelta = currentTime - touchStartTime.current;
      if (timeDelta < 300 && Math.abs(touchVelocity.current) > 0.2) {
        const momentum = -touchVelocity.current * 0.05;
        targetVelocity.current += momentum;
        targetVelocity.current = Math.max(
          -0.05,
          Math.min(0.05, targetVelocity.current),
        );
      }
      touchStartY.current = null;
      touchStartTime.current = null;
      lastTouchY.current = null;
      lastTouchTime.current = null;
      touchVelocity.current = 0;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      pendingSpawns.current.forEach(clearTimeout);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(initialSpawnTimeout);
    };
  }, [activeEventCase]); // Removed hoveredCardKey from dependencies to prevent listener re-registration

  const getCardStyle = (progress: number, baseStyle: React.CSSProperties) => {
    const scale = 0.4 + progress * 0.9; // Even bigger - max scale now 1.3
    let opacity = 0;
    if (progress < 0.12)
      opacity = progress / 0.12; // Very fast fade in
    else if (progress > 0.88)
      opacity = 1 - (progress - 0.88) / 0.12; // Very slow fade out
    else opacity = 1; // Stay at full opacity even longer (0.12-0.88 = 76% of lifecycle)

    return {
      ...baseStyle,
      transform: `scale(${scale})`,
      opacity,
      transformOrigin: "center",
    };
  };

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {activeCards.map((card) => (
        <div
          key={card.key}
          style={getCardStyle(card.progress, card.style)}
          className="pointer-events-auto"
          onMouseEnter={() => (hoveredCardKey.current = card.key)}
          onMouseLeave={() => (hoveredCardKey.current = null)}
        >
          <TwitterCard
            avatar={card?.data?.user?.avatar || ""}
            name={card?.data?.user?.name || ""}
            username={card?.data?.user?.username || ""}
            createdAt={card?.data?.createdAt || ""}
            text={card?.data?.text || ""}
            url={card?.data?.url || ""}
            media={card?.data?.media || []}
          />
        </div>
      ))}
    </div>
  );
}
