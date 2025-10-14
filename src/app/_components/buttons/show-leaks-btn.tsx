import React, { useState, useEffect, useRef } from "react";

interface Particle {
  id: string;
  x: number;
  y: number;
  scale: number;
  offsetX: number;
  progress: number;
}

const generateParticle = (index: number): Particle => {
  const zones: number[] = [70, 90, 110, 130, 150, 170];
  // @ts-ignore
  const x: number = zones[index % zones.length] + (Math.random() * 15 - 7.5);
  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y: 70,
    scale: 0.5 + Math.random() * 1.5,
    offsetX: ((x - 120) / 40) * 30,
    progress: Math.random(),
  };
};

const ShowLeaksBtn: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>(
    Array.from({ length: 7 }, (_, i) => generateParticle(i)),
  );
  const [hovered, setHovered] = useState<boolean>(false);
  const speedMultiplier: number = hovered ? 2 : 1;
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime: number = performance.now();

    const animate = (currentTime: number): void => {
      const deltaTime: number = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setParticles((prev: Particle[]) =>
        prev.map((p: Particle) => {
          let newProgress: number =
            p.progress + (deltaTime / 4) * speedMultiplier;

          if (newProgress >= 1) {
            newProgress = newProgress - 1;
          }

          return { ...p, progress: newProgress };
        }),
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speedMultiplier]);

  const getParticleStyle = (p: Particle): React.CSSProperties => {
    let opacity: number = 0;
    if (p.progress > 0.15 && p.progress < 0.85) {
      opacity = 1;
    } else if (p.progress <= 0.15) {
      opacity = p.progress / 0.15;
    } else {
      opacity = (1 - p.progress) / 0.15;
    }

    const y: number = p.y - p.progress * 60;
    const x: number = p.x + p.progress * p.offsetX;
    const scale: number = p.scale * (1 + p.progress * 0.4);

    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      opacity: opacity,
      filter: "blur(0.5px)",
    };
  };

  return (
    <div className="pointer-events-auto relative flex min-w-[140px] items-center justify-end gap-[32px]">
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="font-inter relative flex h-[81px] w-[239px] cursor-pointer items-center justify-center text-[22px] font-normal text-white"
      >
        <svg
          width="239"
          height="81"
          viewBox="0 0 239 81"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <radialGradient
              id="paint0_radial_549_288"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(119.5 ${
                hovered ? 58 : 73
              }) rotate(-90) scale(${hovered ? 80 : 72} ${hovered ? 216 : 180})`}
              style={{ transition: "all 0.4s ease" }}
            >
              <stop offset="0.45" stopColor="#3a3a3a" />
              <stop offset="1" stopColor="#060606" stopOpacity="0.4" />
            </radialGradient>

            <clipPath id="clipButton">
              <path d="M19.4577 14.3382C20.2425 10.6427 23.5054 8 27.2832 8H211.717C215.495 8 218.758 10.6427 219.542 14.3381L229.948 63.3381C231.005 68.3143 227.21 73 222.123 73H16.8773C11.7902 73 7.99507 68.3143 9.05183 63.3381L19.4577 14.3382Z" />
            </clipPath>
          </defs>

          <g filter="url(#filter0_f_549_288)">
            <path
              d="M19.4577 14.3382C20.2425 10.6427 23.5054 8 27.2832 8H211.717C215.495 8 218.758 10.6427 219.542 14.3381L229.948 63.3381C231.005 68.3143 227.21 73 222.123 73H16.8773C11.7902 73 7.99507 68.3143 9.05183 63.3381L19.4577 14.3382Z"
              fill="url(#paint0_radial_549_288)"
            />
          </g>

          <g clipPath="url(#clipButton)">
            {particles.map((p: Particle) => (
              <circle
                key={p.id}
                cx="0"
                cy="0"
                r="1"
                fill="white"
                style={getParticleStyle(p)}
              />
            ))}
          </g>

          <filter
            id="filter0_f_549_288"
            x="0.874512"
            y="0"
            width="237.251"
            height="81"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="4"
              result="effect1_foregroundBlur_549_288"
            />
          </filter>
        </svg>

        <span className="pointer-events-none relative z-10">Show Leaks</span>
      </button>
    </div>
  );
};

export default ShowLeaksBtn;
