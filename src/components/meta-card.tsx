import type { FC, JSX } from "react";

export const MetaCardTitle: FC<{
  title: string;
  variant?: "default" | "small";
}> = ({ variant, title }) => {
  return (
    <div
      className={`${
        variant === "small" ? "text-sm" : "text-base"
      } mb-1 leading-none text-slate-500 dark:text-slate-300`}
    >
      {title}
    </div>
  );
};

export const MetaCard: FC<{
  title: string;
  value: string | number | JSX.Element;
  footer?: string;
  variant?: "default" | "small";
}> = ({ title, value, footer, variant = "default" }) => {
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
