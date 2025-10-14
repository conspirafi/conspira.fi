// src/components/ConspirafiInfoItem.tsx

import React from "react";
import Image from "next/image";
import type { IConspiraInfo } from "~/server/mock";
import LinkIcon from "../icons/LinkIcon";

const ConspirafiInfoItem: React.FC<IConspiraInfo> = ({
  type,
  link,
  imgSrc,
  title,
  date,
}) => {
  return (
    <div className="font-inter relative flex h-[342px] w-[362px] flex-col overflow-hidden rounded-sm p-4 text-white transition-transform duration-300 hover:scale-105">
      <div className="absolute inset-0 z-10 bg-[#838383]/10 backdrop-blur-2xl"></div>
      <div className="relative inset-0 z-10">
        <div className="h-[186px] w-full overflow-hidden rounded-sm">
          <Image
            width={330}
            height={186}
            src={imgSrc || ""}
            alt={imgSrc || ""}
            loading="lazy"
            quality={80}
          />
        </div>
        <h1 className="mt-4 text-xs tracking-wide">
          {type === "youtube"
            ? "YouTube "
            : type === "article"
              ? "Science Article "
              : type === "podcast"
                ? "Podcast "
                : ""}
          * {date}
        </h1>
        <h3 className="line-clamp-2 h-[50px] text-[21px] leading-[25px] text-ellipsis">
          {title}
        </h3>
        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-full text-sm font-medium`}
        >
          <button className="relative z-20 cursor-pointer bg-white p-1 hover:opacity-70 active:opacity-50">
            <p className="text-sm text-black">
              {type === "youtube"
                ? "YouTube Link"
                : type === "article"
                  ? "Article Link"
                  : type === "podcast"
                    ? "Podcast Link"
                    : ""}
            </p>
          </button>
          <LinkIcon />
        </div>
      </div>
      {/* <div
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className=""
        aria-label={`${content.label}: ${title}`}
      > */}
    </div>
    // </div>
  );
};

export default ConspirafiInfoItem;
