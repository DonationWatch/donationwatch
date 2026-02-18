import type { TestContext } from "vitest";

export const IS_FAKE_ENV = process.env.FAKE === "true";
export const DONOR_WITH_WIKIPEDIA_ARTICLE = "Fake Donor With Wikipedia Article";
export const DONOR_WITH_UBOs = "Fake Donor With UBOs";
export const DONOR_WITH_REL_A = "Fake Donor With Relation A";
export const DONOR_WITH_REL_B = "Fake Donor With Relation B";

export const skipIfFakeEnv = (context: TestContext) => {
  context.skip(IS_FAKE_ENV, "Skipping test in FAKE environment");
};
