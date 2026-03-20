import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "focus:ring-ring/50 inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus:ring-2 focus:ring-offset-2 focus:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>a]:underline [&>a]:underline-offset-2 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
        destructive:
          "bg-destructive [a&]:hover:bg-destructive/90 focus:ring-destructive/50 dark:bg-destructive/60 dark:focus:ring-destructive/40 border-transparent text-white",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Simple Slot implementation to replace @radix-ui/react-slot
function Slot({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  if (!React.isValidElement(children)) {
    return null;
  }
  const childProps = children.props as Record<string, unknown>;
  return React.cloneElement(children, {
    ...props,
    ...childProps,
    className: cn(props.className, childProps.className as string),
  } as React.HTMLAttributes<HTMLElement>);
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
