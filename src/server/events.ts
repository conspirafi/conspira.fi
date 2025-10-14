import z from "zod";

// const blankEvent = {
//   name: "",
//   eventTitle: "",
//   eventVideo: "",
//   eventDescription: "",
//   marketSlug: "",
//   tweetSearchPhrase: "",
//   historicPricesTokens: {
//     yesTokenMint: "",
//     noTokenMint: "",
//   },
//   eventLinks: {
//     PMX: "",
//     JUPITER: "",
//   },
//   isAvtive: false,
// };

export const EventSchema = z.object({
  name: z.string().or(z.null()),
  eventVideo: z.string().or(z.null()),
  eventTitle: z.string(),
  eventDescription: z.string(),
  marketSlug: z.string(),
  tweetSearchPhrase: z.string(),
  historicPricesTokens: z.object({
    yesTokenMint: z.string(),
    noTokenMint: z.string(),
  }),
  eventLinks: z.object({
    PMX: z.string().or(z.null()),
    JUPITER: z.string().or(z.null()),
  }),
  isActive: z.boolean(),
  conspiraInfoId: z.string(),
});

export type IEventSchema = z.infer<typeof EventSchema>;

export const events: IEventSchema[] = [
  {
    name: "CONSPIRA.FI",
    eventVideo:
      "https://ik.imagekit.io/memeworks/Conspirafi%20Markets/conspirafi-3I-Atlas-1.mp4?updatedAt=1760010578180",
    eventTitle: "Is 3I/ATLAS a Sign of Alien Engineering? <",
    eventDescription:
      "Scientists are tracking comet 3I/ATLAS as it approaches Mars in October 2025. Its chemical output and path are unusual. Will official sources confirm signs of alien engineering?",
    marketSlug:
      "will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948",
    tweetSearchPhrase: "3I/ATLAS",
    historicPricesTokens: {
      yesTokenMint: "6BqsA6H4BcUU9CPyfRcnXvX9TZcV5bN3iUMMVGPFS6TB",
      noTokenMint: "6keLtrDSPKLm915Gv46w3cXpbUjQ132BYs8rbCKVJDMT",
    },
    eventLinks: {
      PMX: null,
      JUPITER: null,
    },
    conspiraInfoId: "0",
    isActive: true,
  },
  {
    name: "The event will be soon",
    eventVideo:
      "https://ik.imagekit.io/memeworks/Conspirafi%20Markets/conspirafi-3I-Atlas-1.mp4?updatedAt=1760010578180",
    eventTitle: "3I/Atlas Info Leak",
    eventDescription:
      "Will china be the first to report on the 3I/Atlas comet?",
    marketSlug:
      "will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948",
    tweetSearchPhrase: "3I/Atlas China",
    historicPricesTokens: {
      yesTokenMint: "6BqsA6H4BcUU9CPyfRcnXvX9TZcV5bN3iUMMVGPFS6TB",
      noTokenMint: "6keLtrDSPKLm915Gv46w3cXpbUjQ132BYs8rbCKVJDMT",
    },
    eventLinks: {
      PMX: null,
      JUPITER: null,
    },
    conspiraInfoId: "1",
    isActive: false,
  },
];
