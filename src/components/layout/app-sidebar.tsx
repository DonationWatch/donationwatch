"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";

import { Github } from "@/components/icons/Github";
import { createLucideSpriteIcon } from "@/components/icons/lucide-sprite-icon";
import { PartyDot } from "@/components/parties/party-dot";
import {
  useOptionalCountryConfig,
  useParties,
} from "@/components/providers/country-provider";
import { SidenavSearchTrigger } from "@/components/search/sidenav-search-trigger";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import {
  GITHUB_URL,
  SIDENAV_PARTIES_VISIBLE,
  SIDENAV_YEARS_VISIBLE,
} from "@/utils/config";
import { COUNTRY_CONFIG, getCountryName } from "@/utils/countries";
import { countryFlags } from "@/utils/country-flags";
import { Features, hasFeature } from "@/utils/features";

import { CountrySwitch } from "./country-switch";

const CalendarDays = createLucideSpriteIcon("calendar-days");
const ChartBarStacked = createLucideSpriteIcon("chart-bar-stacked");
const ChevronRight = createLucideSpriteIcon("chevron-right");
const FileSpreadsheet = createLucideSpriteIcon("file-spreadsheet");
const Globe = createLucideSpriteIcon("globe");
const Info = createLucideSpriteIcon("info");
const Scale = createLucideSpriteIcon("scale");
const Server = createLucideSpriteIcon("server");
const Sparkles = createLucideSpriteIcon("sparkles");
const Vote = createLucideSpriteIcon("vote");

export function SidebarActiveMenuButton({
  children,
  activeHref,
  activeClass,
  href,
  render,
  asChild,
  ...props
}: {
  href: string;
  activeHref?: string;
  activeClass?: string;
  asChild?: boolean;
} & React.ComponentProps<typeof SidebarMenuButton>) {
  const pathname = usePathname();
  const isActive = activeHref
    ? pathname.startsWith(activeHref)
    : pathname.startsWith(href);

  let effectiveRender = render;
  let effectiveChildren = children;

  if (asChild && React.isValidElement(children)) {
    effectiveRender = children;
    effectiveChildren = (
      children as React.ReactElement<{ children?: React.ReactNode }>
    ).props.children;
  } else if (!effectiveRender && href) {
    effectiveRender = <Link prefetch={false} href={href} />;
  }

  return (
    <SidebarMenuButton isActive={isActive} render={effectiveRender} {...props}>
      {effectiveChildren}
    </SidebarMenuButton>
  );
}

export function SidebarActiveMenuSubButton({
  children,
  activeHref,
  activeClass,
  href,
  render,
  asChild,
  ...props
}: {
  href: string;
  activeHref?: string;
  activeClass?: string;
  asChild?: boolean;
} & React.ComponentProps<typeof SidebarMenuSubButton>) {
  const pathname = usePathname();
  const isActive = activeHref
    ? pathname.startsWith(activeHref)
    : pathname.startsWith(href);

  let effectiveRender = render;
  let effectiveChildren = children;

  if (asChild && React.isValidElement(children)) {
    effectiveRender = children;
    effectiveChildren = (
      children as React.ReactElement<{ children?: React.ReactNode }>
    ).props.children;
  } else if (!effectiveRender && href) {
    effectiveRender = <Link prefetch={false} href={href} />;
  }

  return (
    <SidebarMenuSubButton
      isActive={isActive}
      render={effectiveRender}
      {...props}
    >
      {effectiveChildren}
    </SidebarMenuSubButton>
  );
}

