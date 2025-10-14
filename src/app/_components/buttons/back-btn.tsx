import React from "react";
import { useConspirafiStore } from "~/app/store/conspirafiStore";

const BackBtn = () => {
  const { setVisibility } = useConspirafiStore();

  return (
    <div className="pointer-events-auto relative flex min-w-[140px] items-center justify-end">
      <button
        onClick={() => setVisibility(false)}
        className="font-inter relative flex h-[122px] w-[283px] cursor-pointer items-center justify-center text-[22px] font-normal text-black"
        style={{ background: "transparent" }}
      >
        <svg
          width="283"
          height="122"
          viewBox="0 0 283 122"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-0"
        >
          <defs>
            <filter
              id="filter0_d_559_862"
              x="0.874512"
              y="0"
              width="281.251"
              height="125"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="15" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_559_862"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_559_862"
                result="shape"
              />
            </filter>
          </defs>

          <g filter="url(#filter0_d_559_862)">
            <path
              d="M41.4577 36.3382C42.2425 32.6427 45.5054 30 49.2832 30H233.717C237.495 30 240.758 32.6427 241.542 36.3381L251.948 85.3381C253.005 90.3143 249.21 95 244.123 95H38.8773C33.7902 95 29.9951 90.3143 31.0518 85.3381L41.4577 36.3382Z"
              fill="white"
            />
          </g>
        </svg>

        <span className="pointer-events-none relative z-10">Back</span>
      </button>
    </div>
  );
};

export default BackBtn;
