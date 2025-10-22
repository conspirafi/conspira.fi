import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";

export const metadataRouter = createTRPCRouter({
  fetchFromUrl: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log("Fetching metadata from URL:", input.url);

        const response = await axios.get(input.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          timeout: 15000,
          maxRedirects: 5,
        });

        const html = response.data as string;
        console.log("Successfully fetched HTML, length:", html.length);

        // Extract OG tags using improved regex patterns
        const metaTagRegex = (property: string, attribute = "property") => {
          const patterns = [
            new RegExp(
              `<meta\\s+${attribute}=["']${property}["']\\s+content=["']([^"']+)["']`,
              "i",
            ),
            new RegExp(
              `<meta\\s+content=["']([^"']+)["']\\s+${attribute}=["']${property}["']`,
              "i",
            ),
            new RegExp(
              `<meta\\s+${attribute}=["']${property}["']\\s+content\\s*=\\s*["']([^"']+)["']`,
              "i",
            ),
            new RegExp(
              `<meta\\s+content\\s*=\\s*["']([^"']+)["']\\s+${attribute}=["']${property}["']`,
              "i",
            ),
          ];

          for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match?.[1]) {
              console.log(
                `Found ${property}: ${match[1].substring(0, 100)}...`,
              );
              return match[1];
            }
          }
          return null;
        };

        const ogImage =
          metaTagRegex("og:image") || metaTagRegex("og:image:url");
        const ogTitle = metaTagRegex("og:title");
        const ogDescription = metaTagRegex("og:description");

        // Also try Twitter card meta tags
        const twitterImage =
          metaTagRegex("twitter:image", "name") ||
          metaTagRegex("twitter:image:src", "name");
        const twitterTitle = metaTagRegex("twitter:title", "name");
        const twitterDescription = metaTagRegex("twitter:description", "name");

        // Fallback to regular meta tags if OG tags not found
        const title =
          ogTitle ||
          twitterTitle ||
          html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
          null;

        const description =
          ogDescription ||
          twitterDescription ||
          metaTagRegex("description", "name") ||
          null;

        const image = ogImage || twitterImage || null;

        // Clean up the extracted values
        const cleanValue = (value: string | null) => {
          if (!value) return null;
          // Decode HTML entities
          return value
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
        };

        console.log("Extracted metadata:", { title, description, image });

        return {
          success: true,
          title: cleanValue(title),
          description: cleanValue(description),
          image: cleanValue(image),
        };
      } catch (error) {
        console.error("Error fetching metadata:", error);

        // Provide more specific error messages
        let errorMessage = "Failed to fetch metadata";

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            errorMessage =
              "Access forbidden - the website may be blocking automated requests";
          } else if (error.response?.status === 404) {
            errorMessage = "Page not found";
          } else if (error.code === "ECONNABORTED") {
            errorMessage = "Request timed out";
          } else if (error.response) {
            errorMessage = `Server returned status ${error.response.status}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        return {
          success: false,
          error: errorMessage,
          title: null,
          description: null,
          image: null,
        };
      }
    }),
});
