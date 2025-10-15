import {
  TwitterApi,
  type MediaObjectV2,
  type TweetPublicMetricsV2,
  type TweetV2,
  type UserV2,
} from "twitter-api-v2";

const blankPublicMetrics: TweetPublicMetricsV2 = {
  retweet_count: 0,
  reply_count: 0,
  like_count: 0,
  quote_count: 0,
  bookmark_count: 0,
  impression_count: 0,
};

export const twitterApiClient = new TwitterApi(
  process.env.TWITTER_BEARER_TOKEN!,
);
export const roClient = twitterApiClient.readOnly;

export interface ITweetFullData {
  id: string;
  text: string;
  createdAt?: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  user?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  rawMedia: (MediaObjectV2 | undefined)[];
  media?: string[];
  url?: string;
}

const LIKE_WEIGHT = 1;
const RETWEET_WEIGHT = 2;
const REPLIES_WEIGHT = 1.5;

function calculatePopularity(post: ITweetFullData): number {
  return (
    post.like_count * LIKE_WEIGHT +
    post.retweet_count * RETWEET_WEIGHT +
    post.reply_count * REPLIES_WEIGHT
  );
}

function sortPostsByPopularity(posts: ITweetFullData[]): ITweetFullData[] {
  return [...posts].sort(
    (a, b) => calculatePopularity(b) - calculatePopularity(a),
  );
}

function getTweetMetrics(
  post: TweetV2,
  tweetIncludes: Map<string, TweetV2>,
): TweetPublicMetricsV2 {
  const referenced = post.referenced_tweets?.[0]?.id;
  if (referenced) {
    const original = tweetIncludes.get(referenced);
    return original?.public_metrics ?? blankPublicMetrics;
  }
  return post.public_metrics ?? blankPublicMetrics;
}

function extractYouTubeThumbnail(url?: string): string | undefined {
  if (!url) return undefined;
  const idMatch =
    url.match(/v=([A-Za-z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  return idMatch?.[1]
    ? `https://img.youtube.com/vi/${idMatch[1]}/hqdefault.jpg`
    : undefined;
}

function buildTweetUrl(
  username: string | undefined,
  tweetId: string,
): string | undefined {
  return username
    ? `https://twitter.com/${username}/status/${tweetId}`
    : undefined;
}

function buildUserData(
  user: UserV2 | undefined,
): ITweetFullData["user"] | undefined {
  if (!user) return undefined;
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.profile_image_url,
    verified: user.verified,
  };
}

function buildMediaUrls(
  mediaItems: (MediaObjectV2 | undefined)[],
  youtubeThumb?: string,
): string[] {
  const urls = mediaItems
    .filter((m): m is MediaObjectV2 => !!m)
    .map((m) => m.url ?? m.preview_image_url ?? "");
  if (youtubeThumb) urls.push(youtubeThumb);
  return urls;
}

export async function fetchTweetsByPhrase(
  phrase: string,
): Promise<ITweetFullData[]> {
  try {
    const response = await roClient.v2.search({
      query: phrase,
      max_results: 100, // Increased from 10 to 100 for more variety
      expansions: [
        "author_id",
        "attachments.media_keys",
        "referenced_tweets.id",
      ],
      "tweet.fields": [
        "created_at",
        "public_metrics",
        "referenced_tweets",
        "attachments",
        "entities",
      ],
      "user.fields": ["name", "username", "profile_image_url", "verified"],
      "media.fields": ["url", "preview_image_url"],
    });

    const users = new Map<string, UserV2>(
      response.includes?.users?.map((u) => [u.id, u]) ?? [],
    );
    const media = new Map<string, MediaObjectV2>(
      response.includes?.media?.map((m) => [m.media_key, m]) ?? [],
    );
    const tweetIncludes = new Map<string, TweetV2>(
      response.includes?.tweets?.map((t) => [t.id, t]) ?? [],
    );

    const tweets: ITweetFullData[] = (response.tweets ?? []).map(
      (tweet: TweetV2) => {
        const user = users.get(tweet.author_id ?? "");
        const mediaItems = (tweet.attachments?.media_keys ?? []).map((key) =>
          media.get(key),
        );

        const youtubeUrl = tweet.entities?.urls?.find(
          (u) =>
            u.expanded_url?.includes("youtube.com/watch") ||
            u.expanded_url?.includes("youtu.be/"),
        )?.expanded_url;

        const youtubeThumb = extractYouTubeThumbnail(youtubeUrl);
        const tweetMetrics = getTweetMetrics(tweet, tweetIncludes);
        const tweetUrl = buildTweetUrl(user?.username, tweet.id);

        return {
          id: tweet.id,
          text: tweet.text,
          createdAt: tweet.created_at,
          user: buildUserData(user),
          media: buildMediaUrls(mediaItems, youtubeThumb),
          rawMedia: mediaItems,
          url: tweetUrl,
          retweet_count: tweetMetrics.retweet_count,
          reply_count: tweetMetrics.reply_count,
          like_count: tweetMetrics.like_count,
          quote_count: tweetMetrics.quote_count,
          impression_count: tweetMetrics.impression_count,
          bookmark_count: tweetMetrics.bookmark_count ?? 0,
        };
      },
    );

    return sortPostsByPopularity(tweets);
  } catch (error) {
    console.error("Tweets fetch error:", error);
    return [];
  }
}
