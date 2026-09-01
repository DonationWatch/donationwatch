import type { PropsWithChildren } from "react";

import type { ConstLocale } from "@/utils/locales";

import { DynamicAppSidebar as AppSidebar } from "@/components/layout/dynamic-app-sidebar";
import { PageFooter } from "@/components/layout/page-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
import { SidebarInset } from "@/components/ui/sidebar";

export const NonCountryRootLayout = ({
  locale,
  children,
}: PropsWithChildren<{
  locale: ConstLocale;
}>) => {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-w-0 flex-1 md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-zinc-200/80 md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:ring-1 md:peer-data-[variant=inset]:ring-black/5 md:peer-data-[variant=inset]:ring-inset md:peer-data-[variant=inset]:dark:border-black/50 md:peer-data-[variant=inset]:dark:shadow-lg md:peer-data-[variant=inset]:dark:ring-white/10">
        <div className="flex min-h-screen flex-col lg:px-16">
          <StickyHeader />
          <div className="relative flex grow flex-col dark:text-white">
            <div className="flex grow flex-col">{children}</div>
          </div>
          <PageFooter locale={locale} />
        </div>
      </SidebarInset>
    </>
  );
};
