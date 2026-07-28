import * as v from "valibot";
import { expect, test } from "vitest";

import { contactFormSchema } from "@/app/[locale]/enterprise/_components/schema";

test("contactFormSchema parses valid data", () => {
  const validData = {
    name: "  Jane Doe  ",
    email: "jane@example.com",
    organization: "Acme Corp",
    consent: true,
    turnstileToken: "valid_token",
  };

  const parsed = v.parse(contactFormSchema, validData);
  expect(parsed).toEqual({
    name: "Jane Doe",
    email: "jane@example.com",
    organization: "Acme Corp",
    queryRequest: "",
    consent: true,
    turnstileToken: "valid_token",
  });
});

test("contactFormSchema fails on invalid data", () => {
  const invalidData = {
    name: "",
    email: "not-an-email",
    organization: "",
    consent: false,
    turnstileToken: "",
  };

  const res = v.safeParse(contactFormSchema, invalidData);
  expect(res.success).toBe(false);
  if (!res.success) {
    const fieldErrors = v.flatten(res.issues).nested;
    expect(fieldErrors?.name).toEqual(["errors.empty"]);
    expect(fieldErrors?.email).toEqual(["errors.email"]);
    expect(fieldErrors?.consent).toEqual(["errors.required"]);
  }
});
