import type { IPMXGetPresaleMarketDetails } from "~/server/schemas";

export interface OverlayProps {
  children?: React.ReactNode;
  data: IPMXGetPresaleMarketDetails | undefined;
}

export interface EventDetailsProps {
  title: string;
  spec: string;
  link: string;
}
