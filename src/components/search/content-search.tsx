"use client";
import type { ReactNode } from "react";

import { Frown, Search, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Country } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import { PartyDot } from "@/components/parties/party-dot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCountryConfig, useDonorNames } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useSearchDialog } from "@/hooks/use-search-dialog";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";
import { getParty } from "@/utils/countries";
import { Features, hasFeature } from "@/utils/features";
import { clientSha1 } from "@/utils/hash";
import { getLongName } from "@/utils/party";
import { serializeYears } from "@/utils/serializers";

const MAX_DONOR_LEN = 15;

export const CountryHeaderSearch = () => {
  const { country: activeCountry } = useParams<{ country: Country }>();

  if (!activeCountry) return null;

  return <HeaderSearch />;
};

const SearchDialog = ({
  country,
  onClose,
  isOpen,
}: {
  country: CountryConfig;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations("search");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="h-full max-h-[90vh] w-full overflow-hidden p-0 lg:max-w-225"
        showCloseButton={false}
        data-testid="search-dialog"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("filter_description")}</DialogTitle>
        </DialogHeader>
        <div className="flex grow flex-col overflow-hidden">
          {isOpen ? (
            <GlobalSearch countryConfig={country} onClose={onClose} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HeaderSearch = () => {
  const t = useTranslations("search");
  const { country: activeCountry } = useParams<{ country: Country }>();
  const { isOpen, open, close } = useSearchDialog();

  const { data, error, isLoading } = useCountryConfig(activeCountry);

  if (isLoading || error || !data) return <div className="size-10 p-1"></div>;

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              className="flex size-10 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-neutral-600/10"
              onClick={() => open()}
              aria-label={t("filter_description")}
              title={t("filter")}
            >
              <Search size={18} />
            </button>
          }
        />
        <TooltipContent sideOffset={10} side={"left"}>
          {t("filter")}
        </TooltipContent>
      </Tooltip>
      <SearchDialog country={data} isOpen={isOpen} onClose={() => close()} />
    </>
  );
};

const GlobalSearch = ({
  countryConfig,
  onClose,
}: {
  countryConfig: CountryConfig;
  onClose: () => void;
}) => {
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const allParties = countryConfig.parties;
  const allYears = countryConfig.years.toReversed();
  const allLegislativeYears = countryConfig.legislativeYears ?? [];
  const { data: donorNames, isSuccess } = useDonorNames(countryConfig);

  const searchLower = search.toLowerCase();
  const searchNorm = search
    .replace(/\W+/g, "")
    .replace(/\./g, "")
    .toUpperCase();

  const filteredParties = allParties.filter(
    (party) =>
      party[PartyField.Id].toLowerCase().includes(searchLower) ||
      getLongName(party).toLowerCase().includes(searchLower) ||
      party[PartyField.Short].toLowerCase().includes(searchLower),
  );
  const filteredYears = allYears.filter((year) =>
    year.toLowerCase().includes(searchLower),
  );
  const filteredLegislativeYears = allLegislativeYears.filter((years) =>
    years.some((year) => year.toLowerCase().includes(searchLower)),
  );
  const filteredDonors = isSuccess
    ? donorNames
        .filter(([, s]) => s.includes(searchNorm))
        .slice(0, MAX_DONOR_LEN)
    : [];

  const selectParty = (party: Party) => {
    onClose();
    router.push(
      `/${locale}/${countryConfig.id}/party/${party[PartyField.Id]}`,
      {
        scroll: true,
      },
    );
  };
  const selectDonor = (donorId: string) => {
    onClose();
    router.push(`/${locale}/${countryConfig.id}/donor/${donorId}`);
  };
  const selectYear = (years: string) => {
    onClose();
    router.push(`/${locale}/${countryConfig.id}/${years}/overview`, {
      scroll: true,
    });
  };

  const visibleParties = filteredParties;
  const visibleDonors = isSuccess ? filteredDonors : [];
  const visibleYears = filteredYears;
  const visibleLegislativeYears = filteredLegislativeYears;
  const groups: {
    id: string;
    title: string;
    items: (YearItem | YearsItem | PartyItem | DonorItem)[];
  }[] = [
    {
      id: "parties",
      title: tSearch("parties"),
      items: visibleParties.map((party) => ({
        type: "party",
        id: party[PartyField.Id],
      })),
    },
    {
      id: "year",
      title: tSearch("years"),
      items: visibleYears.map(
        (year) =>
          ({
            type: "year",
            id: year,
          }) as YearItem,
      ),
    },
    {
      id: "years",
      title: tSearch("legislative_years"),
      items: visibleLegislativeYears.map(
        (years) =>
          ({
            type: "years",
            id: serializeYears(years),
            years,
          }) as YearsItem,
      ),
    },
  ];

  if (hasFeature(countryConfig, Features.Donors)) {
    groups.push({
      id: "donors",
      title: tSearch("donors"),
      items: visibleDonors.map(
        ([name, search]): DonorItem => ({
          type: "donor",
          id: name,
          name,
          search,
        }),
      ),
    });
  }

  return (
    <div className="flex h-full flex-col">
      <SelectableList
        onClose={onClose}
        search={search}
        onSearchChange={setSearch}
        groups={groups}
        render={(item) => {
          switch (item.type) {
            case "party": {
              return <PartyDot party={item.id} country={countryConfig} />;
            }
            case "year": {
              return <span>{item.id}</span>;
            }
            case "years": {
              return <span>{item.id}</span>;
            }
            case "donor": {
              return (
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
              );
            }
            default: {
              return null;
            }
          }
        }}
        onSelect={(item) => {
          switch (item.type) {
            case "party": {
              selectParty(getParty(countryConfig, item.id));
              break;
            }
            case "year": {
              selectYear(item.id);
              break;
            }
            case "years": {
              selectYear(item.id);
              break;
            }
            case "donor": {
              clientSha1(item.name).then((donorId) => selectDonor(donorId));
              break;
            }
          }
        }}
      />
    </div>
  );
};

interface BaseItem {
  id: string;
}

interface YearsItem extends BaseItem {
  type: "years";
  years: string[];
}

interface DonorItem extends BaseItem {
  type: "donor";
  name: string;
  search: string;
}

interface PartyItem extends BaseItem {
  type: "party";
  id: ReceiverId;
}

interface YearItem extends BaseItem {
  type: "year";
}

const SelectableList = ({
  groups,
  render,
  onSelect,
  search,
  onSearchChange,
  onClose,
}: {
  groups: {
    id: string;
    title: string;
    items: (YearItem | PartyItem | YearsItem | DonorItem)[];
  }[];
  render: (item: YearItem | PartyItem | YearsItem | DonorItem) => ReactNode;
  onSelect: (item: YearItem | PartyItem | YearsItem | DonorItem) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const tSearch = useTranslations("search");
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  useEffect(() => {
    setSelectedGroupIdx(0);
    setSelectedItemIdx(-1);
  }, [groups]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        navigateNext();
        break;
      case "ArrowUp":
        e.preventDefault();
        navigatePrevious();
        break;
      case "Enter":
        e.preventDefault();
        selectCurrentItem();
        break;
    }
  };

  const navigateNext = () => {
    let nextGroupIdx = selectedGroupIdx;
    let nextItemIdx = selectedItemIdx;

    do {
      if (nextItemIdx < groups[nextGroupIdx].items.length - 1) {
        nextItemIdx++;
      } else {
        nextGroupIdx++;
        nextItemIdx = 0;
      }
    } while (
      nextGroupIdx < groups.length &&
      groups[nextGroupIdx].items.length === 0
    );

    if (nextGroupIdx < groups.length) {
      setSelectedGroupIdx(nextGroupIdx);
      setSelectedItemIdx(nextItemIdx);
    }
  };

  const navigatePrevious = () => {
    let prevGroupIdx = selectedGroupIdx;
    let prevItemIdx = selectedItemIdx;

    do {
      if (prevItemIdx > 0) {
        prevItemIdx--;
      } else {
        prevGroupIdx--;
        if (prevGroupIdx >= 0) {
          prevItemIdx = groups[prevGroupIdx].items.length - 1;
        }
      }
    } while (prevGroupIdx >= 0 && groups[prevGroupIdx].items.length === 0);

    if (prevGroupIdx >= 0) {
      setSelectedGroupIdx(prevGroupIdx);
      setSelectedItemIdx(prevItemIdx);
    }
  };

  const selectCurrentItem = () => {
    const currentItem = groups[selectedGroupIdx].items[selectedItemIdx];
    onSelect(currentItem);
  };

  const element = groups.map((group, groupIdx) => {
    if (!group.items.length) return null;

    return (
      <div role="group" key={group.id} aria-labelledby={`group-${group.id}`}>
        <ListGroupHeader key={group.id} group={group} />
        <div className="mb-4 flex flex-wrap gap-1">
          {group.items.map((item, itemIdx) => {
            const isSelected =
              groupIdx === selectedGroupIdx && itemIdx === selectedItemIdx;

            return (
              <button
                role="treeitem"
                aria-selected={isSelected}
                type="button"
                className={cn(
                  "inline-block max-w-64 truncate rounded-full px-4 py-2 align-middle hover:bg-gray-200 dark:hover:bg-gray-800",
                  isSelected
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-900",
                )}
                key={`${item.type}-${item.id}`}
                onClick={() => onSelect(item)}
                ref={(el) => {
                  if (!itemRefs.current[groupIdx]) {
                    itemRefs.current[groupIdx] = [];
                  }
                  itemRefs.current[groupIdx][itemIdx] = el;
                }}
              >
                {render(item)}
              </button>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="p-4">
        <div className="flex items-center rounded-sm border px-3 text-neutral-800 dark:border-slate-800 dark:text-white">
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <input
            role={"searchbox"}
            aria-label={tSearch("filter_description")}
            ref={inputRef}
            placeholder={tSearch("filter_description")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            className="shrink-0 p-2 opacity-75 hover:opacity-100"
            onClick={onClose}
            title={t("actions.close")}
          >
            <X />
          </button>
        </div>
      </div>
      <div role="tree" className="grow overflow-x-hidden overflow-y-auto px-4">
        {element.every((group) => group === null) ? (
          <Empty>
            <Frown size={28} className="mb-2" />
            {tSearch("empty")}
          </Empty>
        ) : (
          element
        )}
      </div>
    </>
  );
};

const ListGroupHeader = ({
  group: { title, id },
}: {
  group: { title: string; id: string };
}) => {
  return (
    <div
      aria-hidden={true}
      id={`group-${id}`}
      className="mb-2 px-4 py-0.5 text-sm font-semibold text-gray-800 dark:text-gray-300"
    >
      {title}
    </div>
  );
};

const Empty = ({ children }: { children: ReactNode }) => {
  return (
    <div
      role="presentation"
      className="flex h-full flex-col items-center justify-center py-6 text-sm text-gray-600 dark:text-gray-300"
    >
      {children}
    </div>
  );
};
