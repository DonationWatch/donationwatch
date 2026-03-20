"use client";

import type { JSX } from "react";

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
  const activeClass =
    "text-primary-700 shadow-md bg-white dark:bg-primary-900 dark:text-primary-200";
  return (
    <button
      role="tab"
      className={
        "hover:text-primary-700 dark:hover:bg-primary-800 flex w-full cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 transition-all hover:bg-white hover:shadow-md sm:w-auto dark:hover:text-white " +
        (isActive ? activeClass : "")
      }
      onClick={onClick}
    >
      {icon}
      <div>{label}</div>
    </button>
  );
};
