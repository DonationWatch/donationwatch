import type { FC } from "react";

export const PageLogo: FC<{ size?: number; className?: string }> = ({
  className,
  size = 20,
}) => {
  return (
    <svg
      className={className}
      aria-hidden={true}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 42"
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="a">
          <path
            className="powerclip"
            d="M1 16.5h31.4V33H.9Zm9.5-5v13.4h12.3V11.4c0-1-.8-1.7-1.7-1.7h-8.9c-1 0-1.7.7-1.7 1.7z"
            strokeWidth="1.6"
          />
        </clipPath>
      </defs>
      <g strokeWidth="1.9">
        <path
          d="M10 10c0-1.8 1.2-3 3-3h16c1.8 0 3 1.2 3 3v25H10ZM34 35H8M14 20.3h8"
          strokeWidth="3.059"
        />
        <path d="M26.9 16.2a6.4 6.4 0 1 0 0 8.3" strokeWidth="3.059" />
      </g>
      <path
        transform="matrix(1.82 0 0 1.82 -9.3 -10.6)"
        d="M6.8 27.2V25c0-1.6 1.1-2.7 2.7-2.7h14.3c1.6 0 2.7 1.1 2.7 2.7v2.2"
        clipPath="url(#a)"
        strokeWidth="1.6"
      />
    </svg>
  );
};

export const PageLogo2: FC<{ size?: number; className?: string }> = ({
  className,
  size = 20,
}) => {
  return (
    <svg
      className={className}
      aria-hidden={true}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 42 42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="a">
          <path
            className="powerclip"
            d="M1 16.5h31.4V33H.9Zm9.5-5v13.4h12.3V11.4c0-1-.8-1.7-1.7-1.7h-8.9c-1 0-1.7.7-1.7 1.7z"
            strokeWidth="1.6"
          />
        </clipPath>
      </defs>
      <g strokeWidth="1.9">
        <path
          d="M10 10c0-1.8 1.2-3 3-3h16c1.8 0 3 1.2 3 3v25H10Zm24 25H8"
          strokeWidth="1.75"
        />
        <g strokeWidth="3.06">
          <path d="M26.9 16.2a6.4 6.4 0 1 0 0 8.3M14 20.3h8" />
        </g>
      </g>
      <path
        transform="translate(-9.3 -10.6)scale(1.82)"
        d="M6.8 27.2V25c0-1.6 1.1-2.7 2.7-2.7h14.3c1.6 0 2.7 1.1 2.7 2.7v2.2"
        clipPath="url(#a)"
        strokeWidth=".96"
      />
    </svg>
  );
};
