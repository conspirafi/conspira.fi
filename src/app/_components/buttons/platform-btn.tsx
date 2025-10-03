import { cn } from "@sglara/cn";
import { useViewport } from "~/app/providers/ViewportProvider";
import type { JSX } from "react";

interface PlatformButtonProps {
  text: string;
  icon: JSX.Element;
  styles?: string;
  click: () => void;
}

export default function PlatformButton(props: PlatformButtonProps) {
  const { isMobile, isDesktop } = useViewport();

  return (
    <div
      onClick={() => props.click()}
      className={cn(
        `bg-base-blue flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-1 border-white/10 ${props.styles}`,
        { "gap-3.5": isDesktop, "gap-2": isMobile },
      )}
    >
      {props.icon}
      <span>{props.text}</span>
    </div>
  );
}
