import { DISCOVERY_INDEX_URL, LLMS_URL, OPENAPI_URL } from "@/utils/config";

export const buildGlobalSitemap = (lastMod: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${LLMS_URL}</loc>
    <lastmod>${lastMod}</lastmod>
  </url>
  <url>
    <loc>${OPENAPI_URL}</loc>
    <lastmod>${lastMod}</lastmod>
  </url>
  <url>
    <loc>${DISCOVERY_INDEX_URL}</loc>
    <lastmod>${lastMod}</lastmod>
  </url>
</urlset>`;
};
