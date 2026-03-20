"use client";
import {
  CalendarDays,
  ChartBarStacked,
  ChevronRight,
  FileSpreadsheet,
  Github,
  Globe,
  Info,
  Scale,
  Sparkles,
  UserRound,
  Vote,
} from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Country, CountryConfig } from "@/utils/countries";
import type { BigDonor } from "@/utils/loader/biggest-donors";

import { PartyDot } from "@/components/parties/party-dot";
import { SidenavSearchTrigger } from "@/components/search/sidenav-search-trigger";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarActiveMenuButton,
  SidebarActiveMenuSubButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  GITHUB_URL,
  SIDENAV_DONORS_VISIBLE,
  SIDENAV_PARTIES_VISIBLE,
  SIDENAV_YEARS_VISIBLE,
} from "@/utils/config";
import { COUNTRY_CONFIG, getCountryName } from "@/utils/countries";
import { countryFlags } from "@/utils/country-flags";

import { CountrySwitch } from "./country-switch";

export function AppSidebar({
  countryConfig,
  biggestDonors,
}: {
  countryConfig?: CountryConfig;
  biggestDonors?: BigDonor[];
}) {
  const [showAllParties, setShowAllParties] = useState(false);
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const tSearch = useTranslations("search");
  const tSidebar = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-15 flex-row items-center border-b px-4">
        <CountrySwitch />
      </SidebarHeader>
      <SidebarContent>
        {countryConfig ? (
          <>
            <SidebarGroup>
              <SidenavSearchTrigger />
              <SidebarGroupLabel>{tSidebar("donations")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible
                    defaultOpen={true}
                    render={<SidebarMenuItem className="group/collapsible" />}
                  >
                    <CollapsibleTrigger render={<SidebarMenuButton />}>
                      <CalendarDays />
                      <span>{tSearch("years")}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {countryConfig.years
                          .toReversed()
                          .slice(0, SIDENAV_YEARS_VISIBLE)
                          .map((year) => (
                            <SidebarMenuSubItem key={year}>
                              <SidebarActiveMenuSubButton
                                activeHref={`/${locale}/${countryConfig.id}/${year}`}
                                href={`/${locale}/${countryConfig.id}/${year}/overview`}
                              >
                                {year}
                              </SidebarActiveMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible
                    defaultOpen={true}
                    render={<SidebarMenuItem className="group/collapsible" />}
                  >
                    <CollapsibleTrigger render={<SidebarMenuButton />}>
                      <Vote />
                      <span>{tSearch("parties")}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {countryConfig.parties
                          .slice(
                            0,
                            showAllParties
                              ? undefined
                              : SIDENAV_PARTIES_VISIBLE,
                          )
                          .map((party) => (
                            <SidebarMenuSubItem key={party.id}>
                              <SidebarActiveMenuSubButton
                                activeHref={`/${locale}/${countryConfig.id}/party/${party.id}/`}
                                href={`/${locale}/${countryConfig.id}/party/${party.id}/donors`}
                              >
                                <PartyDot
                                  party={party.id}
                                  country={countryConfig}
                                  nameClassName={"truncate"}
                                />
                              </SidebarActiveMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        {!showAllParties &&
                          countryConfig.parties.length >
                            SIDENAV_PARTIES_VISIBLE && (
                            <SidebarMenuSubItem>
                              <SidebarMenuButton
                                onClick={() => setShowAllParties(true)}
                                className="hover:text-foreground cursor-pointer dark:text-gray-200"
                              >
                                <span className="text-xs">
                                  {tSidebar("show_all", {
                                    num: countryConfig.parties.length,
                                  })}
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          )}
                        {showAllParties &&
                          countryConfig.parties.length >
                            SIDENAV_PARTIES_VISIBLE && (
                            <SidebarMenuSubItem>
                              <SidebarMenuButton
                                onClick={() => setShowAllParties(false)}
                                className="hover:text-foreground cursor-pointer dark:text-gray-200"
                              >
                                <span className="text-xs">
                                  {tSidebar("show_less")}
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                  {biggestDonors ? (
                    <Collapsible
                      defaultOpen={true}
                      render={<SidebarMenuItem className="group/collapsible" />}
                    >
                      <CollapsibleTrigger render={<SidebarMenuButton />}>
                        <UserRound />
                        <span>{tSearch("donors")}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {biggestDonors
                            ?.slice(0, SIDENAV_DONORS_VISIBLE)
                            .map((donor) => (
                              <SidebarMenuSubItem key={donor.id}>
                                <SidebarActiveMenuSubButton
                                  activeHref={`/${locale}/${countryConfig.id}/donor/${donor.id}`}
                                  href={`/${locale}/${countryConfig.id}/donor/${donor.id}`}
                                  title={donor.name}
                                >
                                  <span className={"truncate"}>
                                    {donor.name}
                                  </span>
                                </SidebarActiveMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : null}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>{tSidebar("tools")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarActiveMenuButton
                    activeHref={`/${locale}/${countryConfig.id}/tools/data`}
                    href={`/${locale}/${countryConfig.id}/tools/data`}
                    asChild
                  >
                    <Link
                      prefetch={false}
                      href={`/${locale}/${countryConfig.id}/tools/data`}
                    >
                      <FileSpreadsheet />
                      <span>{t("navigation.export")}</span>
                    </Link>
                  </SidebarActiveMenuButton>
                </SidebarMenuItem>
                {countryConfig.hasDate ? (
                  <SidebarMenuItem>
                    <SidebarActiveMenuButton
                      activeHref={`/${locale}/${countryConfig.id}/tools/bar-chart-race`}
                      href={`/${locale}/${countryConfig.id}/tools/bar-chart-race`}
                      asChild
                    >
                      <Link
                        prefetch={false}
                        href={`/${locale}/${countryConfig.id}/tools/bar-chart-race`}
                      >
                        <ChartBarStacked />
                        <span>{t("navigation.bar_chart_race")}</span>
                      </Link>
                    </SidebarActiveMenuButton>
                  </SidebarMenuItem>
                ) : null}
                <SidebarMenuItem>
                  <SidebarActiveMenuButton
                    activeHref={`/${locale}/${countryConfig.id}/tools/compare`}
                    href={`/${locale}/${countryConfig.id}/tools/compare`}
                    asChild
                  >
                    <Link
                      prefetch={false}
                      href={`/${locale}/${countryConfig.id}/tools/compare`}
                    >
                      <Scale />
                      <span>{t("navigation.compare_parties")}</span>
                    </Link>
                  </SidebarActiveMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>{tSidebar("all_countries")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.entries(COUNTRY_CONFIG)
                  .map(([countryId, country]) => ({
                    countryId: countryId as Country,
                    name: getCountryName(country, tCountries),
                  }))
                  .toSorted((a, b) => a.name.localeCompare(b.name, locale))
                  .map(({ countryId, name }) => (
                    <SidebarMenuItem key={countryId}>
                      <SidebarActiveMenuButton
                        asChild
                        activeHref={`/${locale}/${countryId}`}
                        href={`/${locale}/${countryId}`}
                        className="flex items-center gap-2"
                      >
                        <Link prefetch={false} href={`/${locale}/${countryId}`}>
                          <div className="grow truncate">{name}</div>
                          <div className="flex w-8 shrink-0 justify-center">
                            <Image
                              height={16}
                              className="max-w-full rounded-xs"
                              src={countryFlags[countryId]}
                              alt=""
                            />
                          </div>
                        </Link>
                      </SidebarActiveMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <NavSecondary
          label={tSidebar("more")}
          className="mt-auto"
          items={[
            {
              href: `/${locale}/other-countries`,
              label: t("navigation.other_countries"),
              icon: Globe,
            },
            {
              href: `/${locale}/fun`,
              label: t("navigation.fun"),
              icon: Sparkles,
            },
            {
              href: `/${locale}/about`,
              label: t("navigation.about"),
              icon: Info,
            },
            {
              href: GITHUB_URL,
              label: "GitHub",
              target: "_blank",
              icon: Github,
            },
          ]}
        />
      </SidebarContent>
    </Sidebar>
  );
}

export function NavSecondary({
  items,
  label,
  ...props
}: {
  label?: string;
  items: {
    label: string;
    href: string;
    target?: string;
    icon?: React.ComponentType;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {items.map(({ href, label, target, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <SidebarActiveMenuButton activeHref={href} href={href} asChild>
              <Link target={target} prefetch={false} href={href}>
                {Icon && <Icon />}
                <span>{label}</span>
              </Link>
            </SidebarActiveMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
