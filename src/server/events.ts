import z from "zod";

const blankEvent = {
  name: "",
  eventTitle: "",
  eventDescription: "",
  marketSlug: "",
  tweetSearchPhrase: "",
  historicPricesTokens: {
    yesTokenMint: "",
    noTokenMint: "",
  },
  eventLinks: {
    PMX: "",
    JUPITER: "",
  },
};

export const EventSchema = z.object({
  name: z.string().or(z.null()),
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
});

export type IEventSchema = z.infer<typeof EventSchema>;

export const events: IEventSchema[] = [
  {
    name: "CONSPIRA.FI",
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
  },
  {
    name: null,
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
  },
];
