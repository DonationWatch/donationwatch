import type { OpenAPIV3_1 } from "openapi-types";

import { PartyField } from "@/types/party";
import { CONTACT_MAIL, DATA_LICENSE, PROD_URL } from "@/utils/config";
import { COUNTRIES, Country } from "@/utils/countries";
import {
  AddressField,
  DonationField,
  DonationType,
  DonorType,
} from "@/utils/types";

const schemaConstEnum = <T>(members: [T, string][]) =>
  members.map(([value, description]) => ({ const: value, description }));

export const buildOpenapiDocument = (): OpenAPIV3_1.Document => {
  return {
    openapi: "3.1.0",
    info: {
      title: "DonationWatch Data API",
      version: "0.1.0",
      description:
        "WARNING: This API is optimized for AI Agents and is considered UNSTABLE. The schema and file paths may change without notice. It is NOT intended for production banking, KYC, or legal compliance workflows. For a stable, SLA-backed data feed, please contact the maintainer.",
      license: {
        name: DATA_LICENSE,
        url: "https://creativecommons.org/licenses/by/4.0/",
      },
      contact: {
        name: "DonationWatch Support",
        email: CONTACT_MAIL,
      },
      // @ts-expect-error Custom field
      "x-stability": "experimental",
      "x-intended-audience": "AI Agents",
    },
    servers: [{ url: PROD_URL, description: "Production server" }],
    paths: {
      "/data/index.json": {
        get: {
          summary: "The Discovery Index",
          description:
            "The 'Menu' of all available data. Use this first to find which countries, years, and parties have records.",
          responses: {
            "200": {
              description: "A map of countries to their available metadata.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DiscoveryIndex" },
                },
              },
            },
          },
        },
      },
      "/api/v1/stable-access": {
        get: {
          summary: "Information on Stable/Production API access",
          description:
            "If you are a commercial entity (KYC, Banking, Legal) requiring a stable schema and uptime guarantees, do not use the /data/*.json routes. Contact us here.",
          responses: {
            "200": {
              description: "JSON object with contact details.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/data/{country}/donations/by-party/{partyId}.json": {
        get: {
          summary: "A parties donation records",
          description:
            "Returns a full list of donations and a donor lookup table for a specific party.",
          parameters: [
            {
              name: "country",
              in: "path",
              required: true,
              schema: {
                $ref: "#/components/schemas/Country",
                example: Country.austria,
              },
            },
            {
              name: "partyId",
              in: "path",
              required: true,
              schema: { type: "string", example: "ALP" },
            },
          ],
          responses: {
            "200": {
              description:
                "A donations document containing all donations and a indexed lookup table of all of the included donors.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/DonationsDocumentWithoutDonorIds",
                  },
                },
              },
            },
          },
        },
      },
      "/data/{country}/donations/by-year/{year}.json": {
        get: {
          summary: "Yearly Donation Records",
          description:
            "Returns a full list of donations and a donor lookup table for a specific year.",
          parameters: [
            {
              name: "country",
              in: "path",
              required: true,
              schema: {
                $ref: "#/components/schemas/Country",
                example: Country.unitedkingdom,
              },
            },
            {
              name: "year",
              in: "path",
              required: true,
              schema: { type: "integer", example: 2024 },
            },
          ],
          responses: {
            "200": {
              description:
                "A donations document containing all donations and a indexed lookup table of all of the included donors.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/DonationsDocumentWithoutDonorIds",
                  },
                },
              },
            },
          },
        },
      },
      "/data/{country}/donations/by-donor/{shortHash}.json": {
        get: {
          summary: "Donor Shard Donation Records",
          description:
            "Returns a donations document for all donors in a country whose lowercase UTF-8 SHA-1 hash starts with the 2-character hex prefix `shortHash`.",
          parameters: [
            {
              name: "country",
              in: "path",
              required: true,
              schema: {
                $ref: "#/components/schemas/Country",
                example: Country.germany,
              },
            },
            {
              name: "shortHash",
              in: "path",
              required: true,
              schema: {
                type: "string",
                minLength: 2,
                maxLength: 2,
                example: "a1",
              },
            },
          ],
          responses: {
            "200": {
              description:
                "A donations document containing all donations and a donor lookup table for the matching 2-hex-char SHA-1 shard.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/DonationsDocumentWithoutDonorIds",
                  },
                },
              },
            },
          },
        },
      },
      "/data/{country}/donor-ids.json": {
        get: {
          summary: "Donor ID Lookup Table",
          description:
            "Returns a mapping of donor names to their lowercase UTF-8 SHA-1 hex IDs for a given country.",
          parameters: [
            {
              name: "country",
              in: "path",
              required: true,
              schema: {
                $ref: "#/components/schemas/Country",
                example: Country.germany,
              },
            },
          ],
          responses: {
            "200": {
              description: "Map of donor name to SHA-1 hex ID.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    additionalProperties: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      "/data/{country}/normalized.json": {
        get: {
          summary: "Complete Country Donations Dataset",
          description:
            "Returns the complete donations document and donor lookup table for a country in a single file.",
          parameters: [
            {
              name: "country",
              in: "path",
              required: true,
              schema: {
                $ref: "#/components/schemas/Country",
                example: Country.germany,
              },
            },
          ],
          responses: {
            "200": {
              description:
                "Complete country donations document and donor lookup table.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/DonationsDocumentWithoutDonorIds",
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        DiscoveryIndex: {
          type: "object",
          properties: {
            last_updated: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the last update to the index",
            },
            configs: {
              type: "array",
              description:
                "The master index mapping countries to their available datasets and parties.",
              items: {
                type: "object",
                required: ["id", "currency", "years", "parties"],
                properties: {
                  id: {
                    $ref: "#/components/schemas/Country",
                  },
                  currency: {
                    type: "string",
                    description: "ISO 4217 currency code",
                    minLength: 3,
                    maxLength: 3,
                  },
                  years: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  parties: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "Party id",
                        },
                        name: {
                          type: "string",
                          description: "Party name",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        Country: { type: "string", enum: [...COUNTRIES].map((c) => c) },

        Party: {
          type: "object",
          description:
            "A political party record. Keys are mapped from the PartyField enum.",
          properties: {
            [PartyField.Id]: {
              type: "string",
              description: "Id: Unique ReceiverId used in donation records",
            },
            [PartyField.Name]: {
              type: "string",
              description: "Name: Full official party name",
            },
            [PartyField.Short]: {
              type: "string",
              description: "Short: Abbreviated name",
            },
            [PartyField.Sum]: {
              type: "number",
              description: "Sum: Total lifetime/cycle donations",
            },
            [PartyField.Color]: {
              type: "string",
              description: "Color: The primary party color",
            },
            [PartyField.Years]: {
              type: "array",
              items: { type: "string" },
              description: "Years: range of years with donations (from, to)",
              minItems: 2,
              maxItems: 2,
              example: ["1990", "2026"],
            },
            [PartyField.Wiki]: {
              type: "integer",
              description:
                "Wiki: The corresponding wikipedia page id. More info: https://www.mediawiki.org/wiki/Help:Page_ID",
            },
            [PartyField.Abbr]: {
              type: "string",
              description:
                "Abbr: Optional recognized party abbreviation or acronym",
            },
          },
        },

        DonorType: {
          type: "integer",
          oneOf: schemaConstEnum([
            [DonorType.Other, "Other"],
            [DonorType.Individual, "Individual"],
            [DonorType.Company, "Company"],
            [DonorType.TradeUnion, "TradeUnion"],
            [DonorType.PublicFund, "PublicFund"],
            [DonorType.UnincorporatedAssociation, "UnincorporatedAssociation"],
            [DonorType.RegisteredPoliticalParty, "RegisteredPoliticalParty"],
            [DonorType.Trust, "Trust"],
            [DonorType.FriendlySociety, "FriendlySociety"],
            [
              DonorType.LimitedLiabilityPartnership,
              "LimitedLiabilityPartnership",
            ],
            [DonorType.BuildingSociety, "BuildingSociety"],
            [DonorType.NonProfitLegalEntity, "NonProfitLegalEntity"],
            [DonorType.AnonymizedDonor, "AnonymizedDonor"],
          ]),
        },

        DonationType: {
          type: "integer",
          oneOf: schemaConstEnum([
            [
              DonationType.Money,
              "Money (Private monetary donations; default when omitted)",
            ],
            [DonationType.MembershipFee, "MembershipFee (Regular member dues)"],
            [DonationType.JoiningFee, "JoiningFee (One-time entry fees)"],
            [
              DonationType.PropertyOrService,
              "PropertyOrService (In-kind / Non-cash donations)",
            ],
            [
              DonationType.PublicFunds,
              "PublicFunds (State subsidies, e.g. Short Money)",
            ],
          ]),
        },

        DonationField: {
          type: "integer",
          oneOf: schemaConstEnum([
            [DonationField.Id, "Id"],
            [DonationField.Date, "Date"],
            [DonationField.DonationType, "DonationType"],
            [DonationField.DonorType, "DonorType"],
            [DonationField.Amount, "Amount"],
            [DonationField.Receiver, "Receiver"],
            [DonationField.Address, "Address"],
            [DonationField.DonorIndex, "DonorIndex"],
            [
              DonationField.UBOs,
              "UBOs (See https://en.wikipedia.org/wiki/Beneficial_ownership )",
            ],
            [DonationField.DonorRegistrationNumber, "DonorRegistrationNumber"],
            [DonationField.OriginalReceiver, "OriginalReceiver"],
            [DonationField.OriginalReceiverIndex, "OriginalReceiverIndex"],
          ]),
        },

        DonationsDocumentWithoutDonorIds: {
          type: "object",
          properties: {
            donors: {
              type: "array",
              description:
                "A lookup table of donors. Format: [donorName, ubos]",
              items: {
                type: "array",
                // @ts-expect-error This is currently a missing type int he upstream typedefs
                prefixItems: [
                  { type: "string", description: "Name of the donor" },
                  {
                    type: "array",
                    items: { type: "string" },
                    nullable: true,
                    description: "List of Ultimate Beneficial Owners",
                  },
                ],
              },
            },
            originalReceivers: {
              type: "array",
              description:
                "Optional lookup table of initial recipient committees/PACs/sub-organizations.",
              items: { type: "string" },
            },
            donations: {
              type: "array",
              items: { $ref: "#/components/schemas/DocumentDonation" },
            },
          },
        },

        CountryCode: {
          type: "string",
          description:
            "ISO 3166-1 alpha-2 country code. '??' if country is unknown.",
          maxLength: 2,
          minLength: 2,
        },

        DonationAddress: {
          type: "object",
          properties: {
            [AddressField.Country]: {
              $ref: "#/components/schemas/CountryCode",
            },
            [AddressField.State]: {
              type: "string",
              description: "State: State or province (if available)",
            },
          },
          required: [`${AddressField.Country}`],
        },

        DocumentDonation: {
          type: "object",
          description:
            "A donation record. Keys are mapped from the DonationField enum.",
          properties: {
            [DonationField.Id]: {
              type: "string",
              description: "Id: Unique transaction identifier",
            },
            [DonationField.Date]: {
              type: "string",
              description: "Date: ISO-8601 date string or Year",
              example: "2020-01-01",
            },
            [DonationField.DonationType]: {
              $ref: "#/components/schemas/DonationType",
              description:
                "DonationType: See DonationType enum (0=Money [default when omitted], 1=MembershipFee, 2=JoiningFee, 3=PropertyOrService, 4=PublicFunds)",
            },
            [DonationField.Amount]: {
              type: "number",
              description: "Amount: Total value in the countries currency",
            },
            [DonationField.Address]: {
              $ref: "#/components/schemas/DonationAddress",
              description: "Address: The Address of the Donor",
            },
            [DonationField.Receiver]: {
              type: "string",
              description: "Receiver: The ReceiverId (matches Party Id)",
            },
            [DonationField.DonorIndex]: {
              type: "integer",
              description:
                "DonorIndex: Index of the donor in the DonationsDocument donors array",
            },
            [DonationField.OriginalReceiverIndex]: {
              type: "integer",
              description:
                "OriginalReceiverIndex: Optional index of the initial recipient committee/PAC in the DonationsDocument originalReceivers array",
            },
            [DonationField.DonorType]: {
              $ref: "#/components/schemas/DonorType",
              description:
                "DonorType: See DonorType enum (1=Individual, 2=Company, etc.)",
            },
            [DonationField.UBOs]: {
              type: "array",
              items: {
                type: "string",
              },
            },
            [DonationField.DonorRegistrationNumber]: {
              type: "string",
              description:
                "DonorRegistrationNumber: Official corporate/entity registration number (e.g. UK Companies House CRN, Norwegian OrgNr, French SIREN)",
            },
          },
          required: [
            `${DonationField.Id}`,
            `${DonationField.Amount}`,
            // `${DonationField.DonorName}`,
            `${DonationField.Date}`,
            `${DonationField.Address}`,
            `${DonationField.Receiver}`,
            `${DonationField.DonorIndex}`,
          ],
        },
      },
    },
  } satisfies OpenAPIV3_1.Document;
};
