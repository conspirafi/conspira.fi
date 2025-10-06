import { HydrateClient } from "~/trpc/server";

import HomeComponent from "../_components/MainComponents/HomeComponent/HomeComponent";
import { VideoProvider } from "../providers/VideoProvider";

export default async function Home() {
  return (
    <HydrateClient>
      <VideoProvider>
        <HomeComponent />
      </VideoProvider>
    </HydrateClient>
  );
}
