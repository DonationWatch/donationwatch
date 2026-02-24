"use client";

/* eslint-disable react/no-unknown-property */

import { formatCompactCountryCurrency } from "../../../src/utils/formatter";
import { ImageFooter } from "../components/image-footer";
import { ImagePageHeader } from "../components/image-years-header";
import { ThumbnailWrapper } from "../components/utils";
import { THUMBNAIL_SIZE } from "../utils";

import type { CountryConfig } from "../../../src/utils/countries";
import type { PartyYearsSums } from "../../../src/utils/loader/party-years-sums";
import type { ConstLocale } from "../../../src/utils/locales";
import type { CreateTranslator } from "../utils";

const YEARS_TO_DISPLAY = 5;
const X_AXIS_TICKS = 5;
const GRID_LEFT = 100;
const BAR_HEIGHT = 20;
const BAR_ROW_HEIGHT = 44;
const Y_AXIS_LABEL_WIDTH = 100;
const Y_AXIS_VALUE_WIDTH = 130;
const CHART_WIDTH = THUMBNAIL_SIZE.width - 20;
const CHART_CONTENT_WIDTH =
  CHART_WIDTH - Y_AXIS_LABEL_WIDTH - Y_AXIS_VALUE_WIDTH;

export const CountryPageImage = async (
  locale: ConstLocale,
  getTranslations: CreateTranslator,
  countryConfig: CountryConfig,
  partyYearSums: PartyYearsSums,
) => {
  let maxValue = 0;
  const t = getTranslations();

  const yearsToDisplay =
    countryConfig.years.length > YEARS_TO_DISPLAY
      ? countryConfig.years.slice(countryConfig.years.length - YEARS_TO_DISPLAY)
      : countryConfig.years;

  const yearSums = yearsToDisplay.toReversed().map<[string, number]>((year) => {
    const sum = Object.values(partyYearSums[year]).reduce((acc, curr) => {
      return acc + curr.sum;
    }, 0);
    maxValue = Math.max(maxValue, sum);
    return [year, sum];
  });

  maxValue = Math.ceil(maxValue);

  const perTick = maxValue / X_AXIS_TICKS;

  maxValue += perTick;

  const Chart = (
    <div tw="flex flex-col" style={{ width: `${CHART_WIDTH}px` }}>
      <div tw="grow flex flex-col relative">
        {new Array(X_AXIS_TICKS + 2).fill(0).map((_, i) => (
          <div
            tw="flex absolute top-0 bottom-0 bg-gray-400"
            key={i}
            style={{
              width: "1px",
              left: `${Y_AXIS_LABEL_WIDTH + i * (perTick / maxValue) * CHART_CONTENT_WIDTH}px`,
            }}
          ></div>
        ))}
        {yearSums.map(([year, sum]) => (
          <div
            tw="flex items-center"
            style={{ height: `${BAR_ROW_HEIGHT}px` }}
            key={year}
          >
            <div
              tw="flex justify-end pr-4 text-xl"
              style={{ width: `${Y_AXIS_LABEL_WIDTH}px` }}
            >
              {year}
            </div>
            <div tw="flex grow">
              <div
                tw="flex"
                style={{
                  width: `${(sum / maxValue) * CHART_CONTENT_WIDTH}px`,
                  height: `${BAR_HEIGHT}px`,
                  background: "#4338ca",
                }}
              ></div>
            </div>
            <div
              tw="flex text-lg pl-4"
              style={{ width: `${Y_AXIS_VALUE_WIDTH}px` }}
            >
              {formatCompactCountryCurrency(locale, sum, countryConfig)}
            </div>
          </div>
        ))}
      </div>
      <div tw="flex shrink-0">
        {/* x axis*/}
        <div tw="flex w-full justify-between text-neutral-600">
          {new Array(X_AXIS_TICKS + 1).fill(0).map((_, i) => (
            <div
              key={i}
              tw="absolute flex"
              style={{
                left: `${GRID_LEFT + i * (perTick / maxValue) * CHART_CONTENT_WIDTH}px`,
                transform: "rotate(45deg)",
                transformOrigin: "top left",
              }}
            >
              {formatCompactCountryCurrency(locale, perTick * i, countryConfig)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Label = (
    <div tw="flex shrink-0 flex-col py-2 pb-4">
      <div tw="flex text-xl font-semibold">
        {t("stacked_years.title")}{" "}
        {t("over_min_public_amount", {
          amount: formatCompactCountryCurrency(
            locale,
            countryConfig.minPublicDonationAmount,
            countryConfig,
          ),
        })}
      </div>
    </div>
  );

  return (
    <ThumbnailWrapper>
      <div tw="flex flex-col grow w-full relative">
        <ImagePageHeader
          getTranslations={getTranslations}
          locale={locale}
          country={countryConfig}
        >
          {Label}
        </ImagePageHeader>

        <div tw="flex py-4">{Chart}</div>
      </div>
      <ImageFooter
        getTranslations={getTranslations}
        country={countryConfig}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};
