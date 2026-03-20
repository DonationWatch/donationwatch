import type { PropsWithChildren } from "react";

import type { ConstLocale } from "@/utils/locales";

import { AppSidebar } from "@/components/layout/app-sidebar";
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
      <SidebarInset className="min-w-0 flex-1">
        <div className="flex min-h-screen flex-col lg:px-16">
          <StickyHeader />
          <main className="relative flex grow flex-col dark:text-white">
            <div className="flex grow flex-col">{children}</div>
          </main>
          <PageFooter locale={locale} />
        </div>
      </SidebarInset>
    </>
  );
};
