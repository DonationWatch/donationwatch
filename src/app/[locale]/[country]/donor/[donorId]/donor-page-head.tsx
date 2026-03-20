"use client";
import { HatGlasses, Info, Lock } from "lucide-react";
import { useLocale } from "next-intl";

import type { Countries, Country, CountryConfig } from "@/utils/countries";
import type { Donation, DonorMeta, ReceiverId } from "@/utils/types";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import { RelatedDonorChip } from "@/components/donors/related-donor-chip";
import { PageHeader } from "@/components/layout/page-header";
import Loading from "@/components/loading/loading";
import { MetaCard, MetaCardTitle } from "@/components/meta-card";
import { LastModifiedSchema } from "@/components/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WikiQuote } from "@/components/wiki-quote";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { partyColor } from "@/utils/color";
import { donationYear } from "@/utils/date";
import { getDonorName, isRedactedDonor } from "@/utils/donor";
import {
  formatAnd,
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "@/utils/formatter";
import { AddressField, DonationField, DonorType } from "@/utils/types";

export const DonorPageHead = ({
  donorId,
  countryConfig,
  donorMeta,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  country: Country;
  donorMeta: DonorMeta;
}) => {
  const t = useTranslations("data");
  const { data, isLoading, error } = useDonationsByDonorId(
    countryConfig,
    donorId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading heightClass="h-[284px]" />
      </div>
    );
  }

  if (error || !data) return t("error");

  if (!data || !data.length) {
    return null;
  }

  return (
    <DonorPageHeadContent
      countryConfig={countryConfig}
      donations={data}
      donorMeta={donorMeta}
    />
  );
};

