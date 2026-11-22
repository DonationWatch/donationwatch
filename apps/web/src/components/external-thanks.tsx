import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ConstLocale } from "@donationwatch/core/utils/locales";

import { Country } from "@donationwatch/core/utils/countries";
import { getTranslations } from "next-intl/server";

import { FormatAnd } from "@/components/formatter";

import { Translation } from "./translation";

const externalThanks: Partial<
  Record<Country, { name: string; url: string }[]>
> = {
  [Country.serbia]: [
    {
      name: "CINS",
      url: "https://www.cins.rs/",
    },
  ],
  [Country.georgia]: [
    {
      name: "Transparency International Georgia",
      url: "https://transparency.ge/",
    },
  ],
  [Country.netherlands]: [
    {
      name: "Open State Foundation",
      url: "https://openstate.eu/",
    },
  ],
  [Country.australia]: [
    {
      name: "Antipoverty Centre",
      url: "https://antipovertycentre.org/",
    },
  ],
  [Country.germany]: [
    {
      name: "LobbyControl",
      url: "https://www.lobbycontrol.de/",
    },
  ],
  [Country.france]: [
    {
      name: "Europolitiko",
      url: "https://europolitiko.com",
    },
    {
      name: "M. Francisco Roa Bastos",
      url: "https://www.pantheonsorbonne.fr/page-perso/francisco.roa-bastos%40",
    },
  ],
  [Country.europeanunion]: [
    {
      name: "European Democracy Consulting Stiftung",
      url: "https://edcstiftung.eu/",
    },
  ],
};

export const ExternalThanks = async ({
  country,
  locale,
}: {
  country: CountryConfig;
  locale: ConstLocale;
}) => {
  const thanks = externalThanks[country.id];

  if (!thanks) return null;

  const t = await getTranslations({ locale });

  return (
    <div className="container mx-auto space-y-4 px-4 text-sm">
      <div className="border-t border-zinc-200 dark:border-zinc-800"></div>
      <div className="px-2">
        <Translation
          t={t}
          translationId={"thanks"}
          variables={{
            external: (
              <FormatAnd
                locale={locale}
                items={thanks.map((thank) => (
                  <a
                    key={thank.url}
                    href={thank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
                  >
                    {thank.name}
                  </a>
                ))}
              />
            ),
          }}
        />
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800"></div>
    </div>
  );
};
