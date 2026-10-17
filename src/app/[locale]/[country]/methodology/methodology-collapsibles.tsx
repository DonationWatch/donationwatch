"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDownIcon } from "lucide-react";
import {
  useLocale,
  useTranslations as useNextIntlTranslations,
} from "next-intl";
import { useRef, useState } from "react";

import type { UseNormalizedData } from "@/hooks/use-api";

import { FormatAnd } from "@/components/formatter";
import { ArticleSection } from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNormalized } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export interface MethodologyCollapsiblesTexts {
  filteredReceivers: { title: string; p0: string; p1: string };
  filteredDonors: { title: string; p0: string; p1: string };
  normalizedReceivers: { title: string; p0: string };
  aggregatedDonors: { title: string; p0: string; p1: string };
}

export function MethodologyCollapsibles({
  texts,
}: {
  texts: MethodologyCollapsiblesTexts;
}) {
  const countryConfig = useRequiredCountryConfig();
  const tData = useTranslations("data");
  const { data, error, isLoading } = useNormalized(countryConfig);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) return <Loading />;
  if (error || !data)
    return <p className="text-sm text-red-500">{tData("error")}</p>;

  const hasReceiverFilters = Boolean(
    data.receiverFilters && data.receiverFilters.length > 0,
  );
  const hasDonorFilters = Boolean(
    data.donorFilters && data.donorFilters.length > 0,
  );
  const hasNormalizedReceivers = Boolean(
    data.normalizedReceivers && data.normalizedReceivers.length > 0,
  );
  const hasNormalizedDonors = Boolean(
    data.normalizedDonors && data.normalizedDonors.length > 0,
  );

  return (
    <div className="space-y-4">
      {hasReceiverFilters && (
        <Collapsible
          open={Boolean(openSections.filteredReceivers)}
          onOpenChange={() => toggle("filteredReceivers")}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between text-left text-base font-semibold"
              >
                <span>
                  {texts.filteredReceivers.title} (
                  {data.filteredReceivers.length})
                </span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${
                    openSections.filteredReceivers ? "rotate-180" : ""
                  }`}
                />
              </Button>
            }
          />
          <CollapsibleContent className="px-2">
            <div className="mt-4 space-y-3">
              <p>{texts.filteredReceivers.p0}</p>
              <ul className="list-inside list-disc">
                {data.receiverFilters?.map((filter, idx) => (
                  <li key={`rfilter-${idx}`}>
                    <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs dark:bg-neutral-900">
                      {filter.toString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p>{texts.filteredReceivers.p1}</p>
              <FilteredReceiversList data={data} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {hasDonorFilters && (
        <Collapsible
          open={Boolean(openSections.filteredDonors)}
          onOpenChange={() => toggle("filteredDonors")}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between text-left text-base font-semibold"
              >
                <span>
                  {texts.filteredDonors.title} ({data.filteredDonors.length})
                </span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${
                    openSections.filteredDonors ? "rotate-180" : ""
                  }`}
                />
              </Button>
            }
          />
          <CollapsibleContent className="px-2">
            <div className="mt-4 space-y-3">
              <p>{texts.filteredDonors.p0}</p>
              <ul className="list-inside list-disc">
                {data.donorFilters?.map((filter, idx) => (
                  <li key={`dfilter-${idx}`}>
                    <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs dark:bg-neutral-900">
                      {filter.toString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p>{texts.filteredDonors.p1}</p>
              <FilteredDonorsList data={data} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {hasNormalizedReceivers && (
        <Collapsible
          open={Boolean(openSections.normalizedReceivers)}
          onOpenChange={() => toggle("normalizedReceivers")}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between text-left text-base font-semibold"
              >
                <span>
                  {texts.normalizedReceivers.title} (
                  {data.normalizedReceivers.length})
                </span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${
                    openSections.normalizedReceivers ? "rotate-180" : ""
                  }`}
                />
              </Button>
            }
          />
          <CollapsibleContent className="px-2">
            <div className="mt-4 space-y-3">
              <p>{texts.normalizedReceivers.p0}</p>
              <VirtualizedAggregatedEntityList
                items={data.normalizedReceivers}
                testId="transparency-receiver-list"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {hasNormalizedDonors && (
        <Collapsible
          open={Boolean(openSections.aggregatedDonors)}
          onOpenChange={() => toggle("aggregatedDonors")}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                data-testid="aggregated-donors-trigger"
                className="flex w-full items-center justify-between text-left text-base font-semibold"
              >
                <span>
                  {texts.aggregatedDonors.title} ({data.normalizedDonors.length}
                  )
                </span>
                <ChevronDownIcon
                  className={`size-4 transition-transform duration-200 ${
                    openSections.aggregatedDonors ? "rotate-180" : ""
                  }`}
                />
              </Button>
            }
          />
          <CollapsibleContent className="px-2">
            <div className="mt-4 space-y-3">
              <p>{texts.aggregatedDonors.p0}</p>
              <p>{texts.aggregatedDonors.p1}</p>
              <VirtualizedAggregatedEntityList
                items={data.normalizedDonors}
                testId="transparency-list"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function MethodologyAnonymisationSection() {
  const countryConfig = useRequiredCountryConfig();
  const tMethodology = useNextIntlTranslations("methodology");
  const { data } = useNormalized(countryConfig);

  const anonymisation = data?.anonymisation;
  const hasRecords = Boolean(
    anonymisation &&
    (anonymisation.anonymisedByRequestCount > 0 ||
      anonymisation.redactedUpstreamCount > 0),
  );

  if (!hasRecords || !anonymisation) {
    return null;
  }

  return (
    <ArticleSection title={tMethodology("sections.anonymisation")}>
      <div className="space-y-3">
        <p>{tMethodology("anonymisation.summary")}</p>
        {anonymisation.redactedUpstreamCount > 0 && (
          <p>
            {tMethodology("anonymisation.upstream", {
              count: anonymisation.redactedUpstreamCount,
            })}
          </p>
        )}
        {anonymisation.anonymisedByRequestCount > 0 && (
          <p>
            {tMethodology("anonymisation.by_request", {
              count: anonymisation.anonymisedByRequestCount,
            })}
          </p>
        )}
      </div>
    </ArticleSection>
  );
}

function NormalizedVariantsList({ variants }: { variants: string[] }) {
  const locale = useLocale();
  return (
    <p>
      <FormatAnd
        locale={locale}
        items={variants.map((variant, idx) => (
          <span key={idx}>{variant}</span>
        ))}
      />
    </p>
  );
}

function FilteredReceiversList({ data }: { data: UseNormalizedData }) {
  const locale = useLocale();
  return (
    <p>
      <FormatAnd
        locale={locale}
        items={data.filteredReceivers.map((name) => (
          <span key={name}>{name}</span>
        ))}
      />
    </p>
  );
}

function FilteredDonorsList({ data }: { data: UseNormalizedData }) {
  const locale = useLocale();
  return (
    <p>
      <FormatAnd
        locale={locale}
        items={data.filteredDonors.map((name) => (
          <span key={name}>{name}</span>
        ))}
      />
    </p>
  );
}

function VirtualizedAggregatedEntityList({
  items,
  testId,
}: {
  items: [string, string[]][];
  testId: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
    getItemKey: (index) => items[index][0],
    directDomUpdates: true,
    directDomUpdatesMode: "transform",
  });

  return (
    <div ref={parentRef} className="max-h-96 overflow-y-auto">
      <ul
        data-testid={testId}
        className="relative w-full"
        ref={rowVirtualizer.containerRef}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const [name, normalizedVariants] = items[virtualItem.index];

          return (
            <li
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full border-b border-zinc-200 py-2 last:border-b-0 dark:border-zinc-800"
            >
              <div className="font-semibold">{name}</div>
              <NormalizedVariantsList variants={normalizedVariants} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
