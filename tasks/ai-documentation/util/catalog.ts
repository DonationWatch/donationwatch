import {
  CONTACT_MAIL,
  DATA_LICENSE,
  DISCOVERY_INDEX_URL,
  LLMS_URL,
  OPENAPI_URL,
} from "@/utils/config";

export const buildCatalogJson = () => {
  return {
    api_name: "DonationWatch Data API",
    version: "0.1.0",
    description:
      "High-performance political donation data optimized for AI agents. Uses indexed-key JSON to minimize token overhead.",
    license: DATA_LICENSE,
    license_url: "https://creativecommons.org/licenses/by/4.0/",
    attribution: "Data provided by donation.watch",
    stability: "experimental",
    intended_audience: "AI Agents, Research Bots, Investigative LLMs",
    contact: {
      name: "DonationWatch Support",
      email: CONTACT_MAIL,
    },
    discovery: {
      openapi_spec: OPENAPI_URL,
      llms_txt: LLMS_URL,
      root_index: DISCOVERY_INDEX_URL,
    },
    dictionaries: {
      encoding: "Indexed-Enum-JSON",
      note: "Refer to the OpenAPI schema for full field definitions. Key '4' is always Amount, '5' is Receiver.",
      primary_keys: {
        "0": "Id",
        "1": "Date",
        "2": "DonorType",
        "4": "Amount",
        "5": "Receiver",
        "7": "DonorIndex",
      },
    },
    endpoints: [
      {
        id: "get_discovery_index",
        path: "/data/index.json",
        description:
          "The 'Menu'. Use this to find available countries, years, and party IDs.",
      },
      {
        id: "get_donations_by_year",
        path: "/data/{country}/donations/by-year/{year}.json",
        description: "Full yearly donation logs.",
        parameters: ["country", "year"],
      },
      {
        id: "get_donations_by_party",
        path: "/data/{country}/donations/by-party/{partyId}.json",
        description: "Aggregated donor history for a specific party.",
        parameters: ["country", "partyId"],
      },
    ],
  };
};
