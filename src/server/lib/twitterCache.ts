import { LRUCache } from "lru-cache";

import { fetchTweetsByPhrase } from "./twitterApi";

const cache = new LRUCache<string, any>({
  max: 10, // max 10 unique phrase in cache
  ttl: 1000 * 60 * 60, // 60min in ms
});

export async function searchTweetsCached(phrase: string) {
  const key = `tweets:${phrase.toLowerCase()}`;

  // check cache
  const cached = cache.get(key);
  if (cached) {
    // console.log(`CACHE HIT: ${phrase}`);
    return { source: "cache", data: cached };
  }

  // make response
  // console.log(`CACHE MISS: ${phrase}`);
  const response = await fetchTweetsByPhrase(phrase);

  const data = response ?? [];

  // save in cache
  cache.set(key, data);

  return { source: "api", data };
}
