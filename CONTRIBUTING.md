# Contributing to DonationWatch

Thank you for your interest in contributing to DonationWatch! This guide will help you understand how to work on different parts of the project.

## Contributor License Agreement

To ensure the project's long-term sustainability and our ability to fund infrastructure through a premium API, we require all contributors to sign a Contributor License Agreement (CLA).

Don't worry, **you retain full copyright to your work**. The CLA simply grants us the necessary rights to keep the project's free web version alive and sustainable.

When you open your first Pull Request, the `@cla-assistant` bot will automatically comment with a link to review and sign the agreement. You can also preview the CLA text here: [https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8](https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8).

TL;DR: You still own your code. You're just giving us permission to use it, including in our premium services, so we can pay the Cloudflare bills.

## implementing Fixes & Features in the App

The main application is a standard [Next.js](https://nextjs.org/) project located in the `src/` directory.

1.  **Setup**: Follow the [README](./README.md) to install dependencies.
2.  **Run**: Use `pnpm dev:turbo` to start the development server.
3.  **Data**: The app relies on JSON files in `src/data/`. Running `pnpm data:fake` gives you sample data to work with immediately.

## Working on Data Loaders

Each country has its own data loader located in `tasks/load-data/<country_code>/`. These loaders are responsible for scraping or fetching raw data from official sources and normalizing it.

### File Structure

- `tasks/load-data/<country>/<country>-loader.ts`: Main loader logic.
  - **Extends**: `DataLoader` class.
  - must implement the abstract members

### Common Tasks

#### Fixing Data Issues

If you spot incorrect data (e.g., a donor name is garbled or a date is wrong):

1.  Locate the country's loader file (e.g., `tasks/load-data/de/de-loader.ts`).
2.  Inspect the `transformRawDonation` or `normalizeDonor` methods.
3.  Add specific rules to handle the edge case.

#### Updating Source URLs

Some official government websites change their URLs frequently (e.g., yearly), while others use stable endpoints. If a loader fails with a 404 error:

1.  Verify the official source URL in a browser.
2.  If the URL has changed, find the `loadYearDataToCache` method in the corresponding loader.
3.  Update the `url` variable or the URL construction logic to match the new source location.

#### Testing Your Changes

To test data loader changes, you need to run the ingestion pipeline:

1.  **Rebuild Data**:

    ```bash
    # Fetches fresh data (slow, hits external servers)
    pnpm data:rebuild

    # OR uses existing cache (fast, good for logic changes)
    pnpm data:rebuild:cached
    ```

2.  **Post-Process**:
    ```bash
    # Generates the final JSON files for the app
    pnpm data:postprocess
    ```
3.  **Verify**: Start the app (`pnpm dev:turbo`) and check if the data looks correct.

## Updating Donor Metadata

We maintain a metadata file for each country to link donors to Wikipedia and define relationships between donors (e.g., family members, subsidiaries).

- **Location**: `tasks/load-data/<country>/donor-meta.ts`

### Adding/Updating Metadata

You should add entries to the `donorMeta` object, which adheres to the `DonorMetaDefinition` interface.

```typescript
import type { DonorMetaDefinition } from "../../../src/utils/types";
import { RelationKind } from "../../../src/utils/types";

export const donorMeta: DonorMetaDefinition = {
  donors: {
    "Donor Name": {
      // Wikipedia Page ID (number)
      wiki: 12345,
    },
    "Another Donor": {
      wiki: 67890,
    },
  },
  relations: [
    // Define relationships between donors
    [
      ["Parent Company", RelationKind.company],
      ["Subsidiary", RelationKind.company],
    ],
    [
      ["Wealthy Individual", RelationKind.family],
      ["Spouse", RelationKind.family],
      ["Family Trust", RelationKind.company],
    ],
  ],
};
```

After modifying this file, run `pnpm data:postprocess` to apply changes.

## Wikipedia Integration

We enrich our data with information from Wikipedia to provide context about parties and donors.

### Syncing Data

To sync Wikipedia articles (fetch excerpts, images, etc.), run:

```bash
pnpm run data:wikipedia
```

This script reads the `wiki` fields from:

- **Parties**: Each party in our data has an optional `wiki` field (number) representing a Wikipedia page ID.
- **Donor Meta**: The donor metadata in `donorMeta.donors` uses the `wiki` field for Wikipedia page IDs.

When you add or update these `wiki` fields, running the `data:wikipedia` script will fetch and update the corresponding excerpts.
