import type { FC } from "react";

export const AbsoluteMultipleColorsGradient: FC<{
  colors: { color: string; width: number }[];
}> = ({ colors }) => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 lg:-mx-16">
        <div className="flex h-48 w-full *:h-full">
          {colors.map(({ color, width }) => (
            <div
              key={color}
              style={{
                background: `linear-gradient(0deg, transparent 0%, color(from ${color} srgb r g b / 0.1) calc(100% - 6px),${color} calc(100% - 6px))`,
                width: `${width}%`,
              }}
            ></div>
          ))}
        </div>
      </div>
      {/*offset for page head on mobile */}
      <div className="mb-8 lg:mb-0"></div>
    </>
  );
};
