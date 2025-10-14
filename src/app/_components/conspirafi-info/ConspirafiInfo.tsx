import { ConsiraInfoMocksData } from "~/server/mock";
import ConspirafiInfoItem from "./ConspirafiInfoItem";
import "./ConspirafiInfo.scss";

const ConspirafiInfo = () => {
  const data = ConsiraInfoMocksData;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="no-scrollbar pointer-events-auto z-30 flex h-screen w-full max-w-[800px] flex-wrap content-start justify-center gap-5 overflow-y-auto pb-[360px]">
        {/* Spacer зверху щоб перші айтеми були по центру */}
        <div className="h-[calc(50vh-100px)] w-full shrink-0" />

        {data.map((x) =>
          x.id === "0"
            ? x.data.map((y, index) => (
                <ConspirafiInfoItem
                  key={index}
                  type={y.type}
                  link={y.link}
                  imgSrc={y.imgSrc}
                  title={y.title}
                  date={y.date}
                />
              ))
            : null,
        )}
      </div>
    </div>
  );
};

export default ConspirafiInfo;
