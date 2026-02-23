"use client";

import { useTranslations } from "next-intl";

export default function Loading({
  heightClass = "h-[100px]",
}: {
  heightClass?: string;
}) {
  const t = useTranslations("data");

  return (
    <div className={`flex ${heightClass} items-center justify-center`}>
      <div role="status">
        <svg
          aria-hidden="true"
          className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.6a50 50 0 1 1-100 0 50 50 0 0 1 100 0Zm-90.92 0a40.92 40.92 0 1 0 81.84 0 40.92 40.92 0 0 0-81.84 0Z"
            fill="currentColor"
          />
          <path
            d="M93.97 39.04A4.24 4.24 0 0 0 97 33.55 50 50 0 0 0 41.73 1.28a4.24 4.24 0 0 0-3.28 5.34 4.96 4.96 0 0 0 5.6 3.49 40.92 40.92 0 0 1 44.13 25.77 4.96 4.96 0 0 0 5.79 3.16Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">{t("loading")}</span>
      </div>
    </div>
  );
}
