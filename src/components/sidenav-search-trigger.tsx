"use client";

import { Search } from "lucide-react";

import { useSearchDialog } from "../hooks/use-search-dialog";
import { useTranslations } from "../hooks/use-translations";

export const SidenavSearchTrigger = () => {
  const { open } = useSearchDialog();
  const { translations } = useTranslations();

  return (
    <div className="p-1">
      <button
        title={translations.search.filter_description}
        onClick={() => open()}
        className="flex w-full cursor-pointer items-center gap-2 rounded-full border border-neutral-200 p-2 text-sm leading-none hover:bg-white dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <Search size={16} />
        <span>{translations.search.filter}</span>
      </button>
    </div>
  );
};
