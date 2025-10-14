"use client";

import { useMemo } from "react";
import { ConsiraInfoMocksData } from "~/server/mock";
import ConspirafiInfoItem from "./ConspirafiInfoItem";
import "./ConspirafiInfo.scss";
import { useEventCasesStore } from "~/app/store/useEventStore";

const ConspirafiInfo = () => {
  const data = ConsiraInfoMocksData;
  const { activeEventCase } = useEventCasesStore();

  const activeInfoData = useMemo(() => {
    if (!activeEventCase?.conspiraInfoId) {
      return null;
    }
    return data.find((item) => item.id === activeEventCase.conspiraInfoId);
  }, [activeEventCase, data]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden bg-black/50">
      <div className="no-scrollbar pointer-events-auto z-30 flex h-screen w-full max-w-[800px] flex-wrap content-start justify-center gap-5 overflow-y-auto pb-[360px]">
        <div className="pointer-events-none h-[calc(50vh-100px)] w-full shrink-0" />

        {activeInfoData
          ? activeInfoData.data.map((item, index) => (
              <ConspirafiInfoItem
                key={index}
                type={item.type}
                link={item.link}
                imgSrc={item.imgSrc}
                title={item.title}
                date={item.date}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default ConspirafiInfo;
