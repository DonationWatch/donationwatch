import * as v from "valibot";

export const contactFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "errors.empty")),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "errors.empty"),
    v.email("errors.email"),
  ),
  organization: v.pipe(v.string(), v.trim(), v.minLength(1, "errors.empty")),
  queryRequest: v.optional(v.string(), ""),
  consent: v.literal(true, "errors.required"),
  turnstileToken: v.pipe(v.string(), v.trim(), v.minLength(1, "errors.empty")),
});

export type ContactFormData = v.InferOutput<typeof contactFormSchema>;
