"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useEventCasesStore } from "~/app/store/useEventStore";
import { api } from "~/trpc/react";
import HomeComponent from "~/app/_components/MainComponents/HomeComponent/HomeComponent";
import Loader from "~/app/_components/loader/loader";
import { LoaderProvider } from "~/app/providers/LoaderProvider";
import { ApiDataProvider } from "~/app/providers/apiDataProvider/ApiDataProvider";
import { ViewportProvider } from "~/app/providers/ViewportProvider";

// Force dynamic rendering for preview pages
export const dynamic = "force-dynamic";

export default function PreviewPage() {
  const params = useParams();
  const previewId = params.id as string;

  const { data: fetchedEvents } = api.pmxMarketRouter.getEvents.useQuery({
    previewId,
  });
  const { setEventCases, setActiveEventCase } = useEventCasesStore();

  useEffect(() => {
    if (fetchedEvents && fetchedEvents.length > 0) {
      setEventCases(fetchedEvents);
      setActiveEventCase(fetchedEvents[0]!);
    }
  }, [fetchedEvents, setEventCases, setActiveEventCase]);

  return (
    <ViewportProvider>
      <LoaderProvider>
        <ApiDataProvider>
          <Loader />
          <HomeComponent />
        </ApiDataProvider>
      </LoaderProvider>
    </ViewportProvider>
  );
}
