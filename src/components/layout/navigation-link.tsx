"use client";

import type { ComponentProps, JSX, PropsWithChildren } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const activeClass =
    "text-primary-700 shadow-md bg-white dark:bg-primary-900 dark:text-primary-200";

  return (
    <ActiveLink
      role="tab"
      className="dark:hover:bg-primary-800 flex items-center space-x-2 rounded-lg px-4 py-2 transition-all hover:bg-white hover:shadow-md"
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
      className={
        "hover:text-primary-700 transition-all dark:hover:text-white " +
        (className ? className : "") +
        " " +
        (isActive ? activeClass : "")
      }
    >
      {children}
    </Link>
  );
};