const DonorTypeTooltip = ({ donorType }: { donorType: DonorType }) => {
  const t = useTranslations("donor.anonymized");

  if (donorType !== DonorType.AnonymizedDonor) return;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<div className="ml-2 cursor-help p-2" tabIndex={0} />}
      >
        <HatGlasses />
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-60 space-y-1.5 p-1">
          <h3 className="flex items-center gap-1.5 font-semibold">
            {t("title")}
          </h3>
          <p className="text-xs leading-relaxed opacity-90">
            {t("description")}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const RedactedDonorTooltip = () => {
  const t = useTranslations("donor.redacted");

  return (
    <Tooltip>
      <TooltipTrigger
        render={<div className="ml-2 cursor-help p-2" tabIndex={0} />}
      >
        <Lock />
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-60 space-y-1.5 p-1">
          <h3 className="flex items-center gap-1.5 font-semibold">
            {t("title")}
          </h3>
          <p className="text-xs leading-relaxed opacity-90">
            {t("description")}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const UBOsTooltip = () => {
  const t = useTranslations("donor");

  return (
    <Tooltip>
      <TooltipTrigger
        render={<div className="ml-1 inline-block cursor-help" tabIndex={0} />}
      >
        <Info size={16} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-80 p-1">
          <p className="text-xs leading-relaxed opacity-90">
            {t("ubo_description")}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const DonorPageHeadContent = ({
  countryConfig,
  donations,
  donorMeta,
}: {
  countryConfig: CountryConfig;
  donations: Donation[];
  donorMeta: DonorMeta;
}) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const wikiPageId = donorMeta.wiki;

  const rawDonorName = donations.at(0)?.[DonationField.DonorName] ?? "";
  const donorName = getDonorName(rawDonorName, tCommon);
  const donorType = donations.at(0)?.[DonationField.DonorType];

  let sum: number = 0;
  const sums: Record<string, number> = {};
  const firstYear = donationYear(donations[0]);
  const lastYear = donationYear(donations[donations.length - 1]);
  let lastDonation: string | undefined = undefined;
  const ubos = new Set<string>();

  donations.forEach((donation) => {
    sums[donation[DonationField.Receiver]] ??= 0;
    sums[donation[DonationField.Receiver]] += donation[DonationField.Amount];
    sum += donation[DonationField.Amount];

    if (!lastDonation || donation[DonationField.Date] > lastDonation) {
      lastDonation = donation[DonationField.Date];
    }

    donation[DonationField.UBOs]?.forEach((ubo) => ubos.add(ubo));
  });

  const avg = sum / donations.length;

  const sortedSums = (Object.entries(sums) as [ReceiverId, number][])
    .filter(([, data]) => data > 0)
    .toSorted(([, dataA], [, dataB]) => dataB - dataA);

  const addresses: { country: Countries; state?: string }[] = Object.entries(
    donations.reduce<Partial<Record<Countries, Record<string, boolean>>>>(
      (acc, donation) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        acc[donation[DonationField.Address][AddressField.Country]] ??= {};
        if (donation[DonationField.Address][AddressField.State]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[donation[DonationField.Address][AddressField.Country]]![
            donation[DonationField.Address][AddressField.State]
          ] = true;
        }
        return acc;
      },
      {},
    ),
  ).flatMap(([country, states]) => {
    const stateKeys = Object.keys(states);

    if (stateKeys.length === 0) return { country: country as Countries };

    return stateKeys.map((state) => ({ country: country as Countries, state }));
  });

  return (
    <>
      {lastDonation ? <LastModifiedSchema dateModified={lastDonation} /> : null}

      <AbsoluteMultipleColorsGradient
        colors={sortedSums.map(([party, data]) => ({
          color: partyColor(party, countryConfig),
          width: 100 * (data / sum),
        }))}
      />
      <PageHeader>
        <section aria-labelledby="hero-label">
          <h1 className="mb-4">
            <div className="mb-2 leading-none text-slate-500 dark:text-slate-300">
              {t("donor.title")}
            </div>
            <div
              className="flex items-center text-3xl sm:text-4xl"
              id="hero-label"
            >
              {donorName}
              {donorType ? <DonorTypeTooltip donorType={donorType} /> : null}
              {isRedactedDonor(rawDonorName) ? <RedactedDonorTooltip /> : null}
            </div>
          </h1>

          <div className="mb-3 flex flex-col space-y-3">
            {addresses.map((address, idx) => (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" key={idx}>
                <MetaCard
                  title={tCommon("country")}
                  value={t(`countries.${address.country}`)}
                />
                {address.state && address.state !== address.country && (
                  <MetaCard
                    title={tCommon("state")}
                    value={t.raw(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      `state.${countryConfig.id}.${address.state}`,
                    )}
                  />
                )}
              </div>
            ))}
            <div className="flex-row space-y-2 sm:flex sm:space-y-0 sm:space-x-10">
              <MetaCard
                title={t("donation_count")}
                value={formatNumber(locale, donations.length)}
              />
              <MetaCard
                title={t("sum")}
                value={formatCountryCurrency(locale, sum, countryConfig)}
              />
              {donations.length > 1 ? (
                <MetaCard
                  title={t("average")}
                  value={formatCountryCurrency(locale, avg, countryConfig)}
                />
              ) : null}
              <MetaCard
                title={t("donor.active_period")}
                value={formatYearsRange([firstYear, lastYear])}
              />
              {donorType && donorType !== DonorType.AnonymizedDonor ? (
                <MetaCard
                  title={t("donor.type")}
                  value={t(`donor_type.${donorType}`)}
                />
              ) : null}
            </div>
            {donorMeta.relations ? (
              <div>
                <MetaCardTitle title={t("related.donors")} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {donorMeta.relations.map(([name, kind, sums]) => (
                    <RelatedDonorChip
                      locale={locale}
                      key={name}
                      name={name}
                      kind={kind}
                      country={countryConfig}
                      sums={sums}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            {ubos.size > 0 ? (
              <section aria-labelledby="ubo-heading">
                <MetaCardTitle
                  id="ubo-heading"
                  title={
                    <>
                      {t("donor.ubo")}
                      <UBOsTooltip />
                    </>
                  }
                />
                <p className="mt-2">{formatAnd(locale, [...ubos])}</p>
              </section>
            ) : null}
          </div>
          <div className="mb-3">
            {wikiPageId && (
              <section aria-label={tCommon("summary")} className="pt-4 sm:px-4">
                <WikiQuote pageId={wikiPageId} country={countryConfig} />
              </section>
            )}
          </div>
        </section>
      </PageHeader>
    </>
  );
};
