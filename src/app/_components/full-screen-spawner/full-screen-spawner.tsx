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
}

export default function FullScreenSpawner() {
  const { activeEventCase } = useEventCasesStore();
  const [activeCards, setActiveCards] = useState<CardInstance[]>([]);
  const cardKey = useRef(0);
  const tweets = activeEventCase?.tweets ?? [];

  const availableTweets = useRef<Set<string>>(new Set());
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
  const BASE_AUTOPLAY_VELOCITY = 0.0019;

  const spawnCard = (initialProgress: 0 | 1) => {
    if (availableTweets.current.size === 0 || tweets.length === 0) return;

    const ids = Array.from(availableTweets.current);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    if (!randomId) return;

    const tweet = tweets.find((t) => t.id === randomId);
    if (!tweet) return;

    availableTweets.current.delete(randomId);

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
    availableTweets.current = new Set(tweets.map((t) => t.id));
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
        const updatedCards = prev.map((card) => ({
          ...card,
          progress: Math.max(0, Math.min(1, card.progress + effectiveVelocity)),
        }));

        const removed = updatedCards.filter(
          (card) => card.progress <= 0 || card.progress >= 1,
        );
        removed.forEach((card) => availableTweets.current.add(card.data.id));

        const newCards = updatedCards.filter(
          (card) => card.progress > 0 && card.progress < 1,
        );

        const now = Date.now();
        if (
          newCards.length < 3 &&
          availableTweets.current.size > 0 &&
          now - lastSpawnTime.current > 500
        ) {
          const latestCard = newCards[newCards.length - 1];
          const spawnConditionForward =
            latestCard && latestCard.progress > 0.3 + Math.random() * 0.2;
          const spawnConditionBackward =
            latestCard && latestCard.progress < 0.7 - Math.random() * 0.2;

          if (effectiveVelocity > 0 && spawnConditionForward) {
            const delay = Math.random() * 1500 + 500;
            const timeoutId = window.setTimeout(() => spawnCard(0), delay);
            pendingSpawns.current.push(timeoutId);
            lastSpawnTime.current = now + delay;
          } else if (effectiveVelocity < 0 && spawnConditionBackward) {
            const delay = Math.random() * 1500 + 500;
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
  }, [activeEventCase]);

  const getCardStyle = (progress: number, baseStyle: React.CSSProperties) => {
    const scale = 0.2 + progress * 0.7;
    let opacity = 0;
    if (progress < 0.2) opacity = progress / 0.2;
    else if (progress > 0.8) opacity = 1 - (progress - 0.8) / 0.2;
    else opacity = 1;

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
        >
          <TwitterCard
            avatar={card?.data?.user?.avatar || ""}
            name={card?.data?.user?.name || ""}
            username={card?.data?.user?.username || ""}
            date={new Date(card?.data?.createdAt || "").toLocaleDateString()}
            text={card?.data?.text || ""}
            url={card?.data?.url || ""}
          />
        </div>
      ))}
    </div>
  );
}
