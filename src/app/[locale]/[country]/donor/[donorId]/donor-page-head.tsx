"use client";
import {
  Briefcase,
  Building2,
  ExternalLink,
  Hash,
  HatGlasses,
  Info,
  Lock,
  MapPin,
} from "lucide-react";

import type { CountryConfig } from "@/types/country-config";
import type { DonorInterestAttribution } from "@/types/interests";
import type { Countries, Country } from "@/utils/countries";
import type { Donation, DonorMeta, ReceiverId } from "@/utils/types";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import { ExternalRegistryLink } from "@/components/donations/external-registry-link";
import { RelatedDonorChip } from "@/components/donors/related-donor-chip";
import { PageHeader } from "@/components/layout/page-header";
import Loading from "@/components/loading/loading";
import { MetaCard, MetaCardTitle } from "@/components/meta-card";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { LastModifiedSchema } from "@/components/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WikiQuote } from "@/components/wiki-quote";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import {
  AttributionRole,
  POLICY_INTEREST_TAG_METADATA,
  POLICY_MACRO_DOMAIN_SLUGS,
} from "@/types/interests";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { getDonorName, isRedactedDonor } from "@/utils/donor";
import { Features, hasFeature } from "@/utils/features";
import {
  formatAnd,
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "@/utils/formatter";
import { AddressField, DonationField, DonorType } from "@/utils/types";

export const DonorPageHead = ({
  donorId,
  donorMeta,
  initialDonations,
}: {
  donorId: string;
  country: Country;
  donorMeta: DonorMeta;
  initialDonations?: Donation[];
}) => {
  const countryConfig = useRequiredCountryConfig();
  const t = useTranslations("data");
  const { data, isLoading, error } = useDonationsByDonorId(
    countryConfig,
    donorId,
    initialDonations,
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

  return <DonorPageHeadContent donations={data} donorMeta={donorMeta} />;
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

interface DonorPageHeadSummaryProps {
  countryConfig: CountryConfig;
  addresses: { country: Countries; state?: string }[];
  donationCount: number;
  sum: number;
  avg: number;
  firstYear: string;
  lastYear: string;
  donorType?: DonorType;
  registrationNumber?: string;
  registrationDonorCountry?: Countries;
  donorMeta: DonorMeta;
  ubos: string[];
}

const useInterestLabels = () => {
  const tInterests = useTranslations("interests");
  const tPartyInterests = useTranslations("party.interests");

  return (attr: DonorInterestAttribution) => {
    const meta = POLICY_INTEREST_TAG_METADATA[attr.tag];
    const domainSlug = POLICY_MACRO_DOMAIN_SLUGS[meta.macroDomain];
    const isCore =
      attr.role === AttributionRole.core || String(attr.role) === "core";
    return {
      isCore,
      label: tInterests(
        `tags.${meta.slug}.label` as Parameters<typeof tInterests>[0],
      ),
      description: tInterests(
        `tags.${meta.slug}.description` as Parameters<typeof tInterests>[0],
      ),
      domainLabel: tInterests(
        `domains.${domainSlug}.label` as Parameters<typeof tInterests>[0],
      ),
      roleLabel: tPartyInterests(
        isCore ? "chart.tooltip_direct_business" : "chart.tooltip_multisector",
      ),
    };
  };
};

const sortByRole = (interests: DonorInterestAttribution[]) =>
  [...interests].sort((a, b) => {
    const aCore =
      a.role === AttributionRole.core || String(a.role) === "core" ? 0 : 1;
    const bCore =
      b.role === AttributionRole.core || String(b.role) === "core" ? 0 : 1;
    return aCore - bCore;
  });

const useLocationText = (
  countryConfig: CountryConfig,
  addresses: { country: Countries; state?: string }[],
) => {
  const t = useTranslations();
  return addresses
    .map((a) => {
      const c = t(`countries.${a.country}`);
      if (a.state && a.state !== a.country) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return `${t.raw(`state.${countryConfig.id}.${a.state}`)}, ${c}`;
      }
      return c;
    })
    .join(" · ");
};

const RegistryLink = ({
  country,
  registrationNumber,
  title,
}: {
  country: Countries;
  registrationNumber: string;
  title: string;
}) => (
  <ExternalRegistryLink
    country={country}
    registrationNumber={registrationNumber}
    className="group inline-flex items-center gap-1 tabular-nums hover:underline"
    title={title}
  >
    <span>{registrationNumber}</span>
    <ExternalLink
      className="inline shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
      size={13}
    />
  </ExternalRegistryLink>
);

const IconValueStrip = ({
  countryConfig,
  addresses,
  donorType,
  registrationNumber,
  registrationDonorCountry,
  donorMeta,
}: Pick<
  DonorPageHeadSummaryProps,
  | "countryConfig"
  | "addresses"
  | "donorType"
  | "registrationNumber"
  | "registrationDonorCountry"
  | "donorMeta"
>) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const locationText = useLocationText(countryConfig, addresses);
  const getLabels = useInterestLabels();
  const showDonorType = donorType && donorType !== DonorType.AnonymizedDonor;
  const sortedInterests = donorMeta.interests
    ? sortByRole(donorMeta.interests)
    : [];

  if (
    !showDonorType &&
    !locationText &&
    !(registrationNumber && registrationDonorCountry) &&
    sortedInterests.length === 0
  ) {
    return null;
  }

  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
      {showDonorType && (
        <div className="inline-flex items-center gap-1.5">
          <dt className="inline-flex items-center" title={t("donor.type")}>
            <Building2
              className="size-4 shrink-0 text-zinc-500 dark:text-zinc-300"
              aria-hidden="true"
            />
            <span className="sr-only">{t("donor.type")}</span>
          </dt>
          <dd>{t(`donor_type.${donorType}`)}</dd>
        </div>
      )}
      {locationText && (
        <div className="inline-flex items-center gap-1.5">
          <dt className="inline-flex items-center" title={tCommon("country")}>
            <MapPin
              className="size-4 shrink-0 text-zinc-500 dark:text-zinc-300"
              aria-hidden="true"
            />
            <span className="sr-only">{tCommon("country")}</span>
          </dt>
          <dd>{locationText}</dd>
        </div>
      )}
      {registrationNumber && registrationDonorCountry && (
        <div className="inline-flex items-center gap-1.5">
          <dt
            className="inline-flex items-center"
            title={t("donor.registration_number")}
          >
            <Hash
              className="size-4 shrink-0 text-zinc-500 dark:text-zinc-300"
              aria-hidden="true"
            />
            <span className="sr-only">{t("donor.registration_number")}</span>
          </dt>
          <dd>
            <RegistryLink
              country={registrationDonorCountry}
              registrationNumber={registrationNumber}
              title={tCommon("view_source")}
            />
          </dd>
        </div>
      )}
      {sortedInterests.length > 0 && (
        <div className="inline-flex flex-wrap items-center gap-1.5">
          <dt
            className="inline-flex items-center"
            title={t("party.interests.title")}
          >
            <Briefcase
              className="size-4 shrink-0 text-zinc-500 dark:text-zinc-300"
              aria-hidden="true"
            />
            <span className="sr-only">{t("party.interests.title")}</span>
          </dt>
          <dd className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {sortedInterests.map((attr, idx) => {
              const info = getLabels(attr);
              return (
                <span
                  key={attr.tag}
                  className="inline-flex items-center gap-1.5"
                >
                  {idx > 0 && (
                    <>
                      <span className="sr-only">, </span>
                      <span
                        className="text-zinc-500 dark:text-zinc-300"
                        aria-hidden="true"
                      >
                        /
                      </span>
                    </>
                  )}
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span
                          tabIndex={0}
                          className={
                            info.isCore
                              ? "cursor-default font-medium"
                              : "cursor-default"
                          }
                        />
                      }
                    >
                      {info.label}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-64 space-y-0.5 p-0.5 text-xs">
                        <div className="font-semibold">
                          {info.domainLabel} · {info.roleLabel}
                        </div>
                        <div className="opacity-85">{info.description}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </span>
              );
            })}
          </dd>
        </div>
      )}
    </dl>
  );
};

