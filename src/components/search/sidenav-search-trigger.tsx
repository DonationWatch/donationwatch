"use client";
import { Search } from "lucide-react";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useSearchDialog } from "@/hooks/use-search-dialog";

export const SidenavSearchTrigger = () => {
  const { open } = useSearchDialog();
  const t = useTranslations("search");

  return (
    <div className="p-1">
      <button
        title={t("filter_description")}
        onClick={() => open()}
        className="flex w-full cursor-pointer items-center gap-2 rounded-full border border-neutral-200 p-2 text-sm leading-none hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-800"
      >
        <Search size={16} />
        <span>{t("filter")}</span>
      </button>
    </div>
  );
};
