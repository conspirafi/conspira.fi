import type { IMarketHistoricalData } from "~/server/schemas";

export interface Activity {
  lastest_activity: string;
  procent: string;
  price: string;
  time: string;
  type: "Yes" | "No";
  timestamp: string | null;
}

export function prepareTableData(
  yesData: IMarketHistoricalData[],
  noData: IMarketHistoricalData[],
) {
  // Match YES and NO prices by index to calculate proper probability ratios
  const historyItems: Activity[] = yesData
    .map((item, idx) => {
      const yesItem = item;
      const noItem = noData[idx];

      const rawPrice = {
        yes: yesItem?.price || 0,
        no: noItem?.price || 0,
      };

      // Calculate probability as ratio: price / (yesPrice + noPrice) * 100
      const total =
        parseFloat(rawPrice.yes.toString()) +
        parseFloat(rawPrice.no.toString());

      const yesPercentage = total > 0 ? (rawPrice.yes / total) * 100 : 0;
      const noPercentage = total > 0 ? (rawPrice.no / total) * 100 : 0;

      return [
        {
          lastest_activity: "Yes" as const,
          procent: `${parseFloat(yesPercentage.toFixed(1))}%`,
          price: `${truncate(yesItem.price, 6)}`,
          time: timeAgo(yesItem.timestamp),
          type: "Yes" as const,
          timestamp: yesItem.timestamp,
        },
        {
          lastest_activity: "No" as const,
          procent: `${parseFloat(noPercentage.toFixed(1))}%`,
          price: `${truncate(noItem?.price || 0, 6)}`,
          time: timeAgo(noItem?.timestamp || ""),
          type: "No" as const,
          timestamp: noItem?.timestamp || null,
        },
      ];
    })
    .flat();

  const slicedResultArray = sortByNewest(historyItems).slice(0, 7);

  return slicedResultArray;
}

function truncate(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

// function findClosestPrice(
//   priceMap: Map<string, number>,
//   targetTimestamp: string,
// ): number | null {
//   const targetDate = new Date(targetTimestamp);
//   let closestPrice: number | null = null;
//   let minDiff = Infinity;

//   for (const [ts, price] of priceMap) {
//     const diff = Math.abs(new Date(ts).getTime() - targetDate.getTime());
//     if (diff < minDiff && diff <= 60000) {
//       minDiff = diff;
//       closestPrice = price;
//     }
//   }
//   return closestPrice;
// }

function timeAgo(timestamp: number | string): string {
  const now = Date.now();
  let time: number;

  if (typeof timestamp === "string") {
    // Parse timestamp string to milliseconds
    time = new Date(timestamp).getTime();

    // If parsing failed, return a fallback
    if (isNaN(time)) {
      return "Unknown";
    }
  } else {
    // If it's a number and seems to be in seconds (< year 2100 in milliseconds)
    // Convert to milliseconds
    time = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  }

  const diffMs = now - time;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 365) return `${days}d ago`;
  return `${years}y ago`;
}

function sortByNewest(items: Activity[]): Activity[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.timestamp || 0).getTime() -
      new Date(a.timestamp || 0).getTime(),
  );
}
