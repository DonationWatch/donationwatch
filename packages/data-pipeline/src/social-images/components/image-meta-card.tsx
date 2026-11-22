/* eslint-disable react/no-unknown-property */

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

export const ImageMetaCard = ({
  title,
  value,
  variant = "normal",
}: {
  title: string;
  value: string | number;
  variant?: keyof typeof variants;
}) => {
  return (
    <div tw="flex flex-col">
      <div tw={`flex ${variants[variant].value} font-semibold leading-none`}>
        {value}
      </div>
      <div
        tw={`flex text-base ${variants[variant].title} font-semibold text-zinc-600`}
      >
        {title}
      </div>
    </div>
  );
};
