"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import WhiteArrowIcon from "../icons/WhiteArrowIcon";

export interface TwitterCardProps {
  avatar: string;
  name: string;
  username: string;
  createdAt: string;
  text: string;
  url: string;
  media?: string[];
}

export default function TwitterCard({
  avatar,
  name,
  username,
  createdAt,
  text,
  url,
  media = [],
}: TwitterCardProps) {
  const relativeTime = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Recently";
  const filteredMedia = media.filter((m) => m && m.trim().length > 0);
  const hasMedia = filteredMedia.length > 0;
  return (
    <div
      className="group relative flex w-[321px] cursor-pointer flex-col gap-4 overflow-hidden rounded-[10px] border border-white/10 bg-[#070707]/80 p-6 text-[12px] backdrop-blur-sm"
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
                {relativeTime}
              </span>
            </div>
          </div>
        </div>

        <p className="line-clamp-4 leading-snug text-white">{text}</p>

        {hasMedia && (
          <div className="mt-3 grid gap-2">
            {filteredMedia.length === 1 ? (
              <Image
                src={filteredMedia[0] || ""}
                alt="Tweet media"
                width={273}
                height={154}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: "154px" }}
                unoptimized
              />
            ) : filteredMedia.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {filteredMedia.slice(0, 2).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Tweet media ${idx + 1}`}
                    width={130}
                    height={130}
                    className="rounded-lg object-cover"
                    style={{ height: "130px" }}
                    unoptimized
                  />
                ))}
              </div>
            ) : filteredMedia.length === 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <Image
                  src={filteredMedia[0] || ""}
                  alt="Tweet media 1"
                  width={130}
                  height={268}
                  className="row-span-2 rounded-lg object-cover"
                  style={{ height: "268px" }}
                  unoptimized
                />
                <div className="grid gap-2">
                  {filteredMedia.slice(1, 3).map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Tweet media ${idx + 2}`}
                      width={130}
                      height={130}
                      className="rounded-lg object-cover"
                      style={{ height: "130px" }}
                      unoptimized
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredMedia.slice(0, 4).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Tweet media ${idx + 1}`}
                    width={130}
                    height={130}
                    className="rounded-lg object-cover"
                    style={{ height: "130px" }}
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>
        )}
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
