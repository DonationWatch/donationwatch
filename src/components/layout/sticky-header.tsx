import { Server } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { SidebarTriggerButtons } from "@/components/layout/sidebar-trigger-buttons";
import { DynamicContentSearch } from "@/components/search/dynamic-content-search";

import { LangSwitch } from "./lang-switch";

const EnterpriseApiButton = () => {
  const locale = useLocale();
  const t = useTranslations();
  const label = t("navigation.enterprise");

  return (
    <Link
      href={`/${locale}/enterprise`}
      prefetch={false}
      aria-label={label}
      title={label}
      className="bg-primary-700 hover:bg-primary-500 flex size-10 shrink-0 items-center justify-center rounded-full p-1 font-semibold text-white"
    >
      <Server />
    </Link>
  );
};

export const StickyHeader = () => {
  return (
    <div className="sticky top-0 z-20 lg:-mx-16">
      <header className="pointer-events-none absolute top-0 right-0 left-0 flex shrink-0 border-b border-transparent dark:text-white">
        <div className="flex grow justify-between px-2 pt-4 lg:px-4 lg:pt-4">
          <div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border-zinc-200 bg-white/60 p-1 shadow backdrop-blur-sm lg:flex-col dark:border-zinc-50/6 dark:bg-zinc-900/60">
              <SidebarTriggerButtons />
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border-zinc-200 bg-white/60 p-1 shadow backdrop-blur-sm lg:flex-col dark:border-zinc-50/6 dark:bg-zinc-900/60">
              <EnterpriseApiButton />
              <LangSwitch />
              <DynamicContentSearch />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
