"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";

import type { Country } from "@/utils/countries";

import { createLucideSpriteIcon } from "@/components/icons/lucide-sprite-icon";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useHasEverOpened } from "@/hooks/use-has-ever-opened";
import { useSearchDialog } from "@/hooks/use-search-dialog";

const Search = createLucideSpriteIcon("search");

export const prefetchSearchDialog = () => {
  void import("./search-dialog");
};

const SearchDialog = dynamic(
  () => import("./search-dialog").then((mod) => mod.SearchDialog),
  { ssr: false },
);

export const DynamicContentSearch = () => {
  const t = useTranslations("search");
  const { country: activeCountry } = useParams<{ country: Country }>();
  const { isOpen, open, close } = useSearchDialog();
  const [hasPrefetched, setHasPrefetched] = useState(false);
  const hasEverOpened = useHasEverOpened(isOpen);

  if (!activeCountry) return null;

  const triggerPrefetch = () => {
    prefetchSearchDialog();
    setHasPrefetched(true);
  };

  return (
    <>
      <button
        className="flex size-10 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-neutral-600/10 dark:text-zinc-200 dark:hover:bg-white/10"
        onClick={() => open()}
        onMouseEnter={triggerPrefetch}
        onFocus={triggerPrefetch}
        aria-label={t("filter_description")}
        title={t("filter")}
      >
        <Search size={18} />
      </button>
      {(hasEverOpened || hasPrefetched) && (
        <SearchDialog isOpen={isOpen} onClose={() => close()} />
      )}
    </>
  );
};
