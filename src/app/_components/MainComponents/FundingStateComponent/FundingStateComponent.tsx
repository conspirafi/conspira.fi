"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  IFundingSnapshot,
  IPMXGetPresaleMarketDetails,
} from "~/server/schemas";

import { cn } from "@sglara/cn";

import CopyIcon from "../../icons/CopyIcon";
import LinkIcon from "../../icons/LinkIcon";
import { LimitLine } from "../../shared/LimitLine/LimitLine";
import { useViewport } from "~/app/providers/ViewportProvider";
import ShowLeaksBtn from "../../buttons/show-leaks-btn";
import { useConspirafiStore } from "~/app/store/conspirafiStore";

const conspirafiVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export interface FundingStateComponentProps {
  data: IPMXGetPresaleMarketDetails | undefined;
  fundingSnapshot: IFundingSnapshot | null;
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
  const { isVisible: isConspirafiVisible } = useConspirafiStore();

  const isFundingState = props.data
    ? !(props.data?.migrated && props.fundingSnapshot?.summary.targetReached)
    : true;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-end gap-6 p-[15px]">
      <div className="flex w-full flex-col items-center justify-center">
        <AnimatePresence>
          {!isConspirafiVisible && (
            <motion.div
              key="conspirafi-info-back-btn"
              className="pointer-events-auto"
              variants={conspirafiVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ShowLeaksBtn />
            </motion.div>
          )}
        </AnimatePresence>
        <LimitLine
          isFundingState={isFundingState}
          limit={props.fundingSnapshot?.summary.targetAmount}
          balance={props.fundingSnapshot?.summary.finalCumulativeSum}
        />
      </div>

      <div className="flex w-full items-center justify-center gap-4">
        <WalletLink
          walletLink={props.data?.funding_wallet}
          isDesktop={isDesktop}
        />
        {isDesktop && props.data?.slug && (
          <a
            href={`https://pmx.trade/markets/presale/${props.data.slug}`}
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
