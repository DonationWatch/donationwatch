"use client";

import { Play, Pause, RotateCcw, Download } from "lucide-react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import {
  formatCompactCurrency,
  formatTwoDigitDate,
} from "../../utils/formatter";
import { DonationField, type Donation, type Party } from "../../utils/types";
import { Button } from "../ui/button";

import type { ConstLocale } from "../../utils/locales";
import type { CountryConfig, Currency } from "@/utils/countries";
import type { BarSeriesOption, EChartsOption } from "echarts";

import { t } from "@/app/[locale]/translations";
import { ExpandableReactEchart } from "@/components/chart/expandable-react-echart";
import { useTranslations } from "@/hooks/use-translations";
import { formatPercentFormat } from "@/utils/formatter";

interface EChartsRacingBarsProps {
  donations: Donation[];
  years: string[];
  groupByField: DonationField.DonorName | DonationField.Receiver;
  locale: ConstLocale;
  currency: Currency;
  title: string;
  subtitle: string;
  partiesById: Record<string, Party>;
  countryConfig: CountryConfig;
  /** Total runtime of the animation in milliseconds (default: 10000ms = 10s) */
  totalRuntimeMs?: number;
}

const TOP_N_DONORS = 10;
const DEFAULT_TOTAL_RUNTIME_MS = 10_000; // 10 seconds
const PROGRESS_HEIGHT = 4;
const CHART_WIDTH = 1040; // 16:10
const CHART_HEIGHT = 650;
const backgroundColor = "#111827";

