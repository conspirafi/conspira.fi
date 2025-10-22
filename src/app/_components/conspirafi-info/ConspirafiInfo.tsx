"use client";

import { useMemo } from "react";
import ConspirafiInfoItem from "./ConspirafiInfoItem";
import "./ConspirafiInfo.scss";
import { useEventCasesStore } from "~/app/store/useEventStore";

const ConspirafiInfo = () => {
  const { activeEventCase } = useEventCasesStore();

  const activeInfoData = useMemo(() => {
    if (!activeEventCase?.conspiraInfos) {
      return [];
    }
    return activeEventCase.conspiraInfos;
  }, [activeEventCase]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden bg-black/50">
      <div className="no-scrollbar pointer-events-auto z-30 flex h-screen w-full max-w-[800px] flex-wrap content-start justify-center gap-5 overflow-y-auto pb-[360px]">
        <div className="pointer-events-none h-[calc(50vh-100px)] w-full shrink-0" />

        {activeInfoData.map((item, index) => (
          <ConspirafiInfoItem
            key={index}
            type={item.type}
            link={item.link}
            imgSrc={item.imgSrc}
            title={item.title}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
};

export default ConspirafiInfo;
