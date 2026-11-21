"use client";

import type { Donation } from "@/utils/types";

import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

export const DonorDonationTable = ({
  donations,
}: {
  donations: Donation[];
}) => {
  const countryConfig = useRequiredCountryConfig();
  const t = useTranslations();
  const tCommon = useTranslations("common");

  if (!donations || donations.length === 0) {
    return null;
  }

  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  return (
    <ArticleSectionWrapper id={"sec-donor-donations-table"}>
      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          <DonationHistoryTable
            readonlyDonor={true}
            donations={donations}
            years={countryConfig.years}
            partiesIds={[]}
            title={t("changes.title")}
            description={t("donor.table", {
              donor: donorName,
            })}
            titleId={"sec-donor-donations-table"}
          />
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};
