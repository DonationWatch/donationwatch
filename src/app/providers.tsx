"use client";

import type { Messages } from "next-intl";
import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { createContext, useEffect, useMemo, useState } from "react";

import type { LayoutMessages } from "@/utils/i18n-filter";
import type { BrowserBasedLocale, ConstLocale } from "@/utils/locales";

import { SidebarProvider } from "@/components/ui/sidebar";
import { makeBrand } from "@/utils/brand";
import { SIDENAV_PERSISTENCE_KEY } from "@/utils/config";

export const Providers = ({
  children,
  locale,
  messages,
}: PropsWithChildren<{
  locale: ConstLocale;
  messages: LayoutMessages;
}>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
          },
        },
      }),
  );

  return (
    <NextIntlClientProvider
      locale={locale}
      timeZone="UTC"
      messages={messages as unknown as Messages}
    >
      <QueryClientProvider client={queryClient}>
        <AppUIProvider locale={locale}>{children}</AppUIProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
};

export const BrowserBasedLocaleContext =
  createContext<BrowserBasedLocale | null>(null);

type SearchDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const SearchDialogContext =
  createContext<SearchDialogContextValue | null>(null);

function AppUIProvider({
  children,
  locale,
}: PropsWithChildren<{ locale: ConstLocale }>) {
  // Locale State
  const [browserBasedLocale, setBrowserBasedLocale] =
    useState<BrowserBasedLocale>(() => makeBrand<BrowserBasedLocale>(locale));

  useEffect(() => {
    const navigatorLanguage = navigator.language;
    if (navigatorLanguage.startsWith(locale)) {
      setBrowserBasedLocale(makeBrand<BrowserBasedLocale>(navigatorLanguage));
    }
  }, [locale]);

  // Search Dialog State
  const [searchOpen, setSearchOpen] = useState(false);
  const searchDialogValue = useMemo(
    () => ({
      isOpen: searchOpen,
      open: () => setSearchOpen(true),
      close: () => setSearchOpen(false),
    }),
    [searchOpen],
  );

  // Sidebar Local Storage State
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(SIDENAV_PERSISTENCE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true;
  });
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDENAV_PERSISTENCE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <BrowserBasedLocaleContext.Provider value={browserBasedLocale}>
      <SearchDialogContext.Provider value={searchDialogValue}>
        <SidebarProvider
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          className={!isMounted ? "![&_*]:transition-none" : ""}
        >
          {children}
        </SidebarProvider>
      </SearchDialogContext.Provider>
    </BrowserBasedLocaleContext.Provider>
  );
}
