"use client";

import type { Messages } from "next-intl";
import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { createContext, useEffect, useMemo, useState } from "react";

import type { ClientMessages } from "@/utils/i18n-filter";
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
  messages: ClientMessages;
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
      messages={messages as unknown as Messages}
    >
      <BrowserBasedLocaleProvider locale={locale}>
        <QueryClientProvider client={queryClient}>
          <SidebarLocalStorageProvider>
            <SearchDialogProvider>{children}</SearchDialogProvider>
          </SidebarLocalStorageProvider>
        </QueryClientProvider>
      </BrowserBasedLocaleProvider>
    </NextIntlClientProvider>
  );
};

export function SidebarLocalStorageProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<boolean | null>(null);

  // Read initial value from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem(SIDENAV_PERSISTENCE_KEY);
    if (saved === null) {
      setOpen(true); // default
    } else {
      setOpen(saved === "true");
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (open === null) return;
    window.localStorage.setItem(SIDENAV_PERSISTENCE_KEY, String(open));
  }, [open]);

  if (open === null) return null; // or skeleton to avoid flash

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  );
}

export const BrowserBasedLocaleContext =
  createContext<BrowserBasedLocale | null>(null);

export const BrowserBasedLocaleProvider = ({
  children,
  locale,
}: PropsWithChildren<{ locale: ConstLocale }>) => {
  // We use the base locale as the initial state to ensure hydration matches the server-side render.
  const [browserBasedLocale, setBrowserBasedLocale] =
    useState<BrowserBasedLocale>(() => makeBrand<BrowserBasedLocale>(locale));

  useEffect(() => {
    // navigator is only available in the browser.
    const navigatorLanguage = navigator.language;

    if (navigatorLanguage.startsWith(locale)) {
      setBrowserBasedLocale(makeBrand<BrowserBasedLocale>(navigatorLanguage));
    }
  }, [locale]);

  return (
    <BrowserBasedLocaleContext.Provider value={browserBasedLocale}>
      {children}
    </BrowserBasedLocaleContext.Provider>
  );
};

type SearchDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const SearchDialogContext =
  createContext<SearchDialogContextValue | null>(null);

export const SearchDialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <SearchDialogContext.Provider value={value}>
      {children}
    </SearchDialogContext.Provider>
  );
};
