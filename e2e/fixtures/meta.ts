import { expect } from "@playwright/test";

import { TWITTER_SITE } from "@/utils/config";
import { LOCALES } from "@/utils/locales";

import { PageObject } from "../util/page";

export class Meta extends PageObject {
  private getByName(name: string) {
    return this.page.locator(`meta[name="${name}"]`);
  }

  private getByProperty(property: string) {
    return this.page.locator(`meta[property="${property}"]`);
  }

  private async expectHasName(name: string, content: string | RegExp) {
    return expect(this.getByName(name)).toHaveAttribute("content", content);
  }

  private async expectHasProperty(property: string, content: string | RegExp) {
    return expect(this.getByProperty(property)).toHaveAttribute(
      "content",
      content,
    );
  }

  private async expectAlternates() {
    const pageUrl = new URL(this.page.url());
    const [, ...pathSegments] = pageUrl.pathname.substring(1).split("/");

    const canonical = this.page.locator(`link[rel="canonical"]`);
    await expect(canonical).toHaveAttribute(
      "href",
      `${pageUrl.origin}/${this.locale}/${pathSegments.join("/")}`,
    );

    for (const locale of LOCALES) {
      const link = this.page.locator(
        `link[rel="alternate"][hreflang="${locale}"]`,
      );
      await expect(link).toHaveAttribute(
        "href",
        `${pageUrl.origin}/${locale}/${pathSegments.join("/")}`,
      );
    }
  }

  // TODO: use RegExp.escape once node@24 is used
  public async expectConfigured(name: string, image: string) {
    await this.expectAlternates();
    await expect(this.page.locator("html[lang]")).toHaveAttribute(
      "lang",
      this.locale,
    );
    await expect(this.page).toHaveTitle(new RegExp(name));
    await expect(this.getByName("description")).toHaveAttribute(
      "content",
      new RegExp(name),
    );

    await this.expectHasName("twitter:card", "summary_large_image");
    await this.expectHasName("twitter:site", TWITTER_SITE);
    await this.expectHasName("twitter:title", new RegExp(name));
    await this.expectHasName("twitter:description", new RegExp(name));
    await this.expectHasName("twitter:image", new RegExp(image));

    await this.expectHasProperty("og:type", "website");
    await this.expectHasProperty("og:locale", this.locale);
    await this.expectHasProperty("og:title", new RegExp(name));
    await this.expectHasProperty("og:description", new RegExp(name));
    await this.expectHasProperty("og:image", new RegExp(image));
  }
}
