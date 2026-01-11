"use client";

import { SidebarTrigger, useSidebar } from "./sidebar";
import { RootLink } from "../country-switch";
import { PageLogo } from "../page-logo";

export const SidebarTriggerButtons = () => {
  const { open } = useSidebar();

  // If sidebar is closed, show logo even on large screens
  return (
    <>
      <SidebarTrigger />
      <RootLink
        className={"size-10 rounded-full p-1 " + (!open ? "" : "lg:hidden")}
      >
        <PageLogo size={24} />
      </RootLink>
    </>
  );
};
