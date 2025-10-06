"use client";

import Image from "next/image";
import WhiteArrowIcon from "../icons/WhiteArrowIcon";

export interface TwitterCardProps {
  avatar: string;
  name: string;
  username: string;
  date: string;
  text: string;
  url: string;
}

export default function TwitterCard({
  avatar,
  name,
  username,
  date,
  text,
  url,
}: TwitterCardProps) {
  return (
    <div
      className="group relative flex w-[321px] cursor-pointer flex-col gap-4 overflow-hidden rounded-[10px] border border-white/10 bg-[#070707] p-6 text-[12px]"
      onClick={() => window.open(url, "_blank")}
      role="button"
      tabIndex={0}
    >
      <div className="content transition-[filter] duration-300 group-hover:blur-lg">
        <div className="mb-4 flex items-center gap-2.75">
          <Image
            src={avatar}
            alt={name}
            width={33}
            height={33}
            className="rounded-full"
          />
          <div className="flex w-full flex-col self-stretch">
            <div className="flex h-full items-center gap-2">
              <div className="flex flex-col leading-4">
                <span className="text-white">{name}</span>
                <span className="text-white opacity-30">@{username}</span>
              </div>
              <span className="ms-auto self-start text-white opacity-30">
                {date}
              </span>
            </div>
          </div>
        </div>

        <p className="line-clamp-4 leading-snug text-white">{text}</p>
      </div>

      <div className="overlay absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center bg-white p-0.75 text-[17px] leading-4.5 text-black">
          View on X
        </div>
        <WhiteArrowIcon />
      </div>
    </div>
  );
}
