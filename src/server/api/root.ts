import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { pmxMarketRouter } from "./routers/pmx_market";
import { adminRouter } from "./routers/admin";
import { metadataRouter } from "./routers/metadata";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pmxMarketRouter,
  admin: adminRouter,
  metadata: metadataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
