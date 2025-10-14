/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  crossOrigin: "use-credentials",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/profile_images/**",
      },
      // --- ДОДАЙТЕ ЦЕЙ БЛОК ---
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
        pathname: "/sticky/default_profile_images/**",
      },
      // -------------------------
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/memeworks/**",
      },
    ],
  },
};

export default config;
