import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const adminRouter = createTRPCRouter({
  // Markets
  markets: createTRPCRouter({
    list: publicProcedure.query(async () => {
      return prisma.market.findMany({
        include: {
          videos: { orderBy: { order: "asc" } },
          conspiraInfos: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return prisma.market.findUnique({
          where: { id: input.id },
          include: {
            videos: { orderBy: { order: "asc" } },
            conspiraInfos: { orderBy: { order: "asc" } },
          },
        });
      }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          eventTitle: z.string(),
          eventDescription: z.string(),
          marketSlug: z.string(),
          marketEndTime: z.union([z.string(), z.date()]).nullable().optional(),
          tweetSearchPhrase: z.string(),
          yesTokenMint: z.string(),
          noTokenMint: z.string(),
          pmxLink: z.string().nullable().optional(),
          jupiterLink: z.string().nullable().optional(),
          isActive: z.boolean().default(false),
        }),
      )
      .mutation(async ({ input }) => {
        return prisma.market.create({
          data: {
            ...input,
            marketEndTime: input.marketEndTime
              ? input.marketEndTime instanceof Date
                ? input.marketEndTime
                : new Date(input.marketEndTime)
              : null,
          },
        });
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          eventTitle: z.string().optional(),
          eventDescription: z.string().optional(),
          marketSlug: z.string().optional(),
          marketEndTime: z.union([z.string(), z.date()]).nullable().optional(),
          tweetSearchPhrase: z.string().optional(),
          yesTokenMint: z.string().optional(),
          noTokenMint: z.string().optional(),
          pmxLink: z.string().nullable().optional(),
          jupiterLink: z.string().nullable().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;

        // If trying to activate market, check it has content
        if (data.isActive === true) {
          const videoCount = await prisma.video.count({
            where: { marketId: id },
          });
          const conspiraInfoCount = await prisma.conspiraInfo.count({
            where: { marketId: id },
          });

          if (videoCount === 0 || conspiraInfoCount === 0) {
            throw new Error(
              `Cannot activate market: requires at least 1 video (has ${videoCount}) and 1 leak (has ${conspiraInfoCount})`,
            );
          }
        }

        // Filter out null values and convert to undefined
        const cleanData: any = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== null && value !== undefined) {
            cleanData[key] = value;
          }
        }

        return prisma.market.update({
          where: { id },
          data: {
            ...cleanData,
            marketEndTime: cleanData.marketEndTime
              ? cleanData.marketEndTime instanceof Date
                ? cleanData.marketEndTime
                : new Date(cleanData.marketEndTime)
              : undefined,
          },
        });
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return prisma.market.delete({
          where: { id: input.id },
        });
      }),
  }),

  // Videos
  videos: createTRPCRouter({
    list: publicProcedure
      .input(z.object({ marketId: z.string() }))
      .query(async ({ input }) => {
        return prisma.video.findMany({
          where: { marketId: input.marketId },
          orderBy: { order: "asc" },
        });
      }),

    create: publicProcedure
      .input(
        z.object({
          marketId: z.string(),
          videoUrl: z.string(),
          order: z.number().default(0),
        }),
      )
      .mutation(async ({ input }) => {
        return prisma.video.create({
          data: input,
        });
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          videoUrl: z.string().optional(),
          order: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return prisma.video.update({
          where: { id },
          data,
        });
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return prisma.video.delete({
          where: { id: input.id },
        });
      }),

    reorder: publicProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              id: z.string(),
              order: z.number(),
            }),
          ),
        }),
      )
      .mutation(async ({ input }) => {
        // Update each video's order
        await Promise.all(
          input.items.map((item) =>
            prisma.video.update({
              where: { id: item.id },
              data: { order: item.order },
            }),
          ),
        );
        return { success: true };
      }),
  }),

  // ConspiraInfo
  conspiraInfo: createTRPCRouter({
    list: publicProcedure
      .input(z.object({ marketId: z.string() }))
      .query(async ({ input }) => {
        return prisma.conspiraInfo.findMany({
          where: { marketId: input.marketId },
          orderBy: { order: "asc" },
        });
      }),

    create: publicProcedure
      .input(
        z.object({
          marketId: z.string(),
          type: z.enum(["youtube", "article", "podcast"]),
          title: z.string(),
          link: z.string().optional(),
          imgSrc: z.string().optional(),
          date: z.string(),
          order: z.number().default(0),
        }),
      )
      .mutation(async ({ input }) => {
        return prisma.conspiraInfo.create({
          data: input,
        });
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          type: z.enum(["youtube", "article", "podcast"]).optional(),
          title: z.string().optional(),
          link: z.string().optional(),
          imgSrc: z.string().optional(),
          date: z.string().optional(),
          order: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return prisma.conspiraInfo.update({
          where: { id },
          data,
        });
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return prisma.conspiraInfo.delete({
          where: { id: input.id },
        });
      }),

    reorder: publicProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              id: z.string(),
              order: z.number(),
            }),
          ),
        }),
      )
      .mutation(async ({ input }) => {
        // Update each conspiraInfo's order
        await Promise.all(
          input.items.map((item) =>
            prisma.conspiraInfo.update({
              where: { id: item.id },
              data: { order: item.order },
            }),
          ),
        );
        return { success: true };
      }),
  }),
});
