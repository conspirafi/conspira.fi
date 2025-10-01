"use client";
import { animate, motion } from "framer-motion";
import { useState } from "react";

interface VoteBtnProps {
  percent: string;
  type: "Yes" | "No";
  side: "left" | "right";
  onClick: () => void;
}

export default function VoteBtn(props: VoteBtnProps) {
  const [play, setPlay] = useState(false);
  return (
    <motion.div
      className="relative mt-1.5 cursor-pointer px-10 py-5 text-[21px] font-bold"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={
        play
          ? {
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      role="button"
      tabIndex={0}
      variants={{
        rest: {
          scale: 1,
          color: props.type === "Yes" ? "#61c454" : "#e13737",
        },
        hover: {
          color: "#ffffff",
          textShadow: "0 0 7px #ffffff",
          transition: { duration: 0.3 },
        },
      }}
      onClick={() => {
        setPlay(true);
        props.onClick();
      }}
      onAnimationComplete={() => setPlay(false)}
    >
      <div className="pointer-events-none relative z-20 flex gap-1.5">
        <span className="">{props.type.toUpperCase()}</span>
        <span className="">{props.percent}</span>
      </div>

      <motion.div
        className="absolute top-0 left-0 z-10 h-full w-full rounded-lg"
        initial="rest"
        tabIndex={1}
        style={
          {
            boxShadow:
              props.type === "Yes"
                ? "0px 0px 40px 0px rgba(97, 196, 84, 0.4)"
                : "0px 0px 40px 0px rgba(225, 55, 55, 0.4)",

            background:
              "linear-gradient(var(--rotate), var(--c1) 0%, var(--c2) 100%)",
            "--rotate": props.side === "left" ? "143deg" : "223deg",
            "--c1":
              props.type === "Yes"
                ? "rgba(97, 196, 84, 0.3)"
                : "rgba(225, 55, 55, 0.3)",
            "--c2":
              props.type === "Yes"
                ? "rgba(97, 196, 84, 0.3)"
                : "rgba(225, 55, 55, 0.3)",
          } as React.CSSProperties
        }
        animate={
          play
            ? {
                "--c1":
                  props.type === "Yes"
                    ? ["#6CB962", "#44D832", "#6CB962"]
                    : ["#CA3434", "#ED6161", "#CA3434"],
                "--c2":
                  props.type === "Yes"
                    ? ["#289F19", "#44D832", "#289F19"]
                    : ["#C21111", "#ED6161", "#C21111"],
              }
            : "rest"
        }
        whileHover={
          !play
            ? {
                "--c1": props.type === "Yes" ? "#6CB962" : "#CA3434",
                "--c2": props.type === "Yes" ? "#289F19" : "#C21111",
              }
            : {}
        }
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        variants={{
          rest: {
            transform:
              props.side === "left"
                ? "matrix(1, 0, 0.2, 1, 0, 0)"
                : "matrix(1, 0, -0.2, 1, 0, 0)",
          },
        }}
      />
    </motion.div>
  );
}
