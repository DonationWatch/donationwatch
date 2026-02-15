"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useMemo, useState } from "react";

import { SidebarProvider } from "../components/ui/sidebar";
import { SIDENAV_PERSISTENCE_KEY } from "../utils/config";

import type { Translations } from "../messages/translations";
import type { ConstLocale } from "../utils/locales";
import type { PropsWithChildren, ReactNode } from "react";

export const Providers = ({
  children,
  translations,
  locale,
}: PropsWithChildren<{
  locale: ConstLocale;
  translations: Translations;
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
    <ServerTranslationProvider locale={locale} translations={translations}>
      <QueryClientProvider client={queryClient}>
        <SidebarLocalStorageProvider>
          <SearchDialogProvider>{children}</SearchDialogProvider>
        </SidebarLocalStorageProvider>
      </QueryClientProvider>
    </ServerTranslationProvider>
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

export const TranslationContext = createContext<{
  locale: ConstLocale;
  translations: Translations;
}>(
  {} as {
    locale: ConstLocale;
    translations: Translations;
  },
);

export function ServerTranslationProvider({
  translations,
  children,
  locale,
}: {
  locale: ConstLocale;
  translations: Translations;
  children: ReactNode;
}) {
  return (
    <TranslationContext.Provider value={{ locale, translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

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
