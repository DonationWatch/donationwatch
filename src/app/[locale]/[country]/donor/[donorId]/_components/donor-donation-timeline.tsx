"use client";

import type { Donation, ReceiverId } from "@/utils/types";

import { DonationStackedTimeseriesChart } from "@/components/charts/donation-sum-chart";
import {
  ArticleSectionColumn,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getCountryName } from "@/utils/countries";
import { donationYear, fillYears } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const DonorDonationTimeline = ({
  donations,
}: {
  donations: Donation[];
}) => {
  const countryConfig = useRequiredCountryConfig();
  const tCountries = useTranslations("countries");
  const tDonor = useTranslations("donor");
  const tCommon = useTranslations("common");
  const browserBasedLocale = useBrowserBasedLocale();
  const partiesMap = usePartiesMap();

  if (!donations || donations.length === 0) {
    return null;
  }

  const firstYear = donationYear(donations[0]);
  const lastYear = donationYear(donations[donations.length - 1]);
  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  const parties = new Set<ReceiverId>();
  const sumPerYear: Record<string, number> = {};

  let donationsHaveYearsOnly: boolean = true;
  let sum = 0;

  donations.forEach((donation) => {
    parties.add(donation[DonationField.Receiver]);

    sum += donation[DonationField.Amount];
    const year = donationYear(donation);
    sumPerYear[year] ??= 0;
    sumPerYear[year] += donation[DonationField.Amount];

    if (donation[DonationField.Date].length > 4) {
      donationsHaveYearsOnly = false;
    }
  });

  return (
    <ArticleSectionWrapper id={"sec-donor-timeseries"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-timeseries"}
            title={tDonor("timeline.title")}
          />

          <p className="mb-6">
            {tDonor("timeline.p0", {
              donor: donorName,
              year: firstYear,
            })}
          </p>
          <p className="mb-6">{tDonor("timeline.years")}</p>
          <ul className="mx-2 py-2 text-sm *:py-1">
            {Object.entries(sumPerYear).map(([year, yearSum]) => (
              <li key={year} className="">
                <div className="flex w-full items-center justify-between text-sm font-semibold">
                  <span>{year}</span>
                  <span className="tabular-nums">
                    <span>
                      {formatCountryCurrency(
                        browserBasedLocale,
                        yearSum,
                        countryConfig,
                      )}
                    </span>{" "}
                    <span
                      className={
                        "hidden w-14 text-right text-gray-500 lg:inline-block dark:text-gray-400"
                      }
                    >
                      ({formatPercentFormat(browserBasedLocale, yearSum / sum)})
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mb-6">{tDonor("timeline.p1")}</p>
        </ArticleSectionColumn>
        <ArticleSectionColumn>
          <div>
            <DonationStackedTimeseriesChart
              donations={donations}
              donationsHaveYearsOnly={donationsHaveYearsOnly}
              title={tDonor("timeline.title")}
              subtitle={tDonor("timeline.chart_subtitle", {
                country: getCountryName(countryConfig, tCountries),
                donor: donorName,
                minYear: firstYear,
              })}
              years={fillYears(firstYear, lastYear)}
              parties={[...parties].map((id) => partiesMap[id])}
            />
          </div>
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};
