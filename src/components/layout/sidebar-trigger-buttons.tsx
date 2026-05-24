"use client";

import { useEffect, useState } from "react";

import { RootLink } from "@/components/layout/country-switch";
import { PageLogo } from "@/components/layout/page-logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export const SidebarTriggerButtons = () => {
  const { open } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showLogo = isMounted ? !open : false;

  // If sidebar is closed, show logo even on large screens
  return (
    <>
      <SidebarTrigger />
      <RootLink
        className={"size-10 rounded-full p-1 " + (showLogo ? "" : "lg:hidden")}
      >
        <PageLogo size={24} />
      </RootLink>
    </>
  );
};
