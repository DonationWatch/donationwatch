"use client";

import { useEffect, useState } from "react";

import { RootLink } from "@/components/layout/country-switch";
import { PageLogo } from "@/components/layout/page-logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const SidebarTriggerButtons = () => {
  const t = useTranslations("sidebar");
  const { open } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showLogo = isMounted ? !open : false;

  // If sidebar is closed, show logo even on large screens
  return (
    <>
      <SidebarTrigger
        title={t("toggle")}
        aria-label={t("toggle")}
        className="size-10 rounded-full hover:bg-neutral-600/10 dark:text-zinc-200 dark:hover:bg-white/10"
        size="icon-xl"
      />
      <RootLink
        className={
          "flex size-10 items-center justify-center rounded-full p-1 hover:bg-neutral-600/10 dark:text-zinc-200 dark:hover:bg-white/10 " +
          (showLogo ? "" : "lg:hidden")
        }
      >
        <PageLogo size={24} />
      </RootLink>
    </>
  );
};
