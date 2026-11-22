import type { SVGProps } from "react";

export const Bluesky = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden={true} width="16px" height="16px" {...props}>
    <use href="/icons.svg#bluesky" />
  </svg>
);
