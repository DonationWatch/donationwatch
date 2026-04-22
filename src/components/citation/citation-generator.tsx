"use client";

import { ChevronDownIcon, Quote } from "lucide-react";
import { toast } from "sonner";

import type { ConstLocale } from "@/utils/locales";
import type { StrictNamespacedTranslator } from "@/utils/translator";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { SITE_NAME } from "@/utils/config";

type CitationStyle = "apa" | "biblatex";

interface CitationStyleOption {
  id: CitationStyle;
  label: string;
}

const STYLES: CitationStyleOption[] = [
  { id: "apa", label: "APA" },
  { id: "biblatex", label: "BibLaTeX" },
];

const generateCitation = (
  style: CitationStyle,
  locale: ConstLocale,
  title: string,
  url: string,
  tCitation: StrictNamespacedTranslator<"citation">,
): string => {
  const now = new Date();
  const currentYear = now.getFullYear();

  if (style === "biblatex") {
    // BibLaTeX format requires standard ISO date (YYYY-MM-DD) for urldate
    const isoDate = now.toISOString().split("T")[0];
    return `@dataset{${SITE_NAME}${currentYear}Data,
\ttitle = {${title}},
\tauthor = {{${SITE_NAME}}},
\tdate = {${currentYear}},
\turl = {${url}},
\turldate = {${isoDate}}
}`;
  }

  if (style === "apa") {
    const formattedDate = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);

    // Standard APA 7th Edition Dataset Format
    return tCitation("apa", {
      year: currentYear,
      title,
      date: formattedDate,
      url,
    });
  }

  return "";
};

export function CitationGenerator({
  disabled,
  title,
  url,
  locale,
}: {
  disabled?: boolean;
  title: string;
  url: string;
  locale: ConstLocale;
}) {
  const tCitation = useTranslations("citation");

  const generateAndCopy = async (citation: CitationStyleOption) => {
    try {
      const text = generateCitation(citation.id, locale, title, url, tCitation);

      await navigator.clipboard.writeText(text.trim());
      toast.success(
        tCitation("success", {
          style: citation.label,
        }),
        {
          duration: 3000,
        },
      );
    } catch (e) {
      console.error("Failed to generate and copy citation", e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className={buttonVariants({
          variant: "outline",
        })}
      >
        <Quote size={16} className="mr-2" />
        {tCitation("action")}
        <ChevronDownIcon size={16} className="ml-2 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {STYLES.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onClick={() => generateAndCopy(s)}
            className="cursor-pointer"
          >
            <div className="flex w-full items-center justify-between gap-4">
              <span>{s.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
