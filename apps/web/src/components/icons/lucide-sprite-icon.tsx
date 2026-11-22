import type { SVGProps } from "react";

interface LucideSpriteIconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export const LucideSpriteIcon = ({
  name,
  size = 16,
  className = "",
  ...props
}: LucideSpriteIconProps) => {
  return (
    <svg
      aria-hidden={true}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-${name} ${className}`.trim()}
      viewBox="0 0 24 24"
      {...props}
    >
      <use href={`/icons.svg#lucide-${name}`} />
    </svg>
  );
};

export const createLucideSpriteIcon = (name: string) => {
  const IconComponent = (
    props: SVGProps<SVGSVGElement> & { size?: number },
  ) => <LucideSpriteIcon name={name} {...props} />;
  IconComponent.displayName = `LucideSpriteIcon(${name})`;
  return IconComponent;
};
