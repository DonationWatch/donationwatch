"use client";

import type { PropsWithChildren } from "react";

import { createParser, useQueryStates, parseAsInteger, throttle } from "nuqs";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  Suspense,
  useRef,
  memo,
} from "react";
import { z } from "zod";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";
import { Features, hasFeature } from "@/utils/features";
import { DonationField, DonationType, DonorType } from "@/utils/types";

const yearParser = parseAsInteger;

const partiesParser = createParser({
  parse: (query) => {
    if (!query || query === "__ALL__") return null;
    if (query === "__NONE__") return [];
    const items = query.split(",");
    const result = z.array(z.string()).safeParse(items);
    return result.success ? result.data : null;
  },
  serialize: (value) => {
    if (!value) return "__ALL__";
    if (value.length === 0) return "__NONE__";
    return value.join(",");
  },
});

const typesParser = createParser({
  parse: (query) => {
    if (!query || query === "__ALL__") return null;
    if (query === "__NONE__") return [];
    const items = query
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    const result = z.array(z.number().int()).safeParse(items);
    return result.success ? (result.data as DonationType[]) : null;
  },
  serialize: (value) => {
    if (!value) return "__ALL__";
    if (value.length === 0) return "__NONE__";
    return value.join(",");
  },
});

const donorTypesParser = createParser({
  parse: (query) => {
    if (!query || query === "__ALL__") return null;
    if (query === "__NONE__") return [];
    const items = query
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    const result = z.array(z.number().int()).safeParse(items);
    return result.success ? (result.data as DonorType[]) : null;
  },
  serialize: (value) => {
    if (!value) return "__ALL__";
    if (value.length === 0) return "__NONE__";
    return value.join(",");
  },
});

export interface FilterState {
  fromYear: number;
  toYear: number;
  activePartyIds: ReadonlySet<ReceiverId>;
  activeDonationTypes: ReadonlySet<DonationType>;
  activeDonorTypes: ReadonlySet<DonorType>;
}

export interface FilterBounds {
  minYear: number;
  maxYear: number;
  availableParties: Party[];
  availableDonationTypes: DonationType[];
  availableDonorTypes: DonorType[];
}

export interface FilteredStats {
  totalAmount: number;
  donationCount: number;
  amountPerYear: Record<number, number>;
  amountPerParty: Record<ReceiverId, number>;
}

export interface FilterControls {
  setYearRange: (from: number, to: number) => void;
  toggleParty: (partyId: ReceiverId) => void;
  setSelectedParties: (partyIds: ReceiverId[] | null) => void;
  toggleDonationType: (type: DonationType) => void;
  setSelectedDonationTypes: (types: DonationType[] | null) => void;
  toggleDonorType: (type: DonorType) => void;
  setSelectedDonorTypes: (types: DonorType[] | null) => void;
  resetFilters: () => void;
}

export interface FilterContextValue {
  filteredDonations: Donation[];
  filteredYears: string[];
  activeFilters: FilterState;
  bounds: FilterBounds;
  stats: FilteredStats;
  controls: FilterControls;
  isFiltered: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  yearStats: Record<number, number> | null;
  setYearStats: (stats: Record<number, number> | null) => void;
  setAvailableRange: (range: [number, number] | null) => void;
  accentColor: string;
  setDonations: (donations: Donation[]) => void;
  filteredParties: string[];
  hasFilterSections: boolean;
}

export const FilterContext = createContext<FilterContextValue | null>(null);

export interface NuqsSyncHandle {
  setParams: (
    params: Partial<{
      from: number | null;
      to: number | null;
      parties: string[] | null;
      types: DonationType[] | null;
      donorTypes: DonorType[] | null;
    }>,
  ) => Promise<URLSearchParams>;
}

export interface NuqsParams {
  from: number | null;
  to: number | null;
  parties: string[] | null;
  types: DonationType[] | null;
  donorTypes: DonorType[] | null;
}

const FilterNuqsSync = memo(
  forwardRef<NuqsSyncHandle, { onParamsChange: (params: NuqsParams) => void }>(
    ({ onParamsChange }, ref) => {
      const [params, setParams] = useQueryStates(
        {
          from: yearParser,
          to: yearParser,
          parties: partiesParser,
          types: typesParser,
          donorTypes: donorTypesParser,
        },
        {
          shallow: true,
          limitUrlUpdates: throttle(100),
        },
      );

      useImperativeHandle(
        ref,
        () => ({
          setParams,
        }),
        [setParams],
      );

      useEffect(() => {
        onParamsChange(params);
      }, [params, onParamsChange]);

      return null;
    },
  ),
);

