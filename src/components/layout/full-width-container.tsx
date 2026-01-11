import type { PropsWithChildren, FC } from "react";

export const FullWidthContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto max-w-(--breakpoint-xl) px-4">{children}</div>;
};
