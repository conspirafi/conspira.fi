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
    title: "Is the 3I/Atlas comet alien technology? <",
    spec: "The 3I/Atlas comet is an interstellar visitor on a hyperbolic path from solar system. Its size and speed show our planet's vulnerability.",
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
