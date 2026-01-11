/* eslint-disable react/no-unknown-property */
import type { FC } from "react";

const variants = {
  large: {
    title: "text-2xl",
    value: "text-4xl",
  },
  normal: {
    title: "text-lg",
    value: "text-2xl",
  },
};

export const ImageMetaCard: FC<{
  title: string;
  value: string | number;
  variant?: keyof typeof variants;
}> = ({ title, value, variant = "normal" }) => {
  return (
    <div tw="flex flex-col">
      <div tw={`flex ${variants[variant].value} font-semibold leading-none`}>
        {value}
      </div>
      <div
        tw={`flex text-base ${variants[variant].title} font-semibold text-slate-600`}
      >
        {title}
      </div>
    </div>
  );
};
