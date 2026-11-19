import { select } from "@inquirer/prompts";

const INDEXNOW_KEY = "b505b06a6ef745df9fb702d2c8ab9fee";
const SITEMAP_URL = "https://donation.watch/sitemap.xml";
const MAX_URLS_PER_REQUEST = 10_000;

const promptIndexAfter = async (): Promise<string> =>
  await select({
    message: "Index after which date should URLs be submitted?",
    choices: [
      {
        name: "Last hour",
        value: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        name: "Last 24 hours",
        value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: "All time",
        value: "1970-01-01T00:00:00.000Z",
      },
    ],
  });

const MODIFIED_AFTER_FILTER = await promptIndexAfter();

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

type SitemapIndexEntry = {
  loc: string;
};

function extractTextContent(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, "i");
  const match = xml.match(regex);
  return match?.[1]?.trim() || undefined;
}

function isSitemapIndex(xmlContent: string): boolean {
  return xmlContent.includes("<sitemapindex");
}

function parseSitemapIndex(xmlContent: string): {
  sitemaps: SitemapIndexEntry[];
} {
  const sitemaps: SitemapIndexEntry[] = [];
  const sitemapBlocks =
    xmlContent.match(/<sitemap[^>]*>[\s\S]*?<\/sitemap>/g) || [];

  for (const block of sitemapBlocks) {
    const loc = extractTextContent(block, "loc");
    if (loc) {
      sitemaps.push({ loc });
    }
  }

  return { sitemaps };
}

function parseSitemap(xmlContent: string): { urls: SitemapUrl[] } {
  const urls: SitemapUrl[] = [];
  const urlBlocks = xmlContent.match(/<url[^>]*>[\s\S]*?<\/url>/g) || [];

  for (const block of urlBlocks) {
    const url: SitemapUrl = {
      loc: extractTextContent(block, "loc") || "",
      lastmod: extractTextContent(block, "lastmod"),
    };

    if (url.loc) {
      urls.push(url);
    }
  }

  return { urls };
}

const main = async () => {
  const sitemapResp = await fetch(SITEMAP_URL);

  if (!sitemapResp.ok)
    throw new Error(`fetching sitemap failed. (${sitemapResp.status})`);

  const sitemapText = await sitemapResp.text();

  let allUrls: SitemapUrl[] = [];

  if (isSitemapIndex(sitemapText)) {
    console.log("Detected sitemap index, fetching individual sitemaps...");
    const sitemapIndex = parseSitemapIndex(sitemapText);
    console.log(`Found ${sitemapIndex.sitemaps.length} sitemaps in index`);

    // Fetch and parse all individual sitemaps
    for (const sitemapEntry of sitemapIndex.sitemaps) {
      console.log(`Fetching ${sitemapEntry.loc}...`);
      const individualSitemapResp = await fetch(sitemapEntry.loc);

      if (!individualSitemapResp.ok) {
        console.error(
          `Failed to fetch ${sitemapEntry.loc} (${individualSitemapResp.status})`,
        );
        continue;
      }

      const individualSitemapText = await individualSitemapResp.text();
      const sitemap = parseSitemap(individualSitemapText);
      allUrls.push(...sitemap.urls);
      console.log(`  Found ${sitemap.urls.length} URLs`);
    }
  } else {
    console.log("Processing regular sitemap...");
    const sitemap = parseSitemap(sitemapText);
    allUrls = sitemap.urls;
  }

  const urlList = Array.from(
    new Set(
      allUrls
        .filter(
          (sitemapEntry) =>
            (sitemapEntry.lastmod ?? "") > MODIFIED_AFTER_FILTER,
        )
        .map((sitemapEntry) => sitemapEntry.loc),
    ),
  );

  if (urlList.length === 0) {
    console.log("No URLs to submit to IndexNow.");
    return;
  }

  const totalBatches = Math.ceil(urlList.length / MAX_URLS_PER_REQUEST);
  const origin = new URL(SITEMAP_URL).origin;
  const keyLocation = `${origin}/${INDEXNOW_KEY}.txt`;

  console.log(
    `Submitting ${urlList.length} URLs to IndexNow in ${totalBatches} batch(es)...`,
  );

  for (let i = 0; i < urlList.length; i += MAX_URLS_PER_REQUEST) {
    const batch = urlList.slice(i, i + MAX_URLS_PER_REQUEST);
    const batchNumber = Math.floor(i / MAX_URLS_PER_REQUEST) + 1;

    console.log(
      `Submitting batch ${batchNumber}/${totalBatches} (${batch.length} URLs)...`,
    );

    const indexNowResponse = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        host: origin,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: batch,
      }),
    });

    console.log(
      `Batch ${batchNumber}/${totalBatches} sent to IndexNow (status=${indexNowResponse.status})`,
    );

    if (!indexNowResponse.ok) {
      const errorBody = await indexNowResponse.text();
      console.error(errorBody);
      throw new Error(
        `IndexNow request failed on batch ${batchNumber}/${totalBatches} with status ${indexNowResponse.status}`,
      );
    }
  }
};

void main();
