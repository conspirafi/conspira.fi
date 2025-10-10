import type {
  IPMXGetMarketFees,
  IPMXGetPresaleMarketDetails,
} from "~/server/schemas";
import type { IEventSchema } from "~/server/events";

export interface OverlayProps {
  children?: React.ReactNode;
  marketFees?: IPMXGetMarketFees | null;
  data: IPMXGetPresaleMarketDetails | undefined;
}

export interface EventDetailsProps {
  title: string;
  spec: string;
  link: string;
}

export interface EventTimerProps {
  targetDateString: string | undefined;
  isDesktop?: boolean;
}

export interface MobileEventDetailsProps {
  activeEventCase: IEventSchema | null;
  marketFees?: IPMXGetMarketFees | null;
  data: IPMXGetPresaleMarketDetails | undefined;
}

export interface VolumeElementProps {
  marketFees: IPMXGetMarketFees | undefined;
}
