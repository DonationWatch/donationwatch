import { Country } from "./countries";

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";

export const BASE_URL =
  IS_PROD || IS_TEST ? "https://donation.watch" : "http://localhost:3000";

export const THUMBNAIL_PREFIX =
  IS_PROD || IS_TEST ? "https://thumb.donation.watch" : "http://localhost:3000";

export const TWITTER_SITE = "@donation_watch";

export const MOST_RECENT_HISTORY_SIZE = 4;
export const BIGGEST_DONATIONS_COUNT = 4;

export const CONTACT_MAIL = "contact@donation.watch";

export const IMPRINT = ``;

export const DONOR_ID_HASH_LEN = 2;

export const QUERY_PARAM_BUILD_TS = "t";

export const BSKY_URL = "https://bsky.app/profile/donation.watch";
export const TWITTER_URL = "https://x.com/donation_watch";
export const GITHUB_URL = "https://github.com/DonationWatch/donationwatch";

export const DEFAULT_COUNTRY = Country.germany;

export const SIDENAV_YEARS_VISIBLE = 3;
export const SIDENAV_PARTIES_VISIBLE = 5;
export const SIDENAV_DONORS_VISIBLE = 5;
export const SIDENAV_PERSISTENCE_KEY = "sidebar-open";

// Special keywords for donor names that should be treated specially
// Should use Unicode Private Use Area (PUA)
export const REDACTED_DONOR_KEYWORD = "\uE000";
export const ANONYMIZED_DONOR_KEYWORD = "\uE001";
