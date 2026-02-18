import { useQueries, useQuery } from "@tanstack/react-query";
import "client-only";

import { DONOR_ID_HASH_LEN, QUERY_PARAM_BUILD_TS } from "../utils/config";
import { getCountryConfig } from "../utils/data/get-country-config";
import { getBuild } from "../utils/loader/build";
import { DonationField } from "../utils/types";

import type {
  Country,
  CountryCode,
  CountryConfig,
  UnloadedCountryConfig,
} from "../utils/countries";
import type { Donation, Party } from "../utils/types";
import type {
  DonationsDocument,
  DonationsDocumentWithoutDonorIds,
} from "@/lib/api/donations-document";
import type { UseQueryOptions } from "@tanstack/react-query";

import { donationDocumentToDonations } from "@/lib/api/donations-document";

const jsonFetcher = <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> =>
  fetch(input, init).then((res) => {
    if (!res.ok)
      throw new Error(`Network response was not ok: ${res.status}`, {
        cause: res,
      });
    return res.json();
  });

export const useDonationsByYears = (
  country: CountryConfig,
  years: string[],
) => {
  const build = getBuild(country.id).t;

  return useQueries<UseQueryOptions<Donation[]>[]>({
    queries: years
      .filter((year) => country.years.includes(year))
      .map((year) => {
        return {
          queryKey: [country.id, "donations", "by-year", year],
          queryFn: () =>
            jsonFetcher<DonationsDocumentWithoutDonorIds>(
              `/data/${country.id}/donations/by-year/${year}.json?${QUERY_PARAM_BUILD_TS}=${build}`,
            ).then((document) => donationDocumentToDonations(document)),
        };
      }),
  });
};

export const useCountryConfig = (country: Country) => {
  return useQuery<CountryConfig>({
    queryKey: [country, "config"],
    queryFn: () => getCountryConfig(country),
  });
};

export const useDonationsByParty = (
  country: UnloadedCountryConfig,
  party: Party,
) => {
  const build = getBuild(country.id).t;

  return useQuery<Donation[]>({
    queryKey: [country.id, "donations", "by-party", party.id],
    queryFn: () =>
      jsonFetcher<DonationsDocumentWithoutDonorIds>(
        `/data/${country.id}/donations/by-party/${party.id}.json?${QUERY_PARAM_BUILD_TS}=${build}`,
      ).then((document) => donationDocumentToDonations(document)),
  });
};

export const useNormalized = (country: UnloadedCountryConfig) => {
  const build = getBuild(country.id).t;

  return useQuery<{
    filteredDonors: string[];
    filteredReceivers: string[];
    normalizedDonors: [string, string[]][];
    normalizedReceivers: [string, string[]][];
  }>({
    queryKey: [country.id, "normalized"],
    queryFn: () =>
      jsonFetcher(
        `/data/${country.id}/normalized.json?${QUERY_PARAM_BUILD_TS}=${build}`,
      ),
  });
};

export const useDonorNames = (country: UnloadedCountryConfig) => {
  const build = getBuild(country.id).t;

  return useQuery({
    queryKey: [country.id, "donor-ids"],
    queryFn: () =>
      jsonFetcher<{ donors: string[] }>(
        `/data/${country.id}/donor-ids.json?${QUERY_PARAM_BUILD_TS}=${build}`,
      ).then((data) =>
        data.donors.map<[name: string, search: string]>((name) => [
          name,
          name.replace(/\W+/g, "").replace(/\./g, "").toUpperCase(),
        ]),
      ),
  });
};

export const useDonationsByDonorId = (
  country: UnloadedCountryConfig,
  donorId: string,
) => {
  const build = getBuild(country.id).t;

  return useQuery<Donation[]>({
    queryKey: [
      country.id,
      "donations",
      "by-donor",
      donorId.substring(0, DONOR_ID_HASH_LEN),
    ],
    queryFn: () =>
      jsonFetcher<DonationsDocument>(
        `/data/${country.id}/donations/by-donor/${donorId.substring(0, DONOR_ID_HASH_LEN)}.json?${QUERY_PARAM_BUILD_TS}=${build}`,
      )
        .then((data) =>
          // Filter donations by donor ID
          donationDocumentToDonations(data, (donation) => {
            const [, , /* name */ /* ubos */ donationDonorId] =
              data.donors[donation[DonationField.DonorIndex]];
            return donationDonorId === donorId;
          }),
        )
        .catch((error) => {
          console.error(
            "Error fetching donations by donor id:",
            donorId,
            error,
          );
          return [];
        }),
  });
};

export const useWikipediaByPageId = (
  country: UnloadedCountryConfig,
  pageId: number,
) => {
  const build = getBuild(country.id).t;

  return useQuery<{ extract: string }>({
    queryKey: [country.id, "wikipedia", pageId],
    queryFn: () =>
      jsonFetcher(
        `/data/${country.id}/wikipedia/by-pageId/${pageId}.json?${QUERY_PARAM_BUILD_TS}=${build}`,
      ),
  });
};

export const useDetectedCountry = () => {
  return useQuery<{ country: CountryCode | null }>({
    queryKey: ["detected-country"],
    queryFn: () =>
      jsonFetcher<{ country: CountryCode | null }>(`/api/v1/country`),
  });
};
