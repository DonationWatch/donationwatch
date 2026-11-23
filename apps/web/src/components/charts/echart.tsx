"use client";

import type { EChartsOption, SetOptionOpts } from "echarts";
import type { EChartsType } from "echarts/core";
import type { EChartsExtensionInstaller } from "echarts/types/src/extension.js";
import type { JSX, Ref } from "react";

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

import { echartsEmptyLocale } from "@/components/charts/echart-empty-locale";
import Loading from "@/components/loading/loading";
import { useDarkColorScheme } from "@/hooks/use-media-query";

echarts.use([
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  TitleComponent,
]);

export type ChartFeature =
  | "map"
  | "pie"
  | "line"
  | "sankey"
  | "scatter"
  | "bar"
  | "treemap";

const featureImports: Record<
  ChartFeature,
  () => Promise<EChartsExtensionInstaller[]>
> = {
  bar: () => {
    return Promise.all([
      import("echarts/lib/component/graphic/install").then(
        (mod) => mod.install,
      ),
      import("echarts/lib/chart/line/install").then((mod) => mod.install),
      import("echarts/lib/chart/bar/install").then((mod) => mod.install),
      import("echarts/lib/component/marker/installMarkArea").then(
        (mod) => mod.install,
      ),
      import("echarts/lib/component/marker/installMarkLine").then(
        (mod) => mod.install,
      ),
      import("echarts/lib/component/dataZoom/install").then(
        (mod) => mod.install,
      ),
    ]);
  },
  pie: () => {
    return import("echarts/lib/chart/pie/install").then((mod) => [mod.install]);
  },
  treemap: () => {
    return import("echarts/lib/chart/treemap/install").then((mod) => [
      mod.install,
    ]);
  },
  map: () => {
    return Promise.all([]);
  },
  scatter: () => {
    return Promise.all([
      import("echarts/lib/chart/scatter/install").then((mod) => mod.install),
      import("echarts/lib/component/singleAxis/install").then(
        (mod) => mod.install,
      ),
    ]);
  },
  line: () => {
    return Promise.all([
      import("echarts/lib/chart/line/install").then((mod) => mod.install),
      import("echarts/lib/component/dataZoom/install").then(
        (mod) => mod.install,
      ),
      import("echarts/lib/component/marker/installMarkLine").then(
        (mod) => mod.install,
      ),
    ]);
  },
  sankey: () => {
    return Promise.all([
      import("echarts/lib/component/graphic/install").then(
        (mod) => mod.install,
      ),
      import("echarts/lib/chart/sankey/install").then((mod) => mod.install),
    ]);
  },
};

export interface ReactEChartsProps {
  option: EChartsOption;
  settings?: SetOptionOpts;
  theme?: "light" | "dark";
}

export type OnZrClickFn = (
  params: echarts.ElementEvent,
  chart: EChartsType | undefined,
) => void;
export type OnClickFn = (params: echarts.ECElementEvent) => void;

export interface EChartsPublicApi {
  resetZoom: () => void;
}

const loadedFeatures = new Set<ChartFeature>();
const featureLoadPromises = new Map<ChartFeature, Promise<void>>();
const registeredLocales = new Set<string>();

/** Preloads and registers an ECharts feature module once per session. */
export const preloadChartFeature = (feature: ChartFeature): Promise<void> => {
  if (loadedFeatures.has(feature)) return Promise.resolve();

  const inflight = featureLoadPromises.get(feature);
  if (inflight) return inflight;

  const promise = featureImports[feature]()
    .then((installFns) => {
      // @ts-expect-error - incorrect upstream types
      echarts.use(installFns);
      loadedFeatures.add(feature);
    })
    .finally(() => {
      featureLoadPromises.delete(feature);
    });

  featureLoadPromises.set(feature, promise);
  return promise;
};

// Populate echart time translations based on the locale
const registerLocale = (locale: string) => {
  if (registeredLocales.has(locale)) return;

  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(
      new Date(2021, i, 1),
    ),
  );
  const monthsAbbr = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "short" }).format(
      new Date(2021, i, 1),
    ),
  );
  const days = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
      new Date(2021, 5, 6 + i),
    ),
  );
  const daysAbbr = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2021, 5, 6 + i),
    ),
  );

  echarts.registerLocale(locale, {
    ...echartsEmptyLocale,
    time: {
      month: months,
      monthAbbr: monthsAbbr,
      dayOfWeek: days,
      dayOfWeekAbbr: daysAbbr,
    },
  });
  registeredLocales.add(locale);
};

