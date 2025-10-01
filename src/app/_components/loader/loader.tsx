"use client";

import React, { useEffect, useState, useRef } from "react";
import "./loader.scss";
import { useLoader } from "~/app/providers/LoaderProvider";

const Loader = () => {
  const messages = [
    { text: "~$ ./boot_conspirafi.sh", items: [], spinner: false },
    {
      text: "Launching software...",
      items: [],
      spinner: true,
    },
    {
      text: "Loading website...",
      items: ["index.html", "styles.css", "scripts.js"],
      spinner: true,
    },
    {
      text: "Loading canvas...",
      items: ["canvas.js", "3d_scene.glb", "shaders.frag", "textures.png"],
      spinner: true,
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
  const [promptPrefix, setPromptPrefix] = useState<string>("user@conspira: ");
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

  const TYPING_SPEED = 10;
  const SPINNER_SPEED = 45;

  const { setIsLoading, setIsEntered } = useLoader();

  const ctaText = "Press SPACE to enter website";

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && ctaFinished) {
        event.preventDefault();
        setIsFlashing(true);
        setIsEntered(true);
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
        const { text, items, spinner } = message;

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
          for (const item of items) {
            if (!mountedRef.current) return;
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

      for (const char of ctaText) {
        if (!mountedRef.current) return;
        setCurrentCTAText((prev) => prev + char);
        await sleep(TYPING_SPEED);
      }

      setCTAFinished(true);
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div
      className={`loader flex h-screen w-full flex-col items-center justify-center p-4 font-[BB_Manual_Mono_Pro_Original] text-white ${isTransparent ? "bg-transparent" : "bg-black"}`}
    >
      <div className={showContent ? "flex flex-col items-center" : "hidden"}>
        <h1 className="mb-[28px] text-center font-[Hudson_NY_Pro] text-[50px]">
          $ CONSPIRA.FI
        </h1>
        <div
          className="w-full max-w-[300px] overflow-hidden rounded-md bg-black p-4"
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
              {currentCTAText.replace(/SPACE/g, "").length > 0 && (
                <>
                  {currentCTAText.substring(
                    0,
                    currentCTAText.indexOf("SPACE") !== -1
                      ? currentCTAText.indexOf("SPACE")
                      : currentCTAText.length,
                  )}
                  {currentCTAText.includes("SPACE") && (
                    <span className="loader__rainbow-text">SPACE</span>
                  )}
                  {currentCTAText.indexOf("SPACE") !== -1 &&
                    currentCTAText.length >
                      currentCTAText.indexOf("SPACE") + 5 &&
                    currentCTAText.substring(
                      currentCTAText.indexOf("SPACE") + 5,
                    )}
                </>
              )}
              {!ctaFinished && <span className="loader__cursor" aria-hidden />}
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
