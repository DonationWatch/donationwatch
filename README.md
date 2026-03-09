# DonationWatch

Official source for [DonationWatch](https://donation.watch/), a political party donation tracker.

A Next.js application for tracking and visualizing political party donations across multiple countries.

> [!NOTE]
> This is a hobby project that grew over time, so please expect some ugly code here and there. Be kind!

## License

- **Code**: Licensed under the [GNU Affero General Public License v3.0](./LICENSE) (AGPL-3.0)
- **Generated Data** (contents of `src/data/`): Licensed under the [Creative Commons Attribution 4.0 International License](./LICENSE-DATA) (CC BY 4.0)

## Support the Project

*donation.watch* is a passion project built to make global political financing transparent. It is free, open-source, and has no ads or paywalls.

However, running the infrastructure (servers, domains, privacy services) comes with monthly out-of-pocket costs. If you find this dataset useful for your research, journalism, or personal interest, consider chipping in to help cover the server bills:

<a href="https://www.buymeacoffee.com/donation.watch">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150" height="45" />
</a>

*Note: This is purely a voluntary tip to keep the servers running. There are no premium features or commercial services in return.*

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) (package manager)
- [libreoffice](https://www.libreoffice.org/) (for converting odt to csv in some data loaders)
- [oxipng](https://github.com/oxipng/oxipng) (for optimizing PNG images)

### Local Development

This repository does not include cached data assets from governmental or third-party sources to avoid licensing issues. To run the project locally, you must first generate fake data.

```bash
# Install dependencies
pnpm install

# Generate fake data for development
pnpm data:fake

# Run the development server (with Turbopack)
pnpm dev:turbo

# Or run with Node inspector for debugging
pnpm dev:debug
```

The app will be available at `http://localhost:3000`.

### Other Commands

```bash
# Build for production
pnpm build

# Run E2E tests
pnpm test:e2e

# Run unit tests
pnpm test:unit

# Run unit tests with fake data (required if no real data is present)
pnpm test:unit:fake

# Lint the codebase
pnpm lint
```

## Project Structure

### Next.js Application

The Next.js app code is located in `src/`:

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # React components
├── data/         # Pre-generated JSON data files
├── hooks/        # Custom React hooks
├── messages/     # Internationalization messages
├── middleware.ts # Request middleware
└── utils/        # Utility functions and types
```

## Architecture

### Core Data Types

The application is built around two primary data types defined in `src/utils/types.ts`:

* `Donation` - Represents a single donation
* `Party` - Represents a political party

There's also `src/utils/countries.ts` containing the static configuration for all supported countries.

* `CountryConfig` - Provides per-country configuration that drives the entire application.

## Data Pipeline

**This project does not use a database.** All data is pre-generated and stored as static JSON files.

> [!NOTE]
> Note on Data Privacy:
> This repository contains logic to anonymize specific donors upon request. 
> However, the raw data is sourced from public government records. 
> While https://donation.watch honors removal requests on our hosted platform, we cannot remove data from the official government sources, nor can we enforce this anonymization if you run this scraper independently.

### Data Loading (`tasks/load-data/`)

The data pipeline consists of two main steps:

#### 1. Data Loaders

To work with real data, you need to fetch it from the sources.

```bash
# Fetch data from remote sources (default: last 2 years)
pnpm data:rebuild

# Use previously cached data (skip fetching)
pnpm data:rebuild:cached
```

By default, `data:rebuild` only fetches data for the last couple of years to avoid spamming government servers with requests. Working locally, you typically only need to sync deeply once, and then sync recent years.

When working on extraction logic, use `data:rebuild:cached` to reuse previously downloaded assets without hitting the network.

Each country has its own loader (e.g., `de/de-loader.ts`, `uk/uk-loader.ts`) that:
- Fetches donation data from official government or election commission APIs
- Normalizes the data into the common `Donation` format
- Caches raw data locally for faster subsequent runs

> [!IMPORTANT]
> The data loaders (step 1) only download and normalize the raw data. You **must** run the postprocessing script (step 2) afterwards to generate the final JSON files used by the application regarding aggregated statistics, rankings, and metadata.

#### 2. Postprocessing

```bash
pnpm data:postprocess
```

The `postprocess.ts` script transforms the raw donation data into optimized JSON files for the frontend:
- Builds party statistics and yearly sums
- Generates biggest donors and donations rankings
- Creates donor ID mappings and metadata
- Pre-builds Wikipedia data
- Processes GeoJSON for map visualizations

The generated files are written to `src/data/` and are directly imported by the Next.js app.

## Deployment

The project supports deployment to Cloudflare using OpenNext:

```bash
# Build and preview locally
pnpm cf:preview

# Build and deploy
pnpm cf:deploy
```