function CountryConfigSidebarContent({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) {
  const t = useTranslations();
  const tSidebar = useTranslations("sidebar");
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const parties = useParties();
  const [showAllParties, setShowAllParties] = useState(false);

  return (
    <>
      <SidebarGroup>
        <SidenavSearchTrigger />
        <SidebarGroupLabel>{tSidebar("donations")}</SidebarGroupLabel>
        <SidebarGroupContent className="text-sm">
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
                  {parties
                    .slice(
                      0,
                      showAllParties ? undefined : SIDENAV_PARTIES_VISIBLE,
                    )
                    .map((party) => (
                      <SidebarMenuSubItem key={party[PartyField.Id]}>
                        <SidebarActiveMenuSubButton
                          activeHref={`/${locale}/${countryConfig.id}/party/${party[PartyField.Id]}/`}
                          href={`/${locale}/${countryConfig.id}/party/${party[PartyField.Id]}/donors`}
                        >
                          <PartyDot
                            party={party[PartyField.Id]}
                            nameClassName={"truncate"}
                          />
                        </SidebarActiveMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  {!showAllParties &&
                    parties.length > SIDENAV_PARTIES_VISIBLE && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          onClick={() => setShowAllParties(true)}
                          className="hover:text-foreground cursor-pointer dark:text-gray-200"
                        >
                          <span className="text-xs">
                            {tSidebar("show_all", {
                              num: parties.length,
                            })}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    )}
                  {showAllParties &&
                    parties.length > SIDENAV_PARTIES_VISIBLE && (
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
            >
              <FileSpreadsheet />
              <span>{t("navigation.export")}</span>
            </SidebarActiveMenuButton>
          </SidebarMenuItem>
          {hasFeature(countryConfig, Features.Date) ? (
            <SidebarMenuItem>
              <SidebarActiveMenuButton
                activeHref={`/${locale}/${countryConfig.id}/tools/bar-chart-race`}
                href={`/${locale}/${countryConfig.id}/tools/bar-chart-race`}
              >
                <ChartBarStacked />
                <span>{t("navigation.bar_chart_race")}</span>
              </SidebarActiveMenuButton>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SidebarActiveMenuButton
              activeHref={`/${locale}/${countryConfig.id}/tools/compare`}
              href={`/${locale}/${countryConfig.id}/tools/compare`}
            >
              <Scale />
              <span>{t("navigation.compare_parties")}</span>
            </SidebarActiveMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

export function AppSidebar() {
  const countryConfig = useOptionalCountryConfig();
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const tSidebar = useTranslations("sidebar");
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.classList.remove("sidebar-collapsed");
  }, []);

  return (
    <Sidebar
      variant="inset"
      className="border-r-0"
      role="complementary"
      aria-label={tSidebar("sidebar")}
    >
      <SidebarHeader className="border-sidebar-border h-15 flex-row items-center border-b px-4">
        <CountrySwitch />
      </SidebarHeader>
      <SidebarContent>
        {countryConfig ? (
          <CountryConfigSidebarContent countryConfig={countryConfig} />
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
                        activeHref={`/${locale}/${countryId}`}
                        href={`/${locale}/${countryId}`}
                        className="flex items-center gap-2"
                      >
                        <div className="grow truncate">{name}</div>
                        <div className="flex w-8 shrink-0 justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="h-4 max-w-full rounded-xs"
                            src={countryFlags[countryId]}
                            alt=""
                          />
                        </div>
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
              href: `/${locale}/enterprise`,
              label: t("navigation.enterprise"),
              icon: Server,
            },
            {
              href: GITHUB_URL,
              label: "GitHub",
              target: "_blank",
              icon: Github,
            },
          ]}
        />
        <SidebarGroup className="mt-2 pt-0 lg:hidden">
          <SidebarGroupContent className="px-2">
            <Link
              href={`/${locale}/enterprise`}
              prefetch={false}
              className="block rounded-none border border-zinc-300 bg-white px-3 py-1.5 text-center font-mono text-[10px] font-bold tracking-widest text-zinc-900 uppercase transition-colors hover:bg-black hover:text-white md:text-xs dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-white dark:hover:text-black"
            >
              Enterprise API
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
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
            <SidebarActiveMenuButton
              activeHref={href}
              href={href}
              render={<Link target={target} prefetch={false} href={href} />}
            >
              {Icon && <Icon />}
              <span>{label}</span>
            </SidebarActiveMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
