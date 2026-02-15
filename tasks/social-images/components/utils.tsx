/* eslint-disable react/no-unknown-property */
import type { PropsWithChildren } from "react";

export const ThumbnailWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      tw="bg-white w-full h-full flex flex-col"
      style={{
        fontSize: "16px",
        fontFamily: "NotoSans, NotoSansGeorgian, NotoSansMath",
      }}
    >
      {children}
    </div>
  );
};
