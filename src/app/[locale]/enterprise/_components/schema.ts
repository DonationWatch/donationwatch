import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "errors.empty"),
  email: z.string().trim().min(1, "errors.empty").email("errors.email"),
  organization: z.string().trim().min(1, "errors.empty"),
  queryRequest: z.string().optional().default(""),
  consent: z.literal(true, { message: "errors.required" }),
  turnstileToken: z.string().trim().min(1, "errors.empty"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
