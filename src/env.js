import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(1),
    TWITTER_BEARER_TOKEN: z.string().min(1),
    XAI_API_KEY: z.string().min(1),
    PMX_API_KEY: z.string().min(1),
    PMX_API_AUTHORIZATION: z.string().min(1),
    PMX_BASE_URL: z.string().url(),
    PMX_FEES_BASE_URL: z.string().min(1),
    HISTORIC_PRICES_API_URL: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    XAI_API_KEY: process.env.XAI_API_KEY,
    PMX_API_KEY: process.env.PMX_API_KEY,
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    PMX_API_AUTHORIZATION: process.env.PMX_API_AUTHORIZATION,
    PMX_BASE_URL: process.env.PMX_BASE_URL,
    PMX_FEES_BASE_URL: process.env.PMX_FEES_BASE_URL,
    HISTORIC_PRICES_API_URL: process.env.HISTORIC_PRICES_API_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
