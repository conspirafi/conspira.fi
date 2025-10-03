const LinkIcon = ({ color = "white", height = 12, width = 12 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      <path
        d="M1 11L10.0607 1.93931M11 11V4.06506C11 2.37227 9.62773 1 7.93494 1H1"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LinkIcon;
