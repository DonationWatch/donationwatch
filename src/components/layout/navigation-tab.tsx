"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";

export const NavigationTab = ({
  label,
  isActive,
  onClick,
  icon,
}: {
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const activeClass = "text-zinc-900 dark:text-white";

  return (
    <button
      role="tab"
      className={cn(
        "hover:text-primary-700 flex w-full cursor-pointer items-center gap-2 p-2 text-zinc-500 transition-all hover:text-zinc-900 sm:w-auto dark:text-zinc-400 dark:hover:text-white",
        isActive ? activeClass : undefined,
      )}
      onClick={onClick}
    >
      {icon}
      <div>{label}</div>
    </button>
  );
};