export const EChartsRacingBars = ({
  countryConfig,
  donations,
  years,
  groupByField,
  locale,
  currency,
  title,
  subtitle,
  partiesById,
  totalRuntimeMs = DEFAULT_TOTAL_RUNTIME_MS,
}: EChartsRacingBarsProps) => {
  const { translations } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const selectedMimeTypeRef = useRef<string>("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Process donations into date-based cumulative data
  const { sortedDates, cumulativeDataByDate, partyIds, firstDate } =
    useMemo(() => {
      const isGroupByDonor = groupByField === DonationField.DonorName;

      // dayDonations[date][groupName][partyId] = amount
      // groupName is either donor name (when grouping by donor) or party ID (when grouping by receiver)
      const dayDonations: Record<
        string,
        Record<string, Record<string, number>>
      > = {};
      const partySet = new Set<string>();

      donations.forEach((donation) => {
        const donorName = donation[DonationField.DonorName];
        const receiverId = donation[DonationField.Receiver];
        const date = donation[DonationField.Date];
        const amount = donation[DonationField.Amount];

        partySet.add(receiverId);

        // Group by donor: each bar is a donor, segments are parties they donated to
        // Group by receiver: each bar is a party, segments are donors who gave to them
        const groupName = isGroupByDonor ? donorName : receiverId;
        const segmentId = isGroupByDonor ? receiverId : donorName;

        dayDonations[date] ??= {};
        dayDonations[date][groupName] ??= {};
        dayDonations[date][groupName][segmentId] =
          (dayDonations[date][groupName][segmentId] || 0) + amount;
      });

      // Sort dates chronologically
      const dates = Object.keys(dayDonations).toSorted(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      );

      // Calculate cumulative data for each date
      const cumulative: Record<
        string,
        Record<string, Record<string, number>>
      > = {};
      const runningTotals: Record<string, Record<string, number>> = {};

      dates.forEach((date) => {
        const dailyData = dayDonations[date];

        Object.entries(dailyData).forEach(([groupName, segmentAmounts]) => {
          runningTotals[groupName] ??= {};

          Object.entries(segmentAmounts).forEach(([segmentId, amount]) => {
            runningTotals[groupName][segmentId] =
              (runningTotals[groupName][segmentId] || 0) + amount;
          });
        });

        // Deep copy the running totals for this date
        cumulative[date] = {};
        Object.entries(runningTotals).forEach(([groupName, segmentAmounts]) => {
          cumulative[date][groupName] = { ...segmentAmounts };
        });
      });

      // Sample dates if there are too many for the target duration
      // With 50ms minimum per frame, max frames = totalRuntimeMs / 50
      const maxFrames = Math.floor(totalRuntimeMs / 50);
      let finalDates = dates;

      if (dates.length > maxFrames) {
        // Sample evenly spaced dates, always including first and last
        const sampledDates: string[] = [];
        const step = (dates.length - 1) / (maxFrames - 1);

        for (let i = 0; i < maxFrames; i++) {
          const index = Math.round(i * step);
          sampledDates.push(dates[index]);
        }

        finalDates = sampledDates;
      }

      return {
        sortedDates: finalDates,
        cumulativeDataByDate: cumulative,
        partyIds: Array.from(partySet),
        firstDate: finalDates[0],
      };
    }, [donations, groupByField, totalRuntimeMs]);

  // Calculate frame interval based on total runtime
  const frameIntervalMs = useMemo(() => {
    if (sortedDates.length <= 1) return 100;
    // We start at index 0 (first frame shown immediately), then transition through remaining frames
    // So we need (length - 1) transitions to reach the last frame
    return Math.max(50, totalRuntimeMs / (sortedDates.length - 1)); // Minimum 50ms per frame
  }, [sortedDates.length, totalRuntimeMs]);

  // Animation duration should be shorter than frame interval to prevent overlaps
  // Using 70% allows smooth transitions while ensuring animations complete before next frame
  const animationDurationMs = useMemo(() => {
    return Math.max(35, frameIntervalMs * 0.7); // 70% of frame interval, minimum 35ms
  }, [frameIntervalMs]);

  // Calculate scale for fixed-resolution chart
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const containerWidth = parent.offsetWidth;
          const scale = containerWidth / CHART_WIDTH;
          parent.style.setProperty("--chart-scale", scale.toString());
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Get top N groups (donors or receivers) for a specific date
  const getTopGroupsForDate = useCallback(
    (
      dateIndex: number,
    ): {
      groupName: string;
      total: number;
      segmentAmounts: Record<string, number>;
    }[] => {
      if (dateIndex >= sortedDates.length) return [];

      const date = sortedDates[dateIndex];
      const data = cumulativeDataByDate[date] || {};

      const groupTotals = Object.entries(data).map(
        ([groupName, segmentAmounts]) => {
          const total = Object.values(segmentAmounts).reduce(
            (sum, amt) => sum + amt,
            0,
          );
          return { groupName, total, segmentAmounts };
        },
      );

      return groupTotals
        .toSorted(
          (a, b) => b.total - a.total || a.groupName.localeCompare(b.groupName),
        )
        .slice(0, TOP_N_DONORS);
    },
    [sortedDates, cumulativeDataByDate],
  );

  // Generate ECharts option for current date
  const chartOption = useMemo((): EChartsOption => {
    const isGroupByDonor = groupByField === DonationField.DonorName;

    // If currentDateIndex is -1, show empty chart (before animation starts)
    const topGroups =
      currentDateIndex >= 0 ? getTopGroupsForDate(currentDateIndex) : [];

    // Sort by total descending to ensure proper order
    const sortedGroups = [...topGroups].toSorted((a, b) => b.total - a.total);
    const groupNames = sortedGroups.map((g) => g.groupName);

    // When grouping by donor: series = parties (segments show party breakdown for each donor)
    // When grouping by receiver: show single bar per party in party color (no donor breakdown)
    const isGroupByReceiver = !isGroupByDonor;

    // Create series
    const series: BarSeriesOption[] = isGroupByReceiver
      ? // Single series when grouping by receiver - just show totals in party color
        [
          {
            name: "Total",
            silent: true,
            type: "bar" as const,
            barWidth: 30,
            barCategoryGap: "15%",
            data: groupNames.map((groupName) => {
              const group = sortedGroups.find((g) => g.groupName === groupName);
              return group?.total || 0;
            }),
            itemStyle: {
              // Use party color for each bar
              color: (params) => {
                const groupName = groupNames[params.dataIndex];
                return partiesById[groupName]?.color || "#cccccc";
              },
            },
            label: {
              show: true,
              position: "right" as const,
              offset: [10, 0],
              formatter: (params) => {
                const groupName = groupNames[params.dataIndex];
                const group = sortedGroups.find(
                  (g) => g.groupName === groupName,
                );
                const total = group?.total || 0;
                return formatCompactCurrency(locale, total, currency);
              },
              fontSize: 14,
              color: "#fff",
            },
            animationDuration: 0,
            animationDurationUpdate: animationDurationMs,
          },
        ]
      : // Multiple stacked series when grouping by donor - show party breakdown
        partyIds.map((partyId, index) => ({
          name: partyId,
          silent: true,
          type: "bar" as const,
          stack: "total",
          barWidth: 30,
          barCategoryGap: "15%",
          data: groupNames.map((groupName) => {
            const group = sortedGroups.find((g) => g.groupName === groupName);
            return group?.segmentAmounts[partyId] || 0;
          }),
          itemStyle: {
            color: partiesById[partyId]?.color || "#cccccc",
          },
          label: {
            // Show total on the last series (rightmost segment)
            show: index === partyIds.length - 1,
            position: "right" as const,
            offset: [10, 0],
            formatter: (params) => {
              const groupName = groupNames[params.dataIndex];
              const group = sortedGroups.find((g) => g.groupName === groupName);
              const total = group?.total || 0;
              return formatCompactCurrency(locale, total, currency);
            },
            fontSize: 14,
            color: "#fff",
          },
          realtimeSort: false,
          animationDuration: 0,
          animationDurationUpdate: animationDurationMs,
        }));

    const maxValue = Math.max(...sortedGroups.map((g) => g.total), 1);

    const currentDate =
      currentDateIndex >= 0 ? sortedDates[currentDateIndex] : null;
    const formattedCurrentDate = currentDate
      ? formatTwoDigitDate(locale, new Date(currentDate))
      : "";

    return {
      animation: true,
      animationDuration: 0,
      animationDurationUpdate: animationDurationMs,
      animationEasing: "linear",
      animationEasingUpdate: "cubicInOut",
      backgroundColor,
      graphic: [
        // Title
        {
          type: "text",
          silent: true,
          left: 20,
          top: 25,
          style: {
            text: title,
            font: "bold 24px sans-serif",
            fill: "#fff",
          },
        },
        // Subtitle
        {
          type: "text",
          silent: true,
          left: 20,
          top: 55,
          style: {
            text: subtitle,
            font: "400 16px sans-serif",
            fill: "rgba(255, 255, 255, 0.8)",
          },
        },
        // Current Date (Large display in top-right)
        {
          type: "text",
          silent: true,
          right: 20,
          top: 20,
          style: {
            text: formattedCurrentDate,
            font: "bold 24px monospace",
            fill: "#fff",
          },
        },
        // bottom progress bar background
        {
          type: "rect",
          silent: true,
          style: {
            fill: "#aaa",
          },
          shape: {
            width: 120,
            height: PROGRESS_HEIGHT,
          },
          right: 20,
          top: 48,
        },
        // bottom progress bar fill
        {
          type: "rect",
          silent: true,
          style: {
            fill: "#333",
          },
          shape: {
            width:
              120 -
              120 * (Math.max(0, currentDateIndex + 1) / sortedDates.length),
            height: PROGRESS_HEIGHT,
          },
          right: 20,
          top: 48,
        },
        // date range
        {
          type: "text",
          silent: true,
          style: {
            text: `${
              sortedDates[0]
                ? formatTwoDigitDate(locale, new Date(sortedDates[0]))
                : ""
            } - ${
              sortedDates[sortedDates.length - 1]
                ? formatTwoDigitDate(
                    locale,
                    new Date(sortedDates[sortedDates.length - 1]),
                  )
                : ""
            }`,
            font: "400 12px monospace",
            fill: "rgba(255, 255, 255, 0.7)",
          },
          right: 20,
          top: 60,
        },
        // Watermark
        {
          type: "text",
          silent: true,
          style: {
            text: "donation.watch",
            font: "500 64px sans-serif",
            fill: "#161f32",
          },
          left: "center",
          top: "middle",
          z: -1,
        },
        {
          type: "text",
          silent: true,
          style: {
            text: "donation.watch",
            font: "500 14px sans-serif",
            fill: "rgba(255, 255, 255, 0.4)",
          },
          left: 20,
          bottom: 20,
        },
      ],
      grid: {
        top: "100px",
        left: 300, // Match y-axis label width (260) + padding
        right: 80,
        bottom: "60px",
      },
      xAxis: {
        type: "value",
        max: maxValue,
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.08)",
            type: "dashed",
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        axisLabel: {
          formatter: (value: number) =>
            formatCompactCurrency(locale, value, currency),
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: 14,
        },
      },
      yAxis: {
        type: "category",
        data: isGroupByReceiver
          ? groupNames.map((partyId) => partiesById[partyId]?.short || partyId)
          : groupNames,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: TOP_N_DONORS - 1,
        axisLabel: {
          show: true,
          fontSize: 16,
          color: "#fff",
          align: "right",
          width: 260, // Fixed width for labels
          overflow: "truncate",
          ellipsis: "...",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series,
    };
  }, [
    currentDateIndex,
    getTopGroupsForDate,
    partyIds,
    partiesById,
    locale,
    currency,
    backgroundColor,
    title,
    subtitle,
    sortedDates,
    firstDate,
    groupByField,
  ]);

  // Reset animation when data changes (from/to/groupBy)
  useEffect(() => {
    setCurrentDateIndex(-1);
    setIsPlaying(false);
    setIsRecording(false);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  }, [donations, years, groupByField]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      animationIntervalRef.current = setInterval(() => {
        setCurrentDateIndex((prev) => {
          const next = prev + 1;
          if (next >= sortedDates.length) {
            setIsPlaying(false);
            return prev; // Stay at last frame
          }
          return next;
        });
      }, frameIntervalMs);
    } else {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isPlaying, sortedDates.length, frameIntervalMs]);

  const togglePlay = useCallback(() => {
    if (currentDateIndex >= sortedDates.length - 1) {
      // If at the end, restart
      setCurrentDateIndex(0);
      setIsPlaying(true);
    } else if (currentDateIndex === -1) {
      // If not started yet, start from beginning
      setCurrentDateIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentDateIndex, sortedDates.length]);

  const handleRestart = useCallback(() => {
    setCurrentDateIndex(-1);
    setIsPlaying(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!containerRef.current) return;

    // Find the canvas element within the chart
    const canvas = containerRef.current.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    setIsRecording(true);
    setRecordingProgress(0);
    recordedChunksRef.current = [];

    try {
      // Capture stream from canvas
      const stream = canvas.captureStream(30); // 30 FPS

      // Try to find a compatible codec
      const codecs = [
        // Best for cross-platform playback (Safari/iOS/Chrome/FF)
        "video/mp4;codecs=avc1,mp4a.40.2",
        // High quality, widely supported in Chrome/FF
        "video/webm;codecs=vp9",
        // Standard WebM fallback
        "video/webm;codecs=vp8",
        // Firefox specific H264 in WebM
        "video/webm;codecs=h264",
        // Generic MP4
        "video/mp4",
        // Generic WebM (Browser's choice)
        "video/webm",
      ];

      const supportedCodec = codecs.find((codec) =>
        MediaRecorder.isTypeSupported(codec),
      );

      if (!supportedCodec) {
        const errorMsg = "No compatible video codec found for recording";
        console.error(errorMsg);
        alert(errorMsg);
        setIsRecording(false);
        return;
      }

      // Store the selected mime type for later use
      selectedMimeTypeRef.current = supportedCodec;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedCodec,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Extract file extension from mime type (e.g., "video/webm" -> "webm")
        const mimeType = selectedMimeTypeRef.current;
        const extension = mimeType.split("/")[1]?.split(";")[0] || "webm";

        const blob = new Blob(recordedChunksRef.current, {
          type: mimeType,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bar-chart-race-donationwatch-${countryConfig.id}-${Date.now()}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);

        setIsRecording(false);
        setRecordingProgress(0);
        mediaRecorderRef.current = null;
      };

      mediaRecorder.start();

      // Restart animation and play through
      setCurrentDateIndex(0);
      setIsPlaying(true);

      // Track progress
      const startTime = Date.now();
      const totalDuration = sortedDates.length * frameIntervalMs;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        setRecordingProgress(progress);

        if (progress >= 1) {
          clearInterval(progressInterval);
          setTimeout(() => {
            mediaRecorder.stop();
            setIsPlaying(false);
          }, animationDurationMs + 500); // Wait for last animation to complete
        }
      }, 100);
    } catch (err) {
      console.error("Error recording video:", err);
      setIsRecording(false);
      setRecordingProgress(0);
    }
  }, [sortedDates.length, frameIntervalMs]);

  return (
    <div className="mx-0 my-auto flex w-full max-w-300 flex-col gap-4">
      {/* Outer container that enforces 16:10 aspect ratio */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          aspectRatio: "16 / 10",
        }}
      >
        {/* Inner container that scales down the full-resolution chart */}
        <div
          ref={containerRef}
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: `${CHART_WIDTH}px`,
            height: `${CHART_HEIGHT}px`,
            transform: "scale(var(--chart-scale))",
          }}
        >
          {/* Chart - Always renders at defined resolution */}
          <ExpandableReactEchart
            height={CHART_HEIGHT}
            maxHeightScreen={false}
            allowExpand={false}
            footer={false}
            country={countryConfig}
            years={years}
            feature="bar"
            option={chartOption}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            disabled={isRecording}
            title={
              isPlaying ? translations.actions.pause : translations.actions.play
            }
          >
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRestart}
            disabled={isRecording}
            title={translations.actions.restart}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <div>
          {isRecording ? (
            <span className="mr-4 tabular-nums">
              {t(translations.bar_chart_race.rendering, {
                percentage: formatPercentFormat(locale, recordingProgress),
              })}
            </span>
          ) : null}
          <Button
            onClick={handleDownload}
            disabled={isRecording}
            variant="default"
          >
            <Download />
            {translations.bar_chart_race.download_video}
          </Button>
        </div>
      </div>
    </div>
  );
};
