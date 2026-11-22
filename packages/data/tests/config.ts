import type { TestContext } from "vitest";

export {
  DONOR_WITH_REL_A,
  DONOR_WITH_REL_B,
  DONOR_WITH_UBOs,
  DONOR_WITH_WIKIPEDIA_ARTICLE,
} from "@donationwatch/core/utils/config";

export const IS_FAKE_ENV = process.env.FAKE === "true";

export const skipIfFakeEnv = (context: TestContext) => {
  context.skip(IS_FAKE_ENV, "Skipping test in FAKE environment");
};