export const ReactECharts = ({
  onZrClick,
  onClick,
  onZoom,
  feature = "pie",
  option,
  settings,
  theme,
  locale,
  ref,
}: ReactEChartsProps & {
  feature?: ChartFeature;
  onZrClick?: OnZrClickFn;
  onClick?: OnClickFn;
  onZoom?: () => void;
  locale?: string;
  ref?: Ref<EChartsPublicApi | undefined>;
}): JSX.Element => {
  const [loadedFeature, setLoadedFeature] = useState<ChartFeature | null>(() =>
    loadedFeatures.has(feature) ? feature : null,
  );
  const [chart, setChart] = useState<EChartsType | undefined>(undefined);
  const chartRef = useRef<HTMLDivElement>(null);
  const isDark = useDarkColorScheme();
  const resolvedTheme = theme ?? (isDark ? "dark" : "light");
  const loadingModules = loadedFeature !== feature;

  useImperativeHandle(
    ref,
    () => ({
      resetZoom: () => {
        if (!chart || chart.isDisposed()) return;
        chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: 100,
        });
      },
    }),
    [chart],
  );

  useEffect(() => {
    if (loadedFeatures.has(feature)) {
      setLoadedFeature(feature);
      return;
    }

    let cancelled = false;
    void preloadChartFeature(feature).then(() => {
      if (!cancelled) {
        setLoadedFeature(feature);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [feature]);

  useEffect(() => {
    // Initialize chart
    let instance: EChartsType | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const chartElement = chartRef.current;

    if (!loadingModules && chartElement !== null) {
      if (locale) {
        registerLocale(locale);
      }
      instance = echarts.init(chartElement, resolvedTheme, { locale });
      instance.setOption({
        animation: false,
      });
      setChart(instance);

      // Add ResizeObserver to sync chart size with container
      resizeObserver = new ResizeObserver(() => {
        instance?.resize();
      });
      resizeObserver.observe(chartElement);
    }

    // Add chart resize listener (for window resizes, optional)
    function resizeChart() {
      instance?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      window.removeEventListener("resize", resizeChart);
      if (resizeObserver && chartElement) {
        resizeObserver.unobserve(chartElement);
        resizeObserver.disconnect();
      }
      instance?.dispose();
      setChart(undefined);
    };
  }, [resolvedTheme, loadingModules, feature, locale]);

  useEffect(() => {
    if (!chart || chart.isDisposed()) return;

    const handleTreemapRender =
      onZoom && feature === "treemap" ? () => onZoom() : undefined;
    if (handleTreemapRender) {
      chart.on("treemapRender", handleTreemapRender);
    }

    const handleClick = onClick
      ? (event: echarts.ECElementEvent) => onClick(event)
      : undefined;
    if (handleClick) {
      chart.on("click", handleClick);
    }

    let handleZrClick: ((params: echarts.ElementEvent) => void) | undefined;
    let handleZrMouseMove: ((params: echarts.ElementEvent) => void) | undefined;
    let handleMouseOut: (() => void) | undefined;

    if (onZrClick) {
      handleZrClick = (params) => onZrClick(params, chart);
      handleZrMouseMove = (params) => {
        // @ts-expect-error - getModel is typed as private but we need it to get the grid component and check if the mouse is inside the grid.
        const grid = chart.getModel().getComponent("grid");

        const x = params.event?.zrX;
        const y = params.event?.zrY;

        if (!grid?.coordinateSystem?.containPoint([x, y])) return;

        chart.getZr().setCursorStyle("pointer");
      };
      handleMouseOut = () => {
        chart.getZr().setCursorStyle("default");
      };

      chart.getZr().on("click", handleZrClick);
      chart.getZr().on("mousemove", handleZrMouseMove);
      chart.on("mouseout", handleMouseOut);
    }

    return () => {
      if (chart.isDisposed()) return;

      if (handleTreemapRender) {
        chart.off("treemapRender", handleTreemapRender);
      }
      if (handleClick) {
        chart.off("click", handleClick);
      }
      if (handleZrClick) {
        chart.getZr().off("click", handleZrClick);
      }
      if (handleZrMouseMove) {
        chart.getZr().off("mousemove", handleZrMouseMove);
      }
      if (handleMouseOut) {
        chart.off("mouseout", handleMouseOut);
      }
    };
  }, [chart, feature, onZoom, onClick, onZrClick]);

  useEffect(() => {
    if (!chart || chart.isDisposed()) return;
    chart.setOption(option, settings);
  }, [chart, option, settings]);

  if (loadingModules)
    return (
      <div className="flex w-full grow items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div
      data-testid="chart"
      data-testid-feature={feature}
      className="h-full w-full first:*:overflow-hidden first:*:rounded"
      ref={chartRef}
    />
  );
};
