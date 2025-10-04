"use client";

import React, { useEffect, useState, useRef } from "react";
import "./loader.scss";
import { useLoader } from "~/app/providers/LoaderProvider";
import { useViewport } from "~/app/providers/ViewportProvider";

const Loader = () => {
  const messages = [
    { text: "~$ ./boot_conspiracies.sh", items: [], spinner: false },
    {
      text: "Decrypting hidden protocols...",
      items: [],
      spinner: true,
    },
    {
      text: "Loading prediction engine...",
      items: ["markets.db", "liquidity.cfg", "resolution.log"],
      spinner: true,
    },
    {
      text: "Accessing conspiracy files...",
      items: ["deep_state.db", "ufosightings.csv", "mkultra_notes.txt"],
      spinner: true,
    },
    {
      text: "Preparing first signal...",
      items: ["atlas_3I_logs.bin", "alien_signals.mp4"],
      spinner: true,
      waitForVideo: true,
    },
  ];

  const quotes = [
    "Every movement needs a signal.",
    "Every signal needs a symbol.",
  ];

  const spinnerFrames: string[] = ["/", "-", "\\", "|"];

  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<string>("");
  const [currentSpinner, setCurrentSpinner] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showQuotes, setShowQuotes] = useState<boolean>(false);
  const [quoteLines, setQuoteLines] = useState<string[]>([]);
  const [currentQuoteLine, setCurrentQuoteLine] = useState<string>("");
  const [promptPrefix, setPromptPrefix] = useState<string>("mock@conspirafi: ");
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isShrinking, setIsShrinking] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const [currentCTAText, setCurrentCTAText] = useState<string>("");
  const [ctaFinished, setCTAFinished] = useState<boolean>(false);

  const startedRef = useRef(false);
  const mountedRef = useRef(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const activatedRef = useRef(false);
  const videoLoadedRef = useRef(false);

  const TYPING_SPEED = 10;
  const SPINNER_SPEED = 45;

  const { setIsLoading, setIsEntered } = useLoader();
  const { isMobile } = useViewport();

  const ctaText = isMobile
    ? "TOUCH to enter website"
    : "Press SPACE to reveal the signal";
  const highlightWord = isMobile ? "TOUCH" : "SPACE";
  const beforeHighlight = ctaText.substring(0, ctaText.indexOf(highlightWord));
  const afterHighlight = ctaText.substring(
    ctaText.indexOf(highlightWord) + highlightWord.length,
  );

  useEffect(() => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.src = "/3I Atlas optmizide.mp4";

    const handleCanPlayThrough = () => {
      videoLoadedRef.current = true;
    };

    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.src = "";
    };
  }, []);

  useEffect(() => {
    if (!isSpinning) {
      setCurrentSpinner("");
      return;
    }

    setCurrentSpinner(spinnerFrames[0] || "");
    const interval = setInterval(() => {
      setCurrentSpinner((prev) => {
        const currentIndex = spinnerFrames.indexOf(prev);
        return spinnerFrames[(currentIndex + 1) % spinnerFrames.length] || "";
      });
    }, SPINNER_SPEED);

    return () => clearInterval(interval);
  }, [isSpinning]);

  const handleActivation = () => {
    if (activatedRef.current || !ctaFinished) return;
    activatedRef.current = true;
    setIsFlashing(true);
    setIsEntered(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleActivation();
      }
    };

    if (ctaFinished) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ctaFinished]);

  useEffect(() => {
    const handleClick = () => {
      handleActivation();
    };

    if (ctaFinished) {
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [ctaFinished]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleActivation();
    };

    if (ctaFinished) {
      window.addEventListener("touchstart", handleTouch);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [ctaFinished]);

  useEffect(() => {
    if (isFlashing && overlayRef.current) {
      overlayRef.current.addEventListener(
        "animationend",
        () => {
          setIsFlashing(false);
          setShowContent(false);
          setIsTransparent(true);
          setIsShrinking(true);
        },
        { once: true },
      );
    }
  }, [isFlashing]);

  useEffect(() => {
    if (isShrinking && overlayRef.current) {
      overlayRef.current.addEventListener(
        "animationend",
        () => {
          setIsLoading(false);
        },
        { once: true },
      );
    }
  }, [isShrinking]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    (async () => {
      await sleep(1000);
      if (!mountedRef.current) return;
      setIsWaiting(false);

      const totalItems = messages
        .slice(1)
        .reduce((acc, msg) => acc + Math.max(1, msg.items.length), 0);
      let currentItemIndex = 0;

      for (let i = 0; i < messages.length; i++) {
        if (!mountedRef.current) return;

        const message = messages[i];
        if (!message) return;
        const { text, items, spinner, waitForVideo } = message;

        setIsSpinning(spinner);

        for (const char of text) {
          if (!mountedRef.current) return;
          setCurrentLine((prev) => prev + char);
          await sleep(TYPING_SPEED);
        }

        const completedLine = i === 0 ? promptPrefix + text : text;

        setCurrentLine("");

        setLines((prev) => [...prev, completedLine]);

        if (i === 0) {
          setPromptPrefix("");
          await sleep(300);
          setShowStatus(true);
        }

        if (items.length > 0) {
          for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
            const item = items[itemIdx];
            if (!mountedRef.current) return;

            const isVideoItem = item === "alien_signals.mp4";

            if (waitForVideo && isVideoItem) {
              while (!videoLoadedRef.current && mountedRef.current) {
                await sleep(100);
              }
            }

            setCurrentLine("");

            const startProgress = Math.round(
              (currentItemIndex / totalItems) * 100,
            );
            const endProgress = Math.round(
              ((currentItemIndex + 1) / totalItems) * 100,
            );

            let charProgress = 0;
            for (let c = 0; c < item.length; c++) {
              if (!mountedRef.current) return;
              setCurrentLine((prev) => prev + item[c]);

              charProgress = c / item.length;
              const currentProgress =
                startProgress +
                Math.round((endProgress - startProgress) * charProgress);
              setProgress(currentProgress);

              await sleep(TYPING_SPEED);
            }

            setProgress(endProgress);
            setLines((prev) => [...prev, item]);
            setCurrentLine("");
            currentItemIndex++;
            await sleep(220);
          }
        } else if (i >= 1) {
          const progressValue = Math.round(
            (currentItemIndex / totalItems) * 100,
          );
          setProgress(progressValue);
          currentItemIndex++;
        }

        if (spinner && items.length === 0) {
          await sleep(8 * SPINNER_SPEED);
        }

        setIsSpinning(false);

        if (i >= 1 && i < messages.length - 1) {
          setLines((prev) => [...prev, "\u00A0"]);
        }

        await sleep(220);
      }

      setProgress(100);
      await sleep(200);

      setLines((prev) => [...prev, "\u00A0"]);
      await sleep(100);

      await sleep(200);
      setShowQuotes(true);

      for (const quote of quotes) {
        if (!mountedRef.current) return;
        setCurrentQuoteLine("");
        for (const char of quote) {
          if (!mountedRef.current) return;
          setCurrentQuoteLine((prev) => prev + char);
          await sleep(TYPING_SPEED);
        }
        setQuoteLines((prev) => [...prev, quote]);
        setCurrentQuoteLine("");
        await sleep(300);
      }

      await sleep(100);
      if (!mountedRef.current) return;
      setQuoteLines((prev) => [...prev, "\u00A0"]);
      setFinished(true);

      await sleep(200);
      setShowCTA(true);
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!showCTA || ctaFinished) return;

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    (async () => {
      setCurrentCTAText("");
      for (const char of ctaText) {
        if (!mountedRef.current) return;
        setCurrentCTAText((prev) => prev + char);
        await sleep(TYPING_SPEED);
      }
      setCTAFinished(true);
    })();
  }, [showCTA, ctaText]);

  const renderCTAText = () => {
    if (ctaFinished) {
      return (
        <>
          {beforeHighlight}
          <span className="loader__rainbow-text font-[Enhanced_Led_Board]">
            {highlightWord}
          </span>
          {afterHighlight}
        </>
      );
    }

    const lenBefore = beforeHighlight.length;
    const lenHighlight = highlightWord.length;
    const currentLen = currentCTAText.length;

    if (currentLen <= lenBefore) {
      return (
        <>
          {currentCTAText}
          <span className="loader__cursor" aria-hidden />
        </>
      );
    } else if (currentLen <= lenBefore + lenHighlight) {
      const typedHighlight = currentCTAText.substring(lenBefore);
      return (
        <>
          {beforeHighlight}
          <span className="loader__rainbow-text font-[Enhanced_Led_Board]">
            {typedHighlight}
          </span>
          <span className="loader__cursor" aria-hidden />
        </>
      );
    } else {
      const typedAfter = currentCTAText.substring(lenBefore + lenHighlight);
      return (
        <>
          {beforeHighlight}
          <span className="loader__rainbow-text font-[Enhanced_Led_Board]">
            {highlightWord}
          </span>
          {typedAfter}
          <span className="loader__cursor" aria-hidden />
        </>
      );
    }
  };

  return (
    <div
      className={`loader flex h-screen w-full flex-col items-center justify-center p-4 font-[IBM_Plex_Mono] text-white ${isTransparent ? "bg-transparent" : "bg-black"}`}
    >
      <div className={showContent ? "flex flex-col items-center" : "hidden"}>
        <h1 className="mb-[28px] text-center font-[Hudson_NY_Pro] text-[50px]">
          CONSPIRA.FI
        </h1>
        <div
          className="w-[310px] overflow-hidden rounded-md bg-black p-4"
          style={{ fontSize: 11 }}
        >
          <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>
            {lines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}

            {!finished && !showQuotes && (
              <div>
                {promptPrefix}
                {currentLine}
                {(isWaiting || currentLine) && (
                  <span className="loader__cursor" aria-hidden />
                )}
              </div>
            )}

            {currentSpinner && (
              <div style={{ opacity: 0.3 }}>{currentSpinner}</div>
            )}

            {showStatus && (
              <div>
                Status:{" "}
                <span style={{ color: progress === 100 ? "#00EB2B" : "white" }}>
                  {progress}%
                </span>
              </div>
            )}

            {showQuotes && (
              <>
                <div>{"\u00A0"}</div>
                {quoteLines.map((quoteLine, idx) => (
                  <div key={`quote-${idx}`}>{quoteLine}</div>
                ))}
                {currentQuoteLine && (
                  <div>
                    {currentQuoteLine}
                    <span className="loader__cursor" aria-hidden />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showCTA && (
          <div className="mt-8 text-center">
            <div
              style={{ fontSize: 21, whiteSpace: "nowrap", minHeight: "25px" }}
            >
              {renderCTAText()}
            </div>
          </div>
        )}
      </div>

      {(isFlashing || isShrinking) && (
        <div
          ref={overlayRef}
          className={`tv-effect ${isFlashing ? "flash" : ""} ${isShrinking ? "shrink" : ""}`}
        />
      )}
    </div>
  );
};

export default Loader;
