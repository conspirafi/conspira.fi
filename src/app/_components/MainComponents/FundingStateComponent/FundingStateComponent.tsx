"use-client";

import { useState } from "react";
import type { IPMXGetPresaleMarketDetails } from "~/server/schemas";
import { motion, AnimatePresence } from "framer-motion";

import CopyIcon from "../../icons/CopyIcon";
import { LimitLine } from "../../shared/LimitLine/LimitLine";

export interface FundingStateComponentProps {
  data: IPMXGetPresaleMarketDetails | undefined;
}

export const FundingStateComponent: React.FC<FundingStateComponentProps> = (
  props,
) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!props.data?.funding_wallet || isCopied) {
      return;
    }

    try {
      await navigator.clipboard.writeText(props.data.funding_wallet);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-end gap-6 p-[15px]">
      <LimitLine limit={props.data?.limit} balance={props.data?.balance} />

      <div className="flex items-center gap-4">
        <div
          className="relative flex h-14 cursor-pointer items-center gap-2 rounded-xl border border-dashed px-6 py-4 transition-colors hover:bg-white/10"
          onClick={handleCopy}
        >
          <CopyIcon />

          <p className="font-mono text-sm text-gray-300">
            {props.data?.funding_wallet}
          </p>

          <AnimatePresence>
            {isCopied && (
              <motion.div
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-green-500 px-2 py-1 text-xs text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a
          href={
            "https://pmx.trade/markets/presale/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center gap-2 rounded-xl bg-white px-6 text-black transition-transform hover:scale-105 active:scale-95"
        >
          <span className="font-normal">Fund on PMX</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path
              d="M1 11L11 1M11 1H1M11 1V11"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <a
        href="https://dexscreener.com/solana/ee7o1zq7w5c65aapgvjnq4pa7lxhhaigjnjohqarvbcx"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] underline opacity-30 transition-opacity hover:opacity-60"
      >
        Powered by Agent $MOCK
      </a>
    </div>
  );
};