const DonorPageHeadSummary = (props: DonorPageHeadSummaryProps) => {
  const t = useTranslations();
  const locale = useBrowserBasedLocale();

  return (
    <div className="mb-3 space-y-3">
      <div className="flex flex-wrap gap-x-10 gap-y-2">
        <MetaCard
          title={t("donation_count")}
          value={formatNumber(locale, props.donationCount)}
        />
        <MetaCard
          title={t("sum")}
          value={formatCountryCurrency(locale, props.sum, props.countryConfig)}
        />
        {props.donationCount > 1 && (
          <MetaCard
            title={t("average")}
            value={formatCountryCurrency(
              locale,
              props.avg,
              props.countryConfig,
            )}
          />
        )}
        <MetaCard
          title={t("donor.active_period")}
          value={formatYearsRange([props.firstYear, props.lastYear])}
        />
      </div>

      <IconValueStrip
        countryConfig={props.countryConfig}
        addresses={props.addresses}
        donorType={props.donorType}
        registrationNumber={props.registrationNumber}
        registrationDonorCountry={props.registrationDonorCountry}
        donorMeta={props.donorMeta}
      />

      {(props.donorMeta.relations?.length || props.ubos.length > 0) && (
        <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
          {props.donorMeta.relations && (
            <div>
              <MetaCardTitle title={t("related.donors")} />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {props.donorMeta.relations.map(([name, kind, sums]) => (
                  <RelatedDonorChip
                    key={name}
                    name={name}
                    kind={kind}
                    sums={sums}
                  />
                ))}
              </div>
            </div>
          )}
          {props.ubos.length > 0 && (
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
              <p className="mt-1 text-sm">{formatAnd(locale, props.ubos)}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

const DonorPageHeadContent = ({
  donations,
  donorMeta,
}: {
  donations: Donation[];
  donorMeta: DonorMeta;
}) => {
  const countryConfig = useRequiredCountryConfig();
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const {
    state: { isFiltered, filteredDonations },
  } = useFilterEngine();
  const partiesMap = usePartiesMap();

  const wikiPageId = donorMeta.wiki;
  const activeDonations =
    isFiltered || filteredDonations.length > 0 ? filteredDonations : donations;

  const rawDonorName = donations.at(0)?.[DonationField.DonorName] ?? "";
  const donorName = getDonorName(rawDonorName, tCommon);
  const donorType = donations.at(0)?.[DonationField.DonorType];
  const registrationDonation = hasFeature(
    countryConfig,
    Features.DonorRegistrationNumber,
  )
    ? donations.find(
        (donation) => donation[DonationField.DonorRegistrationNumber],
      )
    : undefined;
  const registrationNumber =
    registrationDonation?.[DonationField.DonorRegistrationNumber];
  const registrationDonorCountry =
    registrationDonation?.[DonationField.Address]?.[AddressField.Country];

  let sum: number = 0;
  const sums: Record<string, number> = {};
  const firstYear = donationYear(activeDonations[0] ?? donations[0]);
  const lastYear = donationYear(
    activeDonations[activeDonations.length - 1] ??
      donations[donations.length - 1],
  );
  let lastDonation: string | undefined = undefined;
  const ubos = new Set<string>();

  activeDonations.forEach((donation) => {
    sums[donation[DonationField.Receiver]] ??= 0;
    sums[donation[DonationField.Receiver]] += donation[DonationField.Amount];
    sum += donation[DonationField.Amount];

    if (!lastDonation || donation[DonationField.Date] > lastDonation) {
      lastDonation = donation[DonationField.Date];
    }

    donation[DonationField.UBOs]?.forEach((ubo) => ubos.add(ubo));
  });

  const avg = activeDonations.length > 0 ? sum / activeDonations.length : 0;

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
          color: partiesMap[party][PartyField.Color],
          width: 100 * (data / sum),
        }))}
      />
      <PageHeader>
        <section aria-labelledby="hero-label">
          <h1 className="mb-4">
            <div className="mb-2 leading-none text-zinc-500 dark:text-zinc-300">
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

          <DonorPageHeadSummary
            countryConfig={countryConfig}
            addresses={addresses}
            donationCount={activeDonations.length}
            sum={sum}
            avg={avg}
            firstYear={firstYear}
            lastYear={lastYear}
            donorType={donorType}
            registrationNumber={registrationNumber}
            registrationDonorCountry={registrationDonorCountry}
            donorMeta={donorMeta}
            ubos={[...ubos]}
          />

          <div className="mb-3">
            {wikiPageId && (
              <section aria-label={tCommon("summary")} className="pt-4 sm:px-4">
                <WikiQuote pageId={wikiPageId} />
              </section>
            )}
          </div>
        </section>
      </PageHeader>
    </>
  );
};
