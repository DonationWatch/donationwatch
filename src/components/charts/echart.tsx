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

import Loading from "@/components/loading/loading";

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
    return Promise.all([
      import("echarts/lib/chart/pie/install").then((mod) => mod.install),
    ]);
  },
  treemap: () => {
    return Promise.all([
      import("echarts/lib/chart/treemap/install").then((mod) => mod.install),
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

export const ReactECharts = ({
  onZrClick,
  onClick,
  onZoom,
  feature = "pie",
  option,
  settings,
  theme,
  ref,
}: ReactEChartsProps & {
  feature?: ChartFeature;
  onZrClick?: OnZrClickFn;
  onClick?: OnClickFn;
  onZoom?: () => void;
  ref?: Ref<EChartsPublicApi | undefined>;
}): JSX.Element => {
  const [loadingModules, setLoadingModules] = useState<boolean>(true);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType | undefined>(undefined);

  if (!theme) {
    theme =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }

  useImperativeHandle(
    ref,
    () => ({
      resetZoom: () => {
        chartInstance.current?.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: 100,
        });
      },
    }),
    [],
  );

  useEffect(() => {
    featureImports[feature]().then((installFns) => {
      // @ts-expect-error - incorrect upstream types
      echarts.use(installFns);

      setLoadingModules(false);
    });
  }, [feature]);

  useEffect(() => {
    // Initialize chart
    let chart: EChartsType | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const chartElement = chartRef.current;

    if (!loadingModules && chartElement !== null) {
      chart = echarts.init(chartElement, theme);
      chartInstance.current = chart;
      chart.setOption({
        animation: false,
      });

      if (onZoom) {
        if (feature === "treemap") {
          chart.on("treemapRender", () => {
            onZoom();
          });
        }
      }

      if (onClick) {
        chart.on("click", (event) => onClick(event));
      }
      if (onZrClick) {
        chart.getZr().on("click", (params) => onZrClick(params, chart));
        chart.getZr().on("mousemove", (params) => {
          // @ts-expect-error - getModel is typed as private but we need it to get the grid component and check if the mouse is inside the grid.
          const grid = chart!.getModel().getComponent("grid");

          const x = params.event?.zrX;
          const y = params.event?.zrY;

          if (!grid.coordinateSystem.containPoint([x, y])) return;

          chart!.getZr().setCursorStyle("pointer");
        });
        chart.on("mouseout", function () {
          chart!.getZr().setCursorStyle("default");
        });
      }

      // Add ResizeObserver to sync chart size with container
      resizeObserver = new ResizeObserver(() => {
        chart?.resize();
      });
      resizeObserver.observe(chartElement);
    }

    // Add chart resize listener (for window resizes, optional)
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      window.removeEventListener("resize", resizeChart);
      if (resizeObserver && chartElement) {
        resizeObserver.unobserve(chartElement);
        resizeObserver.disconnect();
      }
      chart?.dispose();
      chartInstance.current = undefined;
    };
  }, [theme, loadingModules, onZrClick, onZoom, onClick, feature]);

  useEffect(() => {
    // Update chart
    if (!loadingModules && chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      chart!.setOption(option, settings);
    }
  }, [option, settings, theme, loadingModules]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

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
