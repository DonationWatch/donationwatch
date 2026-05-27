import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

import { EnterpriseContactForm } from "@/app/[locale]/enterprise/_components/enterprise-contact-form";
import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import { Article } from "@/components/layout/article";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
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

  const tEnterprise = await getTranslations({
    locale,
    namespace: "enterprise",
  });

  return (
    <NonCountryRootLayout locale={locale}>
      <AbsoluteMultipleColorsGradient
        colors={[{ color: "#3730a3", width: 100 }]}
      />
      <Article fullWidth={true}>
        <div className="space-y-16 py-12 text-zinc-900 selection:bg-zinc-900 selection:text-white md:py-20 dark:text-zinc-100 dark:selection:bg-white dark:selection:text-black">
          {/* 1. Hero Section */}
          <section className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
            <h1 className="max-w-4xl font-sans text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 uppercase sm:text-5xl md:text-6xl dark:text-zinc-50">
              {tEnterprise("heading")}
            </h1>

            <p className="max-w-3xl font-sans leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              {tEnterprise("p0")}
            </p>
          </section>

          {/* 2. The "Intelligence Map" (2-Column Grid) */}
          <section className="mx-auto max-w-7xl border-t border-zinc-300 px-4 pt-16 md:px-8 dark:border-zinc-800">
            <div className="grid items-stretch gap-12 lg:grid-cols-2">
              {/* Left Column (The Terminal) */}
              <div className="flex flex-col">
                <div className="flex h-full w-full flex-col overflow-hidden rounded-none border border-zinc-800 bg-zinc-950">
                  {/* Terminal Content */}
                  <div className="flex-1 space-y-4 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-500 select-all md:p-6">
                    {/* Command Prompt */}
                    <div className="text-zinc-500">
                      <span>$ </span>
                      <span className="text-zinc-200">curl -X GET </span>
                      <span className="text-zinc-400">
                        &quot;https://api.donation.watch/v1/donations?donor=Harborne&quot;
                      </span>
                    </div>

                    {/* JSON Output */}
                    <div className="space-y-1 text-zinc-400">
                      <div>
                        <span className="text-zinc-500">&#123;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-zinc-500">&quot;data&quot;</span>:{" "}
                        <span className="text-zinc-500">[</span>
                        <div className="pl-4">
                          <span className="text-zinc-500">&#123;</span>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;id&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;d651c6c0-7f28-5a2a-bf30-4e38e8334460&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;date&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;2025-01-08&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;receiver&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;Reform UK&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;donation_type&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;monetary donation&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;donor&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;Christopher Harborne&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;amount&quot;
                            </span>
                            : <span className="text-emerald-500">9000000</span>,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;currency&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;GBP&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;upstream_id&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;C0833694&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;source_registry&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">
                              &quot;UK Electoral Commission&quot;
                            </span>
                            ,
                          </div>
                          <div className="pl-4">
                            <span className="text-zinc-500">
                              &quot;country&quot;
                            </span>
                            :{" "}
                            <span className="text-sky-400">&quot;GB&quot;</span>
                          </div>
                          <span className="text-zinc-500">&#125;</span>
                        </div>
                        <span className="text-zinc-500">]</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-zinc-500">&quot;meta&quot;</span>:{" "}
                        <span className="text-zinc-500">&#123;</span>
                        <div className="pl-4">
                          <span className="text-zinc-500">
                            &quot;total_records&quot;
                          </span>
                          : <span className="text-emerald-500">1</span>,
                        </div>
                        <div className="pl-4">
                          <span className="text-zinc-500">
                            &quot;limit&quot;
                          </span>
                          : <span className="text-emerald-500">50</span>,
                        </div>
                        <div className="pl-4">
                          <span className="text-zinc-500">
                            &quot;offset&quot;
                          </span>
                          : <span className="text-emerald-500">0</span>
                        </div>
                        <span className="text-zinc-500">&#125;</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">&#125;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Draft disclaimer */}
                <p className="mt-3 font-sans text-sm tracking-wide text-zinc-500 italic">
                  {tEnterprise("draft_schema")}
                </p>
              </div>

              {/* Right Column (Engine Specifications) */}
              <div className="flex flex-col justify-between space-y-6 py-2">
                <div>
                  <h3 className="mb-8 font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase">
                    {tEnterprise("engine_specs.title")}
                  </h3>

                  <div className="space-y-8">
                    {/* Feature 1 */}
                    <div className="border-b border-zinc-300 pb-6 dark:border-zinc-800">
                      <h4 className="mb-2 font-mono font-bold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
                        {tEnterprise("engine_specs.s0.title")}
                      </h4>
                      <p className="font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {tEnterprise("engine_specs.s0.description")}
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="border-b border-zinc-300 pb-6 dark:border-zinc-800">
                      <h4 className="mb-2 font-mono font-bold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
                        {tEnterprise("engine_specs.s1.title")}
                      </h4>
                      <p className="font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {tEnterprise("engine_specs.s1.description")}
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="pb-2">
                      <h4 className="mb-2 font-mono font-bold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
                        {tEnterprise("engine_specs.s2.title")}
                      </h4>
                      <p className="font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {tEnterprise("engine_specs.s2.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Social Proof Ticker */}
          <section className="w-full border-y border-zinc-300 bg-zinc-50/50 py-8 dark:border-zinc-800 dark:bg-zinc-950/20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono uppercase">
                <span className="font-bold tracking-widest text-zinc-900 uppercase select-none dark:text-zinc-100">
                  {tEnterprise("monitoring.title")}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-zinc-600 md:gap-x-4 dark:text-zinc-400">
                  <span className="uppercase">
                    {tEnterprise("monitoring.financial")}
                  </span>
                  <span
                    className="hidden text-zinc-500 md:inline dark:text-zinc-800"
                    aria-hidden="true"
                  >
                    |
                  </span>
                  <span className="uppercase">
                    {tEnterprise("monitoring.government")}
                  </span>
                  <span
                    className="hidden text-zinc-500 md:inline dark:text-zinc-800"
                    aria-hidden="true"
                  >
                    |
                  </span>
                  <span className="uppercase">
                    {tEnterprise("monitoring.universities")}
                  </span>
                  <span
                    className="hidden text-zinc-500 md:inline dark:text-zinc-800"
                    aria-hidden="true"
                  >
                    |
                  </span>
                  <span className="uppercase">
                    {tEnterprise("monitoring.universities")}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Private Beta Waitlist Section */}
          <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
            <div className="grid items-start gap-12 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-2">
                <h2 className="font-sans text-3xl leading-none font-extrabold tracking-tight text-zinc-900 uppercase sm:text-4xl dark:text-zinc-50">
                  {tEnterprise("register.title")}
                </h2>

                <p className="font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {tEnterprise("register.p0")}
                </p>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <div className="w-full rounded-none border border-zinc-300 bg-white p-6 shadow-none md:p-8 dark:border-zinc-800 dark:bg-zinc-950">
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
                </div>
              </div>
            </div>
          </section>
        </div>
      </Article>
    </NonCountryRootLayout>
  );
}
