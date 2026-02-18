import type { JSX } from "react";

export const MetaCardTitle = ({
  variant,
  title,
  id,
}: {
  title: string | JSX.Element;
  variant?: "default" | "small";
  id?: string;
}) => {
  return (
    <div
      id={id}
      className={`${
        variant === "small" ? "text-sm" : "text-base"
      } mb-1 leading-none text-slate-500 dark:text-slate-300`}
    >
      {title}
    </div>
  );
};

export const MetaCard = ({
  title,
  value,
  footer,
  variant = "default",
}: {
  title: string;
  value: string | number | JSX.Element;
  footer?: string;
  variant?: "default" | "small";
}) => {
  return (
    <div>
      <MetaCardTitle variant={variant} title={title} />
      <div className={`${variant === "small" ? "text-lg" : "text-2xl"}`}>
        {value}
      </div>
      {footer ? (
        <div className="text-muted-foreground text-xs">{footer}</div>
      ) : null}
    </div>
  );
};
