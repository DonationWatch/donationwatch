import { Country } from "./countries";

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

export const PROD_URL = "https://donation.watch";

export const BASE_URL = IS_PROD || IS_TEST ? PROD_URL : "http://localhost:3000";

export const THUMBNAIL_PREFIX =
  IS_PROD || IS_TEST ? "https://thumb.donation.watch" : "http://localhost:3000";

export const TWITTER_SITE = "@donation_watch";

export const MOST_RECENT_HISTORY_SIZE = 4;
export const BIGGEST_DONATIONS_COUNT = 4;

export const SITE_NAME = "DonationWatch";
export const CONTACT_MAIL = "contact@donation.watch";

export const IMPRINT = ``;

export const DONOR_ID_HASH_LEN = 2;

export const QUERY_PARAM_BUILD_TS = "t";

export const BSKY_URL = "https://bsky.app/profile/donation.watch";
export const TWITTER_URL = "https://x.com/donation_watch";
export const GITHUB_ORG = "https://github.com/DonationWatch";
export const GITHUB_URL = `${GITHUB_ORG}/donationwatch`;
export const BMAC_URL = "https://buymeacoffee.com/donation.watch";

export const DEFAULT_COUNTRY = Country.germany;

export const SIDENAV_YEARS_VISIBLE = 3;
export const SIDENAV_PARTIES_VISIBLE = 5;
export const SIDENAV_DONORS_VISIBLE = 5;
export const SIDENAV_PERSISTENCE_KEY = "sidebar-open";

// Special keywords for donor names that should be treated specially
// Should use Unicode Private Use Area (PUA)

// donor was redacted by upstream
export const REDACTED_DONOR_KEYWORD = "\uE000";
// donor was anonymized by us due to request
export const ANONYMIZED_DONOR_KEYWORD = "\uE001";
// donor to party in year (used for countries that have no individual donors but years, e.g. FR)
export const DONOR_TO_PARTY_BY_YEAR = "\uE002";

export const DATA_LICENSE = "CC BY 4.0";

export const LLMS_URL = `${PROD_URL}/llms.txt`;
export const OPENAPI_URL = `${PROD_URL}/schema/openapi.json`;
export const DISCOVERY_INDEX_URL = `${PROD_URL}/data/index.json`;
export const API_CATALOG_URL = `${PROD_URL}/.well-known/api-catalog`;
