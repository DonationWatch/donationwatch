import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  MethodologyAnonymisationSection,
  MethodologyCollapsibles,
} from "@/app/[locale]/[country]/methodology/methodology-collapsibles";
import {
  FormattedCountryCurrency,
  FormattedNumber,
} from "@/components/browser-based-formatter";
import { FormatAnd } from "@/components/formatter";
import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { Article, ArticleSection } from "@/components/layout/article";
import { Translation } from "@/components/translation";
import {
  ALL_POLICY_INTEREST_TAGS,
  ALL_POLICY_MACRO_DOMAINS,
  POLICY_INTEREST_TAG_METADATA,
  POLICY_MACRO_DOMAIN_COLORS,
  POLICY_MACRO_DOMAIN_SLUGS,
} from "@/types/interests";
import { PartyStatField } from "@/types/party-stats";
import { CONTACT_MAIL, DATA_LICENSE, GITHUB_URL } from "@/utils/config";
import { COUNTRIES, getCountryName } from "@/utils/countries";
import { COUNTRY_CONFIG } from "@/utils/country-config";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { formatDate, formatYearsRange } from "@/utils/formatter";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { getCountryCategorizedDonors } from "@/utils/interests/categorized-donors";
import { getBuild } from "@/utils/loader/build";
import { getParties } from "@/utils/loader/parties";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...COUNTRIES].flatMap((country) =>
    LOCALES.map((locale) => ({ locale, country })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/methodology">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const tMethodology = await getTranslations({
    locale: params.locale,
    namespace: "methodology",
  });
  const tCountries = await getTranslations({
    locale: params.locale,
    namespace: "countries",
  });
  const countryConfig = await getCountryConfig(country);
  const localizedCountryName = getCountryName(countryConfig, tCountries);

  return {
    title: `${tMethodology("title")} - ${localizedCountryName}`,
    description: tMethodology("intro", { country: localizedCountryName }),
    alternates: generateAlternates(`${country}/methodology`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/methodology">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country, locale } = params;

  const [
    tMethodology,
    tTransparency,
    tHome,
    tCountries,
    tDonationType,
    tDonorType,
    tInterests,
    countryConfig,
    parties,
    partySums,
    messages,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "methodology" }),
    getTranslations({ locale, namespace: "transparency" }),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "donation_type" }),
    getTranslations({ locale, namespace: "donor_type" }),
    getTranslations({ locale, namespace: "interests" }),
    getCountryConfig(country),
    getParties(country),
    getPartyYearsSums(country),
    getMessagesForLocale(locale),
  ]);

  const staticConfig = COUNTRY_CONFIG[country];
  const countryName = getCountryName(countryConfig, tCountries);
  const buildMeta = getBuild(countryConfig.id);

  const updateCadence =
    countryConfig.updateCadence ?? staticConfig.updateCadence;
  const knownPartyRequirements =
    countryConfig.knownPartyRequirements ?? staticConfig.knownPartyRequirements;

  // Compute compiled dataset totals across all years and parties
  let totalDonationSum = 0;
  let totalDonationCount = 0;
  for (const yearStats of Object.values(partySums)) {
    for (const stat of Object.values(yearStats)) {
      totalDonationSum += stat[PartyStatField.Sum];
      totalDonationCount += stat[PartyStatField.Count];
    }
  }

  const yearsRange = formatYearsRange(countryConfig.years);
  const formattedBuildDate = formatDate(locale, new Date(buildMeta.t));
  const formattedLatestTransaction = countryConfig.lastDonationDate
    ? countryConfig.lastDonationDate.length > 4
      ? formatDate(locale, new Date(countryConfig.lastDonationDate))
      : countryConfig.lastDonationDate
    : null;

  const categorizedDonors = await getCountryCategorizedDonors(countryConfig.id);

  const hasIndividualDonors = hasFeature(countryConfig, Features.Donors);
  const hasExactDates = hasFeature(countryConfig, Features.Date);
  const hasOrigin = hasFeature(countryConfig, Features.Origin);
  const hasExternalTransactionIds = hasFeature(
    countryConfig,
    Features.ExternalDonationIds,
  );
  const hasCompanyRegistrationIds = hasFeature(
    countryConfig,
    Features.DonorRegistrationNumber,
  );

  const partyThresholdType = knownPartyRequirements
    ? knownPartyRequirements.count === -1
      ? "sum"
      : knownPartyRequirements.sum === -1
        ? "count"
        : "both"
    : null;

  const includedDonationTypeItems =
    hasFeature(countryConfig, Features.DonationType) &&
    countryConfig.usedDonationTypes?.length
      ? countryConfig.usedDonationTypes.map((type) => (
          <span key={type}>{tDonationType(`${type}`)}</span>
        ))
      : null;

  const classifiedDonorTypes =
    hasFeature(countryConfig, Features.DonorType) &&
    countryConfig.usedDonorTypes?.length
      ? countryConfig.usedDonorTypes
          .map((type) => tDonorType(`${type}`))
          .join(", ")
      : null;

  const externalIdsSummary =
    hasExternalTransactionIds && hasCompanyRegistrationIds
      ? tMethodology("profile.external_ids_both")
      : hasExternalTransactionIds
        ? tMethodology("profile.external_ids_transaction")
        : hasCompanyRegistrationIds
          ? tMethodology("profile.external_ids_company")
          : tMethodology("profile.external_ids_none");

  const loaderGithubUrl = `${GITHUB_URL}/tree/main/tasks/load-data/${countryConfig.code.toLowerCase()}`;
  const exportPageHref = `/${locale}/${countryConfig.id}/tools/data`;

  // Check for country-specific detailed source override in home.what.source.<country>
  const hasCountrySourceOverride = tHome.has(`what.source.${country}`);
  const countrySourceOverride = hasCountrySourceOverride
    ? tHome(`what.source.${country}`)
    : null;

  const pageMessages = pick(messages, [
    "transparency",
    "countries",
    "data",
    "methodology",
    "interests",
    "party",
  ]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      <Article
        title={tMethodology("title")}
        subtitle={<p>{tMethodology("intro", { country: countryName })}</p>}
      >
        {/* Dataset Profile Summary Card */}
        <ArticleSection title={tMethodology("sections.profile")}>
          <dl className="grid gap-x-8 gap-y-4 rounded-lg border border-neutral-200 bg-neutral-50/60 p-5 text-sm sm:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.source")}
              </dt>
              <dd className="mt-0.5">
                <a
                  href={countryConfig.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                >
                  {countryConfig.source.name}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.coverage")}
              </dt>
              <dd className="mt-0.5">
                {countryConfig.preliminaryDataSince
                  ? tMethodology("profile.coverage_preliminary", {
                      range: yearsRange,
                      preliminarySince: countryConfig.preliminaryDataSince,
                    })
                  : yearsRange}
              </dd>
            </div>

            {totalDonationCount > 0 && (
              <div>
                <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                  {tMethodology("profile.volume")}
                </dt>
                <dd className="mt-0.5">
                  <Translation
                    t={tMethodology}
                    translationId="profile.volume_value"
                    variables={{
                      count: <FormattedNumber value={totalDonationCount} />,
                      sum: (
                        <FormattedCountryCurrency value={totalDonationSum} />
                      ),
                      parties: <FormattedNumber value={parties.length} />,
                    }}
                  />
                </dd>
              </div>
            )}

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.cadence")}
              </dt>
              <dd className="mt-0.5">
                {tMethodology("profile.cadence_value", {
                  cadence: updateCadence ?? "default",
                })}
              </dd>
            </div>

            {formattedLatestTransaction && (
              <div>
                <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                  {tMethodology("profile.latest_transaction")}
                </dt>
                <dd className="mt-0.5">{formattedLatestTransaction}</dd>
              </div>
            )}

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.last_processed")}
              </dt>
              <dd className="mt-0.5">{formattedBuildDate}</dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.donation_threshold")}
              </dt>
              <dd className="mt-0.5">
                {countryConfig.minPublicDonationAmount > 1 ? (
                  <>
                    &ge;{" "}
                    <FormattedCountryCurrency
                      value={countryConfig.minPublicDonationAmount}
                    />
                  </>
                ) : (
                  tMethodology("profile.donation_threshold_all")
                )}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.party_threshold")}
              </dt>
              <dd className="mt-0.5">
                {knownPartyRequirements && partyThresholdType ? (
                  <Translation
                    t={tMethodology}
                    translationId="profile.party_threshold_value"
                    variables={{
                      type: partyThresholdType,
                      count: (
                        <FormattedNumber value={knownPartyRequirements.count} />
                      ),
                      sum: (
                        <FormattedCountryCurrency
                          value={Math.max(0, knownPartyRequirements.sum)}
                        />
                      ),
                    }}
                  />
                ) : (
                  tMethodology("profile.party_threshold_all")
                )}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.granularity")}
              </dt>
              <dd className="mt-0.5">
                {hasIndividualDonors
                  ? tMethodology("profile.granularity_individual")
                  : tMethodology("profile.granularity_aggregate")}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.temporal_resolution")}
              </dt>
              <dd className="mt-0.5">
                {hasExactDates
                  ? tMethodology("profile.resolution_date")
                  : tMethodology("profile.resolution_year")}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.origin_coverage")}
              </dt>
              <dd className="mt-0.5">
                {hasOrigin
                  ? tMethodology("profile.origin_yes")
                  : tMethodology("profile.origin_no")}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.external_ids")}
              </dt>
              <dd className="mt-0.5">{externalIdsSummary}</dd>
            </div>

            {includedDonationTypeItems && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                  {tMethodology("profile.donation_types")}
                </dt>
                <dd className="mt-0.5">
                  <FormatAnd
                    locale={locale}
                    items={includedDonationTypeItems}
                  />
                </dd>
              </div>
            )}

            {classifiedDonorTypes && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                  {tMethodology("profile.donor_types")}
                </dt>
                <dd className="mt-0.5">{classifiedDonorTypes}</dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="font-semibold text-neutral-600 dark:text-neutral-400">
                {tMethodology("profile.access")}
              </dt>
              <dd className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  href={exportPageHref}
                  prefetch={false}
                  className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                >
                  {tMethodology("profile.export_link")}
                </Link>
                <a
                  href={loaderGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                >
                  {tMethodology("profile.pipeline_link")}
                </a>
              </dd>
            </div>
          </dl>
        </ArticleSection>

        {/* Section 1: Data Source & Scope */}
        <ArticleSection title={tMethodology("sections.source")}>
          <div className="space-y-4">
            {countrySourceOverride ? (
              countrySourceOverride
                .split("\n\n")
                .map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              <p>
                {tMethodology("source.default", {
                  country: countryName,
                  source: countryConfig.source.name,
                })}
              </p>
            )}
            {!hasIndividualDonors && (
              <p>
                {tHome("what.no_donors", {
                  country: countryName,
                })}
              </p>
            )}
            <p className="mt-2">
              <a
                href={countryConfig.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
              >
                {tMethodology("source.link")} ({countryConfig.source.name})
              </a>
            </p>
          </div>
        </ArticleSection>

        {/* Section 2: Coverage & Thresholds */}
        <ArticleSection title={tMethodology("sections.coverage")}>
          <div className="space-y-3">
            <p>
              {tMethodology("coverage.default", {
                minYear: countryConfig.minYear,
              })}
            </p>
            {countryConfig.preliminaryDataSince && (
              <p>
                {tMethodology("coverage.preliminary", {
                  preliminarySince: countryConfig.preliminaryDataSince,
                })}
              </p>
            )}
            {countryConfig.minPublicDonationAmount > 1 ? (
              <>
                <p>
                  <Translation
                    t={tMethodology}
                    translationId="threshold.default"
                    variables={{
                      amount: (
                        <FormattedCountryCurrency
                          value={countryConfig.minPublicDonationAmount}
                        />
                      ),
                    }}
                  />
                </p>
                <p>{tMethodology("threshold.note")}</p>
              </>
            ) : (
              <p>{tMethodology("threshold.all")}</p>
            )}
            {knownPartyRequirements && partyThresholdType ? (
              <p>
                <Translation
                  t={tMethodology}
                  translationId="threshold.party"
                  variables={{
                    type: partyThresholdType,
                    count: (
                      <FormattedNumber value={knownPartyRequirements.count} />
                    ),
                    sum: (
                      <FormattedCountryCurrency
                        value={Math.max(0, knownPartyRequirements.sum)}
                      />
                    ),
                  }}
                />
              </p>
            ) : (
              <p>{tMethodology("threshold.party_all")}</p>
            )}
            {hasIndividualDonors && (
              <p>{tMethodology("threshold.net_positive")}</p>
            )}
          </div>
        </ArticleSection>

        {/* Section 3: Update Cadence */}
        <ArticleSection title={tMethodology("sections.cadence")}>
          <p>
            {updateCadence
              ? tMethodology(`cadence.${updateCadence}`)
              : tMethodology("cadence.default")}
          </p>
        </ArticleSection>

        {/* Section 4: Processing & Normalization (with Collapsibles) */}
        <ArticleSection title={tMethodology("sections.processing")}>
          <div className="space-y-4">
            <p>{tMethodology("processing.summary")}</p>
            <ul className="list-inside list-disc space-y-2">
              <li>{tMethodology("processing.step_cleaning")}</li>
              {hasIndividualDonors && (
                <li>{tMethodology("processing.step_clustering")}</li>
              )}
              <li>{tMethodology("processing.step_receivers")}</li>
            </ul>
            {hasIndividualDonors && (
              <p>{tMethodology("processing.donor_identity")}</p>
            )}

            <MethodologyCollapsibles
              texts={{
                filteredReceivers: {
                  title: tTransparency("section.filtered_receivers"),
                  p0: tTransparency("filtered_receivers.p0"),
                  p1: tTransparency("filtered_receivers.p1"),
                },
                filteredDonors: {
                  title: tTransparency("section.filtered_donors"),
                  p0: tTransparency("filtered_donors.p0"),
                  p1: tTransparency("filtered_donors.p1"),
                },
                normalizedReceivers: {
                  title: tTransparency("receivers.title"),
                  p0: tTransparency("receivers.p0", {
                    country: countryName,
                  }),
                },
                aggregatedDonors: {
                  title: tTransparency("section.aggregated"),
                  p0: tTransparency("p0"),
                  p1: tTransparency("p1"),
                },
                categorizedDonors: {
                  title: tTransparency.has("section.categorized")
                    ? tTransparency("section.categorized")
                    : "Categorized Donors & Lobby Interests",
                  p0: tTransparency.has("categorized.p0")
                    ? tTransparency("categorized.p0")
                    : "To measure industry influence and lobbying exposure, donors are mapped to a standardized 24-tag international policy interest taxonomy grouped into 6 Macro-Domains. Attribution distinguishes between Direct Industry operators (primary commercial revenue or sole lobbying mandate in the sector) and Peak Bodies & Umbrella Groups (multi-sector industry associations, conglomerates, or diversified groups).",
                  p1: tTransparency.has("categorized.p1")
                    ? tTransparency("categorized.p1")
                    : "Below is the registry of categorized donors along with their assigned policy interest tags and attribution roles.",
                },
              }}
              categorizedDonors={categorizedDonors}
            />
          </div>
        </ArticleSection>

        {categorizedDonors.length > 0 && (
          <ArticleSection
            id="sec-policy-domains"
            title={tMethodology("policy_domains.title")}
          >
            <div className="space-y-3">
              <p>
                {tMethodology("policy_domains.intro", {
                  country: countryName,
                })}
              </p>
              <p>
                {tMethodology.rich("policy_domains.disclaimer", {
                  email: CONTACT_MAIL,
                  github: (chunks) => (
                    <a
                      href={`${GITHUB_URL}/issues/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {chunks}
                    </a>
                  ),
                  emailLink: (chunks) => (
                    <a href={`mailto:${CONTACT_MAIL}`} className="underline">
                      {chunks}
                    </a>
                  ),
                })}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {ALL_POLICY_MACRO_DOMAINS.map((domain) => {
                  const domainSlug = POLICY_MACRO_DOMAIN_SLUGS[domain];
                  const tags = ALL_POLICY_INTEREST_TAGS.filter(
                    (tag) =>
                      POLICY_INTEREST_TAG_METADATA[tag].macroDomain === domain,
                  );

                  return (
                    <div
                      key={domain}
                      className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: POLICY_MACRO_DOMAIN_COLORS[domain],
                          }}
                          aria-hidden="true"
                        />
                        <span>
                          {tInterests(
                            `domains.${domainSlug}.label` as Parameters<
                              typeof tInterests
                            >[0],
                          )}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        {tags.map((tag) => {
                          const meta = POLICY_INTEREST_TAG_METADATA[tag];
                          return (
                            <li key={tag} className="flex items-start gap-2">
                              <span
                                className="mt-1.5 size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: meta.color }}
                                aria-hidden="true"
                              />
                              <div>
                                <div className="font-medium">
                                  {tInterests(
                                    `tags.${meta.slug}.label` as Parameters<
                                      typeof tInterests
                                    >[0],
                                  )}
                                </div>
                                <div>
                                  {tInterests(
                                    `tags.${meta.slug}.description` as Parameters<
                                      typeof tInterests
                                    >[0],
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </ArticleSection>
        )}

        {/* Section 5: Anonymisation & Redactions (omitted if none) */}
        <MethodologyAnonymisationSection />

        {/* Section 6: Licence & Provenance */}
        <ArticleSection title={tMethodology("sections.licence")}>
          <div className="space-y-3">
            <p>
              {tMethodology("licence.output", {
                licence: DATA_LICENSE,
              })}
            </p>
            <p>
              <Translation
                t={tMethodology}
                translationId="licence.export_prompt"
                variables={{
                  country: countryName,
                  exportLink: (
                    <Link
                      href={exportPageHref}
                      prefetch={false}
                      className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                    >
                      {tMethodology("profile.export_link")}
                    </Link>
                  ),
                  pipelineLink: (
                    <a
                      href={loaderGithubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                    >
                      {tMethodology("profile.pipeline_link")}
                    </a>
                  ),
                }}
              />
            </p>
          </div>
        </ArticleSection>

        {/* Section 7: Data Version & Timestamps */}
        <ArticleSection title={tMethodology("sections.version")}>
          <div className="space-y-2">
            <p>
              {tMethodology("version.last_updated", {
                date: formattedBuildDate,
              })}
            </p>
            {formattedLatestTransaction && (
              <p>
                {tMethodology("version.latest_donation", {
                  date: formattedLatestTransaction,
                })}
              </p>
            )}
            <p>{tMethodology("version.explanation")}</p>
          </div>
        </ArticleSection>

        {/* Section 8: Disclaimer */}
        <ArticleSection title={tMethodology("sections.disclaimer")}>
          <p>{tMethodology("disclaimer.text")}</p>
        </ArticleSection>
      </Article>
    </ScopedClientIntlProvider>
  );
}
