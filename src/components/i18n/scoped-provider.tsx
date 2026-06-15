"use client";

import type { Messages } from "next-intl";
import type { PropsWithChildren } from "react";

import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTimeZone,
} from "next-intl";

export function ScopedClientIntlProvider({
  messages,
  children,
}: PropsWithChildren<{ messages: Partial<Messages> }>) {
  const locale = useLocale();
  const timeZone = useTimeZone();
  const parentMessages = useMessages();
  const mergedMessages = { ...parentMessages, ...messages };

  return (
    <NextIntlClientProvider
      locale={locale}
      timeZone={timeZone}
      messages={mergedMessages}
    >
      {children}
    </NextIntlClientProvider>
  );
}
