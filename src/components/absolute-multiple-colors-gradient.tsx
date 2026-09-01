export const AbsoluteMultipleColorsGradient = ({
  colors,
}: {
  colors: { color: string; width: number }[];
}) => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 md:inset-x-2 md:top-2 lg:-mx-16">
        {/* Solid multi-color bar above the gradient, padded to offset from the main content border radius */}
        <div className="flex h-1.5 w-full overflow-hidden *:h-full md:rounded-full">
          {colors.map(({ color, width }) => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                width: `${width}%`,
              }}
            />
          ))}
        </div>
        {/* Subtle transparent gradient */}
        <div className="flex h-48 w-full *:h-full">
          {colors.map(({ color, width }) => (
            <div
              key={color}
              style={{
                background: `linear-gradient(0deg, transparent 0%, color(from ${color} srgb r g b / 0.1) 100%)`,
                width: `${width}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* offset for page head on mobile */}
      <div className="mb-8 lg:mb-0" />
    </>
  );
};
