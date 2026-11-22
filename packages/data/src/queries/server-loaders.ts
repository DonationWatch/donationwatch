import "server-only";
import type { Country } from "@donationwatch/core/utils/countries";

import {
  donationDocumentToDonations,
  DonationsDocument,
} from "@donationwatch/core/lib/api/donations-document";
import {
  BASE_URL,
  DONOR_ID_HASH_LEN,
  IS_PROD,
} from "@donationwatch/core/utils/config";
import {
  Donation,
  DonationField,
  DonorMeta,
} from "@donationwatch/core/utils/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * CF ASSETS binding aware fetcher for server-side data loading.
 */
async function loadServerData<T>(path: string): Promise<T> {
  let response: Response;

  if (IS_PROD) {
    const context = await getCloudflareContext({ async: true });
    const env = context.env as {
      ASSETS: { fetch: (input: Request) => Promise<Response> };
    };
    response = await env.ASSETS.fetch(
      new Request(`https://assets.local${path}`),
    );
  } else {
    response = await fetch(new URL(path, BASE_URL));
  }

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`, {
      cause: response,
    });
  }

  return response.json();
}

export async function getDonationsByDonorId(
  country: Country,
  donorId: string,
): Promise<Donation[]> {
  try {
    const path = `/data/${country}/donations/by-donor/${donorId.substring(0, DONOR_ID_HASH_LEN)}.json`;
    const data = await loadServerData<DonationsDocument>(path);

    if (!data) {
      return [];
    }

    // Filter donations by donor ID
    return donationDocumentToDonations(data, (donation) => {
      const [, , /* name */ /* ubos */ donationDonorId] =
        data.donors[donation[DonationField.DonorIndex]];
      return donationDonorId === donorId;
    });
  } catch (error) {
    console.error("Error fetching donations by donor id:", donorId);
    return [];
  }
}

export async function getDonorMeta(
  country: Country,
  donorId: string,
): Promise<DonorMeta> {
  try {
    const path = `/data/${country}/donor-meta/${donorId}.json`;
    const data = await loadServerData<DonorMeta>(path);
    return data ?? {};
  } catch (error) {
    console.error("Error fetching donor meta:", donorId);
    return {};
  }
}
