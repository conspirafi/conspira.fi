"use-client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { IPMXGetPresaleMarketDetails } from "~/server/schemas";

import { cn } from "@sglara/cn";

import CopyIcon from "../../icons/CopyIcon";
import LinkIcon from "../../icons/LinkIcon";
import { LimitLine } from "../../shared/LimitLine/LimitLine";
import { useViewport } from "~/app/providers/ViewportProvider";

export interface FundingStateComponentProps {
  data: IPMXGetPresaleMarketDetails | undefined;
}

const WalletLink = ({ walletLink = "", isDesktop = true }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!walletLink || isCopied) {
      return;
    }

    try {
      await navigator.clipboard.writeText(walletLink);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-16 w-full max-w-[500px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-6 transition-colors hover:bg-white/10",
        !isDesktop ? "" : "",
      )}
      onClick={handleCopy}
    >
      <CopyIcon />

      <p className="overflow-hidden font-mono text-sm text-ellipsis whitespace-nowrap text-gray-300">
        {walletLink}
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
  );
};
export const FundingStateComponent: React.FC<FundingStateComponentProps> = (
  props,
) => {
  const { isDesktop } = useViewport();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-end gap-6 p-[15px]">
      <LimitLine limit={props.data?.limit} balance={props.data?.balance} />

      <div className="flex w-full items-center justify-center gap-4">
        <WalletLink
          walletLink={props.data?.funding_wallet}
          isDesktop={isDesktop}
        />
        {isDesktop && (
          <a
            href={
              "https://pmx.trade/markets/presale/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center gap-2 rounded-xl bg-white px-6 text-black transition-transform hover:scale-105 active:scale-95"
          >
            <span className="font-normal">Fund on PMX</span>
            <LinkIcon color="black" />
          </a>
        )}
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
