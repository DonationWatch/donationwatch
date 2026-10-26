import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("does not include /donors URLs for countries without donor feature (e.g. France)", async () => {
    const urls = await sitemap({ id: Promise.resolve("en") });
    const locs = urls.map((entry) => entry.url);

    // France does not have the Donors feature
    const franceDonorUrls = locs.filter(
      (url) => url.includes("/france/") && url.endsWith("/donors"),
    );
    expect(franceDonorUrls).toHaveLength(0);

    // Specifically check legislative years
    expect(
      locs.some((url) =>
        url.includes("https://donation.watch/en/france/2023-2027/donors"),
      ),
    ).toBe(false);

    // A country with donor feature (e.g. Germany) should have /donors URLs
    const germanyDonorUrls = locs.filter(
      (url) => url.includes("/germany/") && url.endsWith("/donors"),
    );
    expect(germanyDonorUrls.length).toBeGreaterThan(0);
  });
});
