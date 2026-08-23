"use client";

import type { ComponentProps, JSX, PropsWithChildren } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const NavigationLink = ({
  label,
  href,
  activeHref,
  icon,
}: {
  label: string;
  href: string;
  activeHref?: string;
  icon: JSX.Element;
}) => {
  const activeClass = "text-zinc-900 dark:text-white";

  return (
    <ActiveLink
      role="tab"
      className="hover:text-primary-700 flex w-full cursor-pointer items-center gap-2 p-2 text-zinc-500 transition-all hover:text-zinc-900 sm:w-auto dark:text-zinc-400 dark:hover:text-white"
      href={href}
      activeHref={activeHref}
      activeClass={activeClass}
    >
      {icon}
      <div>{label}</div>
    </ActiveLink>
  );
};

export const ActiveLink = ({
  href,
  activeHref,
  activeClass,
  className,
  children,
  ...others
}: PropsWithChildren<
  {
    href: string;
    activeHref?: string;
    activeClass: string;
    className?: string;
  } & ComponentProps<typeof Link>
>) => {
  const pathname = usePathname();
  const isActive = activeHref
    ? pathname.startsWith(activeHref)
    : pathname.startsWith(href);

  return (
    <Link
      {...others}
      href={href}
      className={cn(
        "hover:text-primary-700 transition-all dark:hover:text-white",
        className,
        isActive ? activeClass : undefined,
      )}
    >
      {children}
    </Link>
  );
};
