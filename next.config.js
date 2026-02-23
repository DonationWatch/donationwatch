import Analyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const env = process.env.NODE_ENV;
const isProd = env === "production";
const isAnalyze = process.env.ANALYZE === "true";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    reactCompiler: isProd,
  },
  compiler: isProd
    ? {
        reactRemoveProperties: isProd,
      }
    : {},
  typescript: {
    tsconfigPath: "./tsconfig.next.json",
  },
  outputFileTracingExcludes: {
    // remove sourcemaps https://opennext.js.org/aws/common_issues#remove-sourcemaps
    "*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
  },
  redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },

      // added on 2024-10-26
      // redirect old year/donors/overview|sankey
      {
        source: "/:locale/:country/:year/donors/overview",
        destination: "/:locale/:country/:year/donors",
        permanent: true,
      },
      {
        source: "/:locale/:country/:year/donors/sankey",
        destination: "/:locale/:country/:year/donors",
        permanent: true,
      },

      // added on 2025-08-03
      // redirect removed donor sub-pages
      {
        source: "/:locale/:country/donor/:donorId/overview",
        destination: "/:locale/:country/donor/:donorId",
        permanent: true,
      },
      {
        source: "/:locale/:country/donor/:donorId/changes",
        destination:
          "/:locale/:country/donor/:donorId#sec-donor-donations-table",
        permanent: true,
      },

      // added on 2025-12-29
      // redirect sitemap.xml to sitemap_index.xml
      {
        source: "/sitemap.xml",
        destination: "/sitemap_index.xml",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(
  isAnalyze ? Analyzer({ enabled: true })(nextConfig) : nextConfig,
);
