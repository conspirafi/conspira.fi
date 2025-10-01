import React from "react";

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex max-w-[500px] items-start gap-x-6">
    <div className="flex w-14 flex-shrink-0 items-center gap-x-2 pt-1">
      <span className="h-2 w-2 bg-gray-600"></span>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

interface EventDetailsProps {
  title: string;
  spec: string;
  link: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ title, spec, link }) => {
  return (
    <div className="flex max-w-2xl flex-col gap-y-8 text-white">
      <InfoRow label="Title">
        <h1 className="text-[42px] leading-[100%]">{title}</h1>
      </InfoRow>

      <InfoRow label="Specs">
        <p className="text-xs text-white">{spec}</p>
      </InfoRow>

      <InfoRow label="Link">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group pointer-events-auto inline-flex items-center gap-x-2 border-b border-gray-500 pb-1 text-lg text-white transition-colors hover:border-white"
        >
          Full market on PMX
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path
              d="M1 11L11 1M11 1H1M11 1V11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </InfoRow>
    </div>
  );
};

export default EventDetails;
