import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

export async function fetchTweetsViaXAI(topic: string) {
  try {
    const { text, sources } = await generateText({
      model: xai("grok-3-fast-latest"),
      prompt: `Fetch the IDs of the top 5-10 most popular tweets about ${topic} from the last 7 days. Return only a JSON array of post IDs (no other fields).`,
      providerOptions: {
        xai: {
          searchParameters: {
            mode: "on",
            sources: [{ type: "x" }],
            maxSearchResults: 10,
            returnCitations: true,
          },
        },
      },
    });
    const jsonObject: string[] = JSON.parse(text);
    return { jsonObject, sources };
  } catch (err) {
    console.log(err);
    return null;
  }
}
