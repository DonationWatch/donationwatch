"use client";
import type { LucideIcon } from "lucide-react";

import { Expand, X, ZoomOut } from "lucide-react";
import { useLocale } from "next-intl";
import { type JSX, useCallback, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";

import { PageLogo } from "@/components/layout/page-logo";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { isNotNullandNotUndefined } from "@/utils/array";
import {
  formatCompactCountryCurrency,
  formatTwoDigitDate,
} from "@/utils/formatter";
import { getBuild } from "@/utils/loader/build";

import type {
  ChartFeature,
  EChartsPublicApi,
  OnClickFn,
  OnZrClickFn,
  ReactEChartsProps,
} from "./echart";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DynamicEchart } from "./dynamic-echart";

export const ExpandableReactEchart = ({
  years,
  country,
  title,
  subtitle,
  feature,
  option,
  settings,
  theme,
  height,
  allowExpand = false,
  onZrClick,
  onClick,
  maxHeightScreen = false,
  footer = true,
}: ReactEChartsProps & {
  country: CountryConfig;
  title?: string;
  height: number;
  subtitle?: string;
  feature?: ChartFeature;
  onZrClick?: OnZrClickFn;
  onClick?: OnClickFn;
  allowExpand?: boolean;
  years: string[];
  maxHeightScreen?: boolean;
  footer?: boolean;
}): JSX.Element => {
  const t = useTranslations();
  const tChart = useTranslations("chart");
  const locale = useLocale();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoom = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const echartsRef = useRef<EChartsPublicApi>(undefined);

  const tools: {
    title: string;
    icon: LucideIcon;
    onClick: () => void;
  }[] = [];

  if (feature === "treemap" && isZoomed) {
    tools.push({
      icon: ZoomOut,
      title: tChart("reset_zoom"),
      onClick: () => {
        echartsRef.current?.resetZoom();
        setIsZoomed(false);
      },
    });
  }

  if (allowExpand) {
    tools.push({
      title: tChart("toggle_fullscreen"),
      icon: isExpanded ? X : Expand,
      onClick: () => setIsExpanded(!isExpanded),
    });
  }

  const hasPreliminaryData =
    country.preliminaryDataSince !== undefined &&
    years.some((year) => year >= country.preliminaryDataSince!);

  const hasHeader = Boolean(title || subtitle || tools.length);

  const Chart = (
    <>
      {hasHeader ? (
        <header className="flex w-full shrink-0 px-4 pt-4 pb-2">
          {title || subtitle ? (
            <div className="grow space-y-2">
              {title ? (
                <div className="text-base/5 font-semibold">{title}</div>
              ) : null}
              {subtitle ? (
                <div className="text-sm opacity-80">{subtitle}</div>
              ) : null}
            </div>
          ) : null}
          <div className="flex shrink-0 items-start">
            {tools.map((tool) => (
              <button
                key={tool.title}
                className="hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer p-2"
                onClick={tool.onClick}
                title={tool.title}
              >
                <tool.icon size={18} />
              </button>
            ))}
          </div>
        </header>
      ) : null}
      <div
        style={{
          // 200px is approximation of header and footer text height
          height: maxHeightScreen
            ? `min(${height}px, calc(100vh - 60px - 200px))`
            : `${height}px`,
        }}
        className="flex w-full grow items-center justify-center"
      >
        <DynamicEchart
          ref={echartsRef}
          feature={feature}
          option={option}
          settings={settings}
          theme={theme}
          onZrClick={onZrClick}
          onClick={onClick}
          onZoom={handleZoom}
        />
      </div>
      {footer ? (
        <footer className="w-full shrink-0 items-center justify-between space-y-2 px-4 pt-2 pb-4 text-xs">
          <div className="opacity-80">
            {t("footer.build", {
              date: formatTwoDigitDate(
                locale,
                new Date(getBuild(country.id).t),
              ),
            })}
            <br />
            {[
              t("over_min_public_amount", {
                amount: formatCompactCountryCurrency(
                  locale,
                  country.minPublicDonationAmount,
                  country,
                ),
              }),
              country.knownPartyRequirements
                ? t("over_threshold", {
                    type:
                      country.knownPartyRequirements.count === -1
                        ? "sum"
                        : country.knownPartyRequirements.sum === -1
                          ? "count"
                          : "both",
                    count: country.knownPartyRequirements.count,
                    sum: formatCompactCountryCurrency(
                      locale,
                      Math.max(0, country.knownPartyRequirements.sum),
                      country,
                    ),
                  })
                : undefined,
              hasPreliminaryData
                ? t("prelim_data", {
                    year: country.preliminaryDataSince!,
                  })
                : undefined,
            ]
              .filter(isNotNullandNotUndefined)
              .join(", ")}
          </div>
          <div
            aria-hidden="true"
            className="text-primary-700 dark:text-primary-400 flex items-center"
          >
            <PageLogo size={18} className="mr-0.5" />
            donation.watch
          </div>
        </footer>
      ) : null}
    </>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={(open) => setIsExpanded(open)}>
        <DialogContent
          className="h-full max-h-[90vh] w-full p-0 lg:max-w-[90vw]"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex grow flex-col">{Chart}</div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <section className="flex h-full w-full flex-col items-start justify-center rounded bg-white dark:bg-gray-900">
        {Chart}
      </section>
    );
  }
};
