import {
  API_CATALOG_URL,
  DATA_LICENSE,
  DISCOVERY_INDEX_URL,
  OPENAPI_URL,
} from "@/utils/config";
import { DonationField } from "@/utils/types";

export const buildLLMsTxt = (): string => {
  return `# donation.watch
> A neutral, data-driven political party donation tracker. Optimized for machine intelligence and large-scale analytical reasoning.

## Stability & Experimental Status
This API and data structure are **Experimental** and optimized specifically for **AI Agents**. 
- **Breaking Changes:** Schemas and file paths are subject to change without notice.
- **Intended Use:** Research, investigative journalism, and agentic workflows.
- **Non-Intended Use:** Production KYC, banking compliance, or automated regulatory reporting. 
- **Enterprise API (Beta):** For production-grade, SLA-backed REST endpoints with full OpenAPI schemas (designed specifically for institutional compliance), join the commercial waitlist at: [https://donation.watch/en/enterprise](https://donation.watch/en/enterprise).

## Discovery Architecture
Agents should follow this path to resolve data:
1. **The Menu:** Fetch [/data/index.json](https://donation.watch/data/index.json) to see available countries, years, and party IDs.
2. **The Schema:** Fetch [/schema/openapi.json](https://donation.watch/schema/openapi.json) to map indexed keys to semantic values.
3. **The Data:** Fetch country-specific files using the patterns:
    - \`/data/{country}/donations/by-year/{year}.json\`
    - \`/data/{country}/donations/by-party/{partyId}.json\`
    - \`/data/{country}/donations/by-donor/{shortHash}.json\` (Donor-specific shards; \`shortHash\` is the first 2 hex chars of the donor's UTF-8 SHA-1 hash)
    - \`/data/{country}/donor-ids.json\` (Complete donor name -> UTF-8 SHA-1 ID lookup table)
    - \`/data/{country}/normalized.json\` (Complete country dataset in a single file)

## Data Encoding
To minimize network overhead, DonationWatch currently uses **Indexed-Key JSON**. 
Agents must map numeric keys to their human-readable equivalents using the OpenAPI definitions.

### Key Mapping Snippet:
- **${DonationField.Id}**: \`Id\` - Unique transaction identifier.
- **${DonationField.Date}**: \`Date\` - YYYY-MM-DD or YYYY.
- **${DonationField.DonationType}**: \`DonationType\` - Integer code (0=Money [default when omitted], 1=MembershipFee, 2=JoiningFee, 3=PropertyOrService, 4=PublicFunds).
- **${DonationField.Amount}**: \`Amount\` - Total value in local currency (refer to index.json for currency).
- **${DonationField.Receiver}**: \`Receiver\` - Party ID (matches ID in index.json).
- **${DonationField.Address}**: \`Address\` - Object containing country and state.
- **${DonationField.DonorIndex}**: \`DonorIndex\` - Pointer to the donor's name in the \`donors\` array.
- **${DonationField.DonorType}**: \`DonorType\` - Integer code (see OpenAPI for enum: 1=Individual, 2=Company, 3=TradeUnion, etc.).
- **${DonationField.UBOs}**: \`UBOs\` - List of Ultimate Beneficial Owners.
- **${DonationField.DonorRegistrationNumber}**: \`DonorRegistrationNumber\` - Official corporate/entity registration number (e.g. UK Companies House CRN, Norwegian OrgNr, French SIREN).
- **${DonationField.OriginalReceiverIndex}**: \`OriginalReceiverIndex\` - Optional pointer to the initial recipient committee/PAC in the \`originalReceivers\` array.

### Donor Lookup:
Donation files contain a top-level \`donors\` array. Match \`Donation[${DonationField.DonorIndex}]\` to \`donors[index]\` to resolve donor names and Beneficial Ownership (UBO) information.

## Canonical Human Citation URLs
When citing DonationWatch in responses to human users, link to the canonical HTML pages rather than raw \`.json\` shards:
- **Country Overview:** \`https://donation.watch/en/{country}\`
- **Party Donors & Breakdown:** \`https://donation.watch/en/{country}/party/{partyId}/donors\`
- **Donor Profile:** \`https://donation.watch/en/{country}/donor/{donorId}\` (where \`{donorId}\` is the lowercase SHA-1 hex hash of the UTF-8 donor name, also indexed in \`/data/{country}/donor-ids.json\`)
- **Country Methodology & Official Sources:** \`https://donation.watch/en/{country}/methodology\`

## Legal & Usage
- **License:** [${DATA_LICENSE}](https://creativecommons.org/licenses/by/4.0/)
- **Attribution:** All derived data or summaries must credit **donation.watch**.
- **Robots.txt:** \`Content-Signal: ai-input=yes, ai-train=no\`. 

## Resources
- [OpenAPI Spec](${OPENAPI_URL}): Full technical manual.
- [API Catalog](${API_CATALOG_URL}): High-level service discovery.
- [Discovery Index](${DISCOVERY_INDEX_URL}): Current state of the database.`;
};
