import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "block rounded-sm border border-zinc-200/80 bg-white ring-1 ring-black/5 transition ring-inset dark:border-black/50 dark:bg-zinc-900 dark:ring-white/10",
  {
    variants: {
      variant: {
        default: "",
        warn: "border-amber-500/30 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/15 dark:ring-amber-500/20",
        action: "cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800",
      },
      padding: {
        default: "p-4",
        none: "p-0",
        sm: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

function Card({
  className,
  variant,
  padding,
  render,
  ...props
}: useRender.ComponentProps<"div"> &
  React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants({ variant, padding }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "card",
    },
  });
}

function CardHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("flex flex-col gap-1.5 p-6", className),
      },
      props,
    ),
    render,
    state: {
      slot: "card-header",
    },
  });
}

function CardTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("leading-none font-semibold tracking-tight", className),
      },
      props,
    ),
    render,
    state: {
      slot: "card-title",
    },
  });
}

function CardDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("text-muted-foreground text-sm", className),
      },
      props,
    ),
    render,
    state: {
      slot: "card-description",
    },
  });
}

function CardContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("p-6 pt-0", className),
      },
      props,
    ),
    render,
    state: {
      slot: "card-content",
    },
  });
}

function CardFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("flex items-center p-6 pt-0", className),
      },
      props,
    ),
    render,
    state: {
      slot: "card-footer",
    },
  });
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
