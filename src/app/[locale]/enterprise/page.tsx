import type { Metadata } from "next";

import { Code2, Database, ShieldCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

import { EnterpriseContactForm } from "@/app/[locale]/enterprise/_components/enterprise-contact-form";
import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import {
  ArticleHeader,
  ArticleLead,
  ArticleSection,
  ArticleSectionTwoColumns,
  ArticleTitle,
  WideArticle,
} from "@/components/layout/article";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidLocale } from "@/utils/validate";

export async function generateMetadata(
  props: PageProps<"/[locale]/enterprise">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const tEnterprise = await getTranslations({
    locale: params.locale,
    namespace: "enterprise",
  });

  return {
    title: `${tEnterprise("title")} | DonationWatch`,
    description: `${tEnterprise("p0")} | DonationWatch`,
    alternates: generateAlternates("enterprise"),
  };
}

export default async function Page(props: PageProps<"/[locale]/enterprise">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const [tEnterprise, messages] = await Promise.all([
    getTranslations({ locale, namespace: "enterprise" }),
    getMessagesForLocale(locale),
  ]);

  const pageMessages = pick(messages, ["enterprise", "errors"]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      <NonCountryRootLayout locale={locale}>
        <AbsoluteMultipleColorsGradient
          colors={[{ color: "#3730a3", width: 100 }]}
        />
        <WideArticle>
          {/* 1. Hero Header */}
          <ArticleHeader>
            <ArticleTitle>{tEnterprise("heading")}</ArticleTitle>
            <ArticleLead>
              <p>{tEnterprise("p0")}</p>
            </ArticleLead>
          </ArticleHeader>

          {/* 2. API Preview & Engine Specifications */}
          <ArticleSection
            title={tEnterprise("engine_specs.title")}
            id="engine-specs"
          >
            <ArticleSectionTwoColumns className="mb-0 items-stretch">
              {/* Left Column (The Terminal) */}
              <div className="flex min-w-0 flex-col">
                <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-sm">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/70 px-4 py-2.5 font-mono text-xs text-zinc-300">
                    <span className="truncate">
                      GET /v1/donations?donor=Harborne
                    </span>
                    <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-400">
                      200 OK
                    </span>
                  </div>
                  {/* Terminal Content */}
                  <div
                    tabIndex={0}
                    className="flex-1 space-y-4 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-400 select-all md:p-6"
                  >
                    {/* Command Prompt */}
                    <div className="text-zinc-400">
                      <span>$ </span>
                      <span className="text-zinc-200">curl -X GET </span>
                      <span className="text-zinc-400">
                        &quot;https://api.donation.watch/v1/donations?donor=Harborne&quot;
                      </span>
                    </div>

                    {/* JSON Output */}
                    <div className="space-y-1 text-zinc-400">
                      <div>
                        <span className="text-zinc-400">&#123;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-zinc-400">&quot;data&quot;</span>:{" "}
                        <span className="text-zinc-400">[</span>
                        <div className="pl-4">
                          <span className="text-zinc-400">&#123;</span>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;id&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;d651c6c0-7f28-5a2a-bf30-4e38e8334460&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;date&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;2025-01-08&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;receiver&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;Reform UK&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;donation_type&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;monetary donation&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;donor&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;Christopher Harborne&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;amount&quot;
                            </span>
                            : <span className="text-emerald-500">9000000</span>,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;currency&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;GBP&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;upstream_id&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;C0833694&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;source_registry&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;UK Electoral Commission&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-400">
                              &quot;country&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">&quot;GB&quot;</span>
                          </div>
                          <span className="text-zinc-400">&#125;</span>
                        </div>
                        <span className="text-zinc-400">]</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-zinc-400">&quot;meta&quot;</span>:{" "}
                        <span className="text-zinc-400">&#123;</span>
                        <div className="pl-4">
                          <span className="text-zinc-400">
                            &quot;total_records&quot;
                          </span>
                          : <span className="text-emerald-500">1</span>,
                        </div>
                        <div className="pl-4">
                          <span className="text-zinc-400">
                            &quot;limit&quot;
                          </span>
                          : <span className="text-emerald-500">50</span>,
                        </div>
                        <div className="pl-4">
                          <span className="text-zinc-400">
                            &quot;offset&quot;
                          </span>
                          : <span className="text-emerald-500">0</span>
                        </div>
                        <span className="text-zinc-400">&#125;</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">&#125;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Draft disclaimer */}
                <p className="mt-3 text-sm">{tEnterprise("draft_schema")}</p>
              </div>

              {/* Right Column (Engine Specifications) */}
              <div className="flex min-w-0 flex-col justify-center space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <Database className="size-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {tEnterprise("engine_specs.s0.title")}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {tEnterprise("engine_specs.s0.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <Code2 className="size-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {tEnterprise("engine_specs.s1.title")}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {tEnterprise("engine_specs.s1.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {tEnterprise("engine_specs.s2.title")}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {tEnterprise("engine_specs.s2.description")}
                    </p>
                  </div>
                </div>
              </div>
            </ArticleSectionTwoColumns>
          </ArticleSection>

          {/* 3. Monitored By */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-zinc-200 py-6 dark:border-zinc-800">
            <span className="text-base font-semibold">
              {tEnterprise("monitoring.title")}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {tEnterprise("monitoring.financial")}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {tEnterprise("monitoring.government")}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {tEnterprise("monitoring.universities")}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {tEnterprise("monitoring.newsrooms")}
              </Badge>
            </div>
          </div>

          {/* 4. Private Beta Waitlist Section */}
          <ArticleSection
            title={tEnterprise("register.title")}
            id="enterprise-register"
          >
            <div className="grid items-start gap-8 lg:grid-cols-5 xl:gap-12">
              <div className="space-y-4 lg:col-span-2">
                <p className="leading-relaxed">{tEnterprise("register.p0")}</p>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <Card className="w-full p-6 md:p-8">
                  <EnterpriseContactForm
                    successTitle={tEnterprise("form.successTitle")}
                    successMessageTemplate={tEnterprise(
                      "form.successMessageTemplate",
                    )}
                    submitAnotherButton={tEnterprise(
                      "form.submitAnotherButton",
                    )}
                    formTitle={tEnterprise("form.formTitle")}
                    labelFullName={tEnterprise("form.labelFullName")}
                    labelWorkEmail={tEnterprise("form.labelWorkEmail")}
                    labelOrganization={tEnterprise("form.labelOrganization")}
                    labelQueryRequest={tEnterprise("form.labelQueryRequest")}
                    consentText={tEnterprise("form.consentText")}
                    buttonProcessing={tEnterprise("form.buttonProcessing")}
                    buttonSubmit={tEnterprise("form.buttonSubmit")}
                    errorFailedSubmit={tEnterprise("form.errorFailedSubmit")}
                    errorUnexpected={tEnterprise("form.errorUnexpected")}
                    turnstileLabel={tEnterprise("form.turnstileLabel")}
                  />
                </Card>
              </div>
            </div>
          </ArticleSection>
        </WideArticle>
      </NonCountryRootLayout>
    </ScopedClientIntlProvider>
  );
}
