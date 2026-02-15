import { AppSidebar } from "../app-sidebar";
import { PageFooter } from "../page-footer";
import { PageHeader } from "../page-header";
import { SidebarInset } from "./sidebar";

import type { Translations } from "../../messages/translations";
import type { ConstLocale } from "../../utils/locales";
import type { PropsWithChildren } from "react";

export const NonCountryRootLayout = ({
  translations,
  locale,
  children,
}: PropsWithChildren<{
  translations: Translations;
  locale: ConstLocale;
}>) => {
  return (
    <>
      <AppSidebar translations={translations} locale={locale} />
      <SidebarInset className="min-w-0 flex-1">
        <div className="flex min-h-screen flex-col lg:px-16">
          <PageHeader />
          <main className="relative flex grow flex-col dark:text-white">
            <div className="flex grow flex-col">{children}</div>
          </main>
          <PageFooter translations={translations} locale={locale} />
        </div>
      </SidebarInset>
    </>
  );
};
