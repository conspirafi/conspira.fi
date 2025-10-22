import z from "zod";

export const EventSchema = z.object({
  name: z.string().or(z.null()),
  eventVideo: z.string().or(z.null()),
  eventTitle: z.string(),
  eventDescription: z.string(),
  marketSlug: z.string(),
  tweetSearchPhrase: z.string(),
  marketEndTime: z.string().or(z.null()).optional(),
  historicPricesTokens: z.object({
    yesTokenMint: z.string(),
    noTokenMint: z.string(),
  }),
  eventLinks: z.object({
    PMX: z.string().or(z.null()),
    JUPITER: z.string().or(z.null()),
    JUPITER_YES: z.string().or(z.null()).optional(),
    JUPITER_NO: z.string().or(z.null()).optional(),
  }),
  isPMXActive: z.boolean().optional(),
  volumePercentage: z.number().default(33.33),
  isActive: z.boolean(),
  conspiraInfoId: z.string(),
  conspiraInfos: z
    .array(
      z.object({
        type: z.enum(["youtube", "article", "podcast"]),
        link: z.string().optional(),
        imgSrc: z.string().optional(),
        title: z.string(),
        date: z.string(),
      }),
    )
    .optional(),
  tweets: z.any().optional(),
});

export type IEventSchema = z.infer<typeof EventSchema>;

export interface IConspiraInfo {
  type: "youtube" | "article" | "podcast";
  link?: string;
  imgSrc?: string;
  title: string;
  date: string;
}