const areArraysEqual = <T,>(a: T[] | null, b: T[] | null): boolean => {
  const arrA = a ?? [];
  const arrB = b ?? [];
  if (arrA.length !== arrB.length) return false;
  const setA = new Set(arrA);
  return arrB.every((x) => setA.has(x));
};

export const FilterProvider = ({
  countryConfig,
  donations: initialDonations = [],
  accentColor = "#3730a3",
  children,
}: PropsWithChildren<{
  countryConfig: CountryConfig;
  donations?: Donation[];
  accentColor?: string;
}>) => {
  const sortedYears = useMemo(
    () =>
      countryConfig.years
        .map((y) => parseInt(y, 10))
        .filter((y) => !Number.isNaN(y))
        .toSorted((a, b) => a - b),
    [countryConfig.years],
  );

  const [donations, setDonationsState] = useState<Donation[]>(initialDonations);
  const [availableRange, setAvailableRangeState] = useState<
    [number, number] | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [yearStats, setYearStatsState] = useState<Record<
    number,
    number
  > | null>(null);

  const setAvailableRange = useCallback((range: [number, number] | null) => {
    setAvailableRangeState((prev) => {
      if (prev === range) return prev;
      if (!prev || !range) return range;
      if (prev[0] === range[0] && prev[1] === range[1]) return prev;
      return range;
    });
  }, []);

  const setYearStats = useCallback((stats: Record<number, number> | null) => {
    setYearStatsState((prev) => {
      if (prev === stats) return prev;
      if (!prev || !stats) return stats;
      const prevKeys = Object.keys(prev);
      const keys = Object.keys(stats);
      if (prevKeys.length !== keys.length) return stats;
      for (const k of keys) {
        if (prev[parseInt(k, 10)] !== stats[parseInt(k, 10)]) return stats;
      }
      return prev;
    });
  }, []);

  const setDonations = useCallback((newDonations: Donation[]) => {
    setDonationsState((prev) => {
      if (prev === newDonations) return prev;
      if (prev.length !== newDonations.length) return newDonations;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== newDonations[i]) return newDonations;
      }
      return prev;
    });
  }, []);

  // Sync initialDonations if they change from props
  useEffect(() => {
    if (initialDonations && initialDonations.length > 0) {
      setDonations(initialDonations);
    }
  }, [initialDonations, setDonations]);

  const minYear = availableRange
    ? availableRange[0]
    : (sortedYears.at(0) ?? 2000);
  const maxYear = availableRange
    ? availableRange[1]
    : (sortedYears.at(-1) ?? 2026);

  // URL parameters sync state
  const nuqsRef = useRef<NuqsSyncHandle>(null);
  const [urlParams, setUrlParams] = useState<NuqsParams>({
    from: null,
    to: null,
    parties: null,
    types: null,
    donorTypes: null,
  });

  const onParamsChange = useCallback((params: NuqsParams) => {
    setUrlParams(params);
  }, []);

  const { from, to, parties, types, donorTypes } = urlParams;

  // Local pending states for bridging Next.js transition lag
  const [pendingFrom, setPendingFrom] = useState<number | undefined>(undefined);
  const [pendingTo, setPendingTo] = useState<number | undefined>(undefined);
  const [pendingParties, setPendingParties] = useState<
    string[] | null | undefined
  >(undefined);
  const [pendingTypes, setPendingTypes] = useState<
    DonationType[] | null | undefined
  >(undefined);
  const [pendingDonorTypes, setPendingDonorTypes] = useState<
    DonorType[] | null | undefined
  >(undefined);

  // Sync: when URL catches up with pending state, clear the pending state after a short delay to ensure router stability
  useEffect(() => {
    if (pendingFrom !== undefined) {
      const urlVal = from ?? minYear;
      if (urlVal === pendingFrom) {
        const timer = setTimeout(() => setPendingFrom(undefined), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [from, pendingFrom, minYear]);

  useEffect(() => {
    if (pendingTo !== undefined) {
      const urlVal = to ?? maxYear;
      if (urlVal === pendingTo) {
        const timer = setTimeout(() => setPendingTo(undefined), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [to, pendingTo, maxYear]);

  useEffect(() => {
    if (pendingParties !== undefined) {
      if (areArraysEqual(parties, pendingParties)) {
        const timer = setTimeout(() => setPendingParties(undefined), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [parties, pendingParties]);

  useEffect(() => {
    if (pendingTypes !== undefined) {
      if (areArraysEqual(types, pendingTypes)) {
        const timer = setTimeout(() => setPendingTypes(undefined), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [types, pendingTypes]);

  useEffect(() => {
    if (pendingDonorTypes !== undefined) {
      if (areArraysEqual(donorTypes, pendingDonorTypes)) {
        const timer = setTimeout(() => setPendingDonorTypes(undefined), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [donorTypes, pendingDonorTypes]);

  const parsedFilters = useMemo(
    () => ({
      from: pendingFrom !== undefined ? pendingFrom : from,
      to: pendingTo !== undefined ? pendingTo : to,
      parties: pendingParties !== undefined ? pendingParties : parties,
      types: pendingTypes !== undefined ? pendingTypes : types,
      donorTypes:
        pendingDonorTypes !== undefined ? pendingDonorTypes : donorTypes,
    }),
    [
      pendingFrom,
      from,
      pendingTo,
      to,
      pendingParties,
      parties,
      pendingTypes,
      types,
      pendingDonorTypes,
      donorTypes,
    ],
  );

  const activeFromVal = parsedFilters.from ?? minYear;
  const activeToVal = parsedFilters.to ?? maxYear;

  // Clamp to valid bounds
  const clampedFrom = Math.max(minYear, Math.min(maxYear, activeFromVal));
  const clampedTo = Math.max(clampedFrom, Math.min(maxYear, activeToVal));

  const filteredYears = useMemo(() => {
    const arr: string[] = [];
    for (let y = clampedFrom; y <= clampedTo; y++) {
      arr.push(`${y}`);
    }
    return arr;
  }, [clampedFrom, clampedTo]);

  // Dynamic bounds
  const bounds = useMemo<FilterBounds>(() => {
    const presentPartyIds = new Set<ReceiverId>();
    const presentDonationTypes = new Set<DonationType>();
    const presentDonorTypes = new Set<DonorType>();

    for (let i = 0; i < donations.length; i++) {
      const d = donations[i];
      presentPartyIds.add(d[DonationField.Receiver]);
      if (d[DonationField.DonationType] !== undefined) {
        presentDonationTypes.add(d[DonationField.DonationType]!);
      }
      if (d[DonationField.DonorType] !== undefined) {
        presentDonorTypes.add(d[DonationField.DonorType]!);
      }
    }

    const baseDonationTypes = [
      DonationType.Money,
      DonationType.MembershipFee,
      DonationType.JoiningFee,
      DonationType.PropertyOrService,
      DonationType.PublicFunds,
    ];

    const baseDonorTypes = [
      DonorType.Other,
      DonorType.Individual,
      DonorType.Company,
      DonorType.TradeUnion,
      DonorType.PublicFund,
      DonorType.UnincorporatedAssociation,
      DonorType.RegisteredPoliticalParty,
      DonorType.Trust,
      DonorType.FriendlySociety,
      DonorType.LimitedLiabilityPartnership,
      DonorType.BuildingSociety,
      DonorType.NonProfitLegalEntity,
      DonorType.AnonymizedDonor,
    ];

    return {
      minYear,
      maxYear,
      availableParties:
        donations.length > 0
          ? countryConfig.parties.filter((p) =>
              presentPartyIds.has(p[PartyField.Id]),
            )
          : countryConfig.parties,
      availableDonationTypes:
        donations.length > 0
          ? baseDonationTypes.filter((t) => presentDonationTypes.has(t))
          : baseDonationTypes,
      availableDonorTypes:
        donations.length > 0
          ? baseDonorTypes.filter((t) => presentDonorTypes.has(t))
          : baseDonorTypes,
    };
  }, [minYear, maxYear, countryConfig.parties, donations]);

  const activePartyIds = useMemo(() => {
    if (!parsedFilters.parties) {
      return new Set<ReceiverId>(
        bounds.availableParties.map((p) => p[PartyField.Id]),
      );
    }
    return new Set<ReceiverId>(parsedFilters.parties as ReceiverId[]);
  }, [parsedFilters.parties, bounds.availableParties]);

  const activeDonationTypes = useMemo(() => {
    if (!parsedFilters.types) {
      return new Set<DonationType>(bounds.availableDonationTypes);
    }
    return new Set<DonationType>(parsedFilters.types);
  }, [parsedFilters.types, bounds.availableDonationTypes]);

  const activeDonorTypes = useMemo(() => {
    if (!parsedFilters.donorTypes) {
      return new Set<DonorType>(bounds.availableDonorTypes);
    }
    return new Set<DonorType>(parsedFilters.donorTypes);
  }, [parsedFilters.donorTypes, bounds.availableDonorTypes]);

  const isFiltered =
    clampedFrom !== minYear ||
    clampedTo !== maxYear ||
    parsedFilters.parties !== null ||
    parsedFilters.types !== null ||
    parsedFilters.donorTypes !== null;

  const filteredParties = useMemo(() => {
    return Array.from(activePartyIds) as string[];
  }, [activePartyIds]);

  // Fast predicate compiler
  const filterDonation = useCallback(
    (donation: Donation): boolean => {
      // 1. Year range filter
      const dateStr = donation[DonationField.Date];
      const year = parseInt(dateStr.substring(0, 4), 10);
      if (year < clampedFrom || year > clampedTo) return false;

      // 2. Party filter
      if (parsedFilters.parties !== null) {
        const receiver = donation[DonationField.Receiver];
        if (!activePartyIds.has(receiver)) return false;
      }

      // 3. Donation Type filter
      if (parsedFilters.types !== null) {
        const type = donation[DonationField.DonationType] ?? DonationType.Money;
        if (!activeDonationTypes.has(type)) return false;
      }

      // 4. Donor Type filter
      if (parsedFilters.donorTypes !== null) {
        const type = donation[DonationField.DonorType] ?? DonorType.Other;
        if (!activeDonorTypes.has(type)) return false;
      }

      return true;
    },
    [
      clampedFrom,
      clampedTo,
      parsedFilters.parties,
      activePartyIds,
      parsedFilters.types,
      activeDonationTypes,
      parsedFilters.donorTypes,
      activeDonorTypes,
    ],
  );

  // Filter donations list & calculate stats in a single, high-performance O(N) loop
  const { filteredDonations, stats } = useMemo(() => {
    const filtered: Donation[] = [];
    let total = 0;
    const perYear: Record<number, number> = {};
    const perParty: Record<ReceiverId, number> = {};

    for (let i = 0; i < donations.length; i++) {
      const d = donations[i];
      if (filterDonation(d)) {
        filtered.push(d);
        const amount = d[DonationField.Amount];
        total += amount;

        const dateStr = d[DonationField.Date];
        const yr = parseInt(dateStr.substring(0, 4), 10);
        perYear[yr] = (perYear[yr] || 0) + amount;

        const receiver = d[DonationField.Receiver];
        perParty[receiver] = (perParty[receiver] || 0) + amount;
      }
    }

    return {
      filteredDonations: filtered,
      stats: {
        totalAmount: total,
        donationCount: filtered.length,
        amountPerYear: perYear,
        amountPerParty: perParty,
      },
    };
  }, [donations, filterDonation]);

  // Controls implementation
  const setYearRange = useCallback(
    (fromVal: number, toVal: number) => {
      const isFullRange = fromVal <= minYear && toVal >= maxYear;
      setPendingFrom(fromVal);
      setPendingTo(toVal);
      void nuqsRef.current?.setParams({
        from: isFullRange ? null : fromVal,
        to: isFullRange ? null : toVal,
      });
    },
    [minYear, maxYear],
  );

  const toggleParty = useCallback(
    (partyId: ReceiverId) => {
      let next: Set<ReceiverId>;
      if (!parsedFilters.parties) {
        next = new Set(
          bounds.availableParties
            .map((p) => p[PartyField.Id])
            .filter((id) => id !== partyId),
        );
      } else {
        next = new Set(parsedFilters.parties as ReceiverId[]);
        if (next.has(partyId)) {
          next.delete(partyId);
        } else {
          next.add(partyId);
        }
      }
      const val =
        next.size === bounds.availableParties.length ? null : Array.from(next);
      setPendingParties(val);
      void nuqsRef.current?.setParams({ parties: val });
    },
    [parsedFilters.parties, bounds.availableParties],
  );

  const toggleDonationType = useCallback(
    (type: DonationType) => {
      let next: Set<DonationType>;
      if (!parsedFilters.types) {
        next = new Set(bounds.availableDonationTypes.filter((t) => t !== type));
      } else {
        next = new Set(parsedFilters.types);
        if (next.has(type)) {
          next.delete(type);
        } else {
          next.add(type);
        }
      }
      const val =
        next.size === bounds.availableDonationTypes.length
          ? null
          : Array.from(next);
      setPendingTypes(val);
      void nuqsRef.current?.setParams({ types: val });
    },
    [parsedFilters.types, bounds.availableDonationTypes],
  );

  const setSelectedParties = useCallback(
    (partyIds: ReceiverId[] | null) => {
      const val =
        partyIds === null
          ? null
          : partyIds.length === bounds.availableParties.length
            ? null
            : partyIds;
      setPendingParties(val);
      void nuqsRef.current?.setParams({ parties: val });
    },
    [bounds.availableParties.length],
  );

  const setSelectedDonationTypes = useCallback(
    (typesVal: DonationType[] | null) => {
      const val =
        typesVal === null
          ? null
          : typesVal.length === bounds.availableDonationTypes.length
            ? null
            : typesVal;
      setPendingTypes(val);
      void nuqsRef.current?.setParams({ types: val });
    },
    [bounds.availableDonationTypes.length],
  );

  const toggleDonorType = useCallback(
    (type: DonorType) => {
      let next: Set<DonorType>;
      if (!parsedFilters.donorTypes) {
        next = new Set(bounds.availableDonorTypes.filter((t) => t !== type));
      } else {
        next = new Set(parsedFilters.donorTypes);
        if (next.has(type)) {
          next.delete(type);
        } else {
          next.add(type);
        }
      }
      const val =
        next.size === bounds.availableDonorTypes.length
          ? null
          : Array.from(next);
      setPendingDonorTypes(val);
      void nuqsRef.current?.setParams({ donorTypes: val });
    },
    [parsedFilters.donorTypes, bounds.availableDonorTypes],
  );

  const setSelectedDonorTypes = useCallback(
    (typesVal: DonorType[] | null) => {
      const val =
        typesVal === null
          ? null
          : typesVal.length === bounds.availableDonorTypes.length
            ? null
            : typesVal;
      setPendingDonorTypes(val);
      void nuqsRef.current?.setParams({ donorTypes: val });
    },
    [bounds.availableDonorTypes.length],
  );

  const resetFilters = useCallback(() => {
    setPendingFrom(minYear);
    setPendingTo(maxYear);
    setPendingParties(null);
    setPendingTypes(null);
    setPendingDonorTypes(null);
    void nuqsRef.current?.setParams({
      from: null,
      to: null,
      parties: null,
      types: null,
      donorTypes: null,
    });
  }, [minYear, maxYear]);

  const activeFilters = useMemo<FilterState>(
    () => ({
      fromYear: clampedFrom,
      toYear: clampedTo,
      activePartyIds,
      activeDonationTypes,
      activeDonorTypes,
    }),
    [
      clampedFrom,
      clampedTo,
      activePartyIds,
      activeDonationTypes,
      activeDonorTypes,
    ],
  );

  const hasFilterSections = useMemo(() => {
    const hasYears = bounds.minYear < bounds.maxYear;
    const hasParties = bounds.availableParties.length > 1;
    const hasDonationTypes =
      hasFeature(countryConfig, Features.DonationType) &&
      bounds.availableDonationTypes.length > 1;
    const hasDonorTypes =
      hasFeature(countryConfig, Features.DonorType) &&
      bounds.availableDonorTypes.length > 1;

    return hasYears || hasParties || hasDonationTypes || hasDonorTypes;
  }, [bounds, countryConfig]);

  const value = useMemo<FilterContextValue>(
    () => ({
      filteredDonations,
      filteredYears,
      activeFilters,
      bounds,
      stats,
      controls: {
        setYearRange,
        toggleParty,
        toggleDonationType,
        setSelectedParties,
        setSelectedDonationTypes,
        toggleDonorType,
        setSelectedDonorTypes,
        resetFilters,
      },
      isFiltered,
      isOpen,
      setIsOpen,
      yearStats,
      setYearStats,
      setAvailableRange,
      accentColor,
      setDonations,
      filteredParties,
      hasFilterSections,
    }),
    [
      filteredDonations,
      filteredYears,
      activeFilters,
      bounds,
      stats,
      setYearRange,
      toggleParty,
      toggleDonationType,
      setSelectedParties,
      setSelectedDonationTypes,
      toggleDonorType,
      setSelectedDonorTypes,
      resetFilters,
      isFiltered,
      isOpen,
      setIsOpen,
      yearStats,
      setYearStats,
      setAvailableRange,
      accentColor,
      setDonations,
      filteredParties,
      hasFilterSections,
    ],
  );

  return (
    <FilterContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <FilterNuqsSync ref={nuqsRef} onParamsChange={onParamsChange} />
      </Suspense>
    </FilterContext.Provider>
  );
};
