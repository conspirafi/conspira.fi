export interface EventCase {
  id?: string;
  name: string;
  date: Date;
  title: string;
  spec: string;
  link: string;
  status: "Coming Soon" | "Live" | "Ended";
}

export const EventCaseData: EventCase[] = [
  {
    id: "acf0e0c5-d8e3-47ff-ab91-53c549156fcc",
    name: "CONSPIRA.FI",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    title: "Is 3I/ATLAS a Sign of Alien Engineering? <",
    spec: "Scientists are tracking comet 3I/ATLAS as it approaches Mars in October 2025. Its chemical output and path are unusual. Will official sources confirm signs of alien engineering?",
    link: "https://pmx.trade/markets/presale/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948",
    status: "Coming Soon",
  },
  // {
  //   name: "Comming Soon",
  //   date: new Date(new Date().setDate(new Date().getDate() + 7)),
  //   title: "The Hollow Earth Signal: Are We Living On a Shell?",
  //   spec: "Declassified seismic data reveals a resonant frequency from the Earth's core, matching patterns inconsistent with a solid mantle. Experts are baffled.",
  //   link: "https://youtu.be/dQw4w9WgXcQ?si=6qZkojrThyLsVaMf",
  //   status: "Coming Soon",
  // },
];
