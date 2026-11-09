"use client";
import { Expand, X, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import {
  type JSX,
  type PropsWithChildren,
  type RefObject,
  createContext,
  use,
  useCallback,
  useRef,
  useState,
} from "react";

import { PageLogo } from "@/components/layout/page-logo";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
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

import { Card } from "../ui/card";
import { DynamicEchart } from "./dynamic-echart";

const ExpandedChartDialog = dynamic(
  () =>
    import("./expanded-chart-dialog").then((mod) => mod.ExpandedChartDialog),
  { ssr: false },
);

export type ChartHeightMode = "fixed" | "screen";

export interface ChartCardState {
  isExpanded: boolean;
  isZoomed: boolean;
}

export interface ChartCardActions {
  setIsExpanded: (open: boolean) => void;
  toggleExpanded: () => void;
  handleZoom: () => void;
  resetZoom: () => void;
}

export interface ChartCardMeta {
  echartsRef: RefObject<EChartsPublicApi | undefined>;
  years: string[];
  title?: string;
}

export interface ChartCardContextValue {
  state: ChartCardState;
  actions: ChartCardActions;
  meta: ChartCardMeta;
}

const ChartCardContext = createContext<ChartCardContextValue | null>(null);

function useChartCardContext(): ChartCardContextValue {
  const ctx = use(ChartCardContext);
  if (!ctx) {
    throw new Error(
      "ChartCard subcomponents must be used within ChartCard.Provider",
    );
  }
  return ctx;
}

const ChartCardProvider = ({
  years,
  title,
  children,
}: PropsWithChildren<{
  years: string[];
  title?: string;
}>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const echartsRef = useRef<EChartsPublicApi>(undefined);

  const handleZoom = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const resetZoom = useCallback(() => {
    echartsRef.current?.resetZoom();
    setIsZoomed(false);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <ChartCardContext
      value={{
        state: { isExpanded, isZoomed },
        actions: { setIsExpanded, toggleExpanded, handleZoom, resetZoom },
        meta: { echartsRef, years, title },
      }}
    >
      {children}
    </ChartCardContext>
  );
};

const ChartCardFrame = ({ children }: PropsWithChildren) => {
  const {
    state: { isExpanded },
    actions: { setIsExpanded },
    meta: { title },
  } = useChartCardContext();

  if (isExpanded) {
    return (
      <ExpandedChartDialog
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        title={title}
      >
        {children}
      </ExpandedChartDialog>
    );
  }

  return (
    <Card
      padding="none"
      render={
        <section className="flex h-full w-full flex-col items-start justify-center" />
      }
    >
      <div className="h-full w-full p-0.5">{children}</div>
    </Card>
  );
};

const ChartCardHeader = ({
  title,
  subtitle,
  children,
}: PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>) => {
  if (!title && !subtitle && !children) return null;

  return (
    <header className="flex w-full shrink-0 p-4 pt-4 pb-2">
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
      <div className="flex shrink-0 items-start">{children}</div>
    </header>
  );
};

const ChartCardResetZoomTool = () => {
  const {
    state: { isZoomed },
    actions: { resetZoom },
  } = useChartCardContext();
  const tChart = useTranslations("chart");

  if (!isZoomed) return null;

  return (
    <button
      className="hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer p-2"
      onClick={resetZoom}
      title={tChart("reset_zoom")}
    >
      <ZoomOut size={18} />
    </button>
  );
};

const ChartCardExpandTool = () => {
  const {
    state: { isExpanded },
    actions: { toggleExpanded },
  } = useChartCardContext();
  const tChart = useTranslations("chart");
  const Icon = isExpanded ? X : Expand;

  return (
    <button
      className="hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer p-2"
      onClick={toggleExpanded}
      title={tChart("toggle_fullscreen")}
    >
      <Icon size={18} />
    </button>
  );
};

const ChartCardCanvas = ({
  height,
  heightMode = "fixed",
  feature,
  option,
  settings,
  theme,
  onZrClick,
  onClick,
}: ReactEChartsProps & {
  height: number;
  heightMode?: ChartHeightMode;
  feature?: ChartFeature;
  onZrClick?: OnZrClickFn;
  onClick?: OnClickFn;
}) => {
  const {
    actions: { handleZoom },
    meta: { echartsRef },
  } = useChartCardContext();
  const browserBasedLocale = useBrowserBasedLocale();

  return (
    <div
      style={{
        // 200px is approximation of header and footer text height
        height:
          heightMode === "screen"
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
        locale={browserBasedLocale}
        onZrClick={onZrClick}
        onClick={onClick}
        onZoom={handleZoom}
      />
    </div>
  );
};

const ChartCardFooter = () => {
  const {
    meta: { years },
  } = useChartCardContext();
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const tChart = useTranslations("chart");
  const browserBasedLocale = useBrowserBasedLocale();
  const {
    state: { isFiltered },
  } = useFilterEngine();

  const hasPreliminaryData =
    country.preliminaryDataSince !== undefined &&
    Boolean(years?.some((year) => year >= country.preliminaryDataSince!));

  return (
    <footer className="w-full shrink-0 items-center justify-between space-y-2 px-4 pt-2 pb-4 text-xs">
      <div className="opacity-80">
        {t("footer.build", {
          date: formatTwoDigitDate(
            browserBasedLocale,
            new Date(getBuild(country.id).t),
          ),
        })}
        <br />
        {[
          t("over_min_public_amount", {
            amount: formatCompactCountryCurrency(
              browserBasedLocale,
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
                  browserBasedLocale,
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
          isFiltered ? tChart("filtered") : undefined,
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
  );
};

export const ChartCard = {
  Provider: ChartCardProvider,
  Frame: ChartCardFrame,
  Header: ChartCardHeader,
  ResetZoomTool: ChartCardResetZoomTool,
  ExpandTool: ChartCardExpandTool,
  Canvas: ChartCardCanvas,
  Footer: ChartCardFooter,
};

type BaseChartVariantProps = ReactEChartsProps & {
  title?: string;
  height: number;
  subtitle?: string;
  feature?: ChartFeature;
  onZrClick?: OnZrClickFn;
  onClick?: OnClickFn;
  years: string[];
  heightMode?: ChartHeightMode;
};

export const ExpandableReactEchart = ({
  years,
  title,
  subtitle,
  feature,
  option,
  settings,
  theme,
  height,
  onZrClick,
  onClick,
  heightMode = "screen",
}: BaseChartVariantProps): JSX.Element => {
  return (
    <ChartCard.Provider years={years} title={title}>
      <ChartCard.Frame>
        <ChartCard.Header title={title} subtitle={subtitle}>
          {feature === "treemap" ? <ChartCard.ResetZoomTool /> : null}
          <ChartCard.ExpandTool />
        </ChartCard.Header>
        <ChartCard.Canvas
          height={height}
          heightMode={heightMode}
          feature={feature}
          option={option}
          settings={settings}
          theme={theme}
          onZrClick={onZrClick}
          onClick={onClick}
        />
        <ChartCard.Footer />
      </ChartCard.Frame>
    </ChartCard.Provider>
  );
};

export const StaticReactEchart = ({
  years,
  title,
  subtitle,
  feature,
  option,
  settings,
  theme,
  height,
  onZrClick,
  onClick,
  heightMode = "fixed",
}: BaseChartVariantProps): JSX.Element => {
  return (
    <ChartCard.Provider years={years} title={title}>
      <ChartCard.Frame>
        <ChartCard.Header title={title} subtitle={subtitle}>
          {feature === "treemap" ? <ChartCard.ResetZoomTool /> : null}
        </ChartCard.Header>
        <ChartCard.Canvas
          height={height}
          heightMode={heightMode}
          feature={feature}
          option={option}
          settings={settings}
          theme={theme}
          onZrClick={onZrClick}
          onClick={onClick}
        />
        <ChartCard.Footer />
      </ChartCard.Frame>
    </ChartCard.Provider>
  );
};

export const BareReactEchart = ({
  years,
  feature,
  option,
  settings,
  theme,
  height,
  onZrClick,
  onClick,
}: Omit<
  BaseChartVariantProps,
  "title" | "subtitle" | "heightMode"
>): JSX.Element => {
  return (
    <ChartCard.Provider years={years}>
      <ChartCard.Frame>
        <ChartCard.Canvas
          height={height}
          heightMode="fixed"
          feature={feature}
          option={option}
          settings={settings}
          theme={theme}
          onZrClick={onZrClick}
          onClick={onClick}
        />
      </ChartCard.Frame>
    </ChartCard.Provider>
  );
};
