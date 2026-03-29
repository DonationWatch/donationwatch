import { getTranslations } from "next-intl/server";

import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { FormatAnd } from "@/components/formatter";
import { Country } from "@/utils/countries";

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
    <div className="container mx-auto space-y-4 px-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
      <div className="px-2">
        <Translation
          text={t.raw("thanks")}
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
                    className="hover:text-primary-800 dark:hover:text-primary-400"
                  >
                    {thank.name}
                  </a>
                ))}
              />
            ),
          }}
        />
      </div>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
    </div>
  );
};
