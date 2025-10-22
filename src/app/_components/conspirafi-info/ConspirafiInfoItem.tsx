import React from "react";
import Image from "next/image";
import type { IConspiraInfo } from "~/server/types";
import LinkIcon from "../icons/LinkIcon";

const ConspirafiInfoItem: React.FC<IConspiraInfo> = ({
  type,
  link,
  imgSrc,
  title,
  date,
}) => {
  const linkText =
    type === "youtube"
      ? "YouTube Link"
      : type === "article"
        ? "Article Link"
        : type === "podcast"
          ? "Podcast Link"
          : "Open Link";

  return (
    <div className="font-inter relative flex h-[342px] w-[362px] flex-col overflow-hidden rounded-sm p-4 text-white transition-transform duration-300 hover:scale-105">
      <div className="absolute inset-0 z-10 bg-[#838383]/10 backdrop-blur-2xl"></div>

      <div className="relative inset-0 z-10">
        <div className="h-[186px] w-full overflow-hidden rounded-sm bg-gray-800">
          {imgSrc ? (
            <Image
              width={330}
              height={186}
              src={imgSrc}
              alt={title}
              loading="lazy"
              quality={80}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              No image available
            </div>
          )}
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

        <div className="mt-4 inline-flex items-center gap-2 rounded-full text-sm font-medium">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 cursor-pointer bg-white px-3 py-1 hover:opacity-70 active:opacity-50"
            >
              <p className="text-sm text-black">{linkText}</p>
            </a>
          ) : (
            <button
              disabled
              className="relative z-20 cursor-not-allowed bg-gray-400 px-3 py-1 text-sm text-black opacity-50"
            >
              {linkText}
            </button>
          )}
          <LinkIcon />
        </div>
      </div>
    </div>
  );
};

export default ConspirafiInfoItem;